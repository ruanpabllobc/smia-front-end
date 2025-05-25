import React, { ReactNode } from "react";

interface HoverableCardProps {
  children: ReactNode;
  className?: string;
}

const HoverableCard = ({ children, className = "" }: HoverableCardProps) => {
  return (
    <div
      className={`p-4 border border-gray-100 rounded flex justify-between items-start bg-white
                 hover:border-green-200 hover:bg-green-100 transition-colors duration-200
                 ${className}`}
    >
      {children}
    </div>
  );
};

export default HoverableCard;
