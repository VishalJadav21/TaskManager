// Global task management functions
let tasks = [];

function toggleTask(index) {
    if (index >= 0 && index < tasks.length) {
        tasks[index].completed = !tasks[index].completed;
        renderTasks();
    }
}

function deleteTask(index) {
    if (index >= 0 && index < tasks.length) {
        tasks.splice(index, 1);
        renderTasks();
    }
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    if (!taskList) {
        console.error('Task list element not found');
        return;
    }

    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.classList.add('task-item');
        if (task.completed) li.classList.add('completed');

        // Create checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTask(index));

        // Create task text span
        const taskSpan = document.createElement('span');
        taskSpan.innerHTML = `${task.text} <small>(Due: ${formatDate(task.date)})</small>`;

        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => deleteTask(index));

        // Assemble task item
        li.appendChild(checkbox);
        li.appendChild(taskSpan);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
    });

    // Save to local storage
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Format date to be more readable
function formatDate(dateString) {
    try {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const taskDate = document.getElementById('taskDate');
    const addTaskBtn = document.getElementById('addTaskBtn');

    // Load tasks from local storage
    tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Set min date to today
    const today = new Date().toISOString().split('T')[0];
    taskDate.setAttribute('min', today);

    addTaskBtn.addEventListener('click', () => {
        const text = taskInput.value.trim();
        const date = taskDate.value;

        if (text && date) {
            tasks.push({
                text: text,
                date: date,
                completed: false,
                createdAt: new Date().toISOString()
            });

            // Sort tasks by date
            tasks.sort((a, b) => new Date(a.date) - new Date(b.date));

            taskInput.value = '';
            taskDate.value = '';
            renderTasks();
        } else {
            alert('Please enter a task and select a date');
        }
    });

    // Initial render
    renderTasks();
});
