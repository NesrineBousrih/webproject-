// Weekly Planner Application
// Step 2: Adding Days Structure and Basic Interactivity

console.log('Weekly Planner loaded successfully!');

// Get all add task buttons
const addTaskButtons = document.querySelectorAll('.add-task-btn');

// Add click event to each button
addTaskButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Get the parent day card
        const dayCard = this.parentElement;
        const dayName = dayCard.querySelector('h3').textContent;
        
        // Show a simple alert for now (we'll improve this in next steps)
        alert(`Add task button clicked for ${dayName}!\nTask functionality will be added in the next step.`);
    });
});

console.log('Event listeners attached to all Add Task buttons');