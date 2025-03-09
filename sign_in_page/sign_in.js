// Handle Sign-In Form Submission
document.getElementById('sign-in-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Simulate successful login
    setTimeout(function() {
        window.location.href = 'index.html'; // Redirect to the homepage
    }, 1000); // 1-second delay to simulate a real sign-in process
});
// Get the sign-in form element
const signinForm = document.getElementById('signin-form');

// Listen for form submission
signinForm.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevents the form from submitting the traditional way
  
  // You can perform some form validation or authentication here if needed
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  // Check if username and password are valid (this is a simple check, for demonstration)
  if (username && password) {
    // Redirect to the homepage (index.html)
    window.location.href = 'index.html'; // Redirect to index.html
  } else {
    alert('Please enter valid credentials');
  }
}); 