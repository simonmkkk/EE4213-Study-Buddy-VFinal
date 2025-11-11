import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, Bookmark, MessageCircle, Share2 } from "lucide-react";
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
  timestamp: Date;
  resonates: number;
  comments: PostComment[];
  hasResonated: boolean;
  isSaved: boolean;
}

export default function EmotionCenterComments() {
  const location = useLocation();
  const navigate = useNavigate();
  const { post: initialPost, showInput } = location.state || {};
  
  const [post, setPost] = useState<Post>(initialPost);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(showInput || false);

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container py-8">
          <Button
            variant="ghost"
            className="mb-4 gap-2"
            onClick={() => navigate("/community/emotion-center")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Emotion Center
          </Button>
          <p className="text-muted-foreground">Post not found.</p>
        </main>
      </div>
    );
  }

  const handlePostComment = () => {
    if (!newCommentContent.trim()) {
      toast.error("Please write a comment before posting");
      return;
    }

    const newComment: PostComment = {
      id: Date.now().toString(),
      author: "You",
      avatar: "😊",
      content: newCommentContent.trim(),
      timestamp: new Date(),
      isSelf: true,
    };

    setPost({
      ...post,
      comments: [...post.comments, newComment],
    });

    setNewCommentContent("");
    setShowCommentInput(false);
    toast.success("Comment posted successfully!");
  };

  const handleDeleteComment = (commentId: string) => {
    setPost({
      ...post,
      comments: post.comments.filter((c) => c.id !== commentId),
    });
    toast.success("Comment deleted successfully!");
  };

  const handleToggleResonate = () => {
    setPost({
      ...post,
      hasResonated: !post.hasResonated,
      resonates: post.hasResonated ? post.resonates - 1 : post.resonates + 1,
    });
  };

  const handleToggleSave = () => {
    setPost({
      ...post,
      isSaved: !post.isSaved,
    });
    toast.success(post.isSaved ? "Removed from saved" : "Saved successfully!");
  };

  return (
    <div className="min-h-screen bg-background pb-48">
      <main className="container py-8">
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => navigate("/community/emotion-center")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Emotion Center
        </Button>

        <div className="max-w-3xl mx-auto">
          {/* Original Post */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="text-3xl">{post.avatar}</span>
                <div>
                  <p className="font-medium">{post.author}</p>
                  <p className="text-sm text-muted-foreground">
                    {post.timestamp.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <p className="mb-4 whitespace-pre-wrap break-words">{post.content}</p>

              {post.images && post.images.length > 0 && (
                <div className="mb-4 grid grid-cols-2 gap-2">
                  {post.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Post ${index + 1}`}
                      className="h-48 w-full rounded-lg object-cover"
                    />
                  ))}
                </div>
              )}

              <div className="mb-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="bg-slate-100 border-slate-400 text-slate-800 font-medium">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={post.hasResonated ? "text-primary" : ""}
                  onClick={handleToggleResonate}
                >
                  <Heart className={`h-4 w-4 mr-1 ${post.hasResonated ? "fill-current" : ""}`} />
                  {post.resonates}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCommentInput(true)}
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  {post.comments.length} Comments
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={post.isSaved ? "text-primary" : ""}
                  onClick={handleToggleSave}
                >
                  <Bookmark className={`h-4 w-4 mr-1 ${post.isSaved ? "fill-current" : ""}`} />
                  {post.isSaved ? "Saved" : "Save"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Comments ({post.comments.length})</h2>

            {post.comments.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No comments yet. Be the first to respond!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {post.comments.map((comment) => (
                  <Card key={comment.id}>
                    <CardContent className="pt-6">
                      <div className="mb-3 flex items-center gap-2">
                        <span className="text-2xl">{comment.avatar}</span>
                        <div className="flex-1">
                          <span className="font-medium">{comment.author}</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            {comment.timestamp.toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        {comment.isSelf && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                      <p className="text-sm whitespace-pre-wrap break-words">{comment.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Fixed Comment Input at Bottom */}
      {showCommentInput && (
        <div className="fixed bottom-4 left-0 right-0 z-50">
          <div className="container max-w-3xl mx-auto px-4">
            <Card className="shadow-2xl rounded-3xl border-2">
              <CardContent className="pt-6">
                <p className="text-sm font-medium mb-3">Share supportive words</p>
                <div className="flex gap-3 items-center">
                  <Textarea
                    placeholder="Write an encouraging comment..."
                    value={newCommentContent}
                    onChange={(e) => setNewCommentContent(e.target.value)}
                    className="flex-1 resize-none h-11"
                    rows={1}
                  />
                  <Button onClick={handlePostComment} size="lg" className="shrink-0">
                    Post Comment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
