import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatbotLazy from "@/components/ChatbotLazy";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { WA_NUMBER } from "@/lib/contact";
import { COMPANY_FACTS } from "@/lib/companyFacts";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": COMPANY_FACTS.name,
    "url": "https://www.andislab.com",
    "logo": "https://www.andislab.com/logo.png",
    "description": COMPANY_FACTS.description,
    "telephone": `+${WA_NUMBER}`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Indonesia",
      "addressCountry": "ID"
    },
    "areaServed": "ID",
    "openingHours": "Mo-Fr 08:00-17:00",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": COMPANY_FACTS.ratingValue,
      "reviewCount": COMPANY_FACTS.reviewCount,
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Navbar />
      <main className="min-h-screen bg-white pb-12">
        {children}
      </main>
      <Footer />
      <ChatbotLazy />
      <FloatingWhatsApp />
    </>
  );
}

