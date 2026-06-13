const API_URL = "https://cct0jf8jt5.execute-api.us-east-1.amazonaws.com";

let tasks = [];

async function loadTasks() {
  try {
    const response = await fetch(`${API_URL}/tasks`);
    tasks = await response.json();
    renderTasks();
  } catch (error) {
    console.error("Error loading tasks:", error);
    alert("Failed to load tasks from the server");
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
    await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: taskText
      })
    });

    input.value = "";
    loadTasks();
  } catch (error) {
    console.error("Error adding task:", error);
    alert("Failed to add task");
  }
}

async function toggleTask(taskId, completed) {
  try {
    await fetch(`${API_URL}/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        completed: !completed
      })
    });

    loadTasks();
  } catch (error) {
    console.error("Error updating task:", error);
    alert("Failed to update task");
  }
}

async function deleteTask(taskId) {
  try {
    await fetch(`${API_URL}/tasks/${taskId}`, {
      method: "DELETE"
    });

    loadTasks();
  } catch (error) {
    console.error("Error deleting task:", error);
    alert("Failed to delete task");
  }
}

function renderTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span style="text-decoration: ${task.completed ? "line-through" : "none"}">
        ${task.title}
      </span>
      <div>
        <button onclick="toggleTask('${task.taskId}', ${task.completed})">
          ${task.completed ? "Undo" : "Done"}
        </button>
        <button onclick="deleteTask('${task.taskId}')">Delete</button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

loadTasks();
