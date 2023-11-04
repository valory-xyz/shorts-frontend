const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Middleware to parse the incoming requests with JSON payloads
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// Handle POST request to the endpoint "/api/submit"
app.post('/api/submit', (req, res) => {
  const { address, prompt, tool } = req.body;
  
  // Here you would handle the incoming data as needed.
  // For now, let's just log it to the console and return a mock success response.
  console.log('Received request with data:', req.body);
  
  // Mock response for successful processing
  res.status(200).json({ success: true, message: 'Data processed', data: req.body });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
