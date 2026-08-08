import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import FuzzyText from "../ui/FuzzyText";
import NotFound from "@/app/not-found";

// Mock canvas getContext and font API for JSDOM
beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
    font: "",
    textBaseline: "alphabetic",
    fillStyle: "",
    measureText: vi.fn().mockImplementation((text: string) => ({
      width: text.length * 10,
      actualBoundingBoxLeft: 0,
      actualBoundingBoxRight: text.length * 10,
      actualBoundingBoxAscent: 20,
      actualBoundingBoxDescent: 5,
    })),
    fillText: vi.fn(),
    createLinearGradient: vi.fn().mockReturnValue({
      addColorStop: vi.fn(),
    }),
    translate: vi.fn(),
    clearRect: vi.fn(),
    drawImage: vi.fn(),
    getImageData: vi.fn().mockReturnValue({
      data: new Uint8ClampedArray(100),
    }),
    putImageData: vi.fn(),
  }) as unknown as typeof HTMLCanvasElement.prototype.getContext;

  Object.defineProperty(document, "fonts", {
    value: {
      load: vi.fn().mockResolvedValue([]),
      ready: Promise.resolve(),
    },
    configurable: true,
  });
});

describe("FuzzyText Component", () => {
  it("should render a canvas element", () => {
    const { container } = render(
      <FuzzyText
        color="#81D607"
        fontFamily="var(--font-jetbrains-mono), monospace"
        fontSize="5rem"
      >
        404
      </FuzzyText>
    );

    const canvas = container.querySelector("canvas");
    expect(canvas).not.toBeNull();
  });
});

describe("NotFound Page", () => {
  it("should render giant fuzzy text canvas element", () => {
    const { container } = render(<NotFound />);
    expect(container.querySelector("canvas")).not.toBeNull();
  });
});
