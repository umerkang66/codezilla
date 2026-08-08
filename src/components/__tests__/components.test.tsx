import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CookieBanner from "../CookieBanner";
import MarkdownRenderer from "../MarkdownRenderer";
import Faq from "../Faq";
import CtaBanner from "../CtaBanner";

describe("UI Components - Unit Tests", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("CookieBanner Component", () => {
    it("should render cookie banner when consent is not set", () => {
      render(<CookieBanner />);
      expect(screen.getByText("Cookie & Privacy Notice")).toBeInTheDocument();
      expect(screen.getByText("Accept All")).toBeInTheDocument();
      expect(screen.getByText("Essential Only")).toBeInTheDocument();
    });

    it("should store 'accepted' in localStorage and hide banner when Accept All is clicked", () => {
      render(<CookieBanner />);
      const acceptButton = screen.getByText("Accept All");
      fireEvent.click(acceptButton);

      expect(localStorage.getItem("codzilla_cookie_consent")).toBe("accepted");
      expect(screen.queryByText("Cookie & Privacy Notice")).not.toBeInTheDocument();
    });

    it("should store 'essential_only' in localStorage when Essential Only is clicked", () => {
      render(<CookieBanner />);
      const essentialButton = screen.getByText("Essential Only");
      fireEvent.click(essentialButton);

      expect(localStorage.getItem("codzilla_cookie_consent")).toBe("essential_only");
      expect(screen.queryByText("Cookie & Privacy Notice")).not.toBeInTheDocument();
    });

    it("should not render banner if consent was already recorded", () => {
      localStorage.setItem("codzilla_cookie_consent", "accepted");
      render(<CookieBanner />);
      expect(screen.queryByText("Cookie & Privacy Notice")).not.toBeInTheDocument();
    });
  });

  describe("MarkdownRenderer Component", () => {
    it("should render markdown headers, links, and text correctly", () => {
      const markdown = "# Heading 1\n\nThis is **bold** text and [Link](https://example.com).";
      const { container } = render(<MarkdownRenderer content={markdown} />);

      expect(screen.getByText("Heading 1")).toBeInTheDocument();
      expect(container.querySelector("a")).toHaveAttribute("href", "https://example.com");
      expect(container.querySelector("strong")).toHaveTextContent("bold");
    });

    it("should strip malicious script tags from rendering", () => {
      const maliciousMarkdown = "Safe text <script>alert('xss')</script>";
      const { container } = render(<MarkdownRenderer content={maliciousMarkdown} />);

      expect(screen.getByText("Safe text")).toBeInTheDocument();
      expect(container.querySelector("script")).toBeNull();
    });
  });

  describe("Faq Component", () => {
    it("should render FAQs and expand answer when question is clicked", () => {
      render(<Faq />);
      expect(screen.getByText("Frequently Asked Questions")).toBeInTheDocument();

      const questionText = "What pricing model do you use (Fixed-Price vs Hourly)?";
      expect(screen.queryByText(/We primarily offer transparent Fixed-Price milestone/)).not.toBeInTheDocument();

      const questionButton = screen.getByText(questionText);
      fireEvent.click(questionButton);

      expect(screen.getByText(/We primarily offer transparent Fixed-Price milestone/)).toBeInTheDocument();
    });
  });

  describe("CtaBanner Component", () => {
    it("should render CTA heading and action link", () => {
      render(<CtaBanner />);
      expect(screen.getByText(/Ready to Build/i)).toBeInTheDocument();
    });
  });
});
