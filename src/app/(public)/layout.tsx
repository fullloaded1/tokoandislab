import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatbotLazy from "@/components/ChatbotLazy";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-24 pb-12">
        {children}
      </main>
      <Footer />
      <ChatbotLazy />
    </>
  );
}

