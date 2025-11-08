import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Heart, MessageCircle, Share2, Bookmark, Plus, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";

interface Post {
  id: string;
  author: string;
  avatar: string;
  content: string;
  tags: string[];
  timestamp: Date;
  resonates: number;
  comments: number;
  hasResonated: boolean;
}

const topicTags = ["All", "Anxiety", "Stress", "Loneliness", "Achievement", "Gratitude"];

const mockPosts: Post[] = [
  {
    id: "1",
    author: "Floating Cloud",
    avatar: "☁️",
    content: "Feeling overwhelmed with midterms coming up. Anyone else struggling to balance everything? Sometimes I wonder if I'm doing enough...",
    tags: ["Anxiety", "Stress"],
    timestamp: new Date(Date.now() - 7200000),
    resonates: 24,
    comments: 8,
    hasResonated: false,
  },
  {
    id: "2",
    author: "Rising Sun",
    avatar: "🌅",
    content: "Just aced my presentation! Spent weeks preparing and it finally paid off. To anyone stressed about upcoming tasks: you've got this!",
    tags: ["Achievement", "Gratitude"],
    timestamp: new Date(Date.now() - 14400000),
    resonates: 42,
    comments: 12,
    hasResonated: false,
  },
  {
    id: "3",
    author: "Quiet Stream",
    avatar: "🌊",
    content: "Missing home more than usual today. International student life has its challenges, but I'm grateful for the friends I've made here.",
    tags: ["Loneliness", "Gratitude"],
    timestamp: new Date(Date.now() - 21600000),
    resonates: 18,
    comments: 5,
    hasResonated: false,
  },
];

const EmotionCenter = () => {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [selectedTag, setSelectedTag] = useState("All");
  const [showPostModal, setShowPostModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTags, setNewPostTags] = useState<string[]>([]);

  const filteredPosts = posts.filter(post =>
    selectedTag === "All" || post.tags.includes(selectedTag)
  );

  const handleResonate = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? {
            ...post,
            resonates: post.hasResonated ? post.resonates - 1 : post.resonates + 1,
            hasResonated: !post.hasResonated,
          }
        : post
    ));
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) {
      toast.error("Please enter some content");
      return;
    }

    if (newPostTags.length === 0) {
      toast.error("Please select at least one topic tag");
      return;
    }

    const anonymousNames = ["Gentle Breeze", "Mountain Peak", "Desert Rose", "Ocean Wave"];
    const anonymousAvatars = ["🍃", "⛰️", "🌹", "🌊"];
    const randomIndex = Math.floor(Math.random() * anonymousNames.length);

    const newPost: Post = {
      id: Date.now().toString(),
      author: anonymousNames[randomIndex],
      avatar: anonymousAvatars[randomIndex],
      content: newPostContent,
      tags: newPostTags,
      timestamp: new Date(),
      resonates: 0,
      comments: 0,
      hasResonated: false,
    };

    setPosts([newPost, ...posts]);
    setNewPostContent("");
    setNewPostTags([]);
    setShowPostModal(false);
    toast.success("Your anonymous post has been shared!");
  };

  const toggleTag = (tag: string) => {
    if (newPostTags.includes(tag)) {
      setNewPostTags(newPostTags.filter(t => t !== tag));
    } else {
      setNewPostTags([...newPostTags, tag]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Emotion Center</h1>
            <p className="text-lg text-muted-foreground">
              A safe space to share your feelings anonymously
            </p>
          </div>
          <Button onClick={() => setShowPostModal(true)} size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Anonymous Post
          </Button>
        </div>

        {/* Topic Filter */}
        <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2">
          {topicTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              className="cursor-pointer px-4 py-2 whitespace-nowrap"
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Posts Feed */}
        <div className="max-w-3xl mx-auto space-y-6">
          {filteredPosts.map((post) => (
            <Card key={post.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-3xl">{post.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{post.author}</span>
                      <span className="text-sm text-muted-foreground">
                        {post.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-sm mb-4 whitespace-pre-wrap">{post.content}</p>

                <div className="flex items-center gap-4 pt-4 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={post.hasResonated ? "text-destructive" : ""}
                    onClick={() => handleResonate(post.id)}
                  >
                    <Heart className={`h-4 w-4 mr-1 ${post.hasResonated ? "fill-current" : ""}`} />
                    {post.resonates}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {post.comments}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Bookmark className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredPosts.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No posts in this category yet.</p>
              <p className="text-sm mt-2">Share your feelings to start connecting...</p>
            </div>
          )}
        </div>
      </main>

      {/* Create Post Modal */}
      <Dialog open={showPostModal} onOpenChange={setShowPostModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Share Anonymously</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Select Topic Tags <span className="text-destructive">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {topicTags.slice(1).map((tag) => (
                  <Badge
                    key={tag}
                    variant={newPostTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                What's on your mind? (max 500 characters) <span className="text-destructive">*</span>
              </label>
              <Textarea
                placeholder="Share your thoughts and feelings..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value.slice(0, 500))}
                rows={6}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {newPostContent.length}/500
              </p>
            </div>

            <div>
              <Button variant="outline" className="w-full">
                <ImageIcon className="h-4 w-4 mr-2" />
                Add Images (max 3)
              </Button>
            </div>

            <div className="bg-muted p-3 rounded-lg text-xs text-muted-foreground">
              <p className="font-medium mb-1">Privacy Notice:</p>
              <p>Your post will be anonymous. Your identity will not be revealed to other users.</p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowPostModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleCreatePost}
              >
                Post Anonymously
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmotionCenter;
