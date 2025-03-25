import { NextResponse } from "next/server";

const specializationsByIndustry = {
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
  education: [
    { id: "edu_k12", name: "K-12 Teaching", industryId: "education" },
    { id: "edu_higher", name: "Higher Education", industryId: "education" },
    { id: "edu_special", name: "Special Education", industryId: "education" },
    { id: "edu_admin", name: "Educational Administration", industryId: "education" },
    { id: "edu_tech", name: "Educational Technology", industryId: "education" },
  ],
  manufacturing: [
    { id: "mfg_prod", name: "Production Management", industryId: "manufacturing" },
    { id: "mfg_quality", name: "Quality Control", industryId: "manufacturing" },
    { id: "mfg_supply", name: "Supply Chain", industryId: "manufacturing" },
    { id: "mfg_eng", name: "Industrial Engineering", industryId: "manufacturing" },
  ],
  retail: [
    { id: "retail_store", name: "Store Management", industryId: "retail" },
    { id: "retail_merch", name: "Merchandising", industryId: "retail" },
    { id: "retail_ecom", name: "E-commerce", industryId: "retail" },
    { id: "retail_service", name: "Customer Service", industryId: "retail" },
    { id: "retail_sales", name: "Sales", industryId: "retail" },
  ],
  construction: [
    { id: "const_pm", name: "Project Management", industryId: "construction" },
    { id: "const_arch", name: "Architecture", industryId: "construction" },
    { id: "const_civil", name: "Civil Engineering", industryId: "construction" },
    { id: "const_elec", name: "Electrical", industryId: "construction" },
    { id: "const_plumb", name: "Plumbing", industryId: "construction" },
  ],
  real_estate: [
    { id: "re_residential", name: "Residential Sales", industryId: "real_estate" },
    { id: "re_commercial", name: "Commercial Sales", industryId: "real_estate" },
    { id: "re_property", name: "Property Management", industryId: "real_estate" },
    { id: "re_dev", name: "Real Estate Development", industryId: "real_estate" },
  ],
  legal: [
    { id: "legal_corp", name: "Corporate Law", industryId: "legal" },
    { id: "legal_crim", name: "Criminal Law", industryId: "legal" },
    { id: "legal_family", name: "Family Law", industryId: "legal" },
    { id: "legal_re", name: "Real Estate Law", industryId: "legal" },
    { id: "legal_immig", name: "Immigration Law", industryId: "legal" },
  ],
  hospitality: [
    { id: "hosp_hotel", name: "Hotel Management", industryId: "hospitality" },
    { id: "hosp_rest", name: "Restaurant Management", industryId: "hospitality" },
    { id: "hosp_event", name: "Event Planning", industryId: "hospitality" },
    { id: "hosp_tourism", name: "Tourism", industryId: "hospitality" },
  ],
  other: [
    { id: "other_general", name: "General", industryId: "other" },
  ],
};

export async function GET() {
  // Flatten the specializations from all industries into a single array
  const allSpecializations = Object.values(specializationsByIndustry).flat();
  
  // Sort by name for easier browsing
  allSpecializations.sort((a, b) => a.name.localeCompare(b.name));
  
  return NextResponse.json(allSpecializations);
} 