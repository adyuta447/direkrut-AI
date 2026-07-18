"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Animasi landing page: intro hero (masked line reveal), scroll-reveal per
 * section via [data-reveal] / [data-reveal-group] > [data-reveal-item],
 * dan count-up angka statistik via [data-count][data-suffix].
 */
export function useLandingAnimations() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    // Badan lembar (sampai CTA) membeku saat ujung bawahnya menyentuh dasar
    // viewport, lalu footer meluncur menimpanya. Dipakai sticky dengan top
    // negatif (100svh - tinggi) alih-alih pin GSAP, karena transform milik
    // pin mematikan position sticky tumpukan folder di dalamnya.
    const pinEl = document.querySelector<HTMLElement>(".landing-pin");
    const setPinTop = () => {
      if (pinEl) pinEl.style.top = `calc(100svh - ${pinEl.offsetHeight}px)`;
    };
    setPinTop();
    const pinObserver = pinEl ? new ResizeObserver(setPinTop) : null;
    if (pinEl && pinObserver) pinObserver.observe(pinEl);

    const ctx = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .fromTo(".hero-kicker", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 })
        .fromTo(
          ".hero-line-inner",
          { yPercent: 110 },
          { yPercent: 0, duration: 0.9, stagger: 0.12 },
          "-=0.25"
        )
        .fromTo(
          ".hero-search",
          { opacity: 0, y: 24, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6 },
          "-=0.5"
        )
        .fromTo(
          ".hero-chip",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.05 },
          "-=0.35"
        );

      // Hero dipin dengan CSS sticky; saat lembar konten naik menutupinya,
      // konten hero bergeser pelan ke atas dan meredup (parallax depth).
      gsap.to(".hero-pin-content", {
        yPercent: -10,
        opacity: 0.3,
        ease: "none",
        scrollTrigger: {
          trigger: ".landing-sheet",
          start: "top bottom",
          end: "top 25%",
          scrub: true,
        },
      });

      // Catatan: efek footer menimpa CTA kini murni CSS (sticky bottom-0 di
      // .landing-pin). Pin GSAP sengaja tidak dipakai di sini karena
      // transform-nya mematikan position sticky pada tumpukan folder di
      // dalamnya.

      // Tumpukan folder Cara Kerja: tiap folder naik 1:1 mengikuti scroll
      // lalu tertahan (CSS sticky) di slot kaskadenya. GSAP hanya memberi
      // depth: folder yang sedang ditimpa menyusut dan meredup halus.
      const folderItems = gsap.utils.toArray<HTMLElement>(".folder-step");
      folderItems.forEach((folder, i) => {
        const next = folderItems[i + 1];
        const inner = folder.querySelector<HTMLElement>(".folder-inner");
        if (!next || !inner) return;
        gsap.fromTo(
          inner,
          { scale: 1, filter: "brightness(1)" },
          {
            scale: 0.97,
            filter: "brightness(0.88)",
            transformOrigin: "center top",
            ease: "none",
            scrollTrigger: {
              trigger: next,
              start: "top bottom",
              end: () => `top ${120 + (i + 1) * 64}px`,
              scrub: 0.6,
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal-group]").forEach((group) => {
        const items = group.querySelectorAll("[data-reveal-item]");
        if (!items.length) return;
        gsap.fromTo(
          items,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: { trigger: group, start: "top 85%", once: true },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const target = parseFloat(el.dataset.count ?? "0");
        const suffix = el.dataset.suffix ?? "";
        const counter = { value: 0 };
        el.textContent = `0${suffix}`;
        gsap.to(counter, {
          value: target,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          onUpdate: () => {
            el.textContent = `${Math.round(counter.value)}${suffix}`;
          },
        });
      });
    });

    return () => {
      pinObserver?.disconnect();
      ctx.revert();
    };
  }, []);
}
