# Portugal Tattoo, Starter: AI Chatbot

The chatbot is a floating widget on every public-facing page. It handles booking enquiries, answers FAQs, checks slot availability, and guides clients through the booking process, in Portuguese, English, or Spanish.

---

## Architecture Overview

```
User message
     ↓
ChatWidget (client component)
     ↓
POST /api/chat  (Next.js Route Handler)
     ↓
Language detection → system prompt construction
     ↓
Vector search (pgvector) → relevant knowledge chunks
     ↓
OpenAI GPT-4o with tool definitions
     ↓
Tool calls resolved (availability, booking, FAQ)
     ↓
Streamed response → ChatMessages
```

---

## Core Dependencies

```bash
pnpm add openai
pnpm add ai                           # Vercel AI SDK, streaming helpers
pnpm add @ai-sdk/openai               # Vercel AI SDK OpenAI provider
```

---

## Language Detection

Language is determined in order of priority:

1. `NEXT_LOCALE` cookie (set by next-intl when user switches language)
2. `Accept-Language` HTTP header
3. Default: English (`en`)

```typescript
// src/lib/openai/language.ts

export function detectLanguage(request: Request): 'en' | 'pt' | 'es' {
  // 1. Check locale cookie
  const cookieHeader = request.headers.get('cookie') ?? ''
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map((c) => {
      const [k, ...v] = c.trim().split('=')
      return [k?.trim() ?? '', v.join('=')]
    })
  )
  const localeCookie = cookies['NEXT_LOCALE']
  if (localeCookie === 'pt' || localeCookie === 'es') return localeCookie
  if (localeCookie === 'en') return 'en'

  // 2. Accept-Language header
  const acceptLang = request.headers.get('accept-language') ?? ''
  if (acceptLang.startsWith('pt')) return 'pt'
  if (acceptLang.startsWith('es')) return 'es'

  return 'en'
}
```

---

## System Prompts

System prompts are defined per language. They instruct the AI to act as the studio's booking assistant, with access to tools.

```typescript
// src/lib/openai/prompts.ts

export const SYSTEM_PROMPTS: Record<'en' | 'pt' | 'es', string> = {
  en: `You are the booking assistant for [STUDIO_NAME], a professional tattoo studio in Portugal.
Your role is to help clients book consultations, answer questions about services and pricing, and provide useful information about the studio.

Rules:
- Always be friendly, concise, and professional.
- Respond only in English in this session.
- If a client wants to book, use the check_availability tool first, then guide them to the booking page.
- Never invent information. If you don't know something, say so and offer to connect them with the studio directly.
- For anything you cannot resolve, offer the booking page: /booking

Studio context will be provided in the next message via the knowledge base.`,

  pt: `És o assistente de marcações d'[STUDIO_NAME], um estúdio de tatuagem profissional em Portugal.
O teu papel é ajudar clientes a marcar consultas, responder a perguntas sobre serviços e preços, e fornecer informações úteis sobre o estúdio.

Regras:
- Sê sempre simpático, conciso e profissional.
- Responde apenas em português nesta sessão.
- Se um cliente quiser marcar, usa primeiro a ferramenta check_availability e depois guia-o para a página de marcação.
- Nunca inventes informação. Se não souberes algo, diz isso e oferece ligação direta com o estúdio.
- Para o que não conseguires resolver, oferece a página de marcação: /booking`,

  es: `Eres el asistente de reservas de [STUDIO_NAME], un estudio de tatuajes profesional en Portugal.
Tu función es ayudar a los clientes a reservar consultas, responder preguntas sobre servicios y precios, y proporcionar información útil sobre el estudio.

Reglas:
- Sé siempre amable, conciso y profesional.
- Responde únicamente en español en esta sesión.
- Si un cliente quiere reservar, usa primero la herramienta check_availability y luego guíalo a la página de reservas.
- Nunca inventes información. Si no sabes algo, dilo y ofrece conectarlo directamente con el estudio.
- Para lo que no puedas resolver, ofrece la página de reservas: /booking`,
}

export function buildSystemPrompt(
  language: 'en' | 'pt' | 'es',
  studioName: string,
  knowledgeContext: string
): string {
  const base = SYSTEM_PROMPTS[language].replace(/\[STUDIO_NAME\]/g, studioName)
  return `${base}\n\n--- STUDIO KNOWLEDGE ---\n${knowledgeContext}`
}
```

---

## OpenAI Tool Definitions

The chatbot has three tools available:

1. `check_availability`, query available booking slots from Cal.com
2. `get_booking_link`, return the booking page URL
3. `search_knowledge`, vector-search the knowledge base for relevant info

