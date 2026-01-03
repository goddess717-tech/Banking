export default function Button({ variant = "default", size = "md", className = "", ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-md transition font-medium";

  const variants = {
    default: "bg-emerald-600 text-white hover:bg-emerald-700",
    ghost: "bg-transparent hover:bg-black/5 dark:hover:bg-white/10",
    primary: "bg-emerald-600 text-white hover:bg-emerald-700",
    soft: "bg-emerald-600/10 text-emerald-600 hover:bg-emerald-600/15"
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-2 text-base",
    icon: "p-2"
  };

  return (
    <button
      {...props}
      className={(base, variants[variant], sizes[size], className)}
    />
  );
}