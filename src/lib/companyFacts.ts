export const COMPANY_FACTS = {
  name: "PT Andis Sentral Laboratorium",
  shortName: "AndisLab",
  address: "Jl. Raya Mayor Oking Jaya Atmaja No.112, Cirimekar, Kec. Cibinong, Kabupaten Bogor, Jawa Barat 16918",
  streetAddress: "Jl. Raya Mayor Oking Jaya Atmaja No.112, Cirimekar",
  addressLocality: "Cibinong",
  addressRegion: "Jawa Barat",
  postalCode: "16918",
  addressCountry: "ID",
  officePhone: "021-38740154",
  officePhoneInt: "+62-21-38740154",
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
