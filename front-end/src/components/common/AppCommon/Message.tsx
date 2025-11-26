import { useState, useEffect } from "react";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Message, Conversation } from "@/src/types";
import { Send } from "lucide-react";
import { mockUser } from "../Header";

const Messages = ({ userId }: { userId: string }) => {
  const user = mockUser;
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // loadConversations();
  }, [userId]);

  useEffect(() => {
    if (selectedConversation) {
      //   loadMessages(selectedConversation);
    }
  }, [selectedConversation]);

  const loadConversations = () => {
    const allConversations = JSON.parse(
      localStorage.getItem("conversations") || "[]"
    );
    const userConversations = allConversations.filter((conv: Conversation) =>
      conv.participants.includes(userId)
    );
    setConversations(userConversations);
  };

  const loadMessages = (conversationId: string) => {
    const allMessages = JSON.parse(localStorage.getItem("messages") || "[]");
    const conversationMessages = allMessages.filter(
      (msg: Message) =>
        (msg.senderId === userId || msg.receiverId === userId) &&
        conversations
          .find((c) => c.id === conversationId)
          ?.participants.includes(msg.senderId) &&
        conversations
          .find((c) => c.id === conversationId)
          ?.participants.includes(msg.receiverId)
    );
    setMessages(conversationMessages);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const conversation = conversations.find(
      (c) => c.id === selectedConversation
    );
    if (!conversation) return;

    const receiverId =
      conversation.participants.find((p) => p !== userId) || "";

    const message: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: userId,
      receiverId,
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
    };

    const allMessages = JSON.parse(localStorage.getItem("messages") || "[]");
    allMessages.push(message);
    localStorage.setItem("messages", JSON.stringify(allMessages));

    setMessages([...messages, message]);
    setNewMessage("");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
      <Card className="md:col-span-1 p-4 overflow-y-auto">
        <h3 className="font-semibold mb-4">Conversations</h3>
        {conversations.length === 0 ? (
          <p className="text-sm text-muted-foreground">No conversations yet</p>
        ) : (
          <div className="space-y-2">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedConversation === conv.id
                    ? "bg-primary/10"
                    : "hover:bg-muted"
                }`}
              >
                <p className="font-medium text-sm">Conversation</p>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {conv.lastMessage}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="md:col-span-2 p-4 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.senderId === userId ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      msg.senderId === userId
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString()}
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
              />
              <Button onClick={sendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">
              Select a conversation to start messaging
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Messages;
