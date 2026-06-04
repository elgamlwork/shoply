import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-12 w-full rounded-none border-b bg-transparent px-1 text-base text-[var(--color-ink)] placeholder:text-[var(--color-muted)]",
        "transition focus:outline-none focus:border-[var(--color-ink)]",
        invalid ? "border-[var(--color-danger)]" : "border-[var(--color-line)]",
        className,
      )}
      {...props}
    />
  );
});
