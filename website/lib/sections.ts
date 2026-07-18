export type NavItem = {
  href: string;
  label: string;
};

export const NAV: NavItem[] = [
  { href: "/", label: "Overview" },
  { href: "/method", label: "Method" },
  { href: "/results", label: "Results" },
];
