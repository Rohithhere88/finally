package com.example.taskTracker.controller;

import com.example.taskTracker.model.Task;
import com.example.taskTracker.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:3000")  // Adjust if frontend runs elsewhere
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    // Get all tasks (for testing or admin)
    @GetMapping
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // Get tasks for a specific date
    @GetMapping("/date/{date}")
    public List<Task> getTasksByDate(@PathVariable String date) {
        List<Task> defaultTasks = taskRepository.findByDefaultTaskTrue();
        List<Task> dateTasks = taskRepository.findByDateAndDefaultTaskFalse(date);

        List<Task> allTasks = new ArrayList<>();
        allTasks.addAll(defaultTasks);
        allTasks.addAll(dateTasks);

        return allTasks;
    }

    // Create a task (can be default or date-specific)
    @PostMapping
    public Task createTask(@RequestBody Task task) {
        // Validate date if defaultTask == false
        if (Boolean.FALSE.equals(task.getDefaultTask()) && (task.getDate() == null || task.getDate().isEmpty())) {
            throw new IllegalArgumentException("Date is required for non-default tasks");
        }
        return taskRepository.save(task);
    }

    // Update task (including toggling completed)
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task taskDetails) {
        Optional<Task> optionalTask = taskRepository.findById(id);
        if (optionalTask.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Task task = optionalTask.get();
        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());
        task.setCompleted(taskDetails.getCompleted());
        task.setDate(taskDetails.getDate());
        task.setDefaultTask(taskDetails.getDefaultTask());

        Task updatedTask = taskRepository.save(task);
        return ResponseEntity.ok(updatedTask);
    }

    // Delete a task
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        if (!taskRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        taskRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
