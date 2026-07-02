import { cn } from "@/lib/cn";

const sizes = {
  sm: "text-sm min-h-[50px] px-5",
  md: "text-[15px] min-h-[52px] px-4",
};

const variants = {
  primary: "bg-pink text-white hover:bg-pink-dark",
  secondary: "bg-white text-pink hover:bg-pink-light",
  outline: "bg-white text-pink border border-[#E9C6D3] hover:bg-pink-light",
  purple: "bg-purple text-white hover:bg-[#6b64c8]",
  inverted: "bg-white text-pink hover:bg-pink-light",
  ghost: "bg-transparent text-pink hover:bg-pink-light",
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  fullWidth?: boolean;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  fullWidth,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors disabled:cursor-not-allowed",
        sizes[size],
        variants[variant],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
