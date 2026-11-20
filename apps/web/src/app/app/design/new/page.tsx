import type { Metadata } from "next";
import { DesignWizard } from "@/screens/app/design/design-wizard";

export const metadata: Metadata = { title: "Start a design" };

export default function NewDesignPage() {
  return <DesignWizard />;
}
