import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatbotLazy from "@/components/ChatbotLazy";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "PT Andis Sentral Laboratorium",
    "url": "https://www.andislab.com",
    "logo": "https://www.andislab.com/logo.png",
    "description": "Distributor alat laboratorium, bahan kimia lab, reagen air Lovibond, inkubator Daihan Labtech, glassware Pyrex original, dan furnitur lab custom.",
    "telephone": "+6285973211179",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Jl. Raya Mayor Oking Jaya Atmaja No.112, Cirimekar",
      "addressLocality": "Cibinong, Kabupaten Bogor",
      "addressRegion": "Jawa Barat",
      "postalCode": "16918",
      "addressCountry": "ID"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "-6.482025",
      "longitude": "106.864757"
    },
    "areaServed": ["Jabodetabek", "Indonesia"],
    "openingHours": "Mo-Fr 08:00-17:00"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Navbar />
      <main className="min-h-screen bg-white pt-24 pb-12">
        {children}
      </main>
      <Footer />
      <ChatbotLazy />
      <FloatingWhatsApp />
    </>
  );
}

