import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Send, Heart } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";

const emotions = [
  { id: "calm", label: "Calm", icon: "😌" },
  { id: "anxious", label: "Anxious", icon: "😰" },
  { id: "excited", label: "Excited", icon: "😄" },
  { id: "sad", label: "Sad", icon: "😔" },
  { id: "confused", label: "Confused", icon: "🤔" },
];

const topics = [
  "Academics", "Relationships", "Future", "Love", "Family", "Career", "Health", "Hobbies"
];

interface Message {
  id: string;
  text: string;
  sender: "me" | "other";
  timestamp: Date;
}

const SoulMatch = () => {
  const [stage, setStage] = useState<"select" | "matching" | "chatting">("select");
  const [selectedEmotion, setSelectedEmotion] = useState<string>("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [isTyping, setIsTyping] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [matchedUser, setMatchedUser] = useState<{ name: string; icon: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stage === "chatting" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setShowEndModal(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [stage, timeLeft]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStartMatching = () => {
    if (!selectedEmotion) {
      toast.error("Please select an emotion");
      return;
    }
    if (selectedTopics.length === 0) {
      toast.error("Please select at least one topic");
      return;
    }

    setStage("matching");
    
    // Simulate matching
    setTimeout(() => {
      const anonymousNames = ["Gentle Breeze", "Mountain Peak", "Desert Rose", "Ocean Wave"];
      const anonymousIcons = ["🍃", "⛰️", "🌹", "🌊"];
      const randomIndex = Math.floor(Math.random() * anonymousNames.length);
      
      setMatchedUser({
        name: anonymousNames[randomIndex],
        icon: anonymousIcons[randomIndex],
      });
      
      setStage("chatting");
      toast.success("Match found! Start your conversation.");
      
      // Auto-send initial message from matched user
      setTimeout(() => {
        const initialMessage: Message = {
          id: Date.now().toString(),
          text: "Hi there! I'm glad we matched. What's on your mind?",
          sender: "other",
          timestamp: new Date(),
        };
        setMessages([initialMessage]);
      }, 1000);
    }, 3000);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "me",
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputMessage("");

    // Simulate other user typing and responding
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        "I understand how you feel. That must be really difficult.",
        "Thank you for sharing that with me. You're not alone in this.",
        "That's a great perspective! I never thought about it that way.",
        "I've been through something similar. It gets better with time.",
        "You seem like a really thoughtful person. How long have you been dealing with this?",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: "other",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, responseMessage]);
    }, 2000);
  };

  const handleEndChat = () => {
    setShowEndModal(true);
  };

  const handleContinueChat = () => {
    toast.info("Both users must agree to continue chatting");
    setShowEndModal(false);
  };

  const handleNeverAgain = () => {
    toast.success("Chat ended. Thank you for using Soul Match!");
    setStage("select");
    setSelectedEmotion("");
    setSelectedTopics([]);
    setMessages([]);
    setTimeLeft(1800);
    setMatchedUser(null);
    setShowEndModal(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  if (stage === "select") {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="container py-8">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold mb-2">Soul Match</h1>
              <p className="text-lg text-muted-foreground">
                Find a soul companion for anonymous, meaningful conversation
              </p>
            </div>

            <Card>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">How are you feeling?</h3>
                  <div className="grid grid-cols-5 gap-3">
                    {emotions.map((emotion) => (
                      <div
                        key={emotion.id}
                        className={`flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-smooth ${
                          selectedEmotion === emotion.id
                            ? "border-primary bg-primary-light"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setSelectedEmotion(emotion.id)}
                      >
                        <span className="text-3xl mb-2">{emotion.icon}</span>
                        <span className="text-xs font-medium">{emotion.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">What topics interest you?</h3>
                  <div className="flex flex-wrap gap-2">
                    {topics.map((topic) => (
                      <Badge
                        key={topic}
                        variant={selectedTopics.includes(topic) ? "default" : "outline"}
                        className="cursor-pointer px-4 py-2"
                        onClick={() => toggleTopic(topic)}
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="bg-info-light p-4 rounded-lg border border-info">
                  <p className="text-sm text-info-foreground">
                    <strong>Privacy Note:</strong> Your conversation is anonymous and will be automatically deleted after 24 hours. Neither party will know each other's real identity unless you both agree to exchange nicknames.
                  </p>
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleStartMatching}
                >
                  Start Matching
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  if (stage === "matching") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <Heart className="w-32 h-32 text-primary animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Searching for your soul mate...</h2>
          <p className="text-muted-foreground">Finding someone who shares your feelings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Chat Header */}
      <div className="border-b border-border bg-card">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{matchedUser?.icon}</span>
              <div>
                <h2 className="font-semibold">{matchedUser?.name}</h2>
                <p className="text-sm text-muted-foreground">
                  Topics: {selectedTopics.join(", ")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={timeLeft < 300 ? "destructive" : "secondary"}>
                {formatTime(timeLeft)}
              </Badge>
              <Button variant="destructive" size="sm" onClick={handleEndChat}>
                <AlertCircle className="h-4 w-4 mr-2" />
                End Chat
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-muted/30">
        <div className="container py-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                  message.sender === "me"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === "me" ? "text-primary-foreground/70" : "text-muted-foreground"
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-card rounded-2xl px-4 py-3">
                <p className="text-sm text-muted-foreground">Typing...</p>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-card">
        <div className="container py-4">
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* End Chat Modal */}
      <Dialog open={showEndModal} onOpenChange={setShowEndModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>End Conversation?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              What would you like to do?
            </p>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleContinueChat}
              >
                Continue Chat (requires mutual agreement)
              </Button>
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleNeverAgain}
              >
                End & Never Match Again
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => {
                  toast.info("Report submitted");
                  handleNeverAgain();
                }}
              >
                Report & End
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SoulMatch;
