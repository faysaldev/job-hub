"use client";

import { useState, useEffect, useRef } from "react";
import RecruiterLayout from "@/src/components/Recruiter/RecruiterLayout";
import { useAuth } from "@/src/hooks/useAuth";
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
  Phone,
  MapPin,
  Trash2,
  MoreVertical,
  MessageSquare,
} from "lucide-react";
import {
  useGetUserConversationsQuery,
  useDeleteConversationMutation,
} from "@/src/redux/features/conversations/conversationsApi";
import {
  useGetConversationMessagesQuery,
  useSendMessageMutation,
  useDeleteMessageMutation,
} from "@/src/redux/features/messages/messagesApi";
import { useScheduleInterviewMutation } from "@/src/redux/features/interviews/interviewsApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/src/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { toast } from "sonner";

interface Candidate {
  id: string;
  conversationId: string;
  name: string;
  email: string;
  jobTitle: string;
  avatar?: string;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  interviewStatus: "none" | "pending" | "scheduled";
  rawConversation: any;
}

const InterviewsPage = () => {
  const { user } = useAuth();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Refs for uncontrolled inputs to improve performance
  const messageInputRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const typeRef = useRef<HTMLSelectElement>(null);
  const startTimeRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<HTMLInputElement>(null);
  const meetLinkRef = useRef<HTMLInputElement>(null);

  // API Hooks
  const { data: conversations = [], isLoading: isLoadingConvs } =
    useGetUserConversationsQuery();
  const [deleteConversation] = useDeleteConversationMutation();
  const [sendMessage] = useSendMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation();
  const [scheduleInterview, { isLoading: isScheduling }] =
    useScheduleInterviewMutation();

  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null,
  );
  const [showScheduler, setShowScheduler] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const [allMessages, setAllMessages] = useState<any[]>([]);

  // Fetch messages for selected conversation
  const { data: messagesData = [], isFetching: isFetchingMessages } =
    useGetConversationMessagesQuery(
      {
        conversationId: selectedCandidate?.conversationId || "",
        page: page,
        limit: 50,
      },
      { skip: !selectedCandidate?.conversationId },
    );

  // Helper Functions
  const formatLastMessageTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInterviewStatus = (
    status: string | undefined,
  ): Candidate["interviewStatus"] => {
    if (!status) return "none";
    if (status === "interview") return "scheduled";
    if (status === "under_review") return "pending";
    return "none";
  };

  // Reset page and messages when conversation changes
  useEffect(() => {
    setPage(1);
    setAllMessages([]);
  }, [selectedCandidate?.conversationId]);

  // Update all messages when new data arrives
  useEffect(() => {
    if (messagesData && Array.isArray(messagesData) && messagesData.length > 0) {
      if (page === 1) {
        setAllMessages(messagesData);
      } else {
        // Prepend older messages
        setAllMessages((prev) => {
          const newMessages = messagesData.filter(
            (nm: any) => !prev.find((pm) => pm._id === nm._id),
          );
          return [...prev, ...newMessages];
        });
      }
    }
  }, [messagesData, page]);

  // Select latest conversation by default
  useEffect(() => {
    if (conversations.length > 0 && !selectedCandidate) {
      const conv = conversations[0];
      const otherParticipant = conv.participants[0];
      setSelectedCandidate({
        id: otherParticipant?._id,
        conversationId: conv._id,
        name: otherParticipant?.name || "Unknown",
        email: otherParticipant?.email || "",
        jobTitle: conv.role || "Candidate",
        avatar: otherParticipant?.image,
        unreadCount: 0,
        lastMessage: "Click to view",
        lastMessageTime: formatLastMessageTime(conv.updatedAt),
        interviewStatus: getInterviewStatus(conv.status),
        rawConversation: conv,
      });
    }
  }, [conversations, selectedCandidate]);

  useEffect(() => {
    if (page === 1) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [allMessages, page]);

  const handleSendMessage = async () => {
    const content = messageInputRef.current?.value;
    if (!content?.trim() || !selectedCandidate) return;

    try {
      await sendMessage({
        conversationId: selectedCandidate.conversationId,
        receiverId: selectedCandidate.id,
        content,
      }).unwrap();
      if (messageInputRef.current) messageInputRef.current.value = "";
      setPage(1); // Reset to first page to see the new message
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage(messageId).unwrap();
      toast.success("Message deleted");
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  const handleDeleteConversation = async () => {
    if (!selectedCandidate) return;
    if (!confirm("Are you sure you want to delete this conversation?")) return;

    try {
      await deleteConversation(selectedCandidate.conversationId).unwrap();
      setSelectedCandidate(null);
      toast.success("Conversation deleted");
    } catch (error) {
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

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (
      e.currentTarget.scrollTop === 0 &&
      !isFetchingMessages &&
      messagesData.length >= 50
    ) {
      setPage((prev) => prev + 1);
    }
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
                conversations.map((conv: any) => {
                  const other = conv.participants[0];
                  const isSelected =
                    selectedCandidate?.conversationId === conv._id;

                  return (
                    <button
                      key={conv._id}
                      onClick={() =>
                        setSelectedCandidate({
                          id: other._id,
                          conversationId: conv._id,
                          name: other.name,
                          email: other.email,
                          jobTitle: conv.role,
                          avatar: other.image,
                          unreadCount: 0,
                          lastMessage: "Click to view",
                          lastMessageTime: formatLastMessageTime(
                            conv.updatedAt,
                          ),
                          interviewStatus: getInterviewStatus(conv.status),
                          rawConversation: conv,
                        })
                      }
                      className={`w-full p-4 rounded-2xl text-left transition-all duration-300 group ${
                        isSelected
                          ? "bg-[#234C6A] text-white shadow-lg scale-[1.02]"
                          : "hover:bg-gray-50 border border-transparent hover:border-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div
                            className={`w-12 h-12 rounded-2xl overflow-hidden border-2 ${isSelected ? "border-white/20" : "border-gray-100"}`}
                          >
                            {other.image ? (
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
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <h4
                              className={`font-bold truncate ${isSelected ? "text-white" : "text-[#234C6A]"}`}
                            >
                              {other.name}
                            </h4>
                            <span
                              className={`text-[10px] ${isSelected ? "text-white/60" : "text-[#456882]/60"}`}
                            >
                              {formatLastMessageTime(conv.updatedAt)}
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
                              {conv.status?.replace("_", " ")}
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
                <div className="p-6 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
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
                        onClick={() => setShowScheduler(true)}
                        className="bg-[#234C6A] hover:bg-[#234C6A]/90 text-white rounded-xl shadow-lg shadow-blue-100/50"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule
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

                {/* Messages Area */}
                <div
                  ref={chatContainerRef}
                  onScroll={handleScroll}
                  className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30 custom-scrollbar"
                >
                  {isFetchingMessages && page > 1 && (
                    <div className="flex justify-center py-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#234C6A]" />
                    </div>
                  )}

                  {allMessages.length === 0 && !isFetchingMessages ? (
                    <div className="text-center py-20">
                      <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="h-8 w-8 text-gray-300" />
                      </div>
                      <p className="text-[#456882] font-medium">
                        No messages yet. Start the conversation!
                      </p>
                    </div>
                  ) : (
                    [...allMessages].reverse().map((msg: any) => {
                      const isMe =
                        msg.senderId?.toString() === user?._id?.toString();
                      return (
                        <div
                          key={msg._id}
                          className={`flex ${isMe ? "justify-end" : "justify-start"} group animate-in fade-in slide-in-from-bottom-2`}
                        >
                          <div
                            className={`max-w-[85%] relative ${isMe ? "bg-[#234C6A] text-white rounded-2xl rounded-tr-none" : "bg-white text-[#234C6A] rounded-2xl rounded-tl-none shadow-sm border border-gray-100"} p-3 px-4`}
                          >
                            <div className="flex items-end justify-between gap-3">
                              <p className="text-sm leading-relaxed">
                                {msg.content}
                              </p>
                              <div className="flex items-center gap-2 flex-shrink-0 mb-[-2px]">
                                <span className={`text-[9px] opacity-60`}>
                                  {new Date(msg.createdAt).toLocaleTimeString(
                                    [],
                                    { hour: "2-digit", minute: "2-digit" },
                                  )}
                                </span>
                                {isMe && (
                                  <button
                                    onClick={() => handleDeleteMessage(msg._id)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-white/40 hover:text-white"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                )}
                              </div>
                            </div>
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

      {/* Scheduler Modal */}
      <Dialog open={showScheduler} onOpenChange={setShowScheduler}>
        <DialogContent className="sm:max-w-[500px] rounded-[32px] border-none shadow-2xl p-0 overflow-hidden">
          <div className="bg-gradient-to-br from-[#234C6A] to-[#456882] p-8 text-white">
            <DialogHeader>
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md">
                <Calendar className="h-7 w-7" />
              </div>
              <DialogTitle className="text-3xl font-bold">
                Schedule Interview
              </DialogTitle>
              <DialogDescription className="text-white/70 text-base">
                Set up a time to meet with {selectedCandidate?.name}.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#234C6A] ml-1">
                  Date
                </label>
                <Input
                  ref={dateRef}
                  type="date"
                  className="rounded-2xl border-gray-100 bg-gray-50 focus:bg-white h-12"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#234C6A] ml-1">
                  Type
                </label>
                <select
                  ref={typeRef}
                  className="w-full h-12 rounded-2xl border border-gray-100 bg-gray-50 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#234C6A]/10"
                >
                  <option value="video">Video Call</option>
                  <option value="audio">Audio Call</option>
                  <option value="in-person">In Person</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#234C6A] ml-1">
                  Start Time
                </label>
                <Input
                  ref={startTimeRef}
                  type="time"
                  className="rounded-2xl border-gray-100 bg-gray-50 h-12"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#234C6A] ml-1">
                  End Time
                </label>
                <Input
                  ref={endTimeRef}
                  type="time"
                  className="rounded-2xl border-gray-100 bg-gray-50 h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[#234C6A] ml-1">
                Meeting Link
              </label>
              <Input
                ref={meetLinkRef}
                placeholder="https://meet.google.com/..."
                className="rounded-2xl border-gray-100 bg-gray-50 h-12"
              />
            </div>
          </div>

          <DialogFooter className="p-8 pt-0 flex gap-3">
            <Button
              variant="ghost"
              onClick={() => setShowScheduler(false)}
              className="flex-1 h-12 rounded-2xl font-bold"
            >
              Cancel
            </Button>
            <Button
              onClick={handleScheduleInterview}
              disabled={isScheduling}
              className="flex-1 h-12 bg-[#234C6A] hover:bg-[#234C6A]/90 text-white rounded-2xl font-bold shadow-lg"
            >
              {isScheduling ? "Scheduling..." : "Schedule Now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </RecruiterLayout>
  );
};

export default InterviewsPage;