```typescript
// src/lib/openai/tools.ts
import type { ChatCompletionTool } from 'openai/resources'

export const CHATBOT_TOOLS: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'check_availability',
      description:
        'Check available booking slots. Use this when a client asks about availability, wants to know when they can book, or asks "when are you free?".',
      parameters: {
        type: 'object',
        properties: {
          date: {
            type: 'string',
            description: 'A specific date in YYYY-MM-DD format. Optional.',
          },
          month: {
            type: 'string',
            description: 'A month in YYYY-MM format to check the whole month. Optional.',
          },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_booking_link',
      description:
        'Get the URL to the booking page. Use this when a client wants to book, schedule, or make an appointment.',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'search_knowledge',
      description:
        'Search the studio knowledge base for information about services, pricing, styles, policies, or anything specific to this studio.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'The search query to find relevant knowledge base entries.',
          },
        },
        required: ['query'],
      },
    },
  },
]
```

---

## Knowledge Base

The knowledge base is stored in Supabase using `pgvector`. Each entry has a text chunk and its embedding.

### Schema

```sql
-- Enable pgvector extension
create extension if not exists vector;

create table knowledge_base (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  content     text not null,
  language    text not null default 'en',  -- 'en', 'pt', 'es', or 'all'
  category    text,                         -- e.g. 'pricing', 'services', 'policies', 'faq'
  embedding   vector(1536),                 -- OpenAI text-embedding-3-small
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Index for vector similarity search
create index idx_knowledge_embedding on knowledge_base
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- RLS
alter table knowledge_base enable row level security;

-- Public read for active entries (used by chatbot)
create policy "Public read active knowledge"
  on knowledge_base for select
  using (is_active = true);

-- Admin full access
create policy "Admin manage knowledge"
  on knowledge_base for all
  using (auth.role() = 'authenticated');
```

### Vector Search Function

```sql
create or replace function search_knowledge(
  query_embedding vector(1536),
  match_threshold float default 0.7,
  match_count     int default 5,
  lang            text default 'en'
)
returns table (
  id        uuid,
  title     text,
  content   text,
  category  text,
  similarity float
)
language sql stable
as $$
  select
    id,
    title,
    content,
    category,
    1 - (embedding <=> query_embedding) as similarity
  from knowledge_base
  where
    is_active = true
    and (language = lang or language = 'all')
    and 1 - (embedding <=> query_embedding) > match_threshold
  order by embedding <=> query_embedding
  limit match_count;
$$;
```

### Knowledge Search Helper

```typescript
// src/lib/openai/knowledge.ts
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// Use service role for knowledge base reads (bypasses RLS if needed)
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function searchKnowledge(
  query: string,
  language: 'en' | 'pt' | 'es' = 'en',
  limit = 5
): Promise<string> {
  // Generate embedding for the query
  const embeddingResponse = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: query,
  })

  const embedding = embeddingResponse.data[0]?.embedding

  if (!embedding) return ''

  const { data, error } = await supabase.rpc('search_knowledge', {
    query_embedding: embedding as unknown as string,
    match_threshold: 0.65,
    match_count: limit,
    lang: language,
  })

  if (error || !data?.length) return ''

  return data
    .map((entry) => `[${entry.category ?? 'info'}] ${entry.title}\n${entry.content}`)
    .join('\n\n')
}

export async function upsertKnowledgeEntry(entry: {
  id?: string
  title: string
  content: string
  language: string
  category?: string
}) {
  // Generate embedding
  const embeddingResponse = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: `${entry.title}\n${entry.content}`,
  })

  const embedding = embeddingResponse.data[0]?.embedding

  const payload = {
    title: entry.title,
    content: entry.content,
    language: entry.language,
    category: entry.category ?? null,
    embedding: embedding as unknown as string,
    updated_at: new Date().toISOString(),
  }

  if (entry.id) {
    return supabase.from('knowledge_base').update(payload).eq('id', entry.id)
  }

  return supabase.from('knowledge_base').insert(payload)
}
```

---

## Chat API Route

**Route:** `POST /api/chat`  
**File:** `src/app/api/chat/route.ts`

Uses Vercel AI SDK's `streamText` for server-sent events streaming.

