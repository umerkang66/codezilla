import * as XLSX from "xlsx";

export interface JobApplicationForExport {
  id: string;
  job_id?: string;
  job_title?: string;
  job_domain?: string;
  full_name: string;
  email: string;
  phone?: string;
  portfolio_url?: string;
  linkedin_url?: string;
  cover_letter?: string;
  resume_url?: string;
  resume_file_name?: string;
  resume_file_type?: string;
  status: string;
  created_at: string;
}

export interface ApplicationExcelRow {
  "ID": string;
  "Candidate Name": string;
  "Email": string;
  "Phone": string;
  "Applied Position": string;
  "Job Domain": string;
  "Status": string;
  "Applied Date": string;
  "Portfolio URL": string;
  "LinkedIn URL": string;
  "Resume File Name": string;
  "Resume Format": string;
  "Resume Link": string;
  "Cover Letter / Notes": string;
}

/**
 * Formats job applications into clean records for Excel export.
 */
export function formatApplicationsForExcel(
  applications: JobApplicationForExport[]
): ApplicationExcelRow[] {
  return applications.map((app) => {
    let createdDateFormatted = "";
    if (app.created_at) {
      try {
        const d = new Date(app.created_at);
        createdDateFormatted = isNaN(d.getTime())
          ? app.created_at
          : d.toLocaleString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            });
      } catch {
        createdDateFormatted = app.created_at;
      }
    }

    return {
      "ID": app.id || "",
      "Candidate Name": app.full_name || "",
      "Email": app.email || "",
      "Phone": app.phone || "N/A",
      "Applied Position": app.job_title || "N/A",
      "Job Domain": app.job_domain || "N/A",
      "Status": (app.status || "pending").toUpperCase(),
      "Applied Date": createdDateFormatted,
      "Portfolio URL": app.portfolio_url || "N/A",
      "LinkedIn URL": app.linkedin_url || "N/A",
      "Resume File Name": app.resume_file_name || "N/A",
      "Resume Format": (app.resume_file_type || "pdf").toUpperCase(),
      "Resume Link": app.resume_url
        ? app.resume_url.startsWith("data:")
          ? "Uploaded as Base64 attachment in DB"
          : app.resume_url
        : "N/A",
      "Cover Letter / Notes": app.cover_letter || "N/A",
    };
  });
}

/**
 * Generates an Excel workbook (.xlsx) from job applications and initiates browser download.
 */
export function exportApplicationsToExcel(
  applications: JobApplicationForExport[],
  fileNamePrefix: string = "Candidate_Applications"
): boolean {
  if (!applications || applications.length === 0) {
    return false;
  }

  const rows = formatApplicationsForExcel(applications);

  // Build Worksheet
  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Set professional column widths
  worksheet["!cols"] = [
    { wch: 15 }, // ID
    { wch: 25 }, // Candidate Name
    { wch: 30 }, // Email
    { wch: 18 }, // Phone
    { wch: 30 }, // Applied Position
    { wch: 20 }, // Job Domain
    { wch: 15 }, // Status
    { wch: 22 }, // Applied Date
    { wch: 35 }, // Portfolio URL
    { wch: 35 }, // LinkedIn URL
    { wch: 25 }, // Resume File Name
    { wch: 15 }, // Resume Format
    { wch: 35 }, // Resume Link
    { wch: 50 }, // Cover Letter
  ];

  // Build Workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates");

  // Construct descriptive filename
  const todayStr = new Date().toISOString().split("T")[0];
  const sanitizedPrefix = fileNamePrefix.replace(/[^a-zA-Z0-9_-]/g, "_");
  const fileName = `${sanitizedPrefix}_${todayStr}.xlsx`;

  // Write file to trigger browser download
  XLSX.writeFile(workbook, fileName);
  return true;
}
