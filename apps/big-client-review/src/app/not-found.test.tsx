import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import NotFoundPage from "./not-found";

describe("client-review not-found boundary", () => {
  it("provides a route back to the client-review application", () => {
    render(<NotFoundPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Review page not found" }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", {
        name: "Return to the client-review application",
      }),
    ).toHaveAttribute("href", "/");
  });
});
