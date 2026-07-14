"use client";

import { useState } from "react";
import { ArrowUpRight, Clock } from "lucide-react";
import { SiteHeader } from "../../components/organisms/shared/SiteHeader";
import { SiteFooter } from "../../components/organisms/shared/SiteFooter";
import { CtaBanner } from "../../components/organisms/landing/CtaBanner";
import {
  RESOURCE_ARTICLES,
  RESOURCE_CATEGORIES,
} from "../../lib/shared/resourceArticles";
import { FooterRevealBody } from "../../components/atoms/shared/FooterRevealBody";

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState("Semua");

  const articles = RESOURCE_ARTICLES.filter(
    (article) => activeCategory === "Semua" || article.category === activeCategory
  );
  const [featured, ...rest] = articles;

  return (
    <div className="min-h-screen bg-canvas text-ink font-sans overflow-x-clip">
      <FooterRevealBody>
      <SiteHeader />

      <section className="pt-14 pb-10 px-6 lg:px-10 max-w-[1584px] mx-auto border-b border-hairline">
        <p className="flex items-center gap-3 text-[12px] font-medium text-ink-muted uppercase tracking-[0.2em] mb-6">
          Sumber Daya Karir
        </p>
        <h1 className="text-[clamp(40px,5vw,68px)] font-bold leading-[1.05] tracking-[-0.02em] mb-6 text-ink max-w-3xl">
          Biar kamu makin siap di tiap tahap karier
        </h1>
        <p className="text-[17px] text-ink-muted leading-[1.6] max-w-2xl mb-10">
          Dari nyusun CV yang kebaca sistem AI sampai nego gaji, semua panduannya ada di sini.
          Baca sebentar, kepakenya buat seterusnya.
        </p>

        <div className="flex flex-wrap gap-2">
          {RESOURCE_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-[13px] font-normal border transition-none ${
                activeCategory === category
                  ? "bg-primary border-primary text-white"
                  : "bg-canvas border-hairline text-ink-muted hover:border-primary hover:text-primary"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="py-16 px-6 lg:px-10 max-w-[1584px] mx-auto">
        {featured && (
          <article className="rounded-[32px] bg-surface-1 p-8 lg:p-16 mb-4 group cursor-pointer hover:bg-surface-2 transition-none">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-[12px] rounded-full bg-canvas px-3 py-1.5 text-primary font-medium">
                {featured.category}
              </span>
              <span className="flex items-center gap-1.5 text-[13px] text-ink-muted">
                <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
                {featured.readTime}
              </span>
            </div>
            <div className="flex items-end justify-between gap-8">
              <div className="max-w-3xl">
                <h2 className="text-[clamp(28px,3.5vw,48px)] font-bold leading-[1.15] tracking-[-0.01em] text-ink mb-5">
                  {featured.title}
                </h2>
                <p className="text-[16px] text-ink-muted leading-[1.6] max-w-2xl">
                  {featured.excerpt}
                </p>
              </div>
              <ArrowUpRight className="w-8 h-8 text-primary opacity-0 group-hover:opacity-100 transition-none flex-shrink-0 hidden sm:block" />
            </div>
          </article>
        )}

        {rest.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rest.map((article) => (
              <article
                key={article.title}
                className="rounded-3xl border border-hairline p-8 group cursor-pointer hover:border-primary transition-none flex flex-col"
              >
                <div className="flex items-center justify-between gap-3 mb-8">
                  <span className="text-[12px] rounded-full bg-surface-1 px-3 py-1.5 text-primary font-medium">
                    {article.category}
                  </span>
                  <ArrowUpRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-none" />
                </div>
                <h3 className="text-[22px] font-semibold leading-[1.3] text-ink mb-3">
                  {article.title}
                </h3>
                <p className="text-[14px] text-ink-muted leading-[1.6] mb-8">{article.excerpt}</p>
                <span className="flex items-center gap-1.5 text-[13px] text-ink-muted mt-auto">
                  <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
                  {article.readTime}
                </span>
              </article>
            ))}
          </div>
        )}
      </section>

      <CtaBanner />
      </FooterRevealBody>
      <SiteFooter />
    </div>
  );
}
