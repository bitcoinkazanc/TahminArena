"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    label: "Ana Sayfa",
    icon: "🏠",
    href: "/",
  },
  {
    label: "Maçlar",
    icon: "⚽",
    href: "/matches",
  },
  {
    label: "Tahminler",
    icon: "🔮",
    href: "/predictions",
  },
  {
    label: "Kuponlar",
    icon: "🎫",
    href: "/coupons",
  },
  {
    label: "Profil",
    icon: "👤",
    href: "/profile/me",
  },
];

export default function BottomMenu() {
  const pathname = usePathname();

  return (
    <nav className="bottom-menu" aria-label="Ana menü">
      <div className="bottom-menu__inner">
        {menuItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`bottom-menu__item ${
                isActive ? "bottom-menu__item--active" : ""
              }`}
            >
              <span className="bottom-menu__icon" aria-hidden="true">
                {item.icon}
              </span>

              <span className="bottom-menu__label">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}