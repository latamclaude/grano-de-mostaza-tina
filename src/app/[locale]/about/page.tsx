import { TinaPage } from "@/components/TinaPage";
import client from "../../../../tina/__generated__/client";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  const validLocale = locale === "en" ? "en" : "es";

  let query = "";
  let variables = {};
  let data = {};

  try {
    const result = await client.queries.pages({ relativePath: "about.json" });
    query = result.query;
    variables = result.variables;
    data = result.data;
  } catch {
    const aboutData = (await import("../../../../content/pages/about.json")).default;
    data = { pages: aboutData };
  }

  return (
    <TinaPage
      query={query}
      variables={variables as Record<string, unknown>}
      data={data as Record<string, unknown>}
      locale={validLocale}
    />
  );
}
