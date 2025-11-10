import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, GripVertical, Undo2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Goal {
  id: string;
  title: string;
  estimate: number;
  tag?: string;
  completed: boolean;
  completedAt?: Date;
}

const MicroGoalTracker = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState<Goal[]>([
    { id: "1", title: "Review linear algebra notes", estimate: 30, tag: "Math", completed: false },
    { id: "2", title: "Complete React tutorial chapter 3", estimate: 45, tag: "Programming", completed: false },
  ]);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalEstimate, setNewGoalEstimate] = useState(25);
  const [newGoalTag, setNewGoalTag] = useState("");
  const [showUndo, setShowUndo] = useState<string | null>(null);

  const handleAddGoal = () => {
    if (!newGoalTitle.trim()) {
      toast.error("Please enter a goal title");
      return;
    }

    const newGoal: Goal = {
      id: Date.now().toString(),
      title: newGoalTitle,
      estimate: newGoalEstimate,
      tag: newGoalTag || undefined,
      completed: false,
    };

    setGoals([...goals, newGoal]);
    setNewGoalTitle("");
    setNewGoalEstimate(25);
    setNewGoalTag("");
    toast.success("Goal added!");
  };

  const handleToggleComplete = (goalId: string) => {
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, completed: !goal.completed, completedAt: goal.completed ? undefined : new Date() }
        : goal
    ));

    const goal = goals.find(g => g.id === goalId);
    if (goal && !goal.completed) {
      setShowUndo(goalId);
      setTimeout(() => setShowUndo(null), 10000);
    }
  };

  const handleUndo = (goalId: string) => {
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, completed: false, completedAt: undefined }
        : goal
    ));
    setShowUndo(null);
    toast.info("Goal marked as incomplete");
  };

  const stats = {
    total: goals.length,
    completed: goals.filter(g => g.completed).length,
    totalMinutes: goals.reduce((sum, g) => sum + g.estimate, 0),
    completedMinutes: goals.filter(g => g.completed).reduce((sum, g) => sum + g.estimate, 0),
  };

  const progressPercent = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/focus-learning')} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold">Micro-Goal Study Tracker</h1>
          <p className="text-lg text-muted-foreground mt-4">
            Break down your tasks into achievable micro-goals
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Today's Progress</span>
                <span className="text-muted-foreground">
                  {stats.completed} / {stats.total} goals ({Math.round(progressPercent)}%)
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{stats.completedMinutes} / {stats.totalMinutes} minutes</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Goal List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-semibold">Today's Goals</h2>
            
            {goals.map((goal) => (
              <Card key={goal.id} className={goal.completed ? "opacity-75" : ""}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-move mt-1" />
                    <Checkbox
                      checked={goal.completed}
                      onCheckedChange={() => handleToggleComplete(goal.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`font-medium ${goal.completed ? "line-through" : ""}`}>
                          {goal.title}
                        </h3>
                        <Badge variant="outline">{goal.estimate} min</Badge>
                      </div>
                      {goal.tag && (
                        <Badge variant="secondary" className="mt-1">{goal.tag}</Badge>
                      )}
                      {goal.completed && goal.completedAt && (
                        <div className="flex items-center gap-2 mt-2">
                          <p className="text-xs text-muted-foreground">
                            Completed at {goal.completedAt.toLocaleTimeString()}
                          </p>
                          {showUndo === goal.id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUndo(goal.id)}
                              className="h-6 px-2"
                            >
                              <Undo2 className="h-3 w-3 mr-1" />
                              Undo
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {goals.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>No goals yet. Add your first micro-goal to get started!</p>
              </div>
            )}
          </div>

          {/* Add Goal Form */}
          <div>
            <Card className="sticky top-24">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Add New Goal</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Title <span className="text-destructive">*</span>
                    </label>
                    <Input
                      placeholder="e.g., Review Chapter 5"
                      value={newGoalTitle}
                      onChange={(e) => setNewGoalTitle(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Estimate (5-60 min)
                    </label>
                    <Input
                      type="number"
                      min={5}
                      max={60}
                      value={newGoalEstimate}
                      onChange={(e) => setNewGoalEstimate(Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Tag (optional)
                    </label>
                    <Input
                      placeholder="e.g., Math, Programming"
                      value={newGoalTag}
                      onChange={(e) => setNewGoalTag(e.target.value)}
                    />
                  </div>

                  <Button className="w-full" onClick={handleAddGoal}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Goal
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Daily Summary */}
            <Card className="mt-4">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Daily Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Goals Planned</span>
                    <span className="font-medium">{stats.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Completed</span>
                    <span className="font-medium text-accent">{stats.completed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Spillover</span>
                    <span className="font-medium text-warning">{stats.total - stats.completed}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MicroGoalTracker;
