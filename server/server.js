const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const dotenv = require('dotenv');
const pdf = require('pdf-parse');
const fileUpload = require('express-fileupload');
const { OpenAI } = require('openai'); // Import OpenAI directly

dotenv.config();

const app = express();
const PORT = 8800;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this matches your .env file
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// File Upload and Summarization Endpoint
app.post('/summary', async (req, res) => {
  try {
    // Check if a file was uploaded
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No file uploaded. Try again!');
    }

    const sampleFile = req.files.uploadedFile;

    // Validate file type (PDF only)
    if (sampleFile.mimetype !== 'application/pdf') {
      return res.status(400).send('Only PDF files are allowed.');
    }

    // Create a unique file path
    const uploadPath = __dirname + '/tmp/' + new Date().getTime() + '_' + sampleFile.name;

    // Save the file to the server
    sampleFile.mv(uploadPath, async (err) => {
      if (err) {
        console.error('File upload error:', err);
        return res.status(500).send('Failed to save the file.');
      }

      try {
        // Read and parse the PDF file
        const dataBuffer = fs.readFileSync(uploadPath);
        const data = await pdf(dataBuffer);

        // Call OpenAI API for summarization
        const response = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo', // Use the latest model
          messages: [
            {
              role: 'user',
              content: data.text + '\n\nTl;dr', // Prompt for summarization
            },
          ],
          temperature: 0.7,
          max_tokens: Math.floor(data.text.length / 2), // Adjust token limit
          top_p: 1.0,
          frequency_penalty: 0.0,
          presence_penalty: 1,
        });

        // Delete the uploaded file after processing
        fs.unlinkSync(uploadPath);

        // Send the summary back to the client
        res.json({
          id: new Date().getTime(),
          text: response.choices[0].message.content,
        });
      } catch (error) {
        console.error('OpenAI API error:', error);
        fs.unlinkSync(uploadPath); // Clean up the file
        res.status(500).send('An error occurred while processing the file.');
      }
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).send('Internal server error.');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});