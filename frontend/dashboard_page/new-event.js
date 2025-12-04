// new-event.js

document.addEventListener('DOMContentLoaded', () => {
    const newEventForm = document.getElementById('newEventForm');

    if (newEventForm) {
        newEventForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic Form Validation (Client-Side)
            const startTime = new Date(document.getElementById('start_time').value);
            const endTime = new Date(document.getElementById('end_time').value);

            if (startTime >= endTime) {
                alert('Error: End Date & Time must be later than Start Date & Time.');
                return; // Stop submission
            }

            // 1. Collect Form Data
            const formData = new FormData(newEventForm);
            
            // Convert FormData to a readable object for console log (optional)
            const eventData = {};
            for (let [key, value] of formData.entries()) {
                eventData[key] = value;
            }

            // 2. Placeholder for Backend Submission (AJAX/Fetch)
            console.log('Attempting to create event with data:', eventData);
            
            // --- DEMO Success Simulation ---
            // In a real application, you would replace this block with an actual fetch/AJAX call
            // that inserts the data into your database.
            
            alert('Event "' + eventData.title + '" submitted successfully for approval! (Demo mode)');
            
            // Redirect to the Events page on successful submission
            setTimeout(() => {
                window.location.href = 'events.html'; 
            }, 500);
            
        });
    }
});

// NOTE: You would need a separate common.js for the sidebar functionality
// to avoid repeating it on every page, or include that logic here.