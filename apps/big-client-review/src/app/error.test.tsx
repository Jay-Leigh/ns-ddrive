import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ErrorBoundary from "./error";

describe("client-review application error boundary", () => {
  it("offers an accessible retry action", () => {
    const reset = vi.fn();
    render(<ErrorBoundary reset={reset} />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "The client-review application could not load",
    );
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(reset).toHaveBeenCalledOnce();
  });
});