```typescript
// src/app/api/chat/route.ts
import { streamText, tool } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'
import { NextRequest } from 'next/server'
import { detectLanguage } from '@/lib/openai/language'
import { buildSystemPrompt } from '@/lib/openai/prompts'
import { searchKnowledge } from '@/lib/openai/knowledge'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const maxDuration = 30  // Vercel function timeout

export async function POST(request: NextRequest) {
  const { messages } = await request.json()

  const language = detectLanguage(request)

  // Fetch studio settings for personalisation
  const { data: settings } = await supabase
    .from('site_settings')
    .select('studio_name, chatbot_welcome_en, chatbot_welcome_pt, chatbot_welcome_es')
    .single()

  const studioName = settings?.studio_name ?? 'Portugal Tattoo'

  // Get initial knowledge context from the last user message
  const lastUserMessage = [...messages].reverse().find((m: { role: string }) => m.role === 'user')
  const knowledgeContext = lastUserMessage
    ? await searchKnowledge(lastUserMessage.content, language)
    : ''

  const systemPrompt = buildSystemPrompt(language, studioName, knowledgeContext)

  const result = streamText({
    model: openai(process.env.OPENAI_MODEL ?? 'gpt-4o'),
    system: systemPrompt,
    messages,
    maxSteps: 5,  // Allow up to 5 tool calls per conversation turn
    tools: {
      check_availability: tool({
        description: 'Check available booking slots from the calendar.',
        parameters: z.object({
          date: z.string().optional().describe('Specific date YYYY-MM-DD'),
          month: z.string().optional().describe('Month YYYY-MM'),
        }),
        execute: async ({ date, month }) => {
          const params = new URLSearchParams()
          if (date) params.set('date', date)
          else if (month) params.set('month', month)

          const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
          const res = await fetch(`${baseUrl}/api/availability?${params}`)
          const data = await res.json()

          if (!data.available || !data.slots?.length) {
            return { available: false, message: 'No available slots found for that period.' }
          }

          // Format slots for readability
          const formatted = data.slots.slice(0, 8).map((slot: { time: string }) => {
            const d = new Date(slot.time)
            return d.toLocaleDateString('en-GB', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
            }) + ' at ' + d.toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'Europe/Lisbon',
            })
          })

          return {
            available: true,
            slots: formatted,
            bookingUrl: `${baseUrl}/booking`,
          }
        },
      }),

      get_booking_link: tool({
        description: 'Get the URL to the booking page.',
        parameters: z.object({}),
        execute: async () => {
          const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
          return { bookingUrl: `${baseUrl}/booking` }
        },
      }),

      search_knowledge: tool({
        description: 'Search the studio knowledge base.',
        parameters: z.object({
          query: z.string().describe('Search query'),
        }),
        execute: async ({ query }) => {
          const results = await searchKnowledge(query, language)
          return { results: results || 'No relevant information found.' }
        },
      }),
    },
  })

  return result.toDataStreamResponse()
}
```

---

## Chat Widget Component

**File:** `src/components/chatbot/ChatWidget.tsx`

The chatbot is a floating button (bottom-right) that opens a panel with the conversation.

```tsx
// src/components/chatbot/ChatWidget.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { useChat } from 'ai/react'
import { useLocale, useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const locale = useLocale()
  const t = useTranslations('chatbot')
  const scrollRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: t('greeting'),
      },
    ],
  })

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Listen for external open trigger (from booking page)
  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener('pt:chatbot:open', handler)
    return () => window.removeEventListener('pt:chatbot:open', handler)
  }, [])

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-4 right-4 z-50">
        {!open && (
          <Button
            onClick={() => setOpen(true)}
            size="icon"
            className="h-12 w-12 rounded-full shadow-lg"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-4 right-4 z-50 w-[360px] max-w-[calc(100vw-2rem)]">
          <Card className="shadow-xl">
            {/* Header */}
            <CardHeader className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Portugal Tattoo
                  </p>
                  <p className="text-xs text-muted-foreground">
                    AI assistant
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardHeader>

            <Separator />

            {/* Messages */}
            <CardContent className="p-0">
              <ScrollArea className="h-72 px-4 py-3" ref={scrollRef}>
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        'flex',
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      <div
                        className={cn(
                          'max-w-[80%] rounded-lg px-3 py-2 text-xs leading-relaxed',
                          message.role === 'user'
                            ? 'bg-foreground text-background'
                            : 'bg-muted text-foreground'
                        )}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg px-3 py-2">
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>

            <Separator />

            {/* Input */}
            <CardFooter className="p-3">
              <form onSubmit={handleSubmit} className="flex w-full gap-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder={t('placeholder')}
                  className="h-8 text-xs flex-1"
                  disabled={isLoading}
                  autoComplete="off"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  disabled={isLoading || !input.trim()}
                >
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  )
}
```

---

## Injecting the ChatWidget

Add `ChatWidget` to the locale layout so it appears on all public pages:

