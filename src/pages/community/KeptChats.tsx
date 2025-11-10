import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface KeptChat {
  id: string;
  matchedUser: {
    name: string;
    icon: string;
  };
  topics: string[];
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

const KeptChats = () => {
  const navigate = useNavigate();
  const [keptChats, setKeptChats] = useState<KeptChat[]>([]);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);

  useEffect(() => {
    // Load kept chats from localStorage
    const savedChats = localStorage.getItem("keptChats");
    if (savedChats) {
      const chats = JSON.parse(savedChats);
      // Convert timestamp strings back to Date objects
      const parsedChats = chats.map((chat: any) => ({
        ...chat,
        timestamp: new Date(chat.timestamp),
      }));
      setKeptChats(parsedChats);
    }
  }, []);

  const handleDeleteChat = (chatId: string) => {
    const updatedChats = keptChats.filter((chat) => chat.id !== chatId);
    setKeptChats(updatedChats);
    localStorage.setItem("keptChats", JSON.stringify(updatedChats));
    setChatToDelete(null);
    toast.success("Chat deleted");
  };

  const handleOpenChat = (chatId: string) => {
    // Navigate back to SoulMatch with the chat ID
    navigate(`/community/soul-match?chat=${chatId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
          <div>
            <h1 className="text-3xl font-bold">Kept Chats</h1>
            <p className="text-muted-foreground">
              {keptChats.length} {keptChats.length === 1 ? "conversation" : "conversations"} saved
            </p>
          </div>
        </div>

        {keptChats.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Kept Chats</h3>
              <p className="text-muted-foreground text-center mb-6">
                When you keep a chat in Soul Match, it will appear here
              </p>
              <Button onClick={() => navigate("/community/soul-match")}>
                Start New Match
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {keptChats.map((chat) => (
              <Card
                key={chat.id}
                className="transition-all hover:shadow-lg cursor-pointer"
                onClick={() => handleOpenChat(chat.id)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{chat.matchedUser.icon}</span>
                      <div>
                        <h3 className="font-semibold">{chat.matchedUser.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {chat.messageCount} messages
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        setChatToDelete(chat.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>

                  <div className="mb-3 flex flex-wrap gap-2">
                    {chat.topics.slice(0, 3).map((topic) => (
                      <Badge key={topic} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                    {chat.topics.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{chat.topics.length - 3}
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {chat.lastMessage}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {chat.timestamp.toLocaleDateString()} at{" "}
                    {chat.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={chatToDelete !== null} onOpenChange={() => setChatToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chat?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this conversation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => chatToDelete && handleDeleteChat(chatToDelete)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default KeptChats;
