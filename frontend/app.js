const API_URL = "https://cct0jf8jt5.execute-api.us-east-1.amazonaws.com";

let tasks = [];

async function loadTasks() {
  const loadingState = document.getElementById("loadingState");
  const emptyState = document.getElementById("emptyState");

  loadingState.style.display = "block";
  emptyState.style.display = "none";

  try {
    const response = await fetch(`${API_URL}/tasks`);

    if (!response.ok) {
      throw new Error("Failed to load tasks");
    }

    tasks = await response.json();
    renderTasks();
    updateStats();
  } catch (error) {
    console.error("Error loading tasks:", error);
    alert("Failed to load tasks from AWS");
  } finally {
    loadingState.style.display = "none";
  }
}

async function addTask() {
  const input = document.getElementById("taskInput");
  const taskText = input.value.trim();

  if (taskText === "") {
    alert("Please enter a task");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: taskText
      })
    });

    if (!response.ok) {
      throw new Error("Failed to add task");
    }

    input.value = "";
    await loadTasks();
  } catch (error) {
    console.error("Error adding task:", error);
    alert("Failed to add task");
  }
}

async function toggleTask(taskId, completed) {
  try {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        completed: !completed
      })
    });

    if (!response.ok) {
      throw new Error("Failed to update task");
    }

    await loadTasks();
  } catch (error) {
    console.error("Error updating task:", error);
    alert("Failed to update task");
  }
}

async function deleteTask(taskId) {
  try {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error("Failed to delete task");
    }

    await loadTasks();
  } catch (error) {
    console.error("Error deleting task:", error);
    alert("Failed to delete task");
  }
}

function renderTasks() {
  const taskList = document.getElementById("taskList");
  const emptyState = document.getElementById("emptyState");

  taskList.innerHTML = "";

  if (tasks.length === 0) {
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";

  tasks
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .forEach(task => {
      const li = document.createElement("li");
      li.className = `task-item ${task.completed ? "completed" : ""}`;

      const createdAt = task.createdAt
        ? new Date(task.createdAt).toLocaleString()
        : "No date available";

      li.innerHTML = `
        <div>
          <span class="task-title">${escapeHTML(task.title)}</span>
          <span class="task-date">Created: ${createdAt}</span>
        </div>

        <div class="actions">
          <button class="done-btn" onclick="toggleTask('${task.taskId}', ${task.completed})">
            ${task.completed ? "Undo" : "Done"}
          </button>
          <button class="delete-btn" onclick="deleteTask('${task.taskId}')">
            Delete
          </button>
        </div>
      `;

      taskList.appendChild(li);
    });
}

function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const pending = total - completed;

  document.getElementById("totalTasks").textContent = total;
  document.getElementById("completedTasks").textContent = completed;
  document.getElementById("pendingTasks").textContent = pending;
}

function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

loadTasks();
