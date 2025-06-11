package com.example.taskTracker.repository;

import com.example.taskTracker.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    // Find all default tasks
    List<Task> findByDefaultTaskTrue();

    // Find tasks for specific date (not default tasks)
    List<Task> findByDateAndDefaultTaskFalse(String date);
}
