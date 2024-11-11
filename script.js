// Initialize EmailJS with the Public Key
(function() {
    emailjs.init("wT0FcGCXoBgwEqkB_"); // Using the Public Key
    console.log("EmailJS initialized"); // Debugging line
})();

// Function to validate email existence with Hunter.io API
async function emailExists(email) {
    console.log("Checking if email exists: " + email); // Debugging line
    const apiKey = "161a84e4b7345f3d8fb5b7d8da2097721e290a1a"; // Replace with your Hunter.io API key
    try {
        const response = await fetch(`https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${apiKey}`);
        const data = await response.json();
        console.log("Hunter.io response data:", data); // Debugging line to view full response

        // Check if data and status exist in the response
        if (data && data.data && data.data.status) {
            const status = data.data.status;
            console.log("Email status:", status); // Debugging line for email status

            // Consider "valid" and "accept_all" statuses as valid
            return status === "valid" || status === "accept_all";
        } else {
            console.log("Invalid response structure from Hunter.io"); // Debugging line for unexpected response
            return false;
        }
    } catch (error) {
        console.error("Error with Hunter.io API:", error); // Debugging line
        return false;
    }
}

// Contact Form Submission
document.getElementById("contact-form").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent the form from refreshing the page
    console.log("Form submit event triggered"); // Debugging line

    const email = document.getElementById("email").value;
    const contactMessage = document.getElementById("contact-message");

    // Check if the email exists
    const emailIsValid = await emailExists(email);
    if (!emailIsValid) {
        contactMessage.innerText = "Please enter a valid and existing email address.";
        contactMessage.classList.add("error");
        console.log("Invalid email provided"); // Debugging line
        return;
    } else {
        contactMessage.innerText = "";
        contactMessage.classList.remove("error");
        console.log("Email is valid"); // Debugging line
    }

    // Send form data to EmailJS
    emailjs.sendForm('service_596isjp', 'template_w7bj3zt', this)
        .then(function(response) {
            document.getElementById("contact-form").reset(); // Reset the form after successful submission
            contactMessage.innerText = "Thank you! Your message has been sent successfully.";
            contactMessage.classList.remove("error");
            console.log("Form submitted successfully to EmailJS"); // Debugging line
        }, function(error) {
            contactMessage.innerText = "Oops! There was an issue sending your message. Please try again.";
            contactMessage.classList.add("error");
            console.error("Error submitting form to EmailJS:", error); // Debugging line
        });
});
