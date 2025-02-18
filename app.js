const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// In-memory store to cache submissions
const submissions = {};

// Middleware for parsing query parameters
app.use(express.urlencoded({ extended: true }));

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (optional)
app.use(express.static(path.join(__dirname, 'public')));

// Route to render the form and show submitted HTML content
app.get('/', (req, res) => {
  const userHtml = req.query.htmlContent || '';  // Default to an empty string if no content
  res.render('index', { htmlContent: userHtml });
});

// API Route to handle HTML submission via GET request
app.post('/submit-html', (req, res) => {
  const htmlContent = req.body.htmlContent || '';

  if (!htmlContent) {
    return res.status(400).json({ error: 'No HTML content provided' });
  }

  // Generate a unique ID for the submission
  const submissionId = generateUniqueId();

  // Cache the HTML content using the unique ID
  submissions[submissionId] = htmlContent;

  // Send the URL as a response instead of redirecting
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

// Helper function to generate a unique ID (could also use UUID or other methods)
function generateUniqueId() {
  return 'xxxx-xxxx-xxxx'.replace(/[x]/g, () => Math.floor(Math.random() * 16).toString(16));
}

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
