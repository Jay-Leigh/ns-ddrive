import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import NotFoundPage from "./not-found";

describe("staff not-found boundary", () => {
  it("provides a route back to the staff application", () => {
    render(<NotFoundPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Staff page not found" }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Return to the staff application" }),
    ).toHaveAttribute("href", "/");
  });
});
