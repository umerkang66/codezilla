import { Metadata } from "next";
import TalentAcquisitionClient from "./TalentAcquisitionClient";

export const metadata: Metadata = {
  title: "Talent Acquisition & Engineering Careers | Codzilla Technologies",
  description: "Join Codzilla Technologies as a student developer, AI researcher, or hardware engineer. Contribute to real commercial projects, get paid per milestone, and build your engineering career.",
};

export default function TalentAcquisitionPage() {
  return <TalentAcquisitionClient />;
}
