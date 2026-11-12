//were



document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contact-form");
    const nameField = document.getElementById("form-name");
    const emailField = document.getElementById("form-email");
    const commentsField = document.getElementById("form-comments");
    
    const nameError = document.getElementById("name-error");
    const emailError = document.getElementById("email-error");
    const commentsError = document.getElementById("comments-error");
    const charCountDisplay = document.getElementById("char-count");
    const commentsInfo = document.getElementById("comments-info");
    const formErrorsInput = document.getElementById("form-errors-input");

    // Array to record validation errors during unsuccessful submission attempts
    let form_errors = [];

    // Helper: Set custom validity and display validation feedback
    function validateField(field, errorElement) {
        field.setCustomValidity(""); // Clear previous custom messages first

        if (field.validity.valueMissing) {
            field.setCustomValidity("This field is required.");
        } else if (field.type === "email" && field.validity.typeMismatch) {
            field.setCustomValidity("Please enter a valid email address (e.g. name@example.com).");
        } else if (field.validity.tooShort) {
            field.setCustomValidity(`Value is too short. Minimum length is ${field.minLength} characters.`);
        } else if (field.validity.tooLong) {
            field.setCustomValidity(`Value is too long. Maximum length is ${field.maxLength} characters.`);
        }

        if (!field.validity.valid) {
            errorElement.textContent = field.validationMessage;
            errorElement.style.color = "#ff6b6b";
        } else {
            errorElement.textContent = "";
        }
    }

    // 1. Character Counter & Warning Logic for Comments
    function updateCharacterCount() {
        const maxLength = parseInt(commentsField.getAttribute("maxlength")) || 1000;
        const currentLength = commentsField.value.length;
        const remaining = maxLength - currentLength;
        
        charCountDisplay.textContent = remaining;

        // Warning threshold when reaching 50 characters or fewer remaining
        if (remaining <= 50 && remaining > 0) {
            commentsInfo.style.color = "#ffa182"; // Warning color
            commentsInfo.textContent = `Warning: ${remaining} characters remaining.`;
        } else if (remaining === 0) {
            commentsInfo.style.color = "#ff6b6b";
            commentsInfo.textContent = "Character limit reached!";
        } else {
            commentsInfo.style.color = "inherit";
            commentsInfo.textContent = `Characters remaining: ${remaining}`;
        }
    }

    commentsField.addEventListener("input", () => {
        updateCharacterCount();
        validateField(commentsField, commentsError);
    });

    nameField.addEventListener("input", () => validateField(nameField, nameError));
    emailField.addEventListener("input", () => validateField(emailField, emailError));

    // Validate fields when user leaves them (blur)
    nameField.addEventListener("blur", () => validateField(nameField, nameError));
    emailField.addEventListener("blur", () => validateField(emailField, emailError));
    commentsField.addEventListener("blur", () => validateField(commentsField, commentsError));

    // 2. Track Invalid Submissions for Error History (`form_errors`)
    // Listen for the native 'invalid' event in capture phase because it doesn't bubble
    form.addEventListener("invalid", (event) => {
        event.preventDefault(); // Prevent default browser UI popups if handling inline
        const target = event.target;
        
        let errorDescription = target.validationMessage;

        // Push entry matching the requirements (no personal data/text values recorded)
        form_errors.push({
            field: target.name || target.id,
            message: errorDescription,
            timestamp: new Date().toISOString()
        });
    }, true);

    // 3. Form Submission Handling
    form.addEventListener("submit", (event) => {
        form_errors = []; // Reset for this specific submission attempt

        // Trigger native check validity on fields
        nameField.reportValidity();
        validateField(nameField, nameError);

        if (!nameField.validity.valid) {
            form_errors.push({ field: "form-name", message: nameField.validationMessage });
        }

        emailField.reportValidity();
        validateField(emailField, emailError);
        if (!emailField.validity.valid) {
            form_errors.push({ field: "form-email", message: emailField.validationMessage });
        }

        commentsField.reportValidity();
        validateField(commentsField, commentsError);
        if (!commentsField.validity.valid) {
            form_errors.push({ field: "form-comments", message: commentsField.validationMessage });
        }

        // If validation fails, block submission and serialize error history
        if (!form.checkValidity()) {
            event.preventDefault();
            formErrorsInput.value = JSON.stringify(form_errors);
            console.warn("Form validation failed. Recorded errors:", form_errors);
        } else {
            // Successful submission: serialize error history into hidden field right before submit
            formErrorsInput.value = JSON.stringify(form_errors);
        }
    });

    // Initialize counter on load
    updateCharacterCount();
});
