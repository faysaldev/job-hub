"use client";

import { useState, useEffect, useRef } from "react";
import { mockUser } from "@/src/components/common/Header";
import RecruiterLayout from "@/src/components/Recruiter/RecruiterLayout";
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
  CheckCircle,
  XCircle,
  MessageSquare,
  ChevronRight,
  Briefcase,
} from "lucide-react";

interface Interview {
  id: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: string;
  type: "video" | "phone" | "in-person";
  status: "scheduled" | "completed" | "cancelled" | "pending";
  notes?: string;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: "text" | "scheduling" | "confirmation";
  schedulingData?: {
    date?: string;
    time?: string;
    type?: string;
    confirmed?: boolean;
  };
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  avatar?: string;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  interviewStatus: "none" | "pending" | "scheduled";
}

const InterviewsPage = () => {
  const user = mockUser;
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sample candidates for scheduling
  const [candidates] = useState<Candidate[]>([
    {
      id: "c1",
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      jobTitle: "Senior Frontend Developer",
      unreadCount: 2,
      lastMessage: "Yes, that time works for me!",
      lastMessageTime: "10:30 AM",
      interviewStatus: "pending",
    },
    {
      id: "c2",
      name: "Michael Chen",
      email: "m.chen@email.com",
      jobTitle: "Product Designer",
      unreadCount: 0,
      lastMessage: "Looking forward to our conversation",
      lastMessageTime: "Yesterday",
      interviewStatus: "scheduled",
    },
    {
      id: "c3",
      name: "Emily Davis",
      email: "emily.d@email.com",
      jobTitle: "Backend Developer",
      unreadCount: 1,
      lastMessage: "Could we reschedule?",
      lastMessageTime: "2 days ago",
      interviewStatus: "none",
    },
    {
      id: "c4",
      name: "James Wilson",
      email: "j.wilson@email.com",
      jobTitle: "DevOps Engineer",
      unreadCount: 0,
      lastMessage: "Interview confirmed for Friday",
      lastMessageTime: "3 days ago",
      interviewStatus: "scheduled",
    },
  ]);

  // Sample scheduled interviews
  const [interviews] = useState<Interview[]>([
    {
      id: "int1",
      candidateName: "Michael Chen",
      candidateEmail: "m.chen@email.com",
      jobTitle: "Product Designer",
      scheduledDate: "2024-01-28",
      scheduledTime: "10:00 AM",
      duration: "45 min",
      type: "video",
      status: "scheduled",
    },
    {
      id: "int2",
      candidateName: "James Wilson",
      candidateEmail: "j.wilson@email.com",
      jobTitle: "DevOps Engineer",
      scheduledDate: "2024-01-26",
      scheduledTime: "2:00 PM",
      duration: "60 min",
      type: "video",
      status: "scheduled",
    },
  ]);

  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showScheduler, setShowScheduler] = useState(false);
  const [schedulingStep, setSchedulingStep] = useState(0);
  const [schedulingData, setSchedulingData] = useState({
    date: "",
    time: "",
    type: "video",
  });

  // Sample chat messages when candidate is selected
  useEffect(() => {
    if (selectedCandidate) {
      setMessages([
        {
          id: "m1",
          senderId: selectedCandidate.id,
          senderName: selectedCandidate.name,
          content: `Hi, I applied for the ${selectedCandidate.jobTitle} position and I'm excited about the opportunity!`,
          timestamp: "Yesterday 9:00 AM",
          type: "text",
        },
        {
          id: "m2",
          senderId: user?.id || "",
          senderName: user?.name || "Recruiter",
          content: "Hi! Thanks for your application. We'd love to schedule an interview with you. When would be a good time?",
          timestamp: "Yesterday 10:15 AM",
          type: "text",
        },
        {
          id: "m3",
          senderId: selectedCandidate.id,
          senderName: selectedCandidate.name,
          content: "I'm flexible this week. Would Thursday or Friday afternoon work?",
          timestamp: "Yesterday 2:30 PM",
          type: "text",
        },
      ]);
    }
  }, [selectedCandidate, user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!user) return null;

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedCandidate) return;

    const newMsg: ChatMessage = {
      id: `new-${Date.now()}`,
      senderId: user.id,
      senderName: user.name || "Recruiter",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "text",
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");
  };

  const sendScheduleRequest = () => {
    if (!selectedCandidate || !schedulingData.date || !schedulingData.time) return;

    const scheduleMsg: ChatMessage = {
      id: `schedule-${Date.now()}`,
      senderId: user.id,
      senderName: user.name || "Recruiter",
      content: "",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "scheduling",
      schedulingData: {
        date: schedulingData.date,
        time: schedulingData.time,
        type: schedulingData.type,
        confirmed: false,
      },
    };

    setMessages([...messages, scheduleMsg]);
    setShowScheduler(false);
    setSchedulingData({ date: "", time: "", type: "video" });
  };

  const interviewTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "phone":
        return <Phone className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  return (
    <RecruiterLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg">
            <Calendar className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#234C6A]">Schedule Interviews</h1>
            <p className="text-[#456882]">Coordinate and schedule interviews with candidates via chat</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Candidates List */}
          <Card className="p-4 border-none bg-white shadow-lg rounded-2xl lg:col-span-1 h-[700px] flex flex-col">
            <h3 className="font-semibold text-[#234C6A] mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Candidates
            </h3>
            <div className="flex-1 overflow-y-auto space-y-2">
              {candidates.map((candidate) => (
                <button
                  key={candidate.id}
                  onClick={() => setSelectedCandidate(candidate)}
                  className={`w-full p-4 rounded-xl text-left transition-all ${
                    selectedCandidate?.id === candidate.id
                      ? "bg-gradient-to-r from-[#234C6A] to-[#456882] text-white shadow-lg"
                      : "hover:bg-[#E3E3E3]/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      selectedCandidate?.id === candidate.id ? "bg-white/20" : "bg-[#234C6A]/10"
                    }`}>
                      <User className={`h-5 w-5 ${selectedCandidate?.id === candidate.id ? "text-white" : "text-[#234C6A]"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`font-semibold truncate ${selectedCandidate?.id === candidate.id ? "text-white" : "text-[#234C6A]"}`}>
                          {candidate.name}
                        </p>
                        {candidate.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {candidate.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className={`text-xs truncate ${selectedCandidate?.id === candidate.id ? "text-white/80" : "text-[#456882]"}`}>
                        {candidate.jobTitle}
                      </p>
                      <p className={`text-xs truncate mt-1 ${selectedCandidate?.id === candidate.id ? "text-white/70" : "text-[#456882]/70"}`}>
                        {candidate.lastMessage}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-xs ${selectedCandidate?.id === candidate.id ? "text-white/70" : "text-[#456882]/70"}`}>
                        {candidate.lastMessageTime}
                      </span>
                      {candidate.interviewStatus === "scheduled" && (
                        <Badge className="bg-green-500 text-white text-xs">Scheduled</Badge>
                      )}
                      {candidate.interviewStatus === "pending" && (
                        <Badge className="bg-amber-500 text-white text-xs">Pending</Badge>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Chat Area */}
          <Card className="p-4 border-none bg-white shadow-lg rounded-2xl lg:col-span-2 h-[700px] flex flex-col">
            {selectedCandidate ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#E3E3E3]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#234C6A]/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-[#234C6A]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#234C6A]">{selectedCandidate.name}</p>
                      <p className="text-xs text-[#456882]">{selectedCandidate.jobTitle}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowScheduler(!showScheduler)}
                    className="bg-gradient-to-r from-[#234C6A] to-[#456882] text-white"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Interview
                  </Button>
                </div>

                {/* Schedule Picker */}
                {showScheduler && (
                  <div className="p-4 bg-gradient-to-r from-[#234C6A]/5 to-[#456882]/5 rounded-xl my-4">
                    <h4 className="font-semibold text-[#234C6A] mb-4">Schedule an Interview</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm text-[#456882] mb-1">Date</label>
                        <Input
                          type="date"
                          value={schedulingData.date}
                          onChange={(e) => setSchedulingData({ ...schedulingData, date: e.target.value })}
                          className="border-[#E3E3E3]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#456882] mb-1">Time</label>
                        <Input
                          type="time"
                          value={schedulingData.time}
                          onChange={(e) => setSchedulingData({ ...schedulingData, time: e.target.value })}
                          className="border-[#E3E3E3]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#456882] mb-1">Type</label>
                        <div className="flex gap-2">
                          {["video", "phone", "in-person"].map((type) => (
                            <button
                              key={type}
                              onClick={() => setSchedulingData({ ...schedulingData, type })}
                              className={`flex-1 p-2 rounded-lg flex items-center justify-center gap-1 text-sm capitalize ${
                                schedulingData.type === type
                                  ? "bg-[#234C6A] text-white"
                                  : "bg-[#E3E3E3] text-[#456882]"
                              }`}
                            >
                              {interviewTypeIcon(type)}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end mt-4 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowScheduler(false)}
                        className="border-[#234C6A]/20"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={sendScheduleRequest}
                        disabled={!schedulingData.date || !schedulingData.time}
                        className="bg-[#234C6A]"
                      >
                        Send Request
                      </Button>
                    </div>
                  </div>
                )}

                {/* Messages */}
                <div className="flex-1 overflow-y-auto py-4 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderId === user.id ? "justify-end" : "justify-start"}`}
                    >
                      {msg.type === "text" ? (
                        <div
                          className={`max-w-[80%] p-4 rounded-2xl ${
                            msg.senderId === user.id
                              ? "bg-gradient-to-r from-[#234C6A] to-[#456882] text-white rounded-br-none"
                              : "bg-[#E3E3E3] text-[#234C6A] rounded-bl-none"
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-xs opacity-70 mt-1 text-right">{msg.timestamp}</p>
                        </div>
                      ) : msg.type === "scheduling" && msg.schedulingData ? (
                        <div className="max-w-[80%] bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Calendar className="h-5 w-5 text-amber-600" />
                            <span className="font-semibold text-[#234C6A]">Interview Request</span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-[#456882]">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(msg.schedulingData.date!).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[#456882]">
                              <Clock className="h-4 w-4" />
                              <span>{msg.schedulingData.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[#456882]">
                              {interviewTypeIcon(msg.schedulingData.type!)}
                              <span className="capitalize">{msg.schedulingData.type} Interview</span>
                            </div>
                          </div>
                          {!msg.schedulingData.confirmed && (
                            <div className="flex gap-2 mt-4">
                              <Button size="sm" className="flex-1 bg-green-500 hover:bg-green-600">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Confirm
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1 border-red-200 text-red-500 hover:bg-red-50">
                                <XCircle className="h-4 w-4 mr-1" />
                                Decline
                              </Button>
                            </div>
                          )}
                          <p className="text-xs text-[#456882]/70 mt-2 text-right">{msg.timestamp}</p>
                        </div>
                      ) : null}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* Message Input */}
                <div className="pt-4 border-t border-[#E3E3E3]">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      placeholder="Type a message..."
                      className="border-[#E3E3E3] focus:border-[#234C6A]"
                    />
                    <Button
                      onClick={sendMessage}
                      className="bg-gradient-to-r from-[#234C6A] to-[#456882] text-white"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-[#234C6A]/10 flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-10 w-10 text-[#234C6A]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#234C6A] mb-2">Select a Candidate</h3>
                  <p className="text-[#456882] max-w-md">
                    Choose a candidate from the list to start scheduling an interview through chat
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Upcoming Interviews */}
        <Card className="mt-6 p-6 border-none bg-white shadow-lg rounded-2xl">
          <h3 className="font-semibold text-[#234C6A] mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Upcoming Interviews
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {interviews.map((interview) => (
              <div
                key={interview.id}
                className="p-4 bg-gradient-to-r from-[#234C6A]/5 to-[#456882]/5 rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-[#234C6A]/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-[#234C6A]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#234C6A]">{interview.candidateName}</p>
                      <p className="text-xs text-[#456882]">{interview.jobTitle}</p>
                    </div>
                  </div>
                  <Badge className={`${interview.type === "video" ? "bg-blue-500" : interview.type === "phone" ? "bg-green-500" : "bg-purple-500"} text-white`}>
                    {interviewTypeIcon(interview.type)}
                    <span className="ml-1 capitalize">{interview.type}</span>
                  </Badge>
                </div>
                <div className="space-y-2 text-sm text-[#456882]">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(interview.scheduledDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{interview.scheduledTime} ({interview.duration})</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" className="flex-1 border-[#234C6A]/20 text-[#234C6A]">
                    Reschedule
                  </Button>
                  <Button size="sm" className="flex-1 bg-[#234C6A]">
                    Join
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </RecruiterLayout>
  );
};

export default InterviewsPage;
