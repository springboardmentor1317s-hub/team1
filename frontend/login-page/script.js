document.addEventListener('DOMContentLoaded', function() {
    const passwordField = document.getElementById('password');
    const passwordToggle = document.getElementById('passwordToggle');
    const loginForm = document.querySelector('.login-form');

    // --- 1. Password Visibility Toggle ---
    if (passwordToggle && passwordField) {
        passwordToggle.addEventListener('click', function() {
            // Check the current type of the input
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            
            // Set the new type
            passwordField.setAttribute('type', type);
            
            // Toggle the icon (Eye vs. Slashed Eye)
            // &#x1f441; = Eye, &#x1f576; = Slashed Eye (depending on font support)
            // You might prefer an icon library for reliable icons
            passwordToggle.innerHTML = type === 'password' ? '&#x1f441;' : '&#x1f576;'; 
            
            // Focus back on the password field
            passwordField.focus();
        });
    }

    // --- 2. Basic Form Submission Handler ---
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            // Stop the page from reloading when the form is submitted
            event.preventDefault(); 
            
            const email = document.getElementById('email').value;
            const password = passwordField.value;

            // Simple validation
            if (email && password) {
                console.log('Login attempt successful!');
                console.log('Email:', email);
                
                alert('Login Successful! (Data logged to console)');
                
                // In a real application, you would make an API call (fetch) here
            } else {
                alert('Please ensure both email and password are entered.');
            }
        });
    }
});