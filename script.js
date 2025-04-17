document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const gifImageElement = document.getElementById('random-gif');
    const ratingButtons = document.querySelectorAll('.rating-button');
    const refreshButton = document.getElementById('refresh-button');
    const ratingDisplay = document.getElementById('current-rating-display');
    const tagInput = document.getElementById('tag-input');
    const setTagButton = document.getElementById('set-tag-button');
    const tagDisplay = document.getElementById('current-tag-display');

    // --- Configuration ---
    const apiKey = 'YOUR_API_KEY_HERE'; // <-- PASTE YOUR GIPHY API KEY HERE!
    const ratingStorageKey = 'giphyViewerRating'; // Key for storing rating
    const tagStorageKey = 'giphyViewerTag';       // Key for storing tag

    // --- State Variables ---
    let currentRating = 'g'; // Default rating
    let currentTag = '';     // Default tag (empty means random)

    // --- Initialization ---
    function initialize() {
        // 1. Load Rating
        const savedRating = localStorage.getItem(ratingStorageKey);
        if (savedRating && ['g', 'pg', 'pg-13', 'r'].includes(savedRating)) {
            currentRating = savedRating;
        } else {
            localStorage.setItem(ratingStorageKey, currentRating); // Ensure default is saved
        }

        // 2. Load Tag
        const savedTag = localStorage.getItem(tagStorageKey);
        if (savedTag !== null) { // Allow empty string to be saved/loaded
            currentTag = savedTag;
        } else {
             localStorage.setItem(tagStorageKey, currentTag); // Save default empty tag
        }

        // 3. Update UI (display, button highlight, input field)
        updateUI();

        // 4. Fetch initial GIF using the determined rating and tag
        fetchRandomGif();
    }

    // --- Update UI Elements ---
    function updateUI() {
        // Update rating display text
        ratingDisplay.textContent = `Current Rating: ${currentRating.toUpperCase()}`;

        // Update rating button highlighting
        ratingButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.rating === currentRating);
        });

        // Update tag input field value
        tagInput.value = currentTag;

        // Update tag display text
        tagDisplay.textContent = `Current Tag: ${currentTag || '(none)'}`; // Show (none) if tag is empty
    }

    // --- Fetch GIF Function ---
    async function fetchRandomGif() {
        const encodedTag = encodeURIComponent(currentTag.trim()); // URL-encode the tag, remove leading/trailing spaces
        const apiUrl = `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&tag=${encodedTag}&rating=${currentRating}`;

        gifImageElement.alt = 'Fetching a new GIF...';
        gifImageElement.src = '';

        console.log(`Workspaceing Giphy: ${apiUrl}`); // Log the URL for debugging

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`Giphy API error! Status: ${response.status}`);
            }
            const gifData = await response.json();
            console.log("Giphy Data:", gifData);

            if (gifData.data && gifData.data.images && gifData.data.images.original && gifData.data.images.original.url) {
                const gifUrl = gifData.data.images.original.url;
                gifImageElement.src = gifUrl;
                const tagText = currentTag ? `, Tag: ${currentTag}` : ''; // Add tag to alt text if present
                gifImageElement.alt = gifData.data.title || `Random GIF (Rating: ${currentRating.toUpperCase()}${tagText})`;
            } else {
                console.error('No GIF data found in response:', gifData);
                 let message = `No GIF found`;
                 if (currentTag) message += ` for tag '${currentTag}'`;
                 message += ` with rating '${currentRating.toUpperCase()}'.`;
                gifImageElement.alt = message;
                gifImageElement.src = '';
            }

        } catch (error) {
            console.error('Failed to fetch GIF:', error);
            gifImageElement.alt = 'Could not load GIF :(';
            gifImageElement.src = '';
        }
    }

    // --- Event Listeners ---

    // Rating buttons
    ratingButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedRating = button.dataset.rating;
            if (selectedRating !== currentRating) {
                currentRating = selectedRating;
                localStorage.setItem(ratingStorageKey, currentRating);
                updateUI(); // Update display and button highlights
                fetchRandomGif(); // Fetch new GIF with new rating
            }
        });
    });

     // Set Tag Button
     setTagButton.addEventListener('click', () => {
         const newTag = tagInput.value.trim(); // Get value from input and trim whitespace
         if (newTag !== currentTag) {
             currentTag = newTag;
             localStorage.setItem(tagStorageKey, currentTag); // Persist tag
             updateUI(); // Update tag input and display
             fetchRandomGif(); // Fetch new GIF with new tag
         }
     });

     // Optional: Allow pressing Enter in the tag input to set the tag
     tagInput.addEventListener('keypress', (event) => {
         if (event.key === 'Enter') {
             event.preventDefault(); // Prevent potential form submission if inside a form
             setTagButton.click(); // Simulate a click on the Set Tag button
         }
     });

    // Refresh button
    refreshButton.addEventListener('click', () => {
        // Simply fetch using current settings (already includes persisted tag)
        fetchRandomGif();
    });

    // --- Run Initialization ---
    initialize();

}); // End DOMContentLoaded
