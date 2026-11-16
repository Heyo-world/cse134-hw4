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

    nameError.defaultHint = nameError.textContent;
    emailError.defaultHint = emailError.textContent;
    commentsError.defaultHint = commentsError.textContent;

    let formErrors = [];

    //Get current theme colors
    function getAccentColor() {
        return getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();
    }
    /*function getHintColor() {
        return getComputedStyle(document.documentElement).getPropertyValue('--hint-color').trim();
    }*/

    function validateField(input, errorElement) {
        const validityState = input.validity;
        const minLimit = input.getAttribute("minlength") || input.minLength;
        const maxLimit = input.getAttribute("maxlength") || input.maxLength;
        const defaultHintText = errorElement.defaultHint || "";

        input.setCustomValidity("");
        if (validityState.valueMissing) {
            input.setCustomValidity("This field is required.");
        } else if (validityState.typeMismatch && input.type === "email") {
            input.setCustomValidity("Please enter a valid email address (e.g., name@example.com).");
        } else if (validityState.tooShort) {
            input.setCustomValidity(`Enter at least ${minLimit} characters.`);
        } else if (validityState.tooLong) { //Won't happen manually
            input.setCustomValidity(`Enter at most ${maxLimit} characters.`);
        } else {
            input.setCustomValidity("");
        }

        if (!validityState.valid) {
            errorElement.style.color = getAccentColor(); // Accent color
            errorElement.textContent = input.validationMessage;
        } else {
            errorElement.style.color = "";
            errorElement.textContent = defaultHintText;
        }
    }

    // Character Counter & Warning Logic for Comments
    function updateCharacterCount() {
        const maxLength = parseInt(commentsField.getAttribute("maxlength")) || 1000;
        const currentLength = commentsField.value.length;
        const remaining = maxLength - currentLength;

        if (remaining <= 50 && remaining > 0) {
            charRemaining.style.fontWeight = "bold";
            charRemaining.style.fontStyle = "none";
            charRemaining.style.color = "";
            charRemaining.textContent = `Warning: ${remaining} characters remaining.`;
        } else if (remaining === 0) {
            charRemaining.style.fontWeight = "bold";
            charRemaining.style.fontStyle = "italic";
            charRemaining.style.color = "";
            charRemaining.textContent = "Character limit reached.";
        } else {
            charRemaining.style.fontWeight = "none";
            charRemaining.style.fontStyle = "none";
            charRemaining.style.color = "";
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

        validateField(nameField, nameError);
        if (!nameField.validity.valid) {
            formErrors.push({ field: nameField.name, message: nameField.validationMessage });
        }

        validateField(emailField, emailError);
        if (!emailField.validity.valid) {
            formErrors.push({ field: emailField.name, message: emailField.validationMessage });
        }

        validateField(commentsField, commentsError);
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