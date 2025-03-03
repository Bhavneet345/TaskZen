"use client";

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TaskList } from "@/components/task-list"
import { TaskStats } from "@/components/task-stats"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CreateTaskDialog } from "@/components/create-task-dialog"
import { useToast } from "@/components/ui/use-toast"
import { useTaskService } from "@/hooks/use-task-service"
import type { Task } from "@/types/task"

export default function DashboardPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // ✅ **Include `fetchTasks()` to refresh the list after changes**
  const { tasks, setTasks, isLoading, error, fetchTasks, createTask, updateTask, deleteTask, getAiPrioritizedTasks } = useTaskService();

  const [aiTasks, setAiTasks] = useState<Task[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load tasks. Please try again later.",
      });
    }
  }, [error, toast]);

  // ✅ **Fix: Ensure UI updates after task creation**
  const handleCreateTask = async (task: Omit<Task, "_id">) => {
    try {
      const newTask = await createTask(task);

      if (newTask) {
        setTasks((prevTasks) => [...prevTasks, newTask]); // ✅ Ensure UI updates immediately
        console.log("🔥 New Task Added to State in Dashboard:", newTask);
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };
  

  // ✅ **Fix: Ensure UI updates after task update**
  const handleUpdateTask = async (task: Task) => {
    try {
      await updateTask(task);
      await fetchTasks(); // ✅ Refresh tasks after updating
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to update task",
        description: "There was an error updating your task. Please try again.",
      });
    }
  };

  // ✅ **Fix: Ensure UI updates after task deletion**
  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      await fetchTasks(); // ✅ Refresh tasks after deletion
      toast({
        title: "Task deleted",
        description: "Your task has been deleted successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to delete task",
        description: "There was an error deleting your task. Please try again.",
      });
    }
  };

  // ✅ **Fix: AI prioritized tasks update properly**
  const handleGetAiPriorities = async () => {
    setIsAiLoading(true);
    try {
      const prioritizedTasks = await getAiPrioritizedTasks();
      setAiTasks(prioritizedTasks);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "AI prioritization failed",
        description: "There was an error getting AI priorities. Please try again.",
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-normal tracking-tight">Dashboard</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)} variant="outline">
          <Plus className="mr-2 h-4 w-4" /> New Task
        </Button>
      </div>
      
      <TaskStats tasks={tasks} />

      <Tabs defaultValue="all-tasks" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="all-tasks">All Tasks</TabsTrigger>
          <TabsTrigger value="ai-prioritized">AI Prioritized</TabsTrigger>
        </TabsList>

        {/* 🔹 All Tasks */}
        <TabsContent value="all-tasks" className="space-y-4">
          <Card className="border-0 shadow-none">
            <CardHeader>
              <CardTitle className="text-lg font-normal">Tasks</CardTitle>
              <CardDescription>View and manage all your tasks. Click on a task to edit it.</CardDescription>
            </CardHeader>
            <CardContent>
              <TaskList
                tasks={[...tasks]}
                isLoading={isLoading}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* 🔹 AI Prioritized Tasks */}
        <TabsContent value="ai-prioritized" className="space-y-4">
          <Card className="border-0 shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-lg font-normal">AI Prioritized Tasks</CardTitle>
                <CardDescription>Tasks prioritized by AI based on importance and urgency.</CardDescription>
              </div>
              <Button variant="outline" onClick={handleGetAiPriorities} disabled={isAiLoading}>
                {isAiLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                ) : (
                  "Refresh AI Priorities"
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <TaskList
                tasks={aiTasks}
                isLoading={isAiLoading && aiTasks.length === 0}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ✅ Fix: Pass `onCreateTask` properly */}
      <CreateTaskDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateTask={handleCreateTask}
      />
    </div>
  );
}
