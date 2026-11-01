export function ProductGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:gap-x-6 2xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
          <div className="skeleton aspect-[4/5] rounded-2xl" />
          <div className="skeleton mt-4 h-3 w-1/3 rounded" />
          <div className="skeleton mt-2 h-4 w-3/4 rounded" />
          <div className="skeleton mt-3 h-4 w-1/4 rounded" />
        </div>
      ))}
    </div>
  );
}

export function ShopPageSkeleton() {
  return (
    <div className="container-x pb-10 pt-10 sm:pt-14">
      <div className="mb-10 max-w-3xl">
        <div className="skeleton h-3 w-24 rounded" />
        <div className="skeleton mt-4 h-12 w-2/3 rounded-xl" />
        <div className="skeleton mt-4 h-4 w-1/2 rounded" />
      </div>
      <div className="grid gap-10 lg:grid-cols-[250px_1fr] lg:gap-14">
        <div className="hidden space-y-3 lg:block">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton h-8 rounded-lg" style={{ width: `${70 + ((i * 13) % 30)}%` }} />
          ))}
        </div>
        <div>
          <div className="skeleton mb-8 h-10 rounded-full" />
          <ProductGridSkeleton />
        </div>
      </div>
    </div>
  );
}

export function ProductPageSkeleton() {
  return (
    <div className="container-x pb-10 pt-6 sm:pt-8">
      <div className="skeleton h-3 w-64 rounded" />
      <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="skeleton aspect-[4/5] rounded-3xl sm:aspect-square lg:aspect-[4/5]" />
        <div className="space-y-4 lg:py-2">
          <div className="skeleton h-3 w-24 rounded" />
          <div className="skeleton h-12 w-4/5 rounded-xl" />
          <div className="skeleton h-4 w-full rounded" />
          <div className="skeleton h-4 w-2/3 rounded" />
          <div className="skeleton mt-6 h-10 w-40 rounded-lg" />
          <div className="skeleton mt-6 h-14 rounded-full" />
          <div className="grid grid-cols-2 gap-3 pt-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-20 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
