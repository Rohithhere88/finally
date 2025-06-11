package com.example.taskTracker.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private Boolean completed = false;

    // Format: "yyyy-MM-dd", e.g. "2025-06-11"
    private String date;

    // true means default task applied every day
    private Boolean defaultTask = false;

    // Constructors
    public Task() {}

    public Task(String title, String description, Boolean completed, String date, Boolean defaultTask) {
        this.title = title;
        this.description = description;
        this.completed = completed;
        this.date = date;
        this.defaultTask = defaultTask;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getCompleted() {
        return completed;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public Boolean getDefaultTask() {
        return defaultTask;
    }

    public void setDefaultTask(Boolean defaultTask) {
        this.defaultTask = defaultTask;
    }
}
