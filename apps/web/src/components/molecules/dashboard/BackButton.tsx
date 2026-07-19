import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Tombol kembali standar halaman detail. */
export function BackButton({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <Button
      variant="ghost"
      className={cn("-ml-2 w-fit text-muted-foreground hover:text-foreground", className)}
      render={<Link href={href} />}
    >
      <ArrowLeftIcon className="size-4" />
      {label}
    </Button>
  );
}
