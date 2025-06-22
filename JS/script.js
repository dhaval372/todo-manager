// ========== Global Variables ==========
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// ========== DOM Elements ==========
const taskList = document.getElementById("taskList");
const taskText = document.getElementById("taskText");
const taskDate = document.getElementById("taskDate");
const taskPriority = document.getElementById("taskPriority");
const addTaskBtn = document.getElementById("addTaskBtn");
const filterButtons = document.querySelectorAll(".filters button");

// ========== Event Listeners ==========
addTaskBtn.addEventListener("click", addTask);
filterButtons.forEach((btn) =>
  btn.addEventListener("click", () => applyFilter(btn.dataset.filter))
);

// ========== Functions ==========

// Add a new task
function addTask() {
  const text = taskText.value.trim();
  const date = taskDate.value;
  const priority = taskPriority.value;

  if (!text) return alert("Please enter a task");

  const newTask = {
    id: Date.now(),
    text,
    date,
    priority,
    completed: false,
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  clearInputs();
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render tasks based on current filters
function renderTasks() {
  taskList.innerHTML = "";

  const filteredTasks = filterTasks();

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = `task-item flex justify-between items-center p-3 rounded bg-gray-100 ${task.completed ? "line-through bg-green-100" : ""}`;
    li.setAttribute("data-id", task.id);

    li.innerHTML = `
      <div>
        <strong>${task.text}</strong><br />
        <small>Due: ${task.date || "None"}, Priority: ${task.priority}</small>
      </div>
      <div class="space-x-2">
        <button class="complete-btn bg-green-500 text-white px-2 py-1 rounded">✔</button>
        <button class="delete-btn bg-red-500 text-white px-2 py-1 rounded">🗑️</button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

// Event delegation for complete and delete buttons
taskList.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  const taskId = Number(li?.getAttribute("data-id"));

  if (e.target.classList.contains("complete-btn")) {
    toggleComplete(taskId);
  } else if (e.target.classList.contains("delete-btn")) {
    deleteTask(taskId);
  }
});

// Clear input fields after adding
function clearInputs() {
  taskText.value = "";
  taskDate.value = "";
  taskPriority.value = "medium";
}

// Toggle task completed state
function toggleComplete(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

// Delete task
function deleteTask(id) {
  if (!confirm("Delete this task?")) return;
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

// Set current filter
function applyFilter(filter) {
  currentFilter = filter;
  renderTasks();
}

// Filter tasks based on currentFilter
function filterTasks() {
  switch (currentFilter) {
    case "completed":
      return tasks.filter((task) => task.completed);
    case "pending":
      return tasks.filter((task) => !task.completed);
    case "due-today":
      const today = new Date().toISOString().split("T")[0];
      return tasks.filter((task) => task.date === today);
    case "priority-high":
      return tasks.filter((task) => task.priority === "high");
    case "priority-low":
      return tasks.filter((task) => task.priority === "low");
    default:
      return tasks;
  }
}

// Initial render
renderTasks();