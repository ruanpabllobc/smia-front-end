import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "default" | "outline" | "danger";
}

const Button: React.FC<ButtonProps> = ({
  children,
  loading = false,
  variant = "default",
  className = "",
  ...props
}) => {
  const baseStyles =
    "w-full font-medium py-3 px-6 rounded-full transition-colors duration-200";

  const variantStyles = {
    default: "bg-green-700 hover:bg-green-800 text-white",
    outline: "border-2 border-green-700 text-green-700 hover:bg-green-50",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${
        loading ? "opacity-70 cursor-not-allowed" : ""
      } ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? "Processando..." : children}
    </button>
  );
};

export default Button;
