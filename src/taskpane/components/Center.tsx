import * as React from "react";

interface CenterProps {
  children: React.ReactNode | React.ReactNode[];
  style?: React.CSSProperties;
}

export default function Center({ children, style }: CenterProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
