import { MarketingLayout } from "@/screens/marketing/marketing-layout";
import { PricingPage } from "@/screens/marketing/pricing";

export function PricingArtboard() {
  return (
    <MarketingLayout current="pricing">
      <PricingPage />
    </MarketingLayout>
  );
}
