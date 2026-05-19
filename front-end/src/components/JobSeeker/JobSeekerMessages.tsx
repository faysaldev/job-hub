"use client";

import { useState, useEffect, useRef, useCallback, KeyboardEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";
import { useSocket } from "@/src/hooks/useSocket";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import {
  User,
  Send,
  Trash2,
  Pencil,
  Check,
  X,
  MessageSquare,
  ChevronUp,
  Loader2,
  Search,
} from "lucide-react";
import { useDeleteConversationMutation } from "@/src/redux/features/conversations/conversationsApi";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Participant {
  _id: string;
  name: string;
  email: string;
  image?: string;
}

interface ConvItem {
  _id: string;
  participants: Participant[];
  role?: string;
  status?: string;
  updatedAt: string;
}

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
  totalMessages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

const JobSeekerMessages = ({ userId }: { userId: string }) => {
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

  // ── State ──────────────────────────────────────────────────────────────────
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
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MsgItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoadingMsgs, setIsLoadingMsgs] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const [deleteConversation] = useDeleteConversationMutation();

  // ── Derived ────────────────────────────────────────────────────────────────
  const selectedConv = conversations.find((c) => c._id === selectedConvId);
  const otherParticipant = selectedConv?.participants[0];

  // ─── URL sync ──────────────────────────────────────────────────────────────
  // Read ?conversation= from URL on mount
  useEffect(() => {
    const convId = searchParams.get("conversation");
    setSelectedConvId(convId);
  }, [searchParams]);

  // Push selected conversation to URL query
  const selectConversation = useCallback(
    (convId: string) => {
      if (selectedConvId === convId) return;
      setSelectedConvId(convId);
      setMessages([]);
      setCurrentPage(1);
      setPagination(null);
      router.replace(`?conversation=${convId}`, { scroll: false });
    },
    [router, selectedConvId],
  );

  // ─── Socket events ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    // Load conversations
    socket.emit("conversations:get");
    socket.on(
      "conversations:loaded",
      ({ conversations: convs }: { conversations: ConvItem[] }) => {
        setConversations(convs);
        setIsLoadingConvs(false);

        // Auto-select from URL
        const urlConv = searchParams.get("conversation");
        if (urlConv) {
          setSelectedConvId(urlConv);
        } else {
          setSelectedConvId(null);
        }
      },
    );

    // New message
    socket.on("message:new", ({ message }: { message: MsgItem }) => {
      if (message.conversationId === selectedConvId) {
        setMessages((prev) => {
          if (prev.find((m) => m._id === message._id)) return prev;
          return [...prev, message];
        });
        setTimeout(() => scrollToBottom("smooth"), 50);
      }
    });

    // Edited message
    socket.on("message:edited", ({ message }: { message: MsgItem }) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === message._id ? message : m)),
      );
    });

    // Deleted message
    socket.on("message:deleted", ({ messageId }: { messageId: string }) => {
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    });

    // Mark read broadcast
    socket.on(
      "message:read",
      ({ messageId }: { messageId: string; isRead: boolean }) => {
        setMessages((prev) =>
          prev.map((m) => (m._id === messageId ? { ...m, isRead: true } : m)),
        );
      },
    );

    // Messages loaded (paginated)
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
          setMessages(msgs.slice().reverse()); // oldest → newest
          setTimeout(() => scrollToBottom("smooth"), 50);
        } else {
          // Prepend older messages, preserve scroll position
          const container = chatContainerRef.current;
          const prevHeight = container?.scrollHeight ?? 0;
          setMessages((prev) => {
            const incoming = msgs
              .slice()
              .reverse()
              .filter((m) => !prev.find((p) => p._id === m._id));
            return [...incoming, ...prev];
          });
          requestAnimationFrame(() => {
            if (container) {
              container.scrollTop = container.scrollHeight - prevHeight;
            }
          });
        }
      },
    );

    socket.on("socket:error", ({ message: msg }: { message: string }) => {
      toast.error(msg);
    });

    return () => {
      socket.off("conversations:loaded");
      socket.off("message:new");
      socket.off("message:edited");
      socket.off("message:deleted");
      socket.off("message:read");
      socket.off("messages:loaded");
      socket.off("socket:error");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, selectedConvId]);

  // ─── Join conversation room + load messages on conversation change ─────────
  useEffect(() => {
    if (!socket || !selectedConvId) return;

    socket.emit("conversation:join", { conversationId: selectedConvId });
    setIsLoadingMsgs(true);
    setMessages([]);
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

  // ─── Mark incoming messages as read ──────────────────────────────────────
  useEffect(() => {
    if (!socket || !selectedConvId) return;
    messages.forEach((m) => {
      if (!m.isRead && m.receiverId === userId) {
        socket.emit("message:read", {
          messageId: m._id,
          conversationId: selectedConvId,
        });
      }
    });
  }, [messages, socket, selectedConvId, userId]);

  // ─── Load more (scroll to top) ─────────────────────────────────────────────
  const loadMoreMessages = useCallback(() => {
    if (!socket || !selectedConvId || !pagination?.hasNext || isLoadingMore)
      return;
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    setIsLoadingMore(true);
    socket.emit("messages:get", {
      conversationId: selectedConvId,
      page: nextPage,
      limit: 20,
    });
  }, [socket, selectedConvId, pagination, currentPage, isLoadingMore]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (e.currentTarget.scrollTop === 0) loadMoreMessages();
    },
    [loadMoreMessages],
  );

  // ─── Send message ─────────────────────────────────────────────────────────
  const handleSendMessage = useCallback(() => {
    const content = messageInputRef.current?.value?.trim();
    if (!content || !socket || !selectedConvId || !otherParticipant) return;

    setIsSending(true);
    socket.emit("message:send", {
      conversationId: selectedConvId,
      receiverId: otherParticipant._id,
      content,
    });

    if (messageInputRef.current) messageInputRef.current.value = "";
    setIsSending(false);
  }, [socket, selectedConvId, otherParticipant]);

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ─── Edit message ──────────────────────────────────────────────────────────
  const startEdit = (msg: MsgItem) => {
    setEditingMsgId(msg._id);
    setTimeout(() => {
      if (editInputRef.current) editInputRef.current.value = msg.content;
    }, 0);
  };

  const commitEdit = useCallback(() => {
    const newContent = editInputRef.current?.value?.trim();
    if (!newContent || !socket || !editingMsgId || !selectedConvId) {
      setEditingMsgId(null);
      return;
    }
    socket.emit("message:edit", {
      messageId: editingMsgId,
      content: newContent,
      conversationId: selectedConvId,
    });
    setEditingMsgId(null);
  }, [socket, editingMsgId, selectedConvId]);

  // ─── Delete message ────────────────────────────────────────────────────────
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

  // ─── Delete conversation ───────────────────────────────────────────────────
  const handleDeleteConversation = async () => {
    if (!selectedConvId) return;
    if (!confirm("Delete this conversation?")) return;
    try {
      await deleteConversation(selectedConvId).unwrap();
      setConversations((prev) => prev.filter((c) => c._id !== selectedConvId));
      setSelectedConvId(null);
      setMessages([]);
      router.replace("?", { scroll: false });
      toast.success("Conversation deleted");
    } catch {
      toast.error("Failed to delete conversation");
    }
  };

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const today = new Date();
    const diff = today.getDate() - d.getDate();
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    return d.toLocaleDateString();
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="grid h-full grid-cols-1 gap-0 lg:grid-cols-[360px_1fr]">
      {/* ── Conversations Sidebar ────────────────────────────────────── */}
      <div className="flex flex-col overflow-hidden border-r border-[#234C6A]/10 bg-white">
        <div className="space-y-3 border-b border-[#E3E3E3]/70 bg-gradient-to-r from-[#234C6A]/8 to-[#456882]/8 px-5 py-4">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-[#456882]">
              Inbox
            </p>
            <h3 className="flex items-center gap-2 font-black text-[#234C6A]">
              <MessageSquare className="h-5 w-5" />
              Recruiter Chats
            </h3>
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

        <div className="custom-scrollbar flex-1 space-y-2 overflow-y-auto p-3">
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
            conversations.map((conv) => {
              const other = conv.participants[0];
              const isSelected = selectedConvId === conv._id;

              return (
                <button
                  key={conv._id}
                  onClick={() => selectConversation(conv._id)}
                  className={`w-full rounded-3xl p-3 text-left transition-all duration-200 ${
                    isSelected
                      ? "bg-[#234C6A] text-white shadow-lg shadow-[#234C6A]/15"
                      : "border border-transparent hover:border-[#234C6A]/10 hover:bg-[#F8FAFC]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-11 w-11 flex-shrink-0 overflow-hidden rounded-2xl border ${isSelected ? "border-white/20" : "border-[#234C6A]/10"}`}
                    >
                      {other?.image ? (
                        <img
                          src={other.image}
                          alt={other.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#234C6A]/10">
                          <User className="h-5 w-5 text-[#234C6A]" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <h4
                          className={`truncate text-sm font-black ${isSelected ? "text-white" : "text-[#234C6A]"}`}
                        >
                          {other?.name}
                        </h4>
                        <span
                          className={`ml-1 flex-shrink-0 text-[10px] font-bold ${isSelected ? "text-white/60" : "text-[#456882]/60"}`}
                        >
                          {formatTime(conv.updatedAt)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={`truncate text-xs font-semibold ${isSelected ? "text-white/80" : "text-[#456882]"}`}
                        >
                          {conv.role}
                        </p>
                        <Badge
                          className={`${isSelected ? "bg-white/20 text-white" : "bg-[#234C6A]/5 text-[#234C6A]"} h-4 flex-shrink-0 rounded-full border-none px-2 py-0 text-[9px] font-black capitalize`}
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
      </div>

      {/* ── Chat Window ──────────────────────────────────────────────── */}
      <div className="flex flex-col overflow-hidden bg-[#F8FAFC]">
        {selectedConv && otherParticipant ? (
          <>
            {/* Header */}
            <div className="flex flex-shrink-0 items-center justify-between border-b border-[#E3E3E3]/70 bg-white px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 flex-shrink-0 overflow-hidden rounded-2xl border border-[#234C6A]/10 bg-[#F8FAFC]">
                  {otherParticipant.image ? (
                    <img
                      src={otherParticipant.image}
                      alt={otherParticipant.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#234C6A]/5">
                      <User className="h-4 w-4 text-[#234C6A]" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-base font-black text-[#234C6A]">
                    {otherParticipant.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    {selectedConv.role && (
                      <Badge className="h-5 rounded-full border-none bg-[#234C6A]/5 px-2 py-0 text-[10px] font-black text-[#234C6A]">
                        {selectedConv.role}
                      </Badge>
                    )}
                    {selectedConv.status && (
                      <Badge className="h-5 rounded-full border-none bg-[#E3E3E3]/70 px-2 py-0 text-[10px] font-black capitalize text-[#456882]">
                        {selectedConv.status.replace(/_/g, " ")}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={handleDeleteConversation}
                className="rounded-2xl p-2 text-red-400 transition-all hover:bg-red-50 hover:text-red-600"
                title="Delete conversation"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Load-more button */}
            {pagination?.hasNext && (
              <div className="flex flex-shrink-0 justify-center border-b border-[#E3E3E3]/70 bg-white/70 py-2">
                <button
                  onClick={loadMoreMessages}
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

            {/* Messages */}
            <div
              ref={chatContainerRef}
              onScroll={handleScroll}
              className="custom-scrollbar flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-[#F8FAFC] to-white p-5"
            >
              {isLoadingMsgs ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-6 w-6 text-[#234C6A] animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-10">
                  <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#234C6A]/5">
                    <MessageSquare className="h-7 w-7 text-[#234C6A]/30" />
                  </div>
                  <p className="text-xs text-[#456882] font-medium">
                    No messages yet — say hello!
                  </p>
                </div>
              ) : (
                <>
                  {messages.map((msg, idx) => {
                    const isMe = msg.senderId === userId;
                    const isEditing = editingMsgId === msg._id;
                    const prevMsg = messages[idx - 1];
                    const showDate =
                      !prevMsg ||
                      formatDate(msg.createdAt) !==
                        formatDate(prevMsg.createdAt);

                    return (
                      <div key={msg._id}>
                        {showDate && (
                          <div className="flex justify-center my-3">
                            <span className="rounded-full bg-[#E3E3E3]/70 px-3 py-1 text-[10px] font-black text-[#456882]">
                              {formatDate(msg.createdAt)}
                            </span>
                          </div>
                        )}

                        <div
                          className={`flex ${isMe ? "justify-end" : "justify-start"} group`}
                        >
                          <div
                            className={`relative max-w-[78%] ${
                              isMe
                                ? "rounded-3xl rounded-tr-md bg-[#234C6A] text-white"
                                : "rounded-3xl rounded-tl-md border border-[#234C6A]/10 bg-white text-[#234C6A] shadow-sm"
                            } px-4 py-3`}
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
                                  <span className="text-[9px] opacity-50">
                                    {formatTime(msg.createdAt)}
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
                                  onClick={() => startEdit(msg)}
                                  className="p-1 text-[#456882] hover:text-[#234C6A] hover:bg-gray-50 rounded-lg transition-all"
                                >
                                  <Pencil className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => handleDeleteMessage(msg._id)}
                                  className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="flex-shrink-0 border-t border-[#E3E3E3]/70 bg-white p-4">
              <div className="flex gap-2 rounded-3xl border border-[#234C6A]/10 bg-[#F8FAFC] p-2 shadow-inner">
                <Input
                  ref={messageInputRef}
                  placeholder="Type a message..."
                  onKeyDown={handleKeyPress}
                  className="h-11 border-none bg-transparent text-sm text-[#234C6A] focus-visible:ring-0"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isSending}
                  className="h-11 w-11 flex-shrink-0 rounded-2xl bg-[#234C6A] p-0 text-white hover:bg-[#1c405a]"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center bg-[#F8FAFC] p-8 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#234C6A]/5">
              <MessageSquare className="h-8 w-8 text-[#234C6A]/40" />
            </div>
            <h3 className="text-xl font-black text-[#234C6A]">Your Messages</h3>
            <p className="mt-2 max-w-[240px] text-sm text-[#456882]">
              Select a conversation from the left to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSeekerMessages;
