import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SortMenu } from "./sort-menu";

describe("SortMenu", () => {
  it("opens on click and reveals options", async () => {
    const user = userEvent.setup();
    render(
      <SortMenu
        value={{ sortBy: "default", order: "asc" }}
        onChange={() => {}}
      />,
    );
    expect(screen.queryByRole("listbox")).toBeNull();
    await user.click(screen.getByRole("button", { name: /sort/i }));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /price · low to high/i }),
    ).toBeInTheDocument();
  });

  it("calls onChange with the chosen sort value", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <SortMenu value={{ sortBy: "default", order: "asc" }} onChange={onChange} />,
    );
    await user.click(screen.getByRole("button", { name: /sort/i }));
    await user.click(screen.getByRole("option", { name: /price · high to low/i }));
    expect(onChange).toHaveBeenCalledWith({ sortBy: "price", order: "desc" });
  });
});
