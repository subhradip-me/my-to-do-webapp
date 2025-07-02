const addButton = document.querySelector(".add-btn");
const titleInput = document.querySelector(".title");
const descInput = document.querySelector(".description");
const dateInput = document.querySelector(".due-date");
const priorityInput = document.querySelector(".priority");
const taskGrid = document.querySelector(".task-grid");
const addTaskBtn = document.querySelector(".task-add-btn");
const addTaskForm = document.querySelector(".form-container");


// Modern calendar date in header
function setCurrentDate() {
  const dateElem = document.getElementById('current-date');
  if (!dateElem) return;
  const today = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  dateElem.textContent = today.toLocaleDateString(undefined, options);
}
setCurrentDate();



let isFormVisible = false;
 // default form state

function createTaskCard(title, desc, date, priority, saveToStorage = true, completed = false, addedAt = new Date().toLocaleString()) {
  const card = document.createElement("div");
  card.className = "task-card";
  if (completed) card.classList.add("completed");

  card.innerHTML = `
    <div class="card-header">
      <div class="header-inner-container">
        <p class="task-added">Added: ${addedAt}</p>
        <div class="task-actions">
         <button class="edit">
          <img src="icons/pencil-line.png" alt="Edit Task" />
         </button>
         <button class="del">
          <img src="icons/delete-bin-6-line.png" alt="Delete Task" />
         </button>
        </div> 
      </div>
      <h3 class="task-title">${title}</h3>
    </div>
    <p class="task-desc">${desc}</p>
    <div class="card-footer">
      <span class="task-date">Due: ${date}</span>
      <div class="footer-inner-container">
        <span class="task-priority">Priority: ${priority}</span>
        <button class="done">${completed ? "Undo" : "Done"}</button>
      </div>
    </div>
  `;

  const priorityColor = {
    high: "white",
    medium: "white",
    low: "white"
  };
  const priorityBackgroundColor = {
    high: "#FF0B55",
    medium: "orange",
    low: "#A0C878"
  };

  const prioritySpan = card.querySelector(".task-priority");
  const priorityKey = priority.trim().toLowerCase();

  prioritySpan.style.color = priorityColor[priorityKey] || "green";
  prioritySpan.style.backgroundColor = priorityBackgroundColor[priorityKey] || "#fff";

  card.style.backgroundColor =
    priority === "high" ? "#FFF" :
    priority === "medium" ? "#FFF" :
    priority === "low" ? "#FFF" : "";

  card.querySelector(".del").addEventListener("click", () => {
    if (confirm("Are you sure you want to delete this task?")) {
      card.remove();
      deleteTaskFromStorage(title, date);
    }
  });

  card.querySelector(".done").addEventListener("click", (e) => {
    card.classList.toggle("completed");
    const isCompleted = card.classList.contains("completed");
    e.target.textContent = isCompleted ? "Undo" : "Done";
    updateTaskStatus(title, date, isCompleted);
  });

  card.querySelector(".edit").addEventListener("click", () => {
    titleInput.value = title;
    descInput.value = desc;
    dateInput.value = date;
    priorityInput.value = priority;
    card.remove();
    deleteTaskFromStorage(title, date);

    toggleAddTaskForm(true);
  });

  taskGrid.appendChild(card);

  if (saveToStorage) {
    saveTaskToStorage({ title, desc, date, priority, completed, addedAt });
  }
}

function toggleAddTaskForm(show = null) {
  if (show !== null) {
    isFormVisible = show;
  } else {
    isFormVisible = !isFormVisible;
  }

  addTaskForm.style.display = isFormVisible ? "block" : "none";
  addTaskBtn.textContent = isFormVisible ? "x" : "+";
  // Update header toggle icon if present
  const toggleIcon = document.getElementById("toggle-icon");
  if (toggleIcon) {
    toggleIcon.textContent = isFormVisible ? "×" : "+";
  }
}


function saveTaskToStorage(task) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteTaskFromStorage(title, date) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter(task => !(task.title === title && task.date === date));
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTaskStatus(title, date, completed) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.map(task => {
    if (task.title === title && task.date === date) {
      return { ...task, completed };
    }
    return task;
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

addButton.addEventListener("click", () => {
  const title = titleInput.value.trim();
  const desc = descInput.value.trim();
  const date = dateInput.value.trim();
  const priority = priorityInput.value;

  if (!title || !desc || !date || !priority) {
    alert("Please fill in all fields.");
    return;
  }

  createTaskCard(title, desc, date, priority, true, false);

  titleInput.value = "";
  descInput.value = "";
  dateInput.value = "";
  priorityInput.selectedIndex = 0;

  toggleAddTaskForm(false);
});

// Load saved tasks on page load
window.addEventListener("DOMContentLoaded", () => {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => {
    createTaskCard(task.title, task.desc, task.date, task.priority, false, task.completed, task.addedAt);
  });
});
