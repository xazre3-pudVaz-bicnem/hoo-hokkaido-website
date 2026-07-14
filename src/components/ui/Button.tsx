import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "water" | "outline" | "white";
  size?: "md" | "lg";
  className?: string;
};

const variantClasses = {
  primary:
    "bg-forest text-white hover:bg-forest-dark shadow-card hover:shadow-card-hover",
  water:
    "bg-water-deep text-white hover:bg-navy shadow-card hover:shadow-card-hover",
  outline:
    "border-2 border-forest text-forest hover:bg-forest hover:text-white",
  white:
    "bg-white text-forest-dark hover:bg-forest-light shadow-card hover:shadow-card-hover",
} as const;

const sizeClasses = {
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
} as const;

/** リンク型のCTAボタン。タップ領域を確保し、ホバーで軽く浮き上がる */
export default function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
}: ButtonProps) {
  const isExternal = href.startsWith("tel:") || href.startsWith("mailto:");
  const classes = `inline-flex min-h-12 items-center justify-center gap-2 rounded-full font-bold tracking-wide transition-all duration-300 hover:-translate-y-0.5 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (isExternal) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
