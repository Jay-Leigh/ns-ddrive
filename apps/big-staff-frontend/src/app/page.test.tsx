import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "./page";

describe("staff application foundation", () => {
  it("identifies the internal application without claiming feature readiness", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "BIG staff application foundation",
      }),
    ).toBeVisible();
    expect(
      screen.getByText(
        /business workflows and authentication have not been implemented/i,
      ),
    ).toBeVisible();
  });
});
