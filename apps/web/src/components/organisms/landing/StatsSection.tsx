const stats = [
  { count: 8, suffix: "+", display: "8+", label: "Expert reviewers" },
  { count: 3, suffix: "", display: "3", label: "Industry sectors" },
  {
    count: 100,
    suffix: "%",
    display: "95%",
    label: "Feedback nyata",
  },
  { count: 1, suffix: "st", display: "1st", label: "Tahap validasi produk" },
];

export function StatsSection() {
  return (
    <section className="px-6 lg:px-10 max-w-[1584px] mx-auto py-24">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" data-reveal-group>
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-primary rounded-3xl p-8 lg:p-10"
            data-reveal-item
          >
            <p className="text-[clamp(40px,4.5vw,64px)] font-bold tracking-[-0.02em] leading-none mb-4 text-white">
              <span data-count={stat.count} data-suffix={stat.suffix}>
                {stat.display}
              </span>
            </p>
            <p className="text-[14px] text-white/75 font-normal">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
