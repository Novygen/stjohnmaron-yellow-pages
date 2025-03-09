import { NextResponse } from "next/server";

interface Specialization {
  id: string;
  name: string;
  industryId: string;
}

const specializationsByIndustry: Record<string, Specialization[]> = {
  tech: [
    { id: "tech_software", name: "Software Development", industryId: "tech" },
    { id: "tech_infra", name: "IT Infrastructure", industryId: "tech" },
    { id: "tech_security", name: "Cybersecurity", industryId: "tech" },
    { id: "tech_data", name: "Data Science", industryId: "tech" },
    { id: "tech_cloud", name: "Cloud Computing", industryId: "tech" },
    { id: "tech_ai", name: "AI/Machine Learning", industryId: "tech" },
  ],
  healthcare: [
    { id: "health_med", name: "Medicine", industryId: "healthcare" },
    { id: "health_nursing", name: "Nursing", industryId: "healthcare" },
    { id: "health_pt", name: "Physical Therapy", industryId: "healthcare" },
    { id: "health_mental", name: "Mental Health", industryId: "healthcare" },
    { id: "health_admin", name: "Healthcare Administration", industryId: "healthcare" },
  ],
  finance: [
    { id: "fin_accounting", name: "Accounting", industryId: "finance" },
    { id: "fin_banking", name: "Investment Banking", industryId: "finance" },
    { id: "fin_planning", name: "Financial Planning", industryId: "finance" },
    { id: "fin_insurance", name: "Insurance", industryId: "finance" },
    { id: "fin_risk", name: "Risk Management", industryId: "finance" },
  ],
  // ... other industries and their specializations
};

interface Industry {
  id: string;
  name: string;
}

const industries: Industry[] = [
  { id: "tech", name: "Technology" },
  { id: "healthcare", name: "Healthcare" },
  { id: "finance", name: "Finance" },
  { id: "education", name: "Education" },
  { id: "manufacturing", name: "Manufacturing" },
  { id: "retail", name: "Retail" },
  { id: "construction", name: "Construction" },
  { id: "real_estate", name: "Real Estate" },
  { id: "legal", name: "Legal Services" },
  { id: "hospitality", name: "Hospitality" },
  { id: "other", name: "Other" },
];

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const specializationId = params.id;
  
  // Search through all industries to find the specialization
  for (const industryId in specializationsByIndustry) {
    const specializations = specializationsByIndustry[industryId];
    const specialization = specializations.find((spec: Specialization) => spec.id === specializationId);
    
    if (specialization) {
      const industry = industries.find(ind => ind.id === specialization.industryId);
      return NextResponse.json({
        ...specialization,
        industryName: industry?.name || specialization.industryId
      });
    }
  }

  return NextResponse.json(
    { error: "Specialization not found" },
    { status: 404 }
  );
} 