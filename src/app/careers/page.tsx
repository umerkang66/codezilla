import { Metadata } from "next";
import TalentAcquisitionClient from "../talent-acquisition/TalentAcquisitionClient";

export const metadata: Metadata = {
  title: "Careers & Talent Acquisition | Codzilla Technologies",
  description: "Explore engineering careers, student developer opportunities, and research roles at Codzilla Technologies.",
};

export default function CareersPage() {
  return <TalentAcquisitionClient />;
}
