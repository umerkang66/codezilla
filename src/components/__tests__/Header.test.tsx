import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "../Header";
import PillNav from "../PillNav";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("PillNav Component", () => {
  it("renders navigation items", () => {
    const items = [
      { label: "Home", href: "/" },
      { label: "About", href: "/#about" },
    ];
    render(<PillNav items={items} activeHref="/" />);
    expect(screen.getByRole("menuitem", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "About" })).toBeInTheDocument();
  });
});

describe("Header Component with PillNav Hover Animation", () => {
  it("renders header with logo and all navbar links with label-stack", () => {
    render(<Header />);
    expect(screen.getByText("CODZILLA")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Services" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Contact" })).toBeInTheDocument();
  });
});
