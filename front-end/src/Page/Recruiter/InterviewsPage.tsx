"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RecruiterLayout from "@/src/components/Recruiter/RecruiterLayout";
import { useAuth } from "@/src/hooks/useAuth";
import { useSocket } from "@/src/hooks/useSocket";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import {
  Calendar,
  Clock,
  User,
  Send,
  Video,
  MapPin,
  Trash2,
  MoreVertical,
  MessageSquare,
  X,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle,
  Pencil,
  Check,
  Loader2,
} from "lucide-react";
import { useDeleteConversationMutation } from "@/src/redux/features/conversations/conversationsApi";
import {
  useScheduleInterviewMutation,
  useHireCandidateMutation,
} from "@/src/redux/features/interviews/interviewsApi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { toast } from "sonner";

interface MsgItem {
  _id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}
interface Pagination {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
interface ConvItem {
  _id: string;
  participants: any[];
  role?: string;
  status?: string;
  updatedAt: string;
}
interface Candidate {
  id: string;
  conversationId: string;
  name: string;
  email: string;
  jobTitle: string;
  avatar?: string;
  interviewStatus: "none" | "pending" | "scheduled";
  rawConversation: any;
}

const InterviewsPage = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const typeRef = useRef<HTMLSelectElement>(null);
  const startTimeRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<HTMLInputElement>(null);
  const meetLinkRef = useRef<HTMLInputElement>(null);

  const [deleteConversation] = useDeleteConversationMutation();
  const [scheduleInterview, { isLoading: isScheduling }] =
    useScheduleInterviewMutation();
  const [hireCandidate, { isLoading: isHiring }] = useHireCandidateMutation();

