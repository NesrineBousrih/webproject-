// Weekly Planner Application
// Step 3: Task Input Functionality - Create, Display, and Delete Tasks

console.log('Weekly Planner loaded successfully!');

// Data structure to store tasks for each day
let weeklyTasks = {
    weekend: [],
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: []
};

// Data structure for habits
let habits = [];

// Days of the week for habit tracker
const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

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
        taskInput.placeholder = 'Enter your task...';
        modal.classList.add('active');
        modal.dataset.mode = 'task';
        taskInput.focus();
    });
});

// Cancel button - close modal
cancelBtn.addEventListener('click', function() {
    modal.classList.remove('active');
    modal.dataset.mode = '';
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
        modal.dataset.mode = '';
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

// ==================================
// HABIT TRACKER FUNCTIONALITY
// ==================================

const addHabitBtn = document.getElementById('addHabitBtn');
const habitsList = document.getElementById('habitsList');

// Add Habit Button Click
addHabitBtn.addEventListener('click', function() {
    modalTitle.textContent = 'Add New Habit';
    taskInput.placeholder = 'Enter habit name (e.g., Drink Water, Exercise)';
    taskInput.value = '';
    modal.classList.add('active');
    taskInput.focus();
    
    // Change modal behavior to add habit instead of task
    modal.dataset.mode = 'habit';
});

// Update the Add Button click handler to support both tasks and habits
addBtn.addEventListener('click', function() {
    const inputText = taskInput.value.trim();
    
    if (inputText === '') return;
    
    // Check if we're adding a habit or a task
    if (modal.dataset.mode === 'habit') {
        addHabit(inputText);
        renderHabits();
    } else if (currentDay) {
        addTask(currentDay, inputText);
        renderTasks(currentDay);
        currentDay = null;
    }
    
    modal.classList.remove('active');
    modal.dataset.mode = '';
});

// Function to add a habit
function addHabit(habitName) {
    const habit = {
        id: Date.now(),
        name: habitName,
        days: [false, false, false, false, false, false, false] // 7 days, all unchecked
    };
    
    habits.push(habit);
    console.log('Habit added:', habit);
}

// Function to render all habits
function renderHabits() {
    if (habits.length === 0) {
        habitsList.innerHTML = '<p class="no-habits">No habits yet. Start tracking your progress!</p>';
        return;
    }
    
    habitsList.innerHTML = '';
    
    habits.forEach(habit => {
        const habitRow = document.createElement('div');
        habitRow.className = 'habit-row';
        
        let daysHTML = '';
        habit.days.forEach((checked, index) => {
            daysHTML += `
                <div class="habit-day-checkbox ${checked ? 'checked' : ''}" 
                     data-habit-id="${habit.id}" 
                     data-day-index="${index}">
                </div>
            `;
        });
        
        habitRow.innerHTML = `
            <span class="habit-name">${habit.name}</span>
            <div class="habit-days">
                ${daysHTML}
            </div>
            <button class="delete-habit-btn" data-habit-id="${habit.id}">×</button>
        `;
        
        habitsList.appendChild(habitRow);
    });
    
    // Add event listeners to checkboxes
    addHabitCheckboxListeners();
    // Add event listeners to delete buttons
    addHabitDeleteListeners();
}

// Function to add checkbox listeners for habits
function addHabitCheckboxListeners() {
    const checkboxes = document.querySelectorAll('.habit-day-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('click', function() {
            const habitId = parseInt(this.getAttribute('data-habit-id'));
            const dayIndex = parseInt(this.getAttribute('data-day-index'));
            
            toggleHabitDay(habitId, dayIndex);
            renderHabits();
        });
    });
}

// Function to toggle a habit day
function toggleHabitDay(habitId, dayIndex) {
    const habit = habits.find(h => h.id === habitId);
    if (habit) {
        habit.days[dayIndex] = !habit.days[dayIndex];
        console.log(`Habit ${habitId} day ${dayIndex} toggled:`, habit.days[dayIndex]);
    }
}

// Function to add delete listeners for habits
function addHabitDeleteListeners() {
    const deleteButtons = document.querySelectorAll('.delete-habit-btn');
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const habitId = parseInt(this.getAttribute('data-habit-id'));
            deleteHabit(habitId);
            renderHabits();
        });
    });
}

// Function to delete a habit
function deleteHabit(habitId) {
    habits = habits.filter(habit => habit.id !== habitId);
    console.log(`Habit ${habitId} deleted`);
}

// Initialize habits
renderHabits();

console.log('Task management system initialized!');