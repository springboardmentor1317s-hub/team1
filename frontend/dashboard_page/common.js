// common.js

document.addEventListener('DOMContentLoaded', () => {
    // Logic for setting the active class in the sidebar navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        // If the item's URL matches the current page's URL, make it active
        if (item.href === window.location.href) {
            navItems.forEach(n => n.classList.remove('active')); // Remove from all first
            item.classList.add('active'); // Set active class on current page link
        }
    });

    // Basic Logout Button functionality
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            alert('Logging out...');
            // In a real application, you would handle session clearing and redirection here
            // window.location.href = 'login.html'; 
        });
    }
});