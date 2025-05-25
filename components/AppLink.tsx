import React from "react";
import Link, { LinkProps } from "next/link";

interface AppLinkProps extends LinkProps {
  children: React.ReactNode;
  variant?: "default" | "outline" | "danger";
  className?: string;
}

const AppLink: React.FC<AppLinkProps> = ({
  children,
  variant = "default",
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-block text-center font-medium py-3 px-6 rounded-full transition-colors duration-200";

  const variantStyles = {
    default: "bg-green-700 hover:bg-green-800 text-white",
    outline: "border-2 border-green-700 text-green-700 hover:bg-green-50",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };

  return (
    <Link
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
};

export default AppLink;
