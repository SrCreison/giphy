// Wait until the HTML is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    fetchRandomGif(); // Fetch a GIF when the page loads
});

async function fetchRandomGif() {
    const gifImageElement = document.getElementById('random-gif');
    const apiKey = 'Vre3x3atZ8F5kaTDdeJdiKvpQJqB3aVl'; // <-- PASTE YOUR GIPHY API KEY HERE!
    const apiUrl = 'https://api.giphy.com/v1/gifs/random?api_key=Vre3x3atZ8F5kaTDdeJdiKvpQJqB3aVl&tag=gaming&rating=g';
    // Note:
    // - You can add a search term to the `tag` parameter, e.g., `&tag=cats` to get random cat GIFs.
    // - `rating=g` keeps it family-friendly.

    try {
        // Let the user know we're fetching
        gifImageElement.alt = 'Fetching a new GIF...';
        gifImageElement.src = ''; // Clear previous gif

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Giphy API error! Status: ${response.status}`);
        }

        const gifData = await response.json();

        // Log the data to see the structure (useful for debugging)
        console.log(gifData);

        // Extract the GIF URL (check the console log if this path changes)
        const gifUrl = gifData.data.images.original.url;

        // Update the image source and alt text
        gifImageElement.src = gifUrl;
        gifImageElement.alt = gifData.data.title || 'Random GIF'; // Use title if available

    } catch (error) {
        console.error('Failed to fetch GIF:', error);
        gifImageElement.alt = 'Could not load GIF :('; // Show error message
    }
}

// Optional: Add a button to get a new GIF without refreshing
// 1. Add a button in your HTML: <button onclick="fetchRandomGif()">New GIF!</button>
// 2. The fetchRandomGif function will be called when clicked.
