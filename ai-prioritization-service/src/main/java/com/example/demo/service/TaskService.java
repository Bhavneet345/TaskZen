package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.model.Task;
import com.example.demo.repository.TaskRepository;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    // AI-Based Prioritization with Priority Mapping
    public List<Task> prioritizeTasks() {
        List<Task> tasks = taskRepository.findAll();

        for (Task task : tasks) {
            long timeLeft = task.getDeadline().getTime() - System.currentTimeMillis();
            String newPriority;

            if (timeLeft < 86400000) { // Less than 1 day
                newPriority = "HIGH";
            } else if (timeLeft < 259200000) { // Less than 3 days
                newPriority = "MEDIUM";
            } else {
                newPriority = "LOW";
            }

            // Update only if priority has changed
            if (!newPriority.equals(task.getPriority())) {
                task.setPriority(newPriority);
                taskRepository.save(task);
            }
        }
        return tasks;
    }
}
