import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

type HeadingTag = "h1" | "h2" | "h3";

type PageTitleVariant = "default" | "inverted";

type PageTitleProps = {
  as?: HeadingTag;
  variant?: PageTitleVariant;
} & HTMLAttributes<HTMLHeadingElement>;

const baseClasses = "font-bold tracking-tight";
const sizeClasses: Record<HeadingTag, string> = {
  h1: "text-3xl md:text-4xl",
  h2: "text-2xl md:text-3xl",
  h3: "text-xl md:text-2xl",
};
const variantClasses: Record<PageTitleVariant, string> = {
  default: "text-foreground",
  inverted: "text-white",
};

export const PageTitle = ({
  as: Tag = "h1",
  variant = "default",
  className,
  children,
  ...props
}: PageTitleProps) => {
  return (
    <Tag className={cn(baseClasses, sizeClasses[Tag], variantClasses[variant], className)} {...props}>
      {children}
    </Tag>
  );
};
