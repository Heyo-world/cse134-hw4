document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const nameField = document.getElementById("form-name");
    const emailField = document.getElementById("form-email");
    const commentsField = document.getElementById("form-comments");
    
    const nameError = document.getElementById("name-error");
    const emailError = document.getElementById("email-error");
    const commentsError = document.getElementById("comments-error");
    const charRemaining = document.getElementById("comments-count");
    const formErrorsInput = document.getElementById("form-errors-input");

    let formErrors = [];


    function validateField(input, errorElement) {
        const validityState = input.validity;

        input.setCustomValidity("");
        if (validityState.valueMissing) {
            input.setCustomValidity("This field is required.");
        } else if (validityState.typeMismatch && input.type === "email") {
            input.setCustomValidity("Please enter a valid email address (e.g., name@example.com).");
        } else if (validityState.tooShort) {
            input.setCustomValidity(`Enter at least ${input.minlength} characters.`);
        } else if (validityState.tooLong) {
            input.setCustomValidity(`Enter at most ${input.maxLength} characters.`);
        } else {
            input.setCustomValidity("");
        }

        if (!validityState.valid) {
            errorElement.textContent = input.validationMessage;
            errorElement.style.color = "#ffa182"; // Accent color
        } else {
            errorElement.textContent = defaultHintText;
            errorElement.style.color = "lightgray";
        }
    }

    // Character Counter & Warning Logic for Comments
    function updateCharacterCount() {
        const maxLength = parseInt(commentsField.getAttribute("maxlength")) || 1000;
        const currentLength = commentsField.value.length;
        const remaining = maxLength - currentLength;

        if (remaining <= 50 && remaining > 0) {
            charRemaining.style.color = "#ffd582ff"; 
            charRemaining.textContent = `Warning: ${remaining} characters remaining.`;
        } else if (remaining === 0) {
            charRemaining.style.color = "#e07967";
            charRemaining.textContent = "Character limit reached.";
        } else {
            charRemaining.style.color = "inherit";
            charRemaining.textContent = `Characters remaining: ${remaining}`;
        }
    }

    nameField.addEventListener("input", () => validateField(nameField, nameError));
    emailField.addEventListener("input", () => validateField(emailField, emailError));
    commentsField.addEventListener("input", () => {
        updateCharacterCount();
        validateField(commentsField, commentsError);
    });

    nameField.addEventListener("blur", () => validateField(nameField, nameError));
    emailField.addEventListener("blur", () => validateField(emailField, emailError));
    commentsField.addEventListener("blur", () => validateField(commentsField, commentsError));

    // Add errors to formErrors[]
    form.addEventListener("invalid", (event) => {
        event.preventDefault(); 
        const target = event.target;
        
        formErrors.push({
            field: target.name || target.id,
            message: target.validationMessage,
            timestamp: new Date().toISOString()
        });
    }, true);

    // Form Submission Handling
    form.addEventListener("submit", (event) => {
        formErrors = []; // Reset history for this specific submission attempt

        validateField(nameField);
        if (!nameField.validity.valid) {
            formErrors.push({ field: nameField.name, message: nameField.validationMessage });
        }

        validateField(emailField);
        if (!emailField.validity.valid) {
            formErrors.push({ field: emailField.name, message: emailField.validationMessage });
        }

        validateField(commentsField);
        if (!commentsField.validity.valid) {
            formErrors.push({ field: commentsField.name, message: commentsField.validationMessage });
        }

        // If validation fails, block submission
        if (!form.checkValidity()) {
            event.preventDefault();
        }

        // Serialize error history into the hidden input field right before submission
        formErrorsInput.value = JSON.stringify(formErrors);
    });

    // Initialize counter on load
    updateCharacterCount();
});