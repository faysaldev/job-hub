"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import {
  Calendar,
  User,
  Send,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { toast } from "sonner";

interface Recruiter {
  id: string;
  conversationId: string;
  name: string;
  email: string;
  jobTitle: string;
  avatar?: string;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  status: string;
  rawConversation: any;
}

const JobSeekerMessages = ({ userId }: { userId: string }) => {
  const { user } = useAuth();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  // API Hooks
  const { data: conversations = [], isLoading: isLoadingConvs } =
    useGetUserConversationsQuery();
  const [deleteConversation] = useDeleteConversationMutation();
  const [sendMessage] = useSendMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation();

  const [selectedRecruiter, setSelectedRecruiter] = useState<Recruiter | null>(
    null,
  );

  // Pagination state
  const [page, setPage] = useState(1);
  const [allMessages, setAllMessages] = useState<any[]>([]);

  // Fetch messages for selected conversation
  const { data: messagesData = [], isFetching: isFetchingMessages } =
    useGetConversationMessagesQuery(
      {
        conversationId: selectedRecruiter?.conversationId || "",
        page: page,
        limit: 50,
      },
      { skip: !selectedRecruiter?.conversationId },
    );

  // Helper Functions
  const formatLastMessageTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Reset page and messages when conversation changes
  useEffect(() => {
    setPage(1);
    setAllMessages([]);
  }, [selectedRecruiter?.conversationId]);

  // Update all messages when new data arrives
  useEffect(() => {
    if (messagesData && Array.isArray(messagesData) && messagesData.length > 0) {
      if (page === 1) {
        setAllMessages(messagesData);
      } else {
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
    if (conversations.length > 0 && !selectedRecruiter) {
      const conv = conversations[0];
      const otherParticipant = conv.participants[0];
      setSelectedRecruiter({
        id: otherParticipant?._id,
        conversationId: conv._id,
        name: otherParticipant?.name || "Company",
        email: otherParticipant?.email || "",
        jobTitle: conv.role || "Recruiter",
        avatar: otherParticipant?.image,
        unreadCount: 0,
        lastMessage: "Click to view",
        lastMessageTime: formatLastMessageTime(conv.updatedAt),
        status: conv.status || "Applied",
        rawConversation: conv,
      });
    }
  }, [conversations, selectedRecruiter]);

  useEffect(() => {
    if (page === 1) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [allMessages, page]);

  const handleSendMessage = async () => {
    const content = messageInputRef.current?.value;
    if (!content?.trim() || !selectedRecruiter) return;

    try {
      await sendMessage({
        conversationId: selectedRecruiter.conversationId,
        receiverId: selectedRecruiter.id,
        content,
      }).unwrap();
      if (messageInputRef.current) messageInputRef.current.value = "";
      setPage(1);
    } catch (error) {
      toast.error("Failed to send message");
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[650px]">
      {/* Conversations List */}
      <Card className="p-4 border border-gray-100 bg-white shadow-sm rounded-3xl lg:col-span-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-6 px-2">
          <h3 className="font-bold text-[#234C6A] flex items-center gap-2 text-sm">
            <MessageSquare className="h-4 w-4 text-[#456882]" />
            Recruiter Chats
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {isLoadingConvs ? (
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 w-full animate-pulse bg-gray-50 rounded-2xl"
              />
            ))
          ) : conversations.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-xs text-[#456882]">No messages yet</p>
            </div>
          ) : (
            conversations.map((conv: any) => {
              const other = conv.participants[0];
              const isSelected =
                selectedRecruiter?.conversationId === conv._id;

              return (
                <button
                  key={conv._id}
                  onClick={() =>
                    setSelectedRecruiter({
                      id: other._id,
                      conversationId: conv._id,
                      name: other.name,
                      email: other.email,
                      jobTitle: conv.role,
                      avatar: other.image,
                      unreadCount: 0,
                      lastMessage: "Click to view",
                      lastMessageTime: formatLastMessageTime(conv.updatedAt),
                      status: conv.status || "Applied",
                      rawConversation: conv,
                    })
                  }
                  className={`w-full p-3 rounded-2xl text-left transition-all duration-300 group ${
                    isSelected
                      ? "bg-[#234C6A] text-white shadow-md scale-[1.01]"
                      : "hover:bg-gray-50 border border-transparent hover:border-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl overflow-hidden border ${isSelected ? "border-white/20" : "border-gray-100"}`}
                    >
                      {other.image ? (
                        <img
                          src={other.image}
                          alt={other.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#234C6A]/10 flex items-center justify-center text-[#234C6A]">
                          <User className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <h4
                          className={`text-xs font-bold truncate ${isSelected ? "text-white" : "text-[#234C6A]"}`}
                        >
                          {other.name}
                        </h4>
                        <span
                          className={`text-[9px] ${isSelected ? "text-white/60" : "text-[#456882]/60"}`}
                        >
                          {formatLastMessageTime(conv.updatedAt)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={`text-[10px] truncate font-medium ${isSelected ? "text-white/80" : "text-[#456882]"}`}
                        >
                          {conv.role}
                        </p>
                        <Badge
                          className={`${isSelected ? "bg-white/20 text-white" : "bg-[#234C6A]/5 text-[#234C6A]"} text-[8px] px-1.5 py-0 border-none capitalize h-3.5`}
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
      <Card className="lg:col-span-2 border border-gray-100 bg-white shadow-sm rounded-3xl flex flex-col overflow-hidden relative">
        {selectedRecruiter ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-white/80 backdrop-blur-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-100">
                  {selectedRecruiter.avatar ? (
                    <img
                      src={selectedRecruiter.avatar}
                      alt={selectedRecruiter.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#234C6A]/5 flex items-center justify-center text-[#234C6A]">
                      <User className="h-5 w-5" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#234C6A]">
                    {selectedRecruiter.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-50 text-blue-600 border-none text-[9px] px-1.5 py-0 h-4">
                      {selectedRecruiter.jobTitle}
                    </Badge>
                    <Badge className="bg-gray-50 text-gray-500 border-none text-[9px] px-1.5 py-0 h-4 capitalize">
                      {selectedRecruiter.status?.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              </div>

            </div>

            {/* Messages */}
            <div
              ref={chatContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/20 custom-scrollbar"
            >
              {isFetchingMessages && page > 1 && (
                <div className="flex justify-center py-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#234C6A]" />
                </div>
              )}

              {allMessages.length === 0 && !isFetchingMessages ? (
                <div className="text-center py-10">
                  <p className="text-xs text-[#456882]">No messages yet</p>
                </div>
              ) : (
                [...allMessages].reverse().map((msg: any) => {
                  const isMe = msg.senderId === user?._id;
                  return (
                    <div
                      key={msg._id}
                      className={`flex ${isMe ? "justify-end" : "justify-start"} group animate-in fade-in slide-in-from-bottom-1`}
                    >
                      <div
                        className={`max-w-[85%] relative ${isMe ? "bg-[#234C6A] text-white rounded-2xl rounded-tr-none" : "bg-white text-[#234C6A] rounded-2xl rounded-tl-none shadow-sm border border-gray-100"} p-3 px-4`}
                      >
                        <div className="flex items-end justify-between gap-3">
                          <p className="text-sm leading-relaxed">
                            {msg.content}
                          </p>
                          <div className="flex items-center gap-2 flex-shrink-0 mb-[-2px]">
                            <span className="text-[9px] opacity-60">
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                <Input
                  ref={messageInputRef}
                  placeholder="Type a message..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="border-none bg-transparent focus-visible:ring-0 text-sm h-10"
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-[#234C6A] hover:bg-[#234C6A]/90 text-white rounded-xl h-10 px-4"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50/10">
            <div className="bg-[#234C6A]/5 w-16 h-16 rounded-3xl flex items-center justify-center mb-4">
              <MessageSquare className="h-8 w-8 text-[#234C6A]" />
            </div>
            <h3 className="text-lg font-bold text-[#234C6A]">Your Messages</h3>
            <p className="text-xs text-[#456882] max-w-[200px] mt-1">
              Select a recruiter to view your conversation history
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default JobSeekerMessages;
