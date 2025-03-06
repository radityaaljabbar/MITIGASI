// DetailFeedback.js
document.addEventListener('DOMContentLoaded', function() {
    const backButton = document.getElementById('backButton');

    backButton.addEventListener('click', function() {
        window.location.href = '../myfeedback/myfeedback.html'; // Redirect to MyFeedback.html
    });

    // Get feedback ID from the URL query string (if needed)
    const urlParams = new URLSearchParams(window.location.search);
    const feedbackId = urlParams.get('id');
    console.log('Feedback ID:', feedbackId);

    // You can use feedbackId to fetch the feedback details from your backend
    // and display it on this page.
});