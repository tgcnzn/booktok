import React, { useState, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useSupabase } from '../../contexts/SupabaseContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { ExternalLink, ThumbsUp, Award, AlertTriangle } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface Finalist {
  id: string;
  title: string;
  genre: string;
  synopsis: string;
  video_url: string;
  user_id: string;
  votes: number;
  profile: {
    full_name: string;
  };
  has_voted: boolean;
}

interface GroupedFinalists {
  [key: string]: Finalist[];
}

const VotingPage: React.FC = () => {
  const { supabase } = useSupabase();
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  
  const [finalists, setFinalists] = useState<Finalist[]>([]);
  const [groupedFinalists, setGroupedFinalists] = useState<GroupedFinalists>({});
  const [isLoading, setIsLoading] = useState(true);
  const [votingEnabled, setVotingEnabled] = useState(true);
  const [userVotes, setUserVotes] = useState<{[key: string]: boolean}>({});
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = React.createRef<ReCAPTCHA>();

  useEffect(() => {
    fetchFinalists();
    checkVotingStatus();
  }, []);

  const fetchFinalists = async () => {
    try {
      setIsLoading(true);
      
      // Fetch finalists from the submissions table
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
        .eq('stage', 'voting')
        .eq('status', 'finalist');
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        setFinalists([]);
        setIsLoading(false);
        return;
      }

      const formattedFinalists = data.map(item => ({
        ...item,
        profile: item.profiles,
        has_voted: false
      }));
      
      setFinalists(formattedFinalists);
      
      // Group finalists by genre
      const grouped = formattedFinalists.reduce((acc: GroupedFinalists, finalist) => {
        if (!acc[finalist.genre]) {
          acc[finalist.genre] = [];
        }
        acc[finalist.genre].push(finalist);
        return acc;
      }, {});
      
      setGroupedFinalists(grouped);
      
      // Check if authenticated user has already voted
      if (isAuthenticated && user) {
        const { data: votesData, error: votesError } = await supabase
          .from('votes')
          .select('submission_id')
          .eq('user_id', user.id);
          
        if (votesError) throw votesError;
        
        if (votesData && votesData.length > 0) {
          const votes: {[key: string]: boolean} = {};
          votesData.forEach(vote => {
            votes[vote.submission_id] = true;
          });
          setUserVotes(votes);
        }
      }
    } catch (error) {
      console.error('Error fetching finalists:', error);
      showToast({ 
        message: 'Failed to load finalists.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkVotingStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'voting_enabled')
        .single();
        
      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setVotingEnabled(data.value === 'true');
      }
    } catch (error) {
      console.error('Error checking voting status:', error);
      // Default to enabled if there's an error
      setVotingEnabled(true);
    }
  };

  const handleVote = async (finalistId: string) => {
    if (!isAuthenticated) {
      showToast({
        message: 'Please sign in to vote',
        type: 'warning'
      });
      return;
    }
    
    if (userVotes[finalistId]) {
      showToast({
        message: 'You have already voted for this entry',
        type: 'info'
      });
      return;
    }
    
    if (!captchaToken) {
      showToast({
        message: 'Por favor, complete o CAPTCHA antes de votar',
        type: 'warning'
      });
      return;
    }
    
    try {
      // Insert vote record
      const { error: voteError } = await supabase
        .from('votes')
        .insert({
          user_id: user!.id,
          submission_id: finalistId,
          ip_address: '127.0.0.1', // In a real app, you'd get the actual IP
          captcha_token: captchaToken,
        });
        
      if (voteError) throw voteError;
      
      // Increment vote count in the submissions table
      const { error: updateError } = await supabase.rpc('increment_vote', {
        submission_id: finalistId
      });
      
      if (updateError) throw updateError;
      
      // Update local state
      setUserVotes(prev => ({
        ...prev,
        [finalistId]: true
      }));
      
      setFinalists(prev => 
        prev.map(finalist => 
          finalist.id === finalistId 
            ? { ...finalist, votes: finalist.votes + 1, has_voted: true } 
            : finalist
        )
      );
      
      // Update grouped finalists
      setGroupedFinalists(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(genre => {
          updated[genre] = updated[genre].map(finalist => 
            finalist.id === finalistId 
              ? { ...finalist, votes: finalist.votes + 1, has_voted: true } 
              : finalist
          );
        });
        return updated;
      });
      
      // Reset captcha
      setCaptchaToken(null);
      recaptchaRef.current?.reset();
      
      showToast({
        message: 'Seu voto foi registrado!',
        type: 'success'
      });
    } catch (error: any) {
      console.error('Voting error:', error);
      showToast({
        message: error.message || 'Failed to record your vote',
        type: 'error'
      });
    }
  };

  const getVideoEmbedUrl = (url: string) => {
    // Convert YouTube watch URLs to embed URLs
    if (url.includes('youtube.com/watch')) {
      const videoId = new URL(url).searchParams.get('v');
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Convert YouTube short URLs
    if (url.includes('youtu.be')) {
      const videoId = url.split('/').pop();
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // For TikTok, we'd need to handle differently as they use a widget
    // This is simplified for the example
    
    return url;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (finalists.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Card elevation="md" className="p-8 text-center">
          <Award size={48} className="text-primary-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Finalists Coming Soon</h2>
          <p className="text-gray-600 mb-6">
            The finalists for the public voting stage have not been announced yet. 
            Please check back later.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Vote for the Finalists</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Our judges have selected the top entries. Now it's your turn to choose the winners!
        </p>
      </div>

      {!votingEnabled && (
        <div className="bg-warning-50 border border-warning-200 rounded-lg p-4 mb-8 flex items-start">
          <AlertTriangle size={24} className="text-warning-500 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-warning-700">Voting is currently paused</h3>
            <p className="text-warning-600">
              Voting has been temporarily disabled. Please check back later to cast your vote.
            </p>
          </div>
        </div>
      )}

      {Object.keys(groupedFinalists).map(genre => (
        <div key={genre} className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 capitalize border-b pb-2">
            {genre} Category
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {groupedFinalists[genre].map(finalist => (
              <Card key={finalist.id} elevation="md" className="overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                  <iframe 
                    src={getVideoEmbedUrl(finalist.video_url)}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-64 object-cover"
                  ></iframe>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{finalist.title}</h3>
                      <p className="text-gray-500">By {finalist.profile.full_name}</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 capitalize">
                      {genre}
                    </span>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Synopsis</h4>
                    <p className="text-gray-600 text-sm">
                      {finalist.synopsis.length > 200 
                        ? `${finalist.synopsis.substring(0, 200)}...` 
                        : finalist.synopsis}
                    </p>
                    {finalist.synopsis.length > 200 && (
                      <button className="text-primary-600 text-sm mt-1 hover:underline">
                        Read more
                      </button>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ThumbsUp size={18} className="text-primary-500 mr-2" />
                      <span className="text-gray-700">{finalist.votes} votes</span>
                    </div>
                    
                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(finalist.video_url, '_blank')}
                        rightIcon={<ExternalLink size={16} />}
                      >
                        Watch
                      </Button>
                      
                      <Button
                        variant={userVotes[finalist.id] ? "secondary" : "primary"}
                        size="sm"
                        onClick={() => handleVote(finalist.id)}
                        disabled={!votingEnabled || userVotes[finalist.id]}
                        className="mb-2"
                      >
                        {userVotes[finalist.id] ? "Votado" : "Votar"}
                      </Button>
                      {!userVotes[finalist.id] && (
                        <div className="mt-2">
                          <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                            onChange={(token) => setCaptchaToken(token)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}

      <div className="bg-gray-50 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Voting Rules</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>You must be signed in to vote.</li>
          <li>You can vote for one finalist in each genre category.</li>
          <li>Votes are final and cannot be changed once submitted.</li>
          <li>The finalist with the most votes in each genre will be declared the winner.</li>
          <li>In case of a tie, our panel of judges will make the final decision.</li>
          <li>Winners will be announced on our website and notified via email.</li>
        </ul>
      </div>
    </div>
  );
};

export default VotingPage;