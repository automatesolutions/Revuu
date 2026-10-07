import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlaceholderPage, placeholderSections } from "@/screens/app/placeholder-page";

type Section = keyof typeof placeholderSections;

const isSection = (value: string): value is Section => value in placeholderSections;

export function generateStaticParams() {
  return Object.keys(placeholderSections).map((section) => ({ section }));
}

export async function generateMetadata({ params }: PageProps<"/app/[section]">): Promise<Metadata> {
  const { section } = await params;
  return { title: isSection(section) ? placeholderSections[section].title : "Not found" };
}

export default async function SectionPage({ params }: PageProps<"/app/[section]">) {
  const { section } = await params;
  if (!isSection(section)) notFound();
  return <PlaceholderPage section={section} />;
}
