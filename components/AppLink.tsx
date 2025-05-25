import React from "react";
import Link, { LinkProps } from "next/link";

interface AppLinkProps extends LinkProps {
  children: React.ReactNode;
  variant?: "default" | "outline" | "danger";
  size?: "default" | "small";
  width?: "full" | "fit";
  className?: string;
}

const AppLink: React.FC<AppLinkProps> = ({
  children,
  variant = "default",
  size = "default",
  width = "full",
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-block text-center font-medium rounded-full transition-colors duration-200";

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
    <Link
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles[width]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
};

export default AppLink;
