"use client";

import React from "react";

interface CardProps {
  title?: string;
  children: React.ReactNode;
}

/**
 * Card component for GitBook-like card blocks
 * Displays content in a card-like container with an optional title
 */
export function Card({ title, children }: CardProps) {
  return (
    <div className="card">
      {title && <div className="font-bold mb-2">{title}</div>}
      <div>{children}</div>
    </div>
  );
} 