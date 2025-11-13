"use client";

import React from "react";
import "@/styles/components/stat-box.scss";

type StatBoxProps = {
  title: string;
  value: string;
  progress: number; // 0..1
  change: string; // z.B. "+12%"
  description?: string;
};

export default function StatBox({
  title,
  value,
  progress,
  change,
  description,
}: StatBoxProps) {
  const pct = Math.min(Math.max(progress, 0), 1) * 100;

  return (
    <div className="stat-box">
      <div className="stat-box__header">
        <div>
          <div className="stat-box__title">{title}</div>
          <div className="stat-box__value">{value}</div>
        </div>
      </div>
      <div className="stat-box__progress">
        <div
          className="stat-box__progress-bar"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="stat-box__footer">
        <span className="stat-box__change">{change}</span>
        {description && <span>{description}</span>}
      </div>
    </div>
  );
}
