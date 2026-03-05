import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-[var(--accent)]/10">
          <Icon className="size-7 text-[var(--accent)]" />
        </div>
        <div className="space-y-1">
          <p className="text-base font-medium text-[#333333]">{title}</p>
          {description && (
            <p className="text-sm text-[#333333]/60">{description}</p>
          )}
        </div>
        {action}
      </CardContent>
    </Card>
  );
}
