import { MarketingHome } from "@/screens/marketing/home";
import { MarketingLayout } from "@/screens/marketing/marketing-layout";

export function MarketingHomeArtboard() {
  return (
    <MarketingLayout current="home">
      <MarketingHome />
    </MarketingLayout>
  );
}
