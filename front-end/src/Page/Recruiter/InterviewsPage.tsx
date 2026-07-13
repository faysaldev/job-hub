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
  Search,
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
  const scrollToBottom = useCallback(
    (behavior: "smooth" | "auto" = "smooth") => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior,
        });
      }
    },
    [],
  );
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
  const [searchInput, setSearchInput] = useState("");
  const handleSearch = useCallback(() => {
    if (socket) {
      socket.emit("conversations:get", { search: searchInput });
    }
  }, [socket, searchInput]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    },
    [handleSearch],
  );
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
          setSelectedConvId(urlId);
          const conv = convs.find((c) => c._id === urlId);
          if (conv) {
            setSelectedCandidate(buildCandidate(conv));
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
        setTimeout(() => scrollToBottom("smooth"), 50);
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
          setTimeout(() => scrollToBottom("smooth"), 50);
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
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="relative overflow-hidden rounded-3xl bg-[#234C6A] p-7 text-white shadow-2xl shadow-[#234C6A]/20 md:p-9">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:56px_56px]" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="relative z-10 grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white/90 backdrop-blur-sm">
                <Calendar className="h-4 w-4" />
                <span>Recruiter Interview Hub</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight md:text-5xl">
                Coordinate candidates with confidence.
              </h1>
              <p className="mt-3 max-w-2xl text-[16px] font-medium leading-7 text-white/75">
                Chat with applicants, schedule interviews, and move strong
                candidates through your hiring pipeline.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:w-[520px]">
              {[
                { icon: MessageSquare, label: "Candidate Chats" },
                { icon: Calendar, label: "Schedule Fast" },
                { icon: CheckCircle, label: "Hire Flow" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-wide text-white/90 backdrop-blur-sm"
                >
                  <Icon className="mr-1 inline h-3 w-3" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
          {/* Candidates List */}
          <Card className="flex h-[760px] flex-col space-y-4 overflow-hidden rounded-3xl border border-[#234C6A]/10 bg-white/95 p-4 shadow-2xl shadow-[#234C6A]/10 backdrop-blur">
            <div className="flex-shrink-0 space-y-4 rounded-3xl bg-gradient-to-r from-[#234C6A]/8 to-[#456882]/8 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-[#456882]">
                    Pipeline Inbox
                  </p>
                  <h3 className="flex items-center gap-2 font-black text-[#234C6A]">
                    <MessageSquare className="h-5 w-5" />
                    Recent Chats
                  </h3>
                </div>
              </div>
              <div className="relative flex items-center">
                <Search className="pointer-events-none absolute left-4 h-4 w-4 text-[#456882]" />
                <input
                  type="text"
                  placeholder="Type the name and hit enter"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="h-11 w-full rounded-2xl border border-transparent bg-white/80 pl-11 pr-4 text-sm font-semibold text-[#234C6A] outline-none transition-all placeholder:text-[#456882]/55 focus:border-[#234C6A]/15 focus:bg-white focus:ring-2 focus:ring-[#234C6A]/10"
                />
              </div>
            </div>

            <div className="custom-scrollbar flex-1 space-y-2 overflow-y-auto pr-1">
              {isLoadingConvs ? (
                [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-20 w-full animate-pulse rounded-2xl bg-[#F4F7F8]"
                  />
                ))
              ) : conversations.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-3xl bg-[#234C6A]/10">
                    <MessageSquare className="h-7 w-7 text-[#234C6A]/45" />
                  </div>
                  <p className="text-sm font-semibold text-[#456882]">
                    No conversations yet
                  </p>
                </div>
              ) : (
                conversations.map((conv: ConvItem) => {
                  const other = conv.participants[0];
                  const isSelected = selectedConvId === conv._id;
                  return (
                    <button
                      key={conv._id}
                      onClick={() => selectConv(conv)}
                      className={`w-full rounded-3xl p-4 text-left transition-all duration-300 ${
                        isSelected
                          ? "scale-[1.01] bg-[#234C6A] text-white shadow-lg shadow-[#234C6A]/15"
                          : "border border-transparent hover:border-[#234C6A]/10 hover:bg-[#F8FAFC]"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`h-12 w-12 overflow-hidden rounded-2xl border ${isSelected ? "border-white/20" : "border-[#234C6A]/10"}`}
                        >
                          {other?.image ? (
                            <img
                              src={other.image}
                              alt={other.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-[#234C6A]/10 text-[#234C6A]">
                              <User className="h-6 w-6" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <h4
                              className={`truncate font-black ${isSelected ? "text-white" : "text-[#234C6A]"}`}
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
                              className={`truncate text-xs font-semibold ${isSelected ? "text-white/80" : "text-[#456882]"}`}
                            >
                              {conv.role}
                            </p>
                            <Badge
                              className={`${isSelected ? "bg-white/20 text-white" : "bg-[#234C6A]/5 text-[#234C6A]"} h-4 rounded-full border-none px-2 py-0 text-[9px] font-black capitalize`}
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
          <Card className="relative flex h-[760px] flex-col overflow-hidden rounded-3xl border border-[#234C6A]/10 bg-white/95 shadow-2xl shadow-[#234C6A]/10 backdrop-blur">
            {selectedCandidate ? (
              <>
                {/* Chat Header */}
                <div className="sticky top-0 z-30 flex items-center justify-between border-b border-[#E3E3E3]/70 bg-white/95 p-5 backdrop-blur-md">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 overflow-hidden rounded-2xl border border-[#234C6A]/10 bg-[#F8FAFC] shadow-sm">
                      {selectedCandidate.avatar ? (
                        <img
                          src={selectedCandidate.avatar}
                          alt={selectedCandidate.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#234C6A]/5 text-[#234C6A]">
                          <User className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-black leading-tight text-[#234C6A]">
                        {selectedCandidate.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className="rounded-full border-[#234C6A]/10 bg-[#234C6A]/5 px-2 py-0 text-[10px] font-black text-[#234C6A]"
                        >
                          {selectedCandidate.jobTitle}
                        </Badge>
                        {selectedCandidate.interviewStatus === "scheduled" && (
                          <Badge className="rounded-full bg-emerald-500 px-2 py-0 text-[10px] font-black text-white">
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
                        className={`${showScheduler ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-[#234C6A] hover:bg-[#1c405a] text-white"} rounded-2xl font-black shadow-lg transition-all duration-300`}
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
                        className="rounded-2xl bg-emerald-600 font-black text-white shadow-lg shadow-emerald-100/50 hover:bg-emerald-700"
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
                          className="rounded-2xl hover:bg-[#234C6A]/5"
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
                  <div className="mx-6 rounded-b-[40px] border-x border-b border-[#234C6A]/10 bg-white/95 p-8 shadow-[0_20px_50px_rgba(35,76,106,0.15)] backdrop-blur-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-bold text-[#234C6A] ml-1 uppercase tracking-wider opacity-60">
                          <Calendar className="h-3 w-3" />
                          Meeting Date
                        </label>
                        <Input
                          ref={dateRef}
                          type="date"
                          className="h-12 rounded-2xl border-[#234C6A]/10 bg-[#F8FAFC] transition-all focus:bg-white"
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
                            className="h-12 w-full appearance-none rounded-2xl border border-[#234C6A]/10 bg-[#F8FAFC] px-4 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#234C6A]/10 group-hover:bg-white"
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
                          className="h-12 rounded-2xl border-[#234C6A]/10 bg-[#F8FAFC]"
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
                          className="h-12 rounded-2xl border-[#234C6A]/10 bg-[#F8FAFC]"
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
                        className="h-12 rounded-2xl border-[#234C6A]/10 bg-[#F8FAFC] focus:bg-white"
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <Button
                        onClick={handleScheduleInterview}
                        disabled={isScheduling}
                        className="h-14 flex-1 rounded-[20px] bg-gradient-to-r from-[#234C6A] to-[#456882] font-black text-white shadow-xl shadow-[#234C6A]/15 transition-all hover:from-[#1c405a] hover:to-[#3b5a71] active:scale-[0.98]"
                      >
                        {isScheduling ? "Confirming..." : "Confirm Schedule"}
                      </Button>
                      <div className="group relative flex h-14 w-14 cursor-help items-center justify-center rounded-[20px] bg-[#234C6A]/5 text-[#234C6A] transition-colors hover:bg-[#234C6A]/10">
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
                  <div className="flex flex-shrink-0 justify-center border-b border-[#E3E3E3]/70 bg-white/70 py-2">
                    <button
                      onClick={loadMore}
                      disabled={isLoadingMore}
                      className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-black text-[#234C6A] transition-all hover:bg-[#234C6A]/5"
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
                  className="custom-scrollbar flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-[#F8FAFC] to-white p-6"
                >
                  {isLoadingMsgs ? (
                    <div className="flex h-full items-center justify-center">
                      <Loader2 className="h-6 w-6 text-[#234C6A] animate-spin" />
                    </div>
                  ) : allMessages.length === 0 ? (
                    <div className="py-20 text-center">
                      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#234C6A]/5">
                        <MessageSquare className="h-9 w-9 text-[#234C6A]/35" />
                      </div>
                      <p className="font-semibold text-[#456882]">
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
                            className={`relative max-w-[85%] ${isMe ? "rounded-3xl rounded-tr-md bg-[#234C6A] text-white" : "rounded-3xl rounded-tl-md border border-[#234C6A]/10 bg-white text-[#234C6A] shadow-sm"} p-3 px-4`}
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
                              <div className="absolute -top-8 right-0 hidden items-center gap-1 rounded-2xl border border-[#234C6A]/10 bg-white px-1.5 py-1 shadow-lg group-hover:flex">
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
                <div className="border-t border-[#E3E3E3]/70 bg-white p-6">
                  <div className="flex gap-3 rounded-[24px] border border-[#234C6A]/10 bg-[#F8FAFC] p-2 shadow-inner">
                    <input
                      ref={messageInputRef}
                      type="text"
                      placeholder="Type your message..."
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                      className="h-12 flex-1 border-none bg-transparent px-3 text-sm text-[#234C6A] placeholder:text-[#456882]/50 outline-none focus:outline-none focus:ring-0 shadow-none"
                    />
                    <Button
                      onClick={handleSendMessage}
                      className="h-12 w-12 flex-shrink-0 rounded-2xl bg-[#234C6A] text-white shadow-lg hover:bg-[#1c405a]"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center bg-[#F8FAFC] p-12 text-center">
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-[40px] bg-[#234C6A]/5">
                  <MessageSquare className="h-12 w-12 text-[#234C6A]" />
                </div>
                <h3 className="mb-2 text-2xl font-black text-[#234C6A]">
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
