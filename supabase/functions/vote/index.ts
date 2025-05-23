import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VoteRequest {
  submissionId: string;
  userId: string;
  captchaToken: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { submissionId, userId, captchaToken } = await req.json() as VoteRequest;

    // Verify required parameters
    if (!submissionId || !userId || !captchaToken) {
      throw new Error('Missing required parameters');
    }

    // Verify CAPTCHA
    const verificationUrl = 'https://www.google.com/recaptcha/api/siteverify';
    const verificationBody = new URLSearchParams({
      secret: Deno.env.get('RECAPTCHA_SECRET_KEY') || '',
      response: captchaToken,
    });

    const verification = await fetch(verificationUrl, {
      method: 'POST',
      body: verificationBody,
    });

    const captchaResult = await verification.json();

    if (!captchaResult.success) {
      throw new Error('CAPTCHA verification failed');
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_ANON_KEY') || '',
    );

    // Check if user has already voted
    const { data: existingVote, error: voteCheckError } = await supabaseClient
      .from('votes')
      .select('id')
      .eq('user_id', userId)
      .eq('submission_id', submissionId)
      .single();

    if (voteCheckError && voteCheckError.code !== 'PGRST116') {
      throw voteCheckError;
    }

    if (existingVote) {
      throw new Error('You have already voted for this submission');
    }

    // Record the vote
    const { error: voteError } = await supabaseClient
      .from('votes')
      .insert({
        user_id: userId,
        submission_id: submissionId,
        ip_address: req.headers.get('x-forwarded-for') || 'unknown',
      });

    if (voteError) throw voteError;

    // Increment vote count
    const { error: updateError } = await supabaseClient.rpc('increment_vote', {
      submission_id: submissionId,
    });

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ success: true, message: 'Vote recorded successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to record vote' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});