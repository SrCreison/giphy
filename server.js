const express = require('express');
const path = require('path');
const app = express();
const port = 3000; // Or any port you prefer

// Serve static files (HTML, CSS, JS) from the current directory
app.use(express.static(path.join(__dirname, '.')));

app.listen(port, () => {
  console.log(`Random GIF app server listening at http://localhost:${port}`);
});
