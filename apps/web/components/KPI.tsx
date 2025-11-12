import React from "react";

export default function KPI({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="kpi">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      {hint && (
        <div className="label" style={{ fontSize: 12 }}>
          {hint}
        </div>
      )}
    </div>
  );
}
