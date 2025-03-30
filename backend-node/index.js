const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

app.use(cors({
  origin: 'http://localhost:3000',  // Adjust the origin as needed
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Demo scheduling endpoint
app.post('/api/demo/schedule', async (req, res) => {
  try {
    const { name, email, company, teamSize, preferredDate, message } = req.body;
    console.log('Received request data:', name, email. message);

    // Store demo request in Supabase
    const { data, error } = await supabase
      .from('demo_schedule')
      .insert([
        {
          name,
          email,
          company,
          team_size: teamSize,
          preferred_date: preferredDate,
          message,
          status: 'pending'
        }
      ]);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

    // TODO: Send email notification to sales team
    // TODO: Send confirmation email to user

    res.json({
      success: true,
      message: 'Demo request scheduled successfully',
      data
    });
  } catch (error) {
    console.error('Error scheduling demo:', error);
    res.status(500).json({
      success: false,
      message: 'Error scheduling demo',
      error: error.message
    });
  }
});

app.get("/", (req, res) => {
  res.send("Node.js Backend is running");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
