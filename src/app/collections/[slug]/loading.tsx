import { ShopPageSkeleton } from "@/components/ui/skeletons";

export default function Loading() {
  return (
    <>
      <div className="skeleton h-[360px] rounded-none sm:h-[420px]" />
      <ShopPageSkeleton />
    </>
  );
}