  const [conversations, setConversations] = useState<ConvItem[]>([]);
  const [isLoadingConvs, setIsLoadingConvs] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null,
  );
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [allMessages, setAllMessages] = useState<MsgItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoadingMsgs, setIsLoadingMsgs] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [showScheduler, setShowScheduler] = useState(false);
  const isFetchingMessages = isLoadingMore;

  const fmtTime = (d: string) =>
    new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const getInterviewStatus = (s?: string): Candidate["interviewStatus"] => {
    if (s === "interview") return "scheduled";
    if (s === "under_review") return "pending";
    return "none";
  };
  const buildCandidate = (conv: ConvItem): Candidate => {
    const o = conv.participants[0];
    return {
      id: o?._id,
      conversationId: conv._id,
      name: o?.name || "Unknown",
      email: o?.email || "",
      jobTitle: conv.role || "Candidate",
      avatar: o?.image,
      interviewStatus: getInterviewStatus(conv.status),
      rawConversation: conv,
    };
  };

  // URL sync
  useEffect(() => {
    const id = searchParams.get("conversation");
    setSelectedConvId(id);
    console.log(id);
    if (!id) {
      setSelectedCandidate(null);
    } else if (conversations.length > 0) {
      const conv = conversations.find((c) => c._id === id);
      if (conv) {
        setSelectedCandidate(buildCandidate(conv));
      }
    }
  }, [searchParams, conversations]);

  const selectConv = useCallback(
    (conv: ConvItem) => {
      if (selectedConvId === conv._id) return;
      const c = buildCandidate(conv);
      setSelectedCandidate(c);
      setSelectedConvId(conv._id);
      setAllMessages([]);
      setCurrentPage(1);
      setPagination(null);
      router.replace(`?conversation=${conv._id}`, { scroll: false });
    },
    [router, selectedConvId],
  );

  // Socket events
  useEffect(() => {
    if (!socket) return;
    socket.emit("conversations:get");
    socket.on(
      "conversations:loaded",
      ({ conversations: convs }: { conversations: ConvItem[] }) => {
        setConversations(convs);
        setIsLoadingConvs(false);
        const urlId = searchParams.get("conversation");
        if (urlId) {
          const conv = convs.find((c) => c._id === urlId);
          if (conv) {
            setSelectedConvId(urlId);
            setSelectedCandidate(buildCandidate(conv));
          } else {
            setSelectedConvId(null);
            setSelectedCandidate(null);
          }
        } else {
          setSelectedConvId(null);
          setSelectedCandidate(null);
        }
      },
    );
    socket.on("message:new", ({ message }: { message: MsgItem }) => {
      if (message.conversationId === selectedConvId) {
        setAllMessages((prev) =>
          prev.find((m) => m._id === message._id) ? prev : [...prev, message],
        );
        setTimeout(
          () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }),
          50,
        );
      }
    });
    socket.on("message:edited", ({ message }: { message: MsgItem }) =>
      setAllMessages((prev) =>
        prev.map((m) => (m._id === message._id ? message : m)),
      ),
    );
    socket.on("message:deleted", ({ messageId }: { messageId: string }) =>
      setAllMessages((prev) => prev.filter((m) => m._id !== messageId)),
    );
    socket.on("message:read", ({ messageId }: { messageId: string }) =>
      setAllMessages((prev) =>
        prev.map((m) => (m._id === messageId ? { ...m, isRead: true } : m)),
      ),
    );
    socket.on(
      "messages:loaded",
      ({
        messages: msgs,
        pagination: pag,
      }: {
        messages: MsgItem[];
        pagination: Pagination;
        conversationId: string;
      }) => {
        setIsLoadingMsgs(false);
        setIsLoadingMore(false);
        setPagination(pag);
        if (pag.currentPage === 1) {
          setAllMessages(msgs.slice().reverse());
          setTimeout(
            () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }),
            50,
          );
        } else {
          const prevH = chatContainerRef.current?.scrollHeight ?? 0;
          setAllMessages((prev) => {
            const inc = msgs
              .slice()
              .reverse()
              .filter((m) => !prev.find((p) => p._id === m._id));
            return [...inc, ...prev];
          });
          requestAnimationFrame(() => {
            if (chatContainerRef.current)
              chatContainerRef.current.scrollTop =
                chatContainerRef.current.scrollHeight - prevH;
          });
        }
      },
    );
    socket.on("socket:error", ({ message: msg }: { message: string }) =>
      toast.error(msg),
    );
    return () => {
      socket.off("conversations:loaded");
      socket.off("message:new");
      socket.off("message:edited");
      socket.off("message:deleted");
      socket.off("message:read");
      socket.off("messages:loaded");
      socket.off("socket:error");
    };
  }, [socket, selectedConvId]);

  // Join room + load messages
  useEffect(() => {
    if (!socket || !selectedConvId) return;
    socket.emit("conversation:join", { conversationId: selectedConvId });
    setIsLoadingMsgs(true);
    setAllMessages([]);
    setCurrentPage(1);
    setPagination(null);
    socket.emit("messages:get", {
      conversationId: selectedConvId,
      page: 1,
      limit: 20,
    });
    return () => {
      socket.emit("conversation:leave", { conversationId: selectedConvId });
    };
  }, [socket, selectedConvId]);

  // Auto mark as read
  useEffect(() => {
    if (!socket || !selectedConvId) return;
    allMessages.forEach((m) => {
      if (!m.isRead && m.receiverId === user?._id)
        socket.emit("message:read", {
          messageId: m._id,
          conversationId: selectedConvId,
        });
    });
  }, [allMessages, socket, selectedConvId, user?._id]);

  const loadMore = useCallback(() => {
    if (!socket || !selectedConvId || !pagination?.hasNext || isLoadingMore)
      return;
    const next = currentPage + 1;
    setCurrentPage(next);
    setIsLoadingMore(true);
    socket.emit("messages:get", {
      conversationId: selectedConvId,
      page: next,
      limit: 20,
    });
  }, [socket, selectedConvId, pagination, currentPage, isLoadingMore]);

  const handleSendMessage = useCallback(() => {
    const content = messageInputRef.current?.value?.trim();
    if (!content || !socket || !selectedConvId || !selectedCandidate) return;
    socket.emit("message:send", {
      conversationId: selectedConvId,
      receiverId: selectedCandidate.id,
      content,
    });
    if (messageInputRef.current) messageInputRef.current.value = "";
  }, [socket, selectedConvId, selectedCandidate]);

  const commitEdit = useCallback(() => {
    const c = editInputRef.current?.value?.trim();
    if (!c || !socket || !editingMsgId || !selectedConvId) {
      setEditingMsgId(null);
      return;
    }
    socket.emit("message:edit", {
      messageId: editingMsgId,
      content: c,
      conversationId: selectedConvId,
    });
    setEditingMsgId(null);
  }, [socket, editingMsgId, selectedConvId]);

  const handleDeleteMessage = useCallback(
    (msgId: string) => {
      if (!socket || !selectedConvId) return;
      socket.emit("message:delete", {
        messageId: msgId,
        conversationId: selectedConvId,
      });
    },
    [socket, selectedConvId],
  );

  const handleDeleteConversation = async () => {
    if (!selectedConvId) return;
    if (!confirm("Delete this conversation?")) return;
    try {
      await deleteConversation(selectedConvId).unwrap();
      setConversations((prev) => prev.filter((c) => c._id !== selectedConvId));
      setSelectedCandidate(null);
      setSelectedConvId(null);
      setAllMessages([]);
      router.replace("?", { scroll: false });
      toast.success("Conversation deleted");
    } catch {
      toast.error("Failed to delete conversation");
    }
  };

  const handleScheduleInterview = async () => {
    if (!selectedCandidate) return;

    const date = dateRef.current?.value;
    const start_time = startTimeRef.current?.value;
    const end_time = endTimeRef.current?.value;
    const type = typeRef.current?.value as any;
    const meet_link = meetLinkRef.current?.value;

    if (!date || !start_time || !end_time) {
      toast.error("Please fill in date and time");
      return;
    }

    try {
      await scheduleInterview({
        application_id: selectedCandidate.rawConversation.job_id,
        job_id: selectedCandidate.rawConversation.job_id,
        interviewee: selectedCandidate.id as any,
        date: new Date(date).toISOString(),
        start_time,
        end_time,
        type,
        meet_link,
      }).unwrap();

      toast.success("Interview scheduled successfully");
      setShowScheduler(false);
    } catch (error) {
      toast.error("Failed to schedule interview");
    }
  };

  const handleHireCandidate = async () => {
    if (!selectedCandidate) return;
    if (!confirm(`Are you sure you want to hire ${selectedCandidate.name}?`))
      return;

    try {
      await hireCandidate({
        jobId: selectedCandidate.rawConversation.job_id,
        applicantId: selectedCandidate.id,
      }).unwrap();
      toast.success(`${selectedCandidate.name} has been hired!`);
    } catch (error) {
      toast.error("Failed to hire candidate");
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (e.currentTarget.scrollTop === 0) loadMore();
  };

  if (!user) return null;

  return (
    <RecruiterLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#234C6A] to-[#456882] flex items-center justify-center text-white shadow-lg">
              <Calendar className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#234C6A]">
                Interview Hub
              </h1>
              <p className="text-[#456882]">
                Coordinate and schedule with your top candidates
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Candidates List */}
          <Card className="p-4 border-none bg-white shadow-xl rounded-3xl lg:col-span-1 h-[750px] flex flex-col">
            <div className="flex items-center justify-between mb-6 px-2">
              <h3 className="font-bold text-[#234C6A] flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-[#456882]" />
                Recent Chats
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {isLoadingConvs ? (
                [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-20 w-full animate-pulse bg-gray-50 rounded-2xl"
                  />
                ))
              ) : conversations.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-sm text-[#456882]">No conversations yet</p>
                </div>
              ) : (
                conversations.map((conv: ConvItem) => {
                  const other = conv.participants[0];
                  const isSelected = selectedConvId === conv._id;
                  return (
                    <button
                      key={conv._id}
                      onClick={() => selectConv(conv)}
                      className={`w-full p-4 rounded-2xl text-left transition-all duration-300 ${
                        isSelected
                          ? "bg-[#234C6A] text-white shadow-lg scale-[1.02]"
                          : "hover:bg-gray-50 border border-transparent hover:border-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-2xl overflow-hidden border-2 ${isSelected ? "border-white/20" : "border-gray-100"}`}
                        >
                          {other?.image ? (
                            <img
                              src={other.image}
                              alt={other.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-[#234C6A]/10 flex items-center justify-center text-[#234C6A]">
                              <User className="h-6 w-6" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <h4
                              className={`font-bold truncate ${isSelected ? "text-white" : "text-[#234C6A]"}`}
                            >
                              {other?.name}
                            </h4>
                            <span
                              className={`text-[10px] ${isSelected ? "text-white/60" : "text-[#456882]/60"}`}
                            >
                              {fmtTime(conv.updatedAt)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <p
                              className={`text-xs truncate font-medium ${isSelected ? "text-white/80" : "text-[#456882]"}`}
                            >
                              {conv.role}
                            </p>
                            <Badge
                              className={`${isSelected ? "bg-white/20 text-white" : "bg-[#234C6A]/5 text-[#234C6A]"} text-[9px] px-1.5 py-0 border-none capitalize h-4`}
                            >
                              {conv.status?.replace(/_/g, " ")}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </Card>

          {/* Chat Window */}
          <Card className="lg:col-span-2 border-none bg-white shadow-xl rounded-3xl h-[750px] flex flex-col overflow-hidden relative">
            {selectedCandidate ? (
              <>
                {/* Chat Header */}
                <div className="p-6 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                      {selectedCandidate.avatar ? (
                        <img
                          src={selectedCandidate.avatar}
                          alt={selectedCandidate.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#234C6A]/5 flex items-center justify-center text-[#234C6A]">
                          <User className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#234C6A] leading-tight">
                        {selectedCandidate.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-600 border-blue-100 text-[10px] px-2 py-0"
                        >
                          {selectedCandidate.jobTitle}
                        </Badge>
                        {selectedCandidate.interviewStatus === "scheduled" && (
                          <Badge className="bg-green-500 text-white text-[10px] px-2 py-0">
                            Scheduled
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedCandidate.interviewStatus === "pending" && (
                      <Button
                        onClick={() => setShowScheduler(!showScheduler)}
                        className={`${showScheduler ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-[#234C6A] hover:bg-[#234C6A]/90 text-white"} rounded-xl shadow-lg transition-all duration-300`}
                      >
                        {showScheduler ? (
                          <>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </>
                        ) : (
                          <>
                            <Calendar className="h-4 w-4 mr-2" />
                            Schedule
                          </>
                        )}
                      </Button>
                    )}

                    {selectedCandidate.interviewStatus === "scheduled" && (
                      <Button
                        onClick={handleHireCandidate}
                        disabled={isHiring}
                        className="bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg shadow-green-100/50"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {isHiring ? "Hiring..." : "Hire Candidate"}
                      </Button>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-xl hover:bg-gray-50"
                        >
                          <MoreVertical className="h-5 w-5 text-[#456882]" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="rounded-2xl border-gray-100 shadow-2xl p-2"
                      >
                        <DropdownMenuItem
                          onClick={handleDeleteConversation}
                          className="text-red-600 focus:text-red-600 focus:bg-red-50 rounded-xl cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Conversation
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Scheduler Top Drawer */}
                <div
                  className={`absolute top-[7rem] md:top-[8rem] left-0 right-0 z-20 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
                    showScheduler
                      ? "translate-y-0 opacity-100"
                      : "-translate-y-full opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="mx-6 p-8 bg-white/95 backdrop-blur-2xl rounded-b-[40px] shadow-[0_20px_50px_rgba(35,76,106,0.15)] border-x border-b border-gray-100/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-bold text-[#234C6A] ml-1 uppercase tracking-wider opacity-60">
                          <Calendar className="h-3 w-3" />
                          Meeting Date
                        </label>
                        <Input
                          ref={dateRef}
                          type="date"
                          className="rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white h-12 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-bold text-[#234C6A] ml-1 uppercase tracking-wider opacity-60">
                          <Video className="h-3 w-3" />
                          Interview Type
                        </label>
                        <div className="relative group">
                          <select
                            ref={typeRef}
                            className="w-full h-12 rounded-2xl border border-gray-100 bg-gray-50/50 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#234C6A]/10 appearance-none transition-all group-hover:bg-white"
                          >
                            <option value="video">Video Call</option>
                            <option value="audio">Audio Call</option>
                            <option value="in-person">In Person</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#456882] pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-bold text-[#234C6A] ml-1 uppercase tracking-wider opacity-60">
                          <Clock className="h-3 w-3" />
                          Start Time
                        </label>
                        <Input
                          ref={startTimeRef}
                          type="time"
                          className="rounded-2xl border-gray-100 bg-gray-50/50 h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-bold text-[#234C6A] ml-1 uppercase tracking-wider opacity-60">
                          <Clock className="h-3 w-3" />
                          End Time
                        </label>
                        <Input
                          ref={endTimeRef}
                          type="time"
                          className="rounded-2xl border-gray-100 bg-gray-50/50 h-12"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 mb-8">
                      <label className="flex items-center gap-2 text-xs font-bold text-[#234C6A] ml-1 uppercase tracking-wider opacity-60">
                        <MapPin className="h-3 w-3" />
                        Meeting Link or Location
                      </label>
                      <Input
                        ref={meetLinkRef}
                        placeholder="Paste Google Meet / Zoom link or office address..."
                        className="rounded-2xl border-gray-100 bg-gray-50/50 h-12 focus:bg-white"
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <Button
                        onClick={handleScheduleInterview}
                        disabled={isScheduling}
                        className="flex-1 h-14 bg-gradient-to-r from-[#234C6A] to-[#456882] hover:opacity-90 text-white rounded-[20px] font-bold shadow-xl shadow-blue-200/50 transition-all active:scale-[0.98]"
                      >
                        {isScheduling ? "Confirming..." : "Confirm Schedule"}
                      </Button>
                      <div className="w-14 h-14 bg-blue-50 rounded-[20px] flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors cursor-help group relative">
                        <Info className="h-6 w-6" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[#234C6A] text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity text-center shadow-xl">
                          Candidate will be notified instantly via email and
                          app.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                {pagination?.hasNext && (
                  <div className="flex justify-center py-2 border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
                    <button
                      onClick={loadMore}
                      disabled={isLoadingMore}
                      className="flex items-center gap-1.5 text-xs text-[#234C6A] font-semibold hover:bg-[#234C6A]/5 px-4 py-1.5 rounded-full transition-all"
                    >
                      {isLoadingMore ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <ChevronUp className="h-3 w-3" />
                      )}
                      Load earlier messages
                    </button>
                  </div>
                )}
                <div
                  ref={chatContainerRef}
                  onScroll={handleScroll}
                  className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30 custom-scrollbar"
                >
                  {isLoadingMsgs ? (
                    <div className="flex justify-center items-center h-full">
                      <Loader2 className="h-6 w-6 text-[#234C6A] animate-spin" />
                    </div>
                  ) : allMessages.length === 0 ? (
                    <div className="text-center py-20">
                      <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="h-8 w-8 text-gray-300" />
                      </div>
                      <p className="text-[#456882] font-medium">
                        No messages yet. Start the conversation!
                      </p>
                    </div>
                  ) : (
                    allMessages.map((msg: MsgItem) => {
                      const isMe =
                        msg.senderId?.toString() === user?._id?.toString();
                      const isEditing = editingMsgId === msg._id;
                      return (
                        <div
                          key={msg._id}
                          className={`flex ${isMe ? "justify-end" : "justify-start"} group`}
                        >
                          <div
                            className={`max-w-[85%] relative ${isMe ? "bg-[#234C6A] text-white rounded-2xl rounded-tr-sm" : "bg-white text-[#234C6A] rounded-2xl rounded-tl-sm shadow-sm border border-gray-100"} p-3 px-4`}
                          >
                            {isEditing ? (
                              <div className="flex items-center gap-2 min-w-[180px]">
                                <input
                                  ref={editInputRef}
                                  className="flex-1 bg-transparent outline-none text-sm border-b border-white/40 pb-0.5"
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") commitEdit();
                                    if (e.key === "Escape")
                                      setEditingMsgId(null);
                                  }}
                                />
                                <button
                                  onClick={commitEdit}
                                  className="text-white/70 hover:text-white"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => setEditingMsgId(null)}
                                  className="text-white/70 hover:text-white"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-end gap-3">
                                <p className="text-sm leading-relaxed">
                                  {msg.content}
                                </p>
                                <div className="flex items-center gap-1.5 flex-shrink-0 mb-[-2px]">
                                  <span className="text-[9px] opacity-60">
                                    {fmtTime(msg.createdAt)}
                                  </span>
                                  {isMe && (
                                    <span
                                      className={`text-[9px] opacity-60 ${msg.isRead ? "text-blue-300" : ""}`}
                                    >
                                      {msg.isRead ? "✓✓" : "✓"}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                            {!isEditing && isMe && (
                              <div className="absolute -top-7 right-0 hidden group-hover:flex items-center gap-1 bg-white border border-gray-100 shadow-lg rounded-xl px-1.5 py-1">
                                <button
                                  onClick={() => {
                                    setEditingMsgId(msg._id);
                                    setTimeout(() => {
                                      if (editInputRef.current)
                                        editInputRef.current.value =
                                          msg.content;
                                    }, 0);
                                  }}
                                  className="p-1 text-[#456882] hover:text-[#234C6A] hover:bg-gray-50 rounded-lg"
                                >
                                  <Pencil className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => handleDeleteMessage(msg._id)}
                                  className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-6 bg-white border-t border-gray-100">
                  <div className="flex gap-3 bg-gray-50 p-2 rounded-[24px] border border-gray-100 shadow-inner">
                    <Input
                      ref={messageInputRef}
                      placeholder="Type your message..."
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                      className="border-none bg-transparent focus-visible:ring-0 text-[#234C6A]"
                    />
                    <Button
                      onClick={handleSendMessage}
                      className="bg-[#234C6A] hover:bg-[#234C6A]/90 text-white rounded-full w-12 h-12 flex-shrink-0 shadow-lg"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <div className="bg-[#234C6A]/5 w-24 h-24 rounded-[40px] flex items-center justify-center mb-6">
                  <MessageSquare className="h-12 w-12 text-[#234C6A]" />
                </div>
                <h3 className="text-2xl font-bold text-[#234C6A] mb-2">
                  Select a Conversation
                </h3>
                <p className="text-[#456882] max-w-sm">
                  Choose a candidate from the list to coordinate their interview
                  and manage your pipeline.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </RecruiterLayout>
  );
};

export default InterviewsPage;
