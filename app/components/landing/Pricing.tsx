import { Wrapper } from "@/app/components/atoms";
import { TitleBlock } from "@/app/components/TitleBlock";
import type { ContentSchema } from "@/app/content";
import type { Locale } from "@/app/lib/locale";
import PricingEstimator from "@/app/components/landing/PricingEstimator";

interface Props {
  slice: ContentSchema["pricing"];
  consultationButtonLabel: string;
  locale: Locale;
}

export function Pricing({ slice: pricing, consultationButtonLabel, locale }: Props) {
  return (
    <Wrapper id="pricing" className="bg-mist scroll-mt-16">
      <div className="mx-auto w-full max-w-[1440px] px-4 pb-10 lg:px-8 lg:pb-14">
        <TitleBlock
          orientation="center"
          preheading={pricing.preheading}
          heading={pricing.heading}
          body={pricing.body}
        />
      </div>

      <PricingEstimator
        slice={pricing}
        consultationButtonLabel={consultationButtonLabel}
        locale={locale}
      />
    </Wrapper>
  );
}
