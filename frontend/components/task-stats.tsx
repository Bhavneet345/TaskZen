"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Task } from "@/types/task"
import { CheckCircle, Clock, ListChecks } from "lucide-react"

interface TaskStatsProps {
  tasks: Task[]
}

export function TaskStats({ tasks }: TaskStatsProps) {
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.status === "COMPLETED").length
  const pendingTasks = totalTasks - completedTasks

  // Calculate tasks due today
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const dueTodayTasks = tasks.filter((task) => {
    if (!task.deadline) return false
    const dueDate = new Date(task.deadline)
    dueDate.setHours(0, 0, 0, 0)
    return dueDate.getTime() === today.getTime() && task.status !== "COMPLETED"
  }).length

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="border-0 shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-normal">Total Tasks</CardTitle>
          <ListChecks className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTasks}</div>
          <p className="text-xs text-muted-foreground">
            {completedTasks} completed, {pendingTasks} pending
          </p>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-normal">Completed</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedTasks}</div>
          <p className="text-xs text-muted-foreground">
            {totalTasks > 0 ? `${Math.round((completedTasks / totalTasks) * 100)}% of all tasks` : "No tasks yet"}
          </p>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-normal">Due Today</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dueTodayTasks}</div>
          <p className="text-xs text-muted-foreground">Tasks that need your attention today</p>
        </CardContent>
      </Card>
    </div>
  )
}

