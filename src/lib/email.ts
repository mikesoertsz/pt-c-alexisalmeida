import { readFile } from "node:fs/promises";
import path from "node:path";
import { Resend } from "resend";

export type EmailTemplateName =
  | "booking-confirmation"
  | "booking-confirmed-session"
  | "deposit-received"
  | "reminder-24h"
  | "reminder-2h"
  | "aftercare-guide"
  | "review-request"
  | "cancellation"
  | "reschedule-confirmation"
  | "consultation-followup";

export function interpolateTemplate(html: string, vars: Record<string, string>): string {
  let out = html;
  for (const [key, val] of Object.entries(vars)) {
    out = out.split(`{{${key}}}`).join(val);
  }
  return out;
}

export async function sendTemplatedEmail(options: {
  to: string;
  subject: string;
  template: EmailTemplateName;
  variables: Record<string, string>;
}): Promise<void> {
  const templatePath = path.join(process.cwd(), "public", "html", `${options.template}.html`);
  const raw = await readFile(templatePath, "utf8");
  const html = interpolateTemplate(raw, options.variables);

  await sendEmail({ to: options.to, subject: options.subject, html });
}

/** Send a raw HTML email (no template file). Used for internal/admin notifications. */
export async function sendEmail(options: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim();

  if (!apiKey || !from) {
    throw new Error("RESEND_API_KEY and EMAIL_FROM must be configured to send mail");
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: options.to,
    subject: options.subject,
    html: options.html,
    ...(options.replyTo ? { replyTo: options.replyTo } : {}),
  });

  if (error) {
    throw new Error(error.message);
  }
}
