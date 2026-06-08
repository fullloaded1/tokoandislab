"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { updateInquiryStatus } from "../actions";
import { Calendar, Building, FileText, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { formatRupiah } from "@/lib/products";

const COLUMNS = [
  { id: "NEW", title: "New Lead", icon: AlertCircle, color: "border-yellow-200 bg-yellow-50", headerBg: "bg-yellow-100 text-yellow-800" },
  { id: "REVIEWING", title: "Follow Up", icon: Clock, color: "border-purple-200 bg-purple-50", headerBg: "bg-purple-100 text-purple-800" },
  { id: "QUOTED", title: "Quotation Sent", icon: FileText, color: "border-blue-200 bg-blue-50", headerBg: "bg-blue-100 text-blue-800" },
  { id: "WON", title: "Deal (Project)", icon: CheckCircle, color: "border-emerald-200 bg-emerald-50", headerBg: "bg-emerald-100 text-emerald-800" },
  { id: "LOST", title: "Lost", icon: XCircle, color: "border-slate-200 bg-slate-50", headerBg: "bg-slate-200 text-slate-800" },
];

export default function InquiriesClient({ initialInquiries }: { initialInquiries: any[] }) {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Optimistically update UI
    const updatedInquiries = Array.from(inquiries);
    const draggedInquiryIndex = updatedInquiries.findIndex(i => i.id === draggableId);
    
    if (draggedInquiryIndex === -1) return;

    const newStatus = destination.droppableId;
    const oldStatus = updatedInquiries[draggedInquiryIndex].status;

    // Update status in local state
    updatedInquiries[draggedInquiryIndex].status = newStatus;
    setInquiries(updatedInquiries);

    // Call server action
    try {
      const res = await updateInquiryStatus(draggableId, newStatus);
      if (!res.success) {
        // Revert on error
        updatedInquiries[draggedInquiryIndex].status = oldStatus;
        setInquiries([...updatedInquiries]);
        alert(res.error || "Gagal mengupdate status");
      }
    } catch (error) {
      console.error(error);
      updatedInquiries[draggedInquiryIndex].status = oldStatus;
      setInquiries([...updatedInquiries]);
    }
  };

  // Group inquiries by status
  const getInquiriesByStatus = (statusId: string) => {
    return inquiries.filter(i => i.status === statusId)
      // Sort within column if needed (e.g. by date descending)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  if (!isMounted) return null; // Prevent hydration errors for DragDropContext

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 overflow-x-auto pb-8 h-[calc(100vh-140px)] items-start">
        {COLUMNS.map(column => {
          const colInquiries = getInquiriesByStatus(column.id);
          const Icon = column.icon;

          return (
            <div key={column.id} className={`flex-shrink-0 w-80 rounded-2xl border ${column.color} flex flex-col h-full overflow-hidden shadow-sm`}>
              <div className={`px-4 py-3 border-b ${column.color} ${column.headerBg} flex items-center justify-between`}>
                <div className="flex items-center gap-2 font-bold">
                  <Icon className="h-4 w-4" />
                  {column.title}
                </div>
                <div className="px-2 py-0.5 bg-white/50 rounded-full text-xs font-bold">
                  {colInquiries.length}
                </div>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 p-3 overflow-y-auto transition-colors ${snapshot.isDraggingOver ? "bg-black/5" : ""}`}
                  >
                    {colInquiries.map((inq, index) => {
                      const totalEst = inq.items.reduce((sum: number, item: any) => sum + ((item.product?.price || 0) * item.quantity), 0);

                      return (
                        <Draggable key={inq.id} draggableId={inq.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`mb-3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm transition-all
                                ${snapshot.isDragging ? "shadow-xl rotate-2 scale-105" : "hover:border-blue-300 hover:shadow-md"}`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold text-slate-500">{inq.inquiryNo}</span>
                                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(inq.createdAt).toLocaleDateString("id-ID", { month: 'short', day: 'numeric' })}
                                </span>
                              </div>

                              <div className="mb-3">
                                <div className="font-bold text-slate-800 text-sm flex items-start gap-1.5">
                                  <Building className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" />
                                  <span className="line-clamp-2">{inq.institution?.name || "Unknown"}</span>
                                </div>
                                <div className="text-xs text-slate-500 mt-1 pl-5">
                                  {inq.institution?.contacts?.[0]?.name || "Tanpa Nama"}
                                </div>
                              </div>

                              <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                                <div>
                                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Estimasi</div>
                                  <div className="text-sm font-bold text-blue-600">{formatRupiah(totalEst)}</div>
                                </div>
                                <Link 
                                  href={`/admin/inquiries/${inq.id}`}
                                  className="text-xs font-semibold text-blue-600 hover:bg-blue-50 px-2 py-1.5 rounded-lg transition-colors"
                                >
                                  Detail →
                                </Link>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
