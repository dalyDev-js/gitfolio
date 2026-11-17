const B = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded-xl bg-surface-2 ${className}`} />
);

export function PortfolioSkeleton() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-20 sm:px-6" aria-busy="true" aria-label="Loading portfolio">
      <div className="flex flex-col gap-6 pt-12 sm:flex-row sm:items-end sm:gap-8 sm:pt-16">
        <B className="size-24 rounded-3xl sm:size-32" />
        <div className="flex-1 space-y-3">
          <B className="h-4 w-24" />
          <B className="h-10 w-72 max-w-full" />
          <B className="h-4 w-96 max-w-full" />
        </div>
      </div>
      <B className="mt-10 h-24 w-full rounded-2xl" />
      <div className="mt-4 grid gap-4 md:grid-cols-5">
        <B className="h-40 rounded-2xl md:col-span-3" />
        <B className="h-40 rounded-2xl md:col-span-2" />
      </div>
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <B key={i} className="h-44 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
