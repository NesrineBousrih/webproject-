// Weekly Planner Application
// Step 3: Task Input Functionality - Create, Display, and Delete Tasks

console.log('Weekly Planner loaded successfully!');

// Data structure to store tasks for each day
let weeklyTasks = {
    sunday: [],
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: []
};

// Get all add task buttons
const addTaskButtons = document.querySelectorAll('.add-task-btn');

// Modal elements
const modal = document.getElementById('taskModal');
const modalTitle = document.getElementById('modalTitle');
const taskInput = document.getElementById('taskInput');
const cancelBtn = document.getElementById('cancelBtn');
const addBtn = document.getElementById('addBtn');

let currentDay = null; // Track which day we're adding a task to

// Add click event to each button
addTaskButtons.forEach(button => {
    button.addEventListener('click', function() {
        const dayCard = this.parentElement;
        currentDay = dayCard.getAttribute('data-day');
        
        // Update modal title
        modalTitle.textContent = `Add Task for ${capitalizeFirstLetter(currentDay)}`;
        
        // Clear input and show modal
        taskInput.value = '';
        modal.classList.add('active');
        taskInput.focus();
    });
});

// Cancel button - close modal
cancelBtn.addEventListener('click', function() {
    modal.classList.remove('active');
    currentDay = null;
});

// Add button - add task and close modal
addBtn.addEventListener('click', function() {
    const taskText = taskInput.value.trim();
    
    if (taskText !== '' && currentDay) {
        addTask(currentDay, taskText);
        renderTasks(currentDay);
        modal.classList.remove('active');
        currentDay = null;
    }
});

// Allow Enter key to submit
taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addBtn.click();
    }
});

// Close modal when clicking outside
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        modal.classList.remove('active');
        currentDay = null;
    }
});

// Function to add a task to the data structure
function addTask(day, taskText) {
    const task = {
        id: Date.now(), // Unique ID using timestamp
        text: taskText,
        completed: false
    };
    
    weeklyTasks[day].push(task);
    console.log(`Task added to ${day}:`, task);
}

// Function to render tasks for a specific day
function renderTasks(day) {
    const dayCard = document.querySelector(`[data-day="${day}"]`);
    const tasksList = dayCard.querySelector('.tasks-list');
    
    // Clear existing tasks
    tasksList.innerHTML = '';
    
    // Get tasks for this day
    const tasks = weeklyTasks[day];
    
    if (tasks.length === 0) {
        tasksList.innerHTML = '<p class="no-tasks">No tasks yet</p>';
        return;
    }
    
    // Create task elements
    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';
        if (task.completed) {
            taskElement.classList.add('completed');
        }
        
        taskElement.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
            <span class="task-text">${task.text}</span>
            <button class="delete-task-btn" data-id="${task.id}">×</button>
        `;
        
        tasksList.appendChild(taskElement);
    });
    
    // Add event listeners to checkboxes
    addCheckboxListeners(day);
    // Add event listeners to delete buttons
    addDeleteListeners(day);
}

// Function to toggle task completion
function addCheckboxListeners(day) {
    const dayCard = document.querySelector(`[data-day="${day}"]`);
    const checkboxes = dayCard.querySelectorAll('.task-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const taskId = parseInt(this.getAttribute('data-id'));
            toggleTaskCompletion(day, taskId);
            renderTasks(day);
        });
    });
}

// Function to toggle task completion status
function toggleTaskCompletion(day, taskId) {
    const task = weeklyTasks[day].find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        console.log(`Task ${taskId} completion toggled:`, task.completed);
    }
}

// Function to add delete button listeners
function addDeleteListeners(day) {
    const dayCard = document.querySelector(`[data-day="${day}"]`);
    const deleteButtons = dayCard.querySelectorAll('.delete-task-btn');
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const taskId = parseInt(this.getAttribute('data-id'));
            deleteTask(day, taskId);
            renderTasks(day);
        });
    });
}

// Function to delete a task
function deleteTask(day, taskId) {
    weeklyTasks[day] = weeklyTasks[day].filter(task => task.id !== taskId);
    console.log(`Task ${taskId} deleted from ${day}`);
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Initialize: Render all days (empty initially)
Object.keys(weeklyTasks).forEach(day => {
    renderTasks(day);
});

console.log('Task management system initialized!');