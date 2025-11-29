export const formatPhoneNumber = (event) => {
    const allowedKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const input = event.target;

    // Prevent non-numeric input
    if (
        !allowedKeys.includes(event.key) &&
        ![
            "Enter",     // Allow Enter key
            "Backspace", // Allow Backspace key
            "ArrowLeft", // Allow Left Arrow key
            "ArrowRight" // Allow Right Arrow key
        ].includes(event.key)
    ) {
        event.preventDefault();
    }

    // Prevent input if length is 10
    if (input.value.length >= 12 && !["Backspace", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        event.preventDefault();
    }
};
