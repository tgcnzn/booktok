import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());

// Rate limiting for voting endpoints
const votingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 votes per window
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many votes from this IP, please try again after 15 minutes'
});

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// API Routes
app.get('/api/submissions/:genre/finalists', async (req, res) => {
  try {
    const { genre } = req.params;
    
    // Validate genre
    if (!['fiction', 'non-fiction', 'poetry'].includes(genre)) {
      return res.status(400).json({ error: 'Invalid genre' });
    }
    
    // Get finalists for the specified genre
    const { data, error } = await supabase
      .from('submissions')
      .select(`
        id,
        title,
        genre,
        synopsis,
        video_url,
        user_id,
        votes,
        profiles:profiles(full_name)
      `)
      .eq('genre', genre)
      .eq('stage', 'voting')
      .eq('status', 'finalist');
    
    if (error) throw error;
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching finalists:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Apply rate limiting to voting endpoint
app.post('/api/vote', votingLimiter, async (req, res) => {
  try {
    const { submissionId, userId } = req.body;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    
    if (!submissionId || !userId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Check if voting is enabled
    const { data: settingsData, error: settingsError } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'voting_enabled')
      .single();
    
    if (settingsError && settingsError.code !== 'PGRST116') {
      throw settingsError;
    }
    
    if (settingsData && settingsData.value !== 'true') {
      return res.status(403).json({ error: 'Voting is currently disabled' });
    }
    
    // Check if user has already voted for this submission
    const { data: existingVote, error: voteCheckError } = await supabase
      .from('votes')
      .select('id')
      .eq('user_id', userId)
      .eq('submission_id', submissionId);
    
    if (voteCheckError) throw voteCheckError;
    
    if (existingVote && existingVote.length > 0) {
      return res.status(400).json({ error: 'You have already voted for this submission' });
    }
    
    // Record the vote
    const { error: voteError } = await supabase
      .from('votes')
      .insert({
        user_id: userId,
        submission_id: submissionId,
        ip_address: ipAddress
      });
    
    if (voteError) throw voteError;
    
    // Increment the vote count
    const { error: updateError } = await supabase.rpc('increment_vote', {
      submission_id: submissionId
    });
    
    if (updateError) throw updateError;
    
    res.status(200).json({ success: true, message: 'Vote recorded successfully' });
  } catch (error) {
    console.error('Error recording vote:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});