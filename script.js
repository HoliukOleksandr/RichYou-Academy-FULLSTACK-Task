let data = {
    categories: {
        "DESIGN": [
            { text: "Create icons for a dashboard", done: false },
            { text: "Plan your meal", done: false },
            { text: "Prepare a design presentation", done: false }
        ],
        "PERSONAL": [
            { text: "Review daily goals before sleeping. Add some new if time permits", done: false },
            { text: "Stretch for 15 minutes", done: false }
        ],
        "HOUSE": [
            { text: "Water indoor plants", done: false }
        ]
    }
};

// Load from localStorage
if (localStorage.getItem("todoData")) {
    data = JSON.parse(localStorage.getItem("todoData"));
}

// Save to localStorage
function saveData() {
    localStorage.setItem("todoData", JSON.stringify(data));
}

// Global drag info
let dragged = null;
let draggedCategory = null;
let draggedIndex = null;

// Render UI
function render() {
    const container = document.getElementById("task-sections");
    container.innerHTML = "";

    for (const [category, tasks] of Object.entries(data.categories)) {
        // Category title (editable)
        const title = document.createElement("div");
        title.className = "section-title";
        title.textContent = category;
        title.ondblclick = () => editCategory(title, category);
        container.appendChild(title);

        // Tasks
        tasks.forEach((task, idx) => {
            const taskDiv = document.createElement("div");
            taskDiv.className = "task";
            if (task.done) taskDiv.classList.add("completed");

            // Enable drag
            taskDiv.setAttribute("draggable", "true");
            taskDiv.ondragstart = (e) => {
                dragged = taskDiv;
                draggedCategory = category;
                draggedIndex = idx;
                setTimeout(() => taskDiv.classList.add("dragging"), 0);
            };
            taskDiv.ondragend = () => {
                taskDiv.classList.remove("dragging");
                dragged = null;
                draggedCategory = null;
                draggedIndex = null;
            };

            // Allow drop
            taskDiv.ondragover = (e) => {
                e.preventDefault();
                taskDiv.classList.add("drop-target");
            };
            taskDiv.ondragleave = () => {
                taskDiv.classList.remove("drop-target");
            };
            taskDiv.ondrop = (e) => {
                e.preventDefault();
                taskDiv.classList.remove("drop-target");

                if (draggedCategory !== null) {
                    const taskList = data.categories[draggedCategory];
                    const [movedTask] = taskList.splice(draggedIndex, 1);

                    // Insert before dropped element
                    const dropIndex = Array.from(taskDiv.parentNode.children).indexOf(taskDiv) - 1; // -1 because title is also in children
                    data.categories[category].splice(dropIndex, 0, movedTask);

                    saveData();
                    render();
                }
            };

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.done;
            checkbox.onchange = () => toggleTask(category, idx, checkbox);

            const label = document.createElement("label");
            label.textContent = task.text;

            taskDiv.appendChild(checkbox);
            taskDiv.appendChild(label);
            container.appendChild(taskDiv);
        });
    }
}

// Toggle task done state
function toggleTask(category, idx, checkbox) {
    data.categories[category][idx].done = checkbox.checked;
    saveData();
    render();
}

// Add new task to first category
function addTask() {
    const input = document.getElementById("newTaskInput");
    const value = input.value.trim();
    if (!value) return;

    const firstCategory = Object.keys(data.categories)[0];
    data.categories[firstCategory].push({ text: value, done: false });

    input.value = "";
    saveData();
    render();
}

// Edit category name
function editCategory(titleElement, oldName) {
    const input = document.createElement("input");
    input.type = "text";
    input.value = oldName;

    titleElement.replaceWith(input);
    input.focus();

    const save = () => {
        const newName = input.value.trim() || oldName;
        if (newName !== oldName) {
            data.categories[newName] = data.categories[oldName];
            delete data.categories[oldName];
            saveData();
        }
        render();
    };

    input.onblur = save;
    input.onkeydown = (e) => {
        if (e.key === "Enter") save();
    };
}

// Initial render
render();
