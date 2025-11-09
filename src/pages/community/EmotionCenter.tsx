import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Heart, MessageCircle, Share2, Bookmark, Plus, Image as ImageIcon, X } from "lucide-react";
import { toast } from "sonner";

interface PostComment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: Date;
  isSelf?: boolean;
}

interface Post {
  id: string;
  author: string;
  avatar: string;
  content: string;
  tags: string[];
  images?: string[];
  status: "approved" | "pending";
  timestamp: Date;
  resonates: number;
  comments: PostComment[];
  hasResonated: boolean;
  isSaved: boolean;
}

const topicTags = [
  "All",
  "Anxiety",
  "Stress",
  "Loneliness",
  "Achievement",
  "Gratitude",
  "Motivation",
  "Relationships",
  "Wellness",
  "Academics",
  "Career",
  "Celebration",
];

const mockPosts: Post[] = [
  {
    id: "1",
    author: "Floating Cloud",
    avatar: "☁️",
    content: "Feeling overwhelmed with midterms coming up. Anyone else struggling to balance everything? Sometimes I wonder if I'm doing enough...",
    tags: ["Anxiety", "Stress"],
    status: "approved",
    timestamp: new Date(Date.now() - 7200000),
    resonates: 24,
    comments: [
      {
        id: "1",
        author: "Kind Willow",
        avatar: "🌿",
        content: "You are not alone—taking short breaks really helped me last week.",
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        id: "2",
        author: "Silver Lining",
        avatar: "🌤️",
        content: "Try breaking tasks into 20-minute blocks. You got this!",
        timestamp: new Date(Date.now() - 1800000),
      },
    ],
    hasResonated: false,
    isSaved: false,
  },
  {
    id: "2",
    author: "Rising Sun",
    avatar: "🌅",
    content: "Just aced my presentation! Spent weeks preparing and it finally paid off. To anyone stressed about upcoming tasks: you've got this!",
    tags: ["Achievement", "Gratitude"],
    status: "approved",
    timestamp: new Date(Date.now() - 14400000),
    resonates: 42,
    comments: [
      {
        id: "1",
        author: "Supportive Wave",
        avatar: "🌊",
        content: "Congratulations! Celebrate your win and enjoy the momentum.",
        timestamp: new Date(Date.now() - 3600000),
      },
    ],
    hasResonated: false,
    isSaved: false,
  },
  {
    id: "3",
    author: "Quiet Stream",
    avatar: "🌊",
    content: "Missing home more than usual today. International student life has its challenges, but I'm grateful for the friends I've made here.",
    tags: ["Loneliness", "Gratitude"],
    status: "approved",
    timestamp: new Date(Date.now() - 21600000),
    resonates: 18,
    comments: [
      {
        id: "1",
        author: "Warm Lantern",
        avatar: "🏮",
        content: "Sending you a virtual hug. Maybe call someone from home tonight?",
        timestamp: new Date(Date.now() - 5400000),
      },
    ],
    hasResonated: false,
    isSaved: false,
  },
];

