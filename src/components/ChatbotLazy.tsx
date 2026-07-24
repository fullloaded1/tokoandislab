"use client";

import dynamic from "next/dynamic";

// Lazy load Chatbot — tidak perlu SSR, dan bundle Lottie 120KB tidak blocking initial load
const Chatbot = dynamic(() => import("@/components/Chatbot"), {
  ssr: false,
});

export default function ChatbotLazy() {
  return <Chatbot />;
}
