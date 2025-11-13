"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/team", label: "Team" },
  { href: "/clients", label: "Kunden" },
  { href: "/invoices", label: "Rechnungen" },
  { href: "/quotes", label: "Angebote" },
  { href: "/calendar", label: "Calendar" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">Admin Panel</div>
      <nav className="sidebar__nav">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                "sidebar__item" + (isActive ? " sidebar__item--active" : "")
              }
            >
              {/* hier könntest du später Icons einbauen */}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
