import { prisma } from "@/lib/db";
import { MessageSquareText, Search, Activity, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AIAnalyticsPage() {
  const chatLogs = await prisma.chatLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100, // Limit to recent 100 for performance
  });

  const totalChats = await prisma.chatLog.count();
  const salesAgentChats = await prisma.chatLog.count({ where: { agent: "sales" } });
  const techAgentChats = await prisma.chatLog.count({ where: { agent: "tech" } });
  
  // Group by session to get unique users roughly
  const uniqueSessions = await prisma.chatLog.groupBy({
    by: ['sessionId'],
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">AI Chatbot Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">Pantau performa dan riwayat obrolan pelanggan dengan AndisBot.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <MessageSquareText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Total Obrolan</p>
              <h3 className="text-2xl font-bold text-slate-800">{totalChats}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Total Pengguna Aktif</p>
              <h3 className="text-2xl font-bold text-slate-800">{uniqueSessions.length}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Sales vs Tech</p>
              <h3 className="text-lg font-bold text-slate-800">
                {salesAgentChats} <span className="text-slate-400 text-sm font-normal">vs</span> {techAgentChats}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">Riwayat Percakapan Terakhir</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari kata kunci..." 
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none w-64 bg-white"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-800 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 w-48">Waktu & Agen</th>
                <th className="px-6 py-4 w-1/3">Pesan Klien</th>
                <th className="px-6 py-4">Respons AI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {chatLogs.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                    Belum ada riwayat obrolan.
                  </td>
                </tr>
              ) : (
                chatLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 align-top">
                      <div className="text-xs text-slate-500 mb-1">
                        {new Date(log.createdAt).toLocaleString("id-ID")}
                      </div>
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        log.agent === "tech" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                      }`}>
                        {log.agent}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="p-3 bg-slate-100 rounded-xl text-slate-800 whitespace-pre-wrap font-medium">
                        {log.userMessage}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="p-3 bg-blue-50/50 rounded-xl text-slate-600 whitespace-pre-wrap line-clamp-3 hover:line-clamp-none transition-all">
                        {log.aiResponse || "..."}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
