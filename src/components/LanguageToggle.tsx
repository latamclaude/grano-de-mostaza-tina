"use client";

import { usePathname, useRouter } from "next/navigation";

interface LanguageToggleProps {
  readonly locale: "es" | "en";
}

export function LanguageToggle({ locale }: LanguageToggleProps) {
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale() {
    const newLocale = locale === "es" ? "en" : "es";
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  }

  return (
    <div
      className="lang-toggle"
      onClick={switchLocale}
      title={locale === "es" ? "Cambiar idioma / Switch language" : "Switch language / Cambiar idioma"}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") switchLocale(); }}
    >
      {locale === "es" ? (
        <>
          <span className="lang-flag lang-flag-ve" />
          <span className="lang-divider">|</span>
          <span className="lang-flag lang-flag-us" />
          <span className="lang-label">ES</span>
        </>
      ) : (
        <>
          <span className="lang-flag lang-flag-us" />
          <span className="lang-divider">|</span>
          <span className="lang-flag lang-flag-ve" />
          <span className="lang-label">EN</span>
        </>
      )}
    </div>
  );
}
