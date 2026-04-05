"use client";

import { useTina } from "tinacms/dist/react";
import { BlockRenderer } from "./blocks/BlockRenderer";

interface TinaPageProps {
  readonly query: string;
  readonly variables: Record<string, unknown>;
  readonly data: Record<string, unknown>;
  readonly locale: "es" | "en";
}

export function TinaPage({ query, variables, data, locale }: TinaPageProps) {
  const { data: tinaData } = useTina({ query, variables, data });

  const pageData = tinaData?.pages || {};
  const blocks = (pageData as Record<string, unknown>)?.blocks || [];

  return (
    <BlockRenderer
      blocks={blocks as Record<string, unknown>[]}
      locale={locale}
    />
  );
}
