document.addEventListener('DOMContentLoaded', () => {
    const gifImageElement = document.getElementById('random-gif');
    const ratingButtons = document.querySelectorAll('.rating-button');
    const refreshButton = document.getElementById('refresh-button');
    const ratingDisplay = document.getElementById('current-rating-display');
    const apiKey = 'YOUR_API_KEY_HERE'; // <-- PASTE YOUR GIPHY API KEY HERE!
    const localStorageKey = 'giphyViewerRating'; // Key for storing rating

    let currentRating = 'g'; // Default rating

    // --- Initialization ---
    function initialize() {
        // 1. Load rating from localStorage if available
        const savedRating = localStorage.getItem(localStorageKey);
        if (savedRating && ['g', 'pg', 'pg-13', 'r'].includes(savedRating)) {
            currentRating = savedRating;
        } else {
            // If nothing saved or invalid value, ensure default is saved
            localStorage.setItem(localStorageKey, currentRating);
        }

        // 2. Update UI (display and button highlight)
        updateRatingUI(currentRating);

        // 3. Fetch initial GIF using the determined rating
        fetchRandomGif();
    }

    // --- Update UI Elements ---
    function updateRatingUI(rating) {
        // Update the display text
        ratingDisplay.textContent = `Current Rating: ${rating.toUpperCase()}`;

        // Update button highlighting
        ratingButtons.forEach(button => {
            if (button.dataset.rating === rating) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    // --- Fetch GIF Function ---
    async function fetchRandomGif() {
        // Construct API URL using the *current* rating
        const apiUrl = `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&tag=&rating=${currentRating}`;

        // Let the user know we're fetching
        gifImageElement.alt = 'Fetching a new GIF...';
        gifImageElement.src = ''; // Clear previous gif to show loading state

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`Giphy API error! Status: ${response.status}`);
            }
            const gifData = await response.json();
            console.log("Giphy Data:", gifData); // For debugging

            // Check if data and the expected URL path exist
             if (gifData.data && gifData.data.images && gifData.data.images.original && gifData.data.images.original.url) {
                const gifUrl = gifData.data.images.original.url;
                gifImageElement.src = gifUrl;
                gifImageElement.alt = gifData.data.title || `Random GIF (Rating: ${currentRating.toUpperCase()})`;
            } else {
                 // Handle cases where the expected structure isn't returned (e.g., no results for rating/tag)
                console.error('Unexpected data structure from Giphy:', gifData);
                gifImageElement.alt = `No GIF found for rating '${currentRating.toUpperCase()}'. Try another rating?`;
                gifImageElement.src = ''; // Keep image blank
            }

        } catch (error) {
            console.error('Failed to fetch GIF:', error);
            gifImageElement.alt = 'Could not load GIF :(';
            gifImageElement.src = ''; // Keep image blank on error
        }
    }

    // --- Event Listeners ---

    // Rating buttons
    ratingButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedRating = button.dataset.rating;
            if (selectedRating !== currentRating) {
                currentRating = selectedRating; // Update global rating
                localStorage.setItem(localStorageKey, currentRating); // Persist to localStorage
                updateRatingUI(currentRating); // Update UI immediately
                fetchRandomGif(); // Fetch new GIF with the new rating
            }
        });
    });

    // Refresh button
    refreshButton.addEventListener('click', () => {
        fetchRandomGif(); // Fetch new GIF using the current persisted rating
    });

    // --- Run Initialization ---
    initialize();

}); // End DOMContentLoaded
