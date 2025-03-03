"use client";

import { useState, useEffect } from "react";
import type { Task } from "@/types/task";

export function useTaskService() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  // 🔹 Fetch Tasks from Backend
  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      setError(null); // ✅ Reset error before fetching new data

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("❌ Authentication required. Please log in.");
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks`, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Ensure JWT token is included
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`❌ Failed to fetch tasks: ${errorData.error || res.statusText}`);
      }

      const data = await res.json();
      setTasks(data); // ✅ Update tasks state with response data
    } catch (err) {
      console.error("❌ Error Fetching Tasks:", err);

      // ✅ Ensure `setError` receives an Error object, not a string
      setError(err instanceof Error ? err : new Error("An unexpected error occurred"));
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Create a New Task (Instant UI Update)
  const createTask = async (taskData: Omit<Task, "_id">) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("❌ Authentication required.");
  
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks`, { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`❌ Task creation failed: ${errorData.error || "Unknown error"}`);
      }
  
      const newTask = await res.json();
      console.log("✅ New Task Created:", newTask);
  
      // ✅ Ensure React triggers a re-render by returning a **new array reference**
      setTasks((prevTasks) => {
        const updatedTasks = [...prevTasks, newTask];
        console.log("✅ Updated Task List in State:", updatedTasks);
        return JSON.parse(JSON.stringify(updatedTasks)); // 🔥 Returning a new array reference to force re-render
      });
  
      return newTask;
    } catch (error) {
      console.error("❌ Error creating task:", error);
      throw error;
    }
  };  

  // 🔹 Update a Task (Instant UI Update)
  const updateTask = async (task: Task): Promise<Task> => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks/${task._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(task),
      });

      if (!res.ok) throw new Error("Task update failed");

      const updatedTask = await res.json();

      // ✅ **Ensure real-time update in UI**
      setTasks((prevTasks) => prevTasks.map((t) => (t._id === task._id ? updatedTask : t)));

      return updatedTask;
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  };

  // 🔹 Delete a Task (Instant UI Update)
  const deleteTask = async (taskId: string): Promise<void> => {
    try {
      if (!taskId) {
        throw new Error("Invalid task ID");
      }

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required. Please log in.");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Task deletion failed: ${errorData.error}`);
      }

      console.log("Task deleted successfully");

      // ✅ **Ensure real-time update in UI**
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  };

  // 🔹 Get AI Prioritized Tasks (Instant UI Update)
  const getAiPrioritizedTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks/prioritize`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch AI-prioritized tasks");

      const prioritizedTasks = await res.json();

      // ✅ **Ensure real-time update in UI**
      setTasks(prioritizedTasks);

      return prioritizedTasks;
    } catch (error) {
      console.error("Error fetching AI-prioritized tasks:", error);
      throw error;
    }
  };

  return {
    tasks,
    setTasks,
    isLoading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    getAiPrioritizedTasks,
  };
}
