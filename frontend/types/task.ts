export type TaskPriority = "LOW" | "MEDIUM" | "HIGH"
export type TaskStatus = "TODO" | "COMPLETED"

export interface Task {
  _id: string
  title: string
  description: string
  priority: TaskPriority
  status: TaskStatus
  deadline?: Date; 
}

