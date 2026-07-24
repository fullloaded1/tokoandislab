export const COMPANY_FACTS = {
  name: "PT Andis Sentral Laboratorium",
  shortName: "AndisLab",
  foundYear: 2010,
  get experienceYears() {
    return new Date().getFullYear() - this.foundYear;
  },
  clientsCount: "500+",
  productsCount: "2.000+",
  coverageArea: "34 Provinsi di seluruh Indonesia",
  supportHours: "Senin–Jumat, 08:00–17:00 WIB",
  tagline: "Distributor Alat Laboratorium Resmi di Indonesia",
  description: "Distributor alat laboratorium ready stock di Indonesia, melayani instansi pemerintah, kampus, dan industri dengan kelengkapan dokumen SPJ & faktur pajak sejak 2010.",
  ratingValue: "4.9",
  reviewCount: "520",
} as const;
