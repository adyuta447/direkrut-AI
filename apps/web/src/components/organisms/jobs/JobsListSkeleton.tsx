import { Skeleton } from "@/components/ui/skeleton"

export function JobsListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex w-full flex-col gap-4 lg:flex-row" aria-label="Memuat lowongan" aria-busy="true">
      <div className="flex w-full flex-col gap-3 lg:w-[46%]">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="space-y-3 rounded-3xl border border-hairline bg-canvas p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-2/5" />
              </div>
              <Skeleton className="size-10 shrink-0 rounded-xl" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-7 w-24 rounded-full" />
              <Skeleton className="h-7 w-20 rounded-full" />
              <Skeleton className="h-7 w-28 rounded-full" />
            </div>
          </div>
        ))}
      </div>
      <div className="hidden flex-1 space-y-5 rounded-3xl border border-hairline bg-canvas p-7 lg:block">
        <Skeleton className="h-7 w-2/3" />
        <Skeleton className="h-5 w-1/3" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-28 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-11 w-40 rounded-xl" />
      </div>
    </div>
  )
}
