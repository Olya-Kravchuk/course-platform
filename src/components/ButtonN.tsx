import React from 'react'

import { ReactNode } from "react";

interface ButtonNProps {
  children?: ReactNode;
  className?: string; // <- обов'язково додати
  onClick?: () => void;
}

export default function ButtonN({ children, className, onClick }: ButtonNProps) {
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}