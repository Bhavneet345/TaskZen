"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CheckCircle2, Circle, Clock, MoreHorizontal, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
import type { Task } from "@/types/task";
import { EditTaskDialog } from "@/components/edit-task-dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onUpdateTask: (task: Task) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
}

export function TaskList({ tasks, isLoading, onUpdateTask, onDeleteTask }: TaskListProps) {
  console.log("🚀 TaskList Rendering - Tasks Received:", tasks);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // ✅ Toggle Task Status Instantly in UI
  const handleStatusToggle = async (task: Task) => {
    try {
      const newStatus = task.status === "COMPLETED" ? "TODO" : "COMPLETED";
      const token = localStorage.getItem("token");

      if (!token) throw new Error("Authentication required");

      // 🔹 Optimistically update UI
      await onUpdateTask({ ...task, status: newStatus });

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks/${task._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update task");
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  // ✅ Handle Task Editing
  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsEditDialogOpen(true);
  };

  // ✅ Handle Task Deletion with Real-Time UI Update
  const handleDeleteTask = (task: Task) => {
    setTaskToDelete(task);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required");

      // 🔹 **Optimistically Remove Task from UI**
      const deletedTaskId = taskToDelete._id;
      onDeleteTask(deletedTaskId); // **Remove from state immediately**
      setIsDeleteDialogOpen(false);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks/${deletedTaskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete task");
    } catch (error) {
      console.error("Error deleting task:", error);
      setTaskToDelete(null);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-priority-high text-white";
      case "MEDIUM":
        return "bg-priority-medium text-white";
      case "LOW":
        return "bg-priority-low text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex animate-pulse items-center justify-between rounded-md border p-4">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 rounded-full bg-muted"></div>
              <div className="h-4 w-48 rounded bg-muted"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-16 rounded bg-muted"></div>
              <div className="h-8 w-8 rounded bg-muted"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task._id}
          className={cn(
            "flex items-center justify-between rounded-md border p-4 transition-colors",
            task.status === "COMPLETED" && "bg-muted/30",
          )}
        >
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 rounded-full p-0"
              onClick={() => handleStatusToggle(task)}
            >
              {task.status === "COMPLETED" ? (
                <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
              <span className="sr-only">Toggle status</span>
            </Button>
            <div className={cn("flex flex-col", task.status === "COMPLETED" && "text-muted-foreground")}>
              <span className={cn("font-medium", task.status === "COMPLETED" && "line-through")}>{task.title}</span>
              {task.description && (
                <span className="text-sm text-muted-foreground line-clamp-1">{task.description}</span>
              )}
              {task.deadline && (
                <div className="mt-1 flex items-center text-xs text-muted-foreground">
                  <Clock className="mr-1 h-3 w-3" />
                  <span>Due {format(new Date(task.deadline), "MMM d, yyyy")}</span>
                </div>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEditTask(task)}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteTask(task)} className="text-red-500">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}

      {taskToEdit && (
        <EditTaskDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onUpdateTask={onUpdateTask}
          task={taskToEdit}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
