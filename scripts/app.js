const taskInput = document.getElementById("task-title");
const taskDescriptionInput = document.getElementById("task-description");
const categorySelect = document.getElementById("task-category");
const dueDateInput = document.getElementById("task-due-date");
const prioritySelect = document.getElementById("task-priority");
const taskList = document.getElementById("tasks");
const themeToggle = document.getElementById("theme-toggle");
const searchInput = document.getElementById("search-tasks");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function addTask() {
  const title = taskInput.value.trim();
  const description = taskDescriptionInput.value.trim();
  const category = categorySelect.value;
  const dueDate = dueDateInput.value;
  const priority = prioritySelect.value;

  if (title) {
    const task = {
      id: Date.now(),
      title,
      description,
      category,
      dueDate,
      priority,
      completed: false,
    };
    tasks.push(task);
    saveTasks();
    updateTaskList();
    clearInputs();
  }
}

function updateTaskList() {
  const filter = searchInput.value.toLowerCase();
  taskList.innerHTML = "";
  tasks
    .filter(
      (task) =>
        task.title.toLowerCase().includes(filter) ||
        task.description.toLowerCase().includes(filter)
    )
    .forEach((task) => {
      const taskItem = document.createElement("li");
      taskItem.innerHTML = `
        <span>${task.title} (${task.category})</span>
        <span>Due: ${task.dueDate || "N/A"}</span>
        <span>Priority: ${task.priority}</span>
      `;
      if (task.completed) {
        taskItem.classList.add("completed");
      }

      taskItem.addEventListener("click", () => toggleTaskCompletion(task.id));

      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.addEventListener("click", (e) => {
        e.stopPropagation();
        editTask(task.id);
      });

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteTask(task.id);
      });

      taskItem.appendChild(editButton);
      taskItem.appendChild(deleteButton);
      taskList.appendChild(taskItem);
    });
}

function toggleTaskCompletion(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    updateTaskList();
  }
}

function deleteTask(taskId) {
  tasks = tasks.filter((t) => t.id !== taskId);
  saveTasks();
  updateTaskList();
}

function editTask(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    taskInput.value = task.title;
    taskDescriptionInput.value = task.description;
    categorySelect.value = task.category;
    dueDateInput.value = task.dueDate;
    prioritySelect.value = task.priority;
    deleteTask(taskId);
  }
}

function clearInputs() {
  taskInput.value = "";
  taskDescriptionInput.value = "";
  dueDateInput.value = "";
  prioritySelect.value = "Low";
}

function toggleTheme() {
  document.body.classList.toggle("dark");
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function sortTasksByDate() {
  tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  updateTaskList();
}

function sortTasksByPriority() {
  const priorityOrder = { High: 1, Medium: 2, Low: 3 };
  tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  updateTaskList();
}

document.getElementById("add-task").addEventListener("click", addTask);
themeToggle.addEventListener("click", toggleTheme);
searchInput.addEventListener("input", updateTaskList);
document
  .getElementById("sort-tasks-date")
  .addEventListener("click", sortTasksByDate);
document
  .getElementById("sort-tasks-priority")
  .addEventListener("click", sortTasksByPriority);

updateTaskList();
