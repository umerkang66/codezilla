import { describe, it, expect, vi } from "vitest";
import {
  formatApplicationsForExcel,
  exportApplicationsToExcel,
  JobApplicationForExport,
} from "../excelExport";
import * as XLSX from "xlsx";

vi.mock("xlsx", async () => {
  const actual = await vi.importActual("xlsx");
  return {
    ...actual,
    writeFile: vi.fn(),
  };
});

describe("Excel Export Utility", () => {
  const mockApplications: JobApplicationForExport[] = [
    {
      id: "app-123",
      job_id: "job-1",
      job_title: "Senior Full Stack Engineer",
      job_domain: "Engineering",
      full_name: "Jane Doe",
      email: "jane@example.com",
      phone: "+1234567890",
      portfolio_url: "https://janedoe.dev",
      linkedin_url: "https://linkedin.com/in/janedoe",
      cover_letter: "Excited to apply for this role!",
      resume_url: "https://example.com/resumes/jane.pdf",
      resume_file_name: "jane_doe_cv.pdf",
      resume_file_type: "pdf",
      status: "shortlisted",
      created_at: "2026-08-01T10:00:00.000Z",
    },
    {
      id: "app-456",
      job_id: "job-2",
      job_title: "AI Research Scientist",
      job_domain: "AI / ML",
      full_name: "John Smith",
      email: "john@example.com",
      status: "pending",
      created_at: "2026-08-05T14:30:00.000Z",
    },
  ];

  it("should format candidate application list into Excel row records correctly", () => {
    const formatted = formatApplicationsForExcel(mockApplications);
    expect(formatted).toHaveLength(2);

    expect(formatted[0]["ID"]).toBe("app-123");
    expect(formatted[0]["Candidate Name"]).toBe("Jane Doe");
    expect(formatted[0]["Email"]).toBe("jane@example.com");
    expect(formatted[0]["Phone"]).toBe("+1234567890");
    expect(formatted[0]["Applied Position"]).toBe("Senior Full Stack Engineer");
    expect(formatted[0]["Job Domain"]).toBe("Engineering");
    expect(formatted[0]["Status"]).toBe("SHORTLISTED");
    expect(formatted[0]["Portfolio URL"]).toBe("https://janedoe.dev");
    expect(formatted[0]["LinkedIn URL"]).toBe("https://linkedin.com/in/janedoe");
    expect(formatted[0]["Resume File Name"]).toBe("jane_doe_cv.pdf");
    expect(formatted[0]["Cover Letter / Notes"]).toBe("Excited to apply for this role!");

    expect(formatted[1]["Phone"]).toBe("N/A");
    expect(formatted[1]["Portfolio URL"]).toBe("N/A");
    expect(formatted[1]["LinkedIn URL"]).toBe("N/A");
    expect(formatted[1]["Cover Letter / Notes"]).toBe("N/A");
    expect(formatted[1]["Status"]).toBe("PENDING");
  });

  it("should return false when exporting an empty application list", () => {
    const result = exportApplicationsToExcel([]);
    expect(result).toBe(false);
  });

  it("should generate workbook and call XLSX.writeFile when exporting applications", () => {
    const result = exportApplicationsToExcel(mockApplications, "Test_Applicants");
    expect(result).toBe(true);
    expect(XLSX.writeFile).toHaveBeenCalled();
  });
});
