import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "./page";

describe("client-review application foundation", () => {
  it("identifies the invited review boundary without claiming feature readiness", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "BIG client-review application foundation",
      }),
    ).toBeVisible();
    expect(
      screen.getByText(
        /review invitations and authentication have not been implemented/i,
      ),
    ).toBeVisible();
  });
});
