import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CategoryRail } from "./category-rail";

describe("CategoryRail", () => {
  it("renders 'All' plus all provided categories", () => {
    render(
      <CategoryRail
        categories={[
          { slug: "beauty", name: "Beauty" },
          { slug: "tech", name: "Tech" },
        ]}
        active="all"
        onSelect={() => {}}
      />,
    );
    expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Beauty" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tech" })).toBeInTheDocument();
  });

  it("marks the active chip as pressed", () => {
    render(
      <CategoryRail
        categories={[{ slug: "beauty", name: "Beauty" }]}
        active="beauty"
        onSelect={() => {}}
      />,
    );
    const chip = screen.getByRole("button", { name: "Beauty" });
    expect(chip).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("invokes onSelect with the chosen slug", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(
      <CategoryRail
        categories={[{ slug: "tech", name: "Tech" }]}
        active="all"
        onSelect={onSelect}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Tech" }));
    expect(onSelect).toHaveBeenCalledWith("tech");
    await user.click(screen.getByRole("button", { name: "All" }));
    expect(onSelect).toHaveBeenCalledWith("all");
  });

  it("shows placeholder chips while loading", () => {
    const { container } = render(
      <CategoryRail categories={[]} active="all" onSelect={() => {}} loading />,
    );
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });
});
