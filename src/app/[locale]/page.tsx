import { TinaPage } from "@/components/TinaPage";
import client from "../../../tina/__generated__/client";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const validLocale = locale === "en" ? "en" : "es";

  let query = "";
  let variables = {};
  let data = {};

  try {
    const result = await client.queries.pages({ relativePath: "home.json" });
    query = result.query;
    variables = result.variables;
    data = result.data;
  } catch {
    // Fallback to local JSON if TinaCloud is unavailable
    const homeData = (await import("../../../content/pages/home.json")).default;
    data = { pages: homeData };
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
