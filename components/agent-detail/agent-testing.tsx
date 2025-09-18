import {
  Card,
  CardTitle,
  CardContent,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Bot, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InfoMessageBox } from "@/components/shared/ResponseMessage";

interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
}
export default function AgentTesting({ agent }: { agent: any }) {
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const handleSendMessage = async () => {
    console.log("sending message");
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Your Chatbot</CardTitle>
        <CardDescription>
          Try out your chatbot before embedding it on your website
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex h-96">
          {/* Chat Messages */}
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 p-4 border rounded-lg">
              {chatMessages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Bot className="h-8 w-8 mx-auto mb-2" />
                  <p>Start a conversation to test your chatbot</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {message.role === "assistant" && (
                            <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          )}
                          {message.role === "user" && (
                            <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          )}
                          <div>
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Bot className="h-4 w-4" />
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            {/* Message Input */}
            <div className="flex space-x-2 mt-4">
              <Input value={newMessage} placeholder="Type your message..." />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Chat Info Sidebar */}
          <div className="w-64 ml-6 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Bot Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Model:</span>
                  <span className="font-medium">{agent.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Temperature:</span>
                  <span className="font-medium">{agent.temperature}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max Tokens:</span>
                  <span className="font-medium">{agent.maxTokens}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Documents:</span>
                  <span className="font-medium">{agent.documents.length}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Test Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  Clear Chat
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  Send Test Message
                </Button>
              </CardContent>
            </Card>

            <InfoMessageBox
              message="This is a simulation of how your bot will behave. The actual
                responses will use your configured model and knowledge base."
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
