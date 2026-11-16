document.addEventListener("DOMContentLoaded", () => {
    const themeToggleButton = document.getElementById("theme-toggle");

    if (themeToggleButton) {
        themeToggleButton.style.display = "inline-block"; // Reveal control since JS is active

        // Function to apply theme and update accessibility labels
        const setTheme = (theme) => {
            if (theme === "light") {
                document.documentElement.setAttribute("data-theme", "light");
                themeToggleButton.setAttribute("aria-label", "Switch to dark theme");
                themeToggleButton.textContent = "☀️ Light"; // Raw emoji string
                themeToggleButton.style.fontFamily = "";
            } else {
                document.documentElement.removeAttribute("data-theme");
                themeToggleButton.setAttribute("aria-label", "Switch to light theme");
                themeToggleButton.textContent = "🌙 Dark"; // Raw emoji string
                themeToggleButton.style.fontFamily = "";
            }
        };

        // Restore saved preference on load
        try {
            const savedTheme = localStorage.getItem("theme");
            if (savedTheme) {
                setTheme(savedTheme);
            }
        } catch (e) {
            console.warn("localStorage is unavailable:", e);
        }

        // Toggle theme on click and persist securely
        themeToggleButton.addEventListener("click", () => {
            // Check current state accurately (if data-theme is "light", switch to dark, otherwise light)
            const currentTheme = document.documentElement.getAttribute("data-theme");
            const newTheme = currentTheme === "light" ? "dark" : "light";

            setTheme(newTheme);

            try {
                localStorage.setItem("theme", newTheme);
            } catch (e) {
                console.warn("Could not save theme preference to localStorage:", e);
            }

            document.dispatchEvent(new CustomEvent("themeChanged"));
        });
    }
});