const EmotionCenter = () => {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [showPostModal, setShowPostModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTags, setNewPostTags] = useState<string[]>([]);
  const [newPostImages, setNewPostImages] = useState<{ file: File; preview: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [focusedPostId, setFocusedPostId] = useState<string | null>(null);
  const [newCommentContent, setNewCommentContent] = useState("");

  useEffect(() => {
    return () => {
      newPostImages.forEach((image) => URL.revokeObjectURL(image.preview));
    };
  }, [newPostImages]);

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

  const handleToggleSave = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, isSaved: !post.isSaved }
          : post,
      ),
    );
    toast.info("Saved posts are shown in your personal collection (coming soon).");
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
      images: newPostImages.map((image) => image.preview),
      status: "pending",
      timestamp: new Date(),
      resonates: 0,
      comments: [],
      hasResonated: false,
      isSaved: false,
    };

    setPosts([newPost, ...posts]);
    newPostImages.forEach((image) => URL.revokeObjectURL(image.preview));
    setNewPostContent("");
    setNewPostTags([]);
    setNewPostImages([]);
    setShowPostModal(false);
    toast.success("Your anonymous post has been submitted for review.");
  };

  const toggleTag = (tag: string) => {
    if (newPostTags.includes(tag)) {
      setNewPostTags(newPostTags.filter(t => t !== tag));
    } else {
      setNewPostTags([...newPostTags, tag]);
    }
  };

  const handleImageSelection = (files: FileList | null) => {
    if (!files) return;

    const selected = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setNewPostImages((prev) => [...prev, ...selected]);
  };

  const handleRemoveImage = (preview: string) => {
    setNewPostImages((prev) => {
      const next = prev.filter((image) => image.preview !== preview);
      URL.revokeObjectURL(preview);
      return next;
    });
  };

  const exitThreadView = () => {
    setFocusedPostId(null);
    setActiveCommentPostId(null);
    setNewCommentContent("");
  };

  const handleOpenComments = (postId: string) => {
    if (focusedPostId === postId) {
      if (activeCommentPostId === postId) {
        setActiveCommentPostId(null);
        setNewCommentContent("");
      } else {
        setActiveCommentPostId(postId);
        setNewCommentContent("");
      }
      return;
    }

    setFocusedPostId(postId);
    setActiveCommentPostId(postId);
    setNewCommentContent("");
  };

  const handlePostFocus = (event: MouseEvent<HTMLDivElement>, postId: string) => {
    const interactive = (event.target as HTMLElement).closest("button, textarea, input, a, label");
    if (interactive) {
      return;
    }

    setFocusedPostId(postId);
    setActiveCommentPostId(postId);
  };

  const handleAddComment = () => {
    if (!newCommentContent.trim() || !activeCommentPostId) {
      toast.error("Please enter a comment before posting.");
      return;
    }

    const targetPostId = activeCommentPostId;

    const anonymousNames = ["Friendly Horizon", "Calm Meadow", "Bright Ember", "Gentle Brook"];
    const anonymousAvatars = ["🌄", "🌱", "🔥", "💧"];
    const randomIndex = Math.floor(Math.random() * anonymousNames.length);

    const newComment: PostComment = {
      id: Date.now().toString(),
      author: anonymousNames[randomIndex],
      avatar: anonymousAvatars[randomIndex],
      content: newCommentContent,
      timestamp: new Date(),
      isSelf: true,
    };

    setActiveCommentPostId(null);
    setNewCommentContent("");

    setPosts((prev) =>
      prev.map((post) =>
        post.id === targetPostId
          ? { ...post, comments: [...post.comments, { ...newComment, isSelf: true }] }
          : post,
      ),
    );
    toast.success("Comment added anonymously.");
  };

  const handleDeleteComment = (postId: string, commentId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, comments: post.comments.filter((comment) => comment.id !== commentId) }
          : post,
      ),
    );
    toast.success("Comment removed.");
  };

  const handleDeletePost = (postId: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId));
    if (activeCommentPostId === postId) {
      setActiveCommentPostId(null);
      setNewCommentContent("");
    }
    if (focusedPostId === postId) {
      setFocusedPostId(null);
    }
    toast.success("Post removed.");
  };

  const visiblePosts = focusedPostId ? posts.filter((post) => post.id === focusedPostId) : posts;

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        <div className="mb-8 flex flex-col gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Emotion Center</h1>
            <p className="text-lg text-muted-foreground">
              A safe space to share your feelings anonymously
            </p>
          </div>
          <Button onClick={() => setShowPostModal(true)} size="lg" className="self-start">
            <Plus className="h-5 w-5 mr-2" />
            Post Anonymously
          </Button>
          {focusedPostId && (
            <Button
              variant="outline"
              size="sm"
              className="self-start border border-primary text-primary hover:bg-primary/10"
              onClick={exitThreadView}
            >
              ← Back to community feed
            </Button>
          )}
        </div>

        {/* Posts Feed */}
        <div className="max-w-3xl mx-auto space-y-6">
          {visiblePosts.map((post) => (
            <Card key={post.id}>
              <CardContent className="pt-6" onClick={(event) => handlePostFocus(event, post.id)}>
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-3xl">{post.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{post.author}</span>
                        <span className="text-sm text-muted-foreground">
                          {post.timestamp.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {post.status === "pending" && (
                          <Badge variant="outline" className="text-xs sm:text-sm border-warning text-warning px-3 py-1">
                            Pending review
                          </Badge>
                        )}
                        {post.status === "pending" && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-7 px-3 text-xs border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => handleDeletePost(post.id)}
                          >
                            Delete post
                          </Button>
                        )}
                      </div>
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

                <p className="text-sm mb-4 whitespace-pre-wrap break-words">{post.content}</p>

                {post.images && post.images.length > 0 && (
                  <div className="mb-4 grid gap-3 sm:grid-cols-2">
                    {post.images.map((image, index) => (
                      <img
                        key={`${post.id}-image-${index}`}
                        src={image}
                        alt="Shared attachment"
                        className="h-48 w-full rounded-lg object-cover"
                      />
                    ))}
                  </div>
                )}

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
                  <Button
                    variant="ghost"
                    size="sm"
                    className={focusedPostId === post.id ? "text-primary" : ""}
                    onClick={() => handleOpenComments(post.id)}
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {post.comments.length}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={post.isSaved ? "text-primary" : ""}
                    onClick={() => handleToggleSave(post.id)}
                  >
                    <Bookmark className={`h-4 w-4 mr-1 ${post.isSaved ? "fill-current" : ""}`} />
                    {post.isSaved ? "Saved" : "Save"}
                  </Button>
                </div>

                {focusedPostId === post.id && (
                  <div className="mt-4 space-y-6 border-t pt-4">
                    <div className="space-y-4 pr-0 sm:pr-2">
                      <div>
                        <p className="text-sm font-medium mb-2">Recent Comments</p>
                        {post.comments.length === 0 ? (
                          <p className="text-sm text-muted-foreground">
                            No comments yet. Be the first to respond!
                          </p>
                        ) : (
                          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                            {post.comments.map((comment) => (
                              <div key={comment.id} className="rounded-lg border p-3">
                                <div className="mb-2 flex items-center gap-2 text-sm">
                                  <span className="text-xl">{comment.avatar}</span>
                                  <span className="font-medium">{comment.author}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {comment.timestamp.toLocaleTimeString("en-US", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                  {comment.isSelf && (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      className="ml-auto h-7 px-3 text-xs border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                      onClick={() => handleDeleteComment(post.id, comment.id)}
                                    >
                                      Delete
                                    </Button>
                                  )}
                                </div>
                                <p className="text-sm whitespace-pre-wrap break-words">{comment.content}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {activeCommentPostId === post.id && (
                      <div className="w-full rounded-2xl border border-primary/40 bg-background/95 shadow-lg">
                        <div className="px-4 pt-4">
                          <p className="text-sm font-medium mb-2">Share supportive words</p>
                          <Textarea
                            id={`comment-input-${post.id}`}
                            placeholder="Write an encouraging comment..."
                            value={newCommentContent}
                            onChange={(event) => setNewCommentContent(event.target.value)}
                            rows={3}
                            className="resize-none border border-primary/50 bg-background focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40"
                          />
                        </div>
                        <div className="flex justify-end gap-2 px-4 pb-4">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setActiveCommentPostId(null);
                              setNewCommentContent("");
                            }}
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleAddComment}>Post Comment</Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {posts.length === 0 && (
            !focusedPostId &&
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
                What's on your mind? <span className="text-destructive">*</span>
              </label>
              <Textarea
                placeholder="Share your thoughts and feelings..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={8}
              />
            </div>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(event) => handleImageSelection(event.target.files)}
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Add Images
              </Button>

              {newPostImages.length > 0 && (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {newPostImages.map((image) => (
                    <div key={image.preview} className="relative overflow-hidden rounded-lg border">
                      <img src={image.preview} alt="Preview" className="h-40 w-full object-cover" />
                      <button
                        type="button"
                        className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                        onClick={() => handleRemoveImage(image.preview)}
                        aria-label="Remove image"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-muted p-3 rounded-lg text-xs text-muted-foreground">
              <p className="font-medium mb-1">Privacy Notice:</p>
              <p>Your post will be anonymous. Your identity will not be revealed to other users.</p>
              <p className="mt-1">All submissions go through moderation. While under review, your post will be shown with a "Pending review" badge.</p>
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
