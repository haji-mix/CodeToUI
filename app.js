const express = require('express');
const path = require('path');
const crypto = require('crypto'); // Used for unique ID generation
const app = express();
const port = 3000;

// In-memory store to cache submissions
const submissions = {};

// Middleware for parsing request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Ensure JSON parsing for API requests

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (optional)
app.use(express.static(path.join(__dirname, 'public')));

// Enable CORS (Optional: Useful for API calls from other origins)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Route to render the form and show submitted HTML content
app.get('/', (req, res) => {
  const userHtml = req.query.htmlContent || ''; // Default to empty string if no content
  res.render('index', { htmlContent: userHtml });
});

// API Route to handle HTML submission via POST request
app.post('/submit-html', (req, res) => {
  const htmlContent = req.body.htmlContent?.trim(); // Trim to avoid empty strings

  if (!htmlContent) {
    return res.status(400).json({ error: 'No HTML content provided' });
  }

  // Generate a unique ID for the submission
  const submissionId = generateUniqueId();

  // Cache the HTML content using the unique ID
  submissions[submissionId] = htmlContent;

  // Respond with the generated URL
  res.json({ url: `/view/${submissionId}` });
});

// Route to view the cached HTML content by ID
app.get('/view/:id', (req, res) => {
  const submissionId = req.params.id;
  const htmlContent = submissions[submissionId];

  if (!htmlContent) {
    return res.status(404).send('Content not found');
  }

  // Render the cached HTML content
  res.send(htmlContent);
});

// Helper function to generate a unique ID
function generateUniqueId() {
  return crypto.randomUUID(); // More reliable than manual string replacement
}

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
