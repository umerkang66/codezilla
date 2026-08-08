import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Shuffle from "../Shuffle";

describe("Shuffle Component", () => {
  it("renders text content with given tag and class", () => {
    const { container } = render(
      <Shuffle text="Test Shuffle Text" tag="h1" className="custom-shuffle" />
    );

    const h1Element = container.querySelector("h1");
    expect(h1Element).not.toBeNull();
    expect(h1Element).toHaveClass("custom-shuffle");
    expect(h1Element).toHaveTextContent("Test Shuffle Text");
  });
});
