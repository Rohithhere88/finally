import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";

const API_URL = "http://localhost:8080/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [defaultTask, setDefaultTask] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatDate = (date) => date.toISOString().split("T")[0];

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const dateStr = formatDate(selectedDate);
      const res = await axios.get(`${API_URL}/date/${dateStr}`);
      setTasks(res.data);
    } catch (err) {
      setError("Failed to fetch tasks.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required");
      return;
    }
    setLoading(true);
    setError(null);

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      completed: false,
      defaultTask,
      date: defaultTask ? null : formatDate(selectedDate),
    };

    try {
      await axios.post(API_URL, taskData);
      setTitle("");
      setDescription("");
      setDefaultTask(false);
      if (defaultTask) {
        setSelectedDate(new Date());
      }
      fetchTasks();
    } catch (err) {
      setError("Failed to create task.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t))
    );
    try {
      await axios.put(`${API_URL}/${task.id}`, {
        ...task,
        completed: !task.completed,
      });
    } catch (err) {
      setError("Failed to update task.");
      console.error(err);
      fetchTasks();
    }
  };

  const deleteTask = async (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (err) {
      setError("Failed to delete task.");
      console.error(err);
      fetchTasks();
    }
  };

  return (
    <div className="app" role="main" aria-label="Luxury Task Tracker">
      <h1>Task Tracker</h1>

      <div className="date-picker-container">
        <label htmlFor="datePicker">Select Date:</label>
        <DatePicker
          id="datePicker"
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          maxDate={new Date(2100, 11, 31)}
          disabled={loading}
          className="date-picker-input"
          calendarClassName="calendar-style"
        />
      </div>

      <form className="form" onSubmit={createTask} noValidate>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          aria-required="true"
          className="input-field"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
          aria-required="true"
          className="input-field"
        />
        <label className="default-task-label" htmlFor="defaultTaskCheck">
          <input
            id="defaultTaskCheck"
            type="checkbox"
            checked={defaultTask}
            onChange={(e) => setDefaultTask(e.target.checked)}
            disabled={loading}
          />
          Default Task (applies every day)
        </label>
        <button
          type="submit"
          disabled={loading || !title.trim() || !description.trim()}
          aria-label="Add Task"
          className="btn-add"
        >
          {loading ? "Processing..." : "Add Task"}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {loading && tasks.length === 0 ? (
        <p className="loading-message">Loading tasks...</p>
      ) : (
        <ul className="task-list" aria-live="polite">
          {tasks.length === 0 && <p>No tasks for this date.</p>}
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`task-item ${task.completed ? "completed" : ""}`}
              aria-checked={task.completed}
              role="checkbox"
              tabIndex={0}
            >
              <div className="task-content">
                <strong className="task-title">{task.title}</strong>
                <p className="task-desc">{task.description}</p>
                {task.defaultTask && (
                  <small className="default-tag">Default</small>
                )}
              </div>
              <div className="actions">
                <button
                  onClick={() => toggleTask(task)}
                  aria-label={
                    task.completed
                      ? `Mark task "${task.title}" as incomplete`
                      : `Mark task "${task.title}" as complete`
                  }
                  disabled={loading}
                  className="btn-done"
                >
                  {task.completed ? "Undo" : "Done"}
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  aria-label={`Delete task "${task.title}"`}
                  disabled={loading}
                  className="btn-delete"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
