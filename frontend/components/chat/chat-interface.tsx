"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, Package, Car, Star, MapPin } from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: "text" | "system";
}

interface ChatInterfaceProps {
  conversationId: string;
}

const mockParticipant = null as unknown as {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
  rating: number;
  deliveryCount: number;
} | null;

const mockMessages: Message[] = [];

const mockDeliveryInfo = null as unknown as {
  type: "delivery" | "trip";
  title: string;
  pickup?: string;
  dropoff?: string;
  fee?: string;
  status: "active" | "completed" | "pending";
} | null;

export function ChatInterface({ conversationId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: "1", // Current user
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "text",
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      {/* Chat Header */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/messages">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>

            <div className="flex items-center gap-3 flex-1">
              {!mockParticipant ? (
                <div className="text-muted-foreground text-sm">
                  No participant selected
                </div>
              ) : (
                <>
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={mockParticipant.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback>
                        {mockParticipant.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {mockParticipant.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold">{mockParticipant.name}</h2>
                      <Badge variant="secondary">Verified</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{mockParticipant.rating}</span>
                      </div>
                      <span>{mockParticipant.deliveryCount} deliveries</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Delivery/Trip Info */}
      <Card className="mb-4">
        <CardContent className="p-4">
          {!mockDeliveryInfo ? (
            <div className="text-sm text-muted-foreground">
              No delivery/trip info available
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                {mockDeliveryInfo.type === "delivery" ? (
                  <Package className="h-5 w-5 text-blue-600" />
                ) : (
                  <Car className="h-5 w-5 text-green-600" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{mockDeliveryInfo.title}</h3>
                  <Badge
                    variant={
                      mockDeliveryInfo.status === "active"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {mockDeliveryInfo.status}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  {mockDeliveryInfo.pickup && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>
                        <strong>Pickup:</strong> {mockDeliveryInfo.pickup}
                      </span>
                    </div>
                  )}
                  {mockDeliveryInfo.dropoff && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>
                        <strong>Drop-off:</strong> {mockDeliveryInfo.dropoff}
                      </span>
                    </div>
                  )}
                  {mockDeliveryInfo.fee && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-green-600">
                        {mockDeliveryInfo.fee}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Messages */}
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id}>
                {message.type === "system" ? (
                  <div className="flex justify-center">
                    <div className="bg-muted px-3 py-2 rounded-lg text-sm text-muted-foreground max-w-md text-center">
                      {message.content}
                    </div>
                  </div>
                ) : (
                  <div
                    className={`flex ${
                      message.senderId === "1" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderId === "1"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.senderId === "1"
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>

        {/* Message Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
