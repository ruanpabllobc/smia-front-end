import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "default" | "outline" | "danger";
  size?: "default" | "small";
  width?: "full" | "fit";
}

const Button: React.FC<ButtonProps> = ({
  children,
  loading = false,
  variant = "default",
  size = "default",
  width = "full",
  className = "",
  ...props
}) => {
  const baseStyles = "font-medium rounded-full transition-colors duration-200";

  const variantStyles = {
    default: "bg-green-700 hover:bg-green-800 text-white",
    outline: "border-2 border-green-700 text-green-700 hover:bg-green-50",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };

  const sizeStyles = {
    default: "py-3 px-6",
    small: "py-2 px-4 text-sm",
  };

  const widthStyles = {
    full: "w-full",
    fit: "w-fit",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${
        widthStyles[width]
      } ${loading ? "opacity-70 cursor-not-allowed" : ""} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? "Processando..." : children}
    </button>
  );
};

export default Button;
