import { useState, useEffect } from "react";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Send, User } from "lucide-react";
import { mockUser } from "@/src/components/common/Header";

// Define types for messages and conversations
interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
}

const Messages = ({ userId }: { userId: string }) => {
  const user = mockUser;

  // Dummy conversations data
  const dummyConversations: Conversation[] = [
    {
      id: "1",
      participants: ["user1", "recruiter1"],
      lastMessage:
        "Thanks for your interest. We'll contact you for an interview soon!",
      lastMessageTime: "2024-11-20T10:30:00",
      unread: 0,
    },
    {
      id: "2",
      participants: ["user1", "recruiter2"],
      lastMessage:
        "Can you share more details about your experience with React?",
      lastMessageTime: "2024-11-19T15:45:00",
      unread: 1,
    },
    {
      id: "3",
      participants: ["user1", "recruiter3"],
      lastMessage: "Your application has been shortlisted for the next round.",
      lastMessageTime: "2024-11-18T09:15:00",
      unread: 0,
    },
  ];

  // Dummy messages data
  const dummyMessages: Record<string, Message[]> = {
    "1": [
      {
        id: "m1",
        senderId: "recruiter1",
        receiverId: "user1",
        content: "Hi, thanks for applying for the Senior Frontend position.",
        timestamp: "2024-11-20T09:00:00",
        read: true,
      },
      {
        id: "m2",
        senderId: "user1",
        receiverId: "recruiter1",
        content: "Thank you! I'm excited about the opportunity.",
        timestamp: "2024-11-20T09:15:00",
        read: true,
      },
      {
        id: "m3",
        senderId: "recruiter1",
        receiverId: "user1",
        content:
          "Thanks for your interest. We'll contact you for an interview soon!",
        timestamp: "2024-11-20T10:30:00",
        read: true,
      },
    ],
    "2": [
      {
        id: "m4",
        senderId: "recruiter2",
        receiverId: "user1",
        content:
          "Hi, I saw your application for the Product Designer position.",
        timestamp: "2024-11-19T14:00:00",
        read: true,
      },
      {
        id: "m5",
        senderId: "user1",
        receiverId: "recruiter2",
        content: "Hi! Yes, I'm very interested in this opportunity.",
        timestamp: "2024-11-19T14:15:00",
        read: true,
      },
      {
        id: "m6",
        senderId: "recruiter2",
        receiverId: "user1",
        content: "Can you share more details about your experience with React?",
        timestamp: "2024-11-19T15:45:00",
        read: false,
      },
    ],
  };

  const [conversations] = useState<Conversation[]>(dummyConversations);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (selectedConversation && dummyMessages[selectedConversation]) {
      setMessages(dummyMessages[selectedConversation]);
    } else {
      setMessages([]);
    }
  }, [selectedConversation]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    // For demo purposes, we'll just add the message to the state
    const newMsg: Message = {
      id: `new-${Date.now()}`,
      senderId: userId,
      receiverId: "some-recruiter", // In a real app, this would come from the conversation
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");
  };

  const getOtherParticipant = (conv: Conversation) => {
    // In a real app, you'd fetch participant details
    return conv.participants.find((p) => p !== userId) || "Recruiter";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
      <Card className="md:col-span-1 p-4 overflow-y-auto border-[#456882]/30 bg-white">
        <h3 className="font-semibold mb-4 text-[#234C6A]">Conversations</h3>
        {conversations.length === 0 ? (
          <p className="text-sm text-[#234C6A]/50">No conversations yet</p>
        ) : (
          <div className="space-y-2">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedConversation === conv.id
                    ? "bg-[#234C6A]/10 border border-[#234C6A]/30"
                    : "hover:bg-[#234C6A]/5 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="bg-[#234C6A]/10 p-2 rounded-full">
                    <User className="h-4 w-4 text-[#234C6A]" />
                  </div>
                  <p className="font-medium text-sm text-[#234C6A]">
                    {getOtherParticipant(conv)}
                  </p>
                  {conv.unread > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {conv.unread}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#234C6A]/70 line-clamp-1">
                  {conv.lastMessage}
                </p>
                <p className="text-xs text-[#234C6A]/50 mt-1">
                  {new Date(conv.lastMessageTime).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="md:col-span-2 p-4 flex flex-col border-[#456882]/30 bg-white">
        {selectedConversation ? (
          <>
            <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.senderId === userId ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${
                      msg.senderId === userId
                        ? "bg-gradient-to-r from-[#234C6A] to-[#456882] text-white rounded-br-none"
                        : "bg-[#E3E3E3] text-[#234C6A] rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs opacity-70 mt-1 text-right">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                className="border-[#456882]/30 focus:border-[#234C6A] focus:ring-[#234C6A]"
              />
              <Button
                onClick={sendMessage}
                className="bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="bg-[#234C6A]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-[#234C6A]" />
              </div>
              <p className="text-[#234C6A]/70 text-lg">
                Select a conversation to start messaging
              </p>
              <p className="text-[#234C6A]/50 mt-2 max-w-md">
                Connect with recruiters and hiring managers to discuss
                opportunities
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Messages;
