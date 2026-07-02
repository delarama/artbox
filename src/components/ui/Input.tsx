import { cn } from "@/lib/cn";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function Input({ className, label, id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="w-full">
      {label ? (
        <label htmlFor={inputId} className="sr-only">
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        className={cn(
          "w-full rounded-xl border border-[#E4D8DC] px-4 py-3.5 text-[15px] text-body outline-none focus:border-pink focus:shadow-[0_0_0_3px_rgba(212,83,126,0.12)]",
          className,
        )}
        {...props}
      />
    </div>
  );
}

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "w-full rounded-xl border border-[#E4D8DC] bg-white px-4 py-3.5 text-[15px] text-body outline-none focus:border-pink focus:shadow-[0_0_0_3px_rgba(212,83,126,0.12)]",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
