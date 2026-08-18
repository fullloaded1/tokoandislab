"use client";

import { CUSTOMER_TESTIMONIALS } from "@/lib/promoSuccessMetrics";

export default function CustomerGratitude() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl border border-emerald-200">
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 mb-3">
          💚 Terima Kasih!
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
          Terima Kasih Kepada <span className="text-emerald-600">Pelanggan Setia</span>
        </h2>
        <p className="text-sm text-slate-600 mt-3 max-w-2xl mx-auto">
          Kepercayaan dari laboratorium di seluruh Indonesia adalah aset terbesar kami.
          Berikut ucapan terima kasih dari mereka yang sudah merasakan kualitas AndisLab.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CUSTOMER_TESTIMONIALS.map((testimonial, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-300"
          >
            {/* Rating Stars */}
            <div className="flex items-center gap-0.5 mb-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < Math.floor(testimonial.rating)
                        ? "text-yellow-400"
                        : "text-slate-200"
                    }`}
                  >
                    ★
                  </span>
                ))}
            </div>

            {/* Message */}
            <p className="text-slate-700 text-sm leading-relaxed mb-4 italic">
              "{testimonial.message}"
            </p>

            {/* Name & Institution */}
            <div className="border-t border-slate-100 pt-3">
              <p className="font-bold text-slate-800 text-sm">{testimonial.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{testimonial.institution}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Thank you message */}
      <div className="mt-12 text-center">
        <p className="text-slate-700 font-semibold max-w-2xl mx-auto">
          Komitmen kami: Terus memberikan produk berkualitas, harga bersaing, dan layanan terbaik
          untuk kemajuan laboratorium dan industri Indonesia. 🇮🇩
        </p>
      </div>
    </section>
  );
}
