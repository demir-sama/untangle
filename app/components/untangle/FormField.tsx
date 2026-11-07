import type { ReactNode } from "react";
export function FormField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="grid min-w-0 gap-2 text-sm font-medium">
      <span>{label}</span>
      {children}
      {hint && (
        <span className="text-xs font-normal leading-5 text-muted-foreground">
          {hint}
        </span>
      )}
    </label>
  );
}
export const selectClass =
  "h-11 w-full min-w-0 rounded-md border bg-background px-3 text-sm";