```tsx
// src/app/[locale]/layout.tsx  (excerpt)
import { ChatWidget } from '@/components/chatbot/ChatWidget'

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params

  // Check if chatbot is enabled in settings
  const supabase = await createServerClient()
  const { data: settings } = await supabase
    .from('site_settings')
    .select('chatbot_enabled')
    .single()

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale}>
          {children}
          {settings?.chatbot_enabled !== false && <ChatWidget />}
          <CookieBanner />
          <Toaster position="bottom-right" />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

Note: The `ChatWidget` must not overlap with the Sonner `Toaster`. The Toaster is positioned `bottom-right` and the ChatWidget button is `bottom-4 right-4`. When the chat panel is open it expands upward. The cookie banner uses `bottom-center` which avoids overlap.

---

## Knowledge Base Admin UI

**File:** `src/app/admin/chatbot/page.tsx`

Allows the studio owner to add, edit, and delete knowledge base entries. Embeddings are generated server-side via the API.

```tsx
// src/app/admin/chatbot/page.tsx
import { createServerClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default async function ChatbotAdminPage() {
  const supabase = await createServerClient()

  const { data: entries } = await supabase
    .from('knowledge_base')
    .select('id, title, category, language, is_active, created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Chatbot Knowledge Base</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Add information the chatbot can use when answering client questions.
          </p>
        </div>
        <Button size="sm" className="text-xs">
          Add entry
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Title</TableHead>
                <TableHead className="text-xs">Category</TableHead>
                <TableHead className="text-xs">Language</TableHead>
                <TableHead className="text-xs">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!entries?.length ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-xs text-muted-foreground py-8">
                    No knowledge entries yet. Add your first entry to help the chatbot answer client questions.
                  </TableCell>
                </TableRow>
              ) : (
                entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-sm text-foreground">{entry.title}</TableCell>
                    <TableCell className="text-xs text-muted-foreground capitalize">
                      {entry.category ?? '-'}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground uppercase">
                      {entry.language}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={entry.is_active ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {entry.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-sm font-medium text-foreground">Suggested entries to add</h2>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            {[
              'Pricing, consultation fee, minimum price, deposit policy',
              'Services, tattoo styles offered, sizes, what you specialise in',
              'Booking policy, notice required, cancellation rules',
              'Aftercare, healing instructions (can be linked from chatbot)',
              'Location, address, parking, public transport',
              'Hours, opening days and times',
              'FAQ, common client questions and answers',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-muted-foreground mt-0.5">, </span>
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
```

---

## Knowledge Base API Routes

**File:** `src/app/api/admin/knowledge/route.ts`

```typescript
// src/app/api/admin/knowledge/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { upsertKnowledgeEntry } from '@/lib/openai/knowledge'

export async function GET(_request: NextRequest) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('knowledge_base')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ entries: data })
}

export async function POST(request: NextRequest) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()

  const { error } = await upsertKnowledgeEntry({
    title: body.title,
    content: body.content,
    language: body.language ?? 'all',
    category: body.category,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true }, { status: 201 })
}
```

---

## Multilingual Greeting

The chatbot greeting message is fetched from `site_settings` for the active language:

```typescript
// In the chat route, greeting selection:
const greetingKey = `chatbot_welcome_${language}` as keyof typeof settings
const greeting = settings?.[greetingKey] ?? SYSTEM_PROMPTS[language].split('\n')[0]
```

Default greetings (pre-seeded in `site_settings`):

| Language | Default greeting |
|---|---|
| `en` | "Hi! I'm here to help you book a consultation or answer any questions." |
| `pt` | "Olá! Estou aqui para ajudar com marcações ou responder às tuas perguntas." |
| `es` | "¡Hola! Estoy aquí para ayudarte a reservar una consulta o responder tus preguntas." |

---

## Rate Limiting

Add rate limiting to `/api/chat` to prevent abuse. Use Vercel KV or a simple in-memory counter.

```typescript
// In src/app/api/chat/route.ts, add before streamText call

const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'
const rateLimitKey = `chat_ratelimit_${ip}`

// Simple check, in production use Upstash Redis (@upstash/ratelimit)
// For Starter tier: 20 messages per IP per hour is sufficient
```

Install for production:

```bash
pnpm add @upstash/ratelimit @upstash/redis
```

---

## Environment Variables (Chatbot-specific)

```env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o
# For rate limiting (optional but recommended):
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

---

## Chatbot Behaviour Summary

| Trigger | Chatbot action |
|---|---|
| "When can I book?" | `check_availability` → list first 8 slots + booking link |
| "I want to book a tattoo" | `get_booking_link` → direct to /booking |
| "How much does it cost?" | `search_knowledge` (pricing) → answer from knowledge base |
| "Where are you located?" | `search_knowledge` (location) → answer from knowledge base |
| "What styles do you do?" | `search_knowledge` (services) → answer from knowledge base |
| Any unknown question | Respond from context or say it doesn't know + offer booking |
| User switches language | Language is re-detected on next `/api/chat` request from cookie |

---

*Last updated: April 2026*
