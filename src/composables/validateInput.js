export const formatValidateInputText = (event) => {
    const allowedKeys = [
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", // Numbers
        ...Array.from("abcdefghijklmnopqrstuvwxyz"),    // Lowercase letters
        ...Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ"),    // Uppercase letters
        " ", // Space key
        "_",  // Underscore key
        "@",

    ];

    const controlKeys = [
        "Enter",     // Allow Enter key
        "Backspace", // Allow Backspace key
        "ArrowLeft", // Allow Left Arrow key
        "ArrowRight" // Allow Right Arrow key
    ];

    // Check if the pressed key is not allowed
    document.addEventListener('keydown', (event) => {
        if (!allowedKeys.includes(event.key) && !controlKeys.includes(event.key)) {
            event.preventDefault();
        }
    });

}