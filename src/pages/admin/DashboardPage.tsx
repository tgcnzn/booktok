import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  Award, 
  Eye, 
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { useSupabase } from '../../contexts/SupabaseContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

interface DashboardStats {
  totalParticipants: number;
  totalSubmissions: number;
  totalJudges: number;
  totalVotes: number;
  submissionsByGenre: {
    [key: string]: number;
  };
  submissionsByStatus: {
    [key: string]: number;
  };
}

const DashboardPage: React.FC = () => {
  const { supabase } = useSupabase();
  const [stats, setStats] = useState<DashboardStats>({
    totalParticipants: 0,
    totalSubmissions: 0,
    totalJudges: 0,
    totalVotes: 0,
    submissionsByGenre: {},
    submissionsByStatus: {},
  });
  const [isLoading, setIsLoading] = useState(true);
  const [votingEnabled, setVotingEnabled] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
    checkVotingStatus();
  }, []);

  const fetchDashboardStats = async () => {
    setIsLoading(true);
    try {
      // Fetch total participants (users with role 'participant')
      const { count: participantCount, error: participantError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'participant');
      
      if (participantError) throw participantError;
      
      // Fetch total judges
      const { count: judgeCount, error: judgeError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'judge');
      
      if (judgeError) throw judgeError;
      
      // Fetch total submissions
      const { count: submissionCount, error: submissionError } = await supabase
        .from('submissions')
        .select('*', { count: 'exact', head: true });
      
      if (submissionError) throw submissionError;
      
      // Fetch total votes
      const { count: voteCount, error: voteError } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true });
      
      if (voteError) throw voteError;
      
      // Fetch submissions by genre
      const { data: genreData, error: genreError } = await supabase
        .from('submissions')
        .select('genre')
        .order('genre');
      
      if (genreError) throw genreError;
      
      const genreCounts: {[key: string]: number} = {};
      genreData.forEach(submission => {
        const genre = submission.genre;
        if (genreCounts[genre]) {
          genreCounts[genre]++;
        } else {
          genreCounts[genre] = 1;
        }
      });
      
      // Fetch submissions by status
      const { data: statusData, error: statusError } = await supabase
        .from('submissions')
        .select('status')
        .order('status');
      
      if (statusError) throw statusError;
      
      const statusCounts: {[key: string]: number} = {};
      statusData.forEach(submission => {
        const status = submission.status;
        if (statusCounts[status]) {
          statusCounts[status]++;
        } else {
          statusCounts[status] = 1;
        }
      });
      
      setStats({
        totalParticipants: participantCount || 0,
        totalSubmissions: submissionCount || 0,
        totalJudges: judgeCount || 0,
        totalVotes: voteCount || 0,
        submissionsByGenre: genreCounts,
        submissionsByStatus: statusCounts,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
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
    }
  };

  const toggleVoting = async () => {
    try {
      const newValue = !votingEnabled;
      
      const { error } = await supabase
        .from('settings')
        .upsert({
          key: 'voting_enabled',
          value: newValue.toString(),
        });
      
      if (error) throw error;
      
      setVotingEnabled(newValue);
    } catch (error) {
      console.error('Error toggling voting status:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="inline-block">
          <svg className="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex items-center space-x-3">
          <Button
            variant={votingEnabled ? "primary" : "outline"}
            size="sm"
            onClick={toggleVoting}
            leftIcon={votingEnabled ? <CheckCircle size={18} /> : <XCircle size={18} />}
          >
            {votingEnabled ? "Voting Enabled" : "Voting Disabled"}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchDashboardStats}
            leftIcon={<TrendingUp size={18} />}
          >
            Refresh Stats
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 text-primary-600 mr-4">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase">Participants</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalParticipants}</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-white p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-secondary-100 text-secondary-600 mr-4">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase">Submissions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSubmissions}</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-white p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-accent-100 text-accent-600 mr-4">
              <Award size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase">Judges</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalJudges}</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-white p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-success-100 text-success-600 mr-4">
              <Eye size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase">Total Votes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalVotes}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Submissions by Genre</h2>
          <div className="space-y-4">
            {Object.keys(stats.submissionsByGenre).map(genre => (
              <div key={genre} className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary-600 bg-primary-200 capitalize">
                      {genre}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-primary-600">
                      {stats.submissionsByGenre[genre]}
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary-200">
                  <div 
                    style={{ width: `${(stats.submissionsByGenre[genre] / stats.totalSubmissions) * 100}%` }} 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Submission Status</h2>
          <div className="space-y-4">
            {Object.keys(stats.submissionsByStatus).map(status => {
              let statusColor;
              let statusIcon;
              
              switch(status) {
                case 'pending':
                  statusColor = 'text-warning-600 bg-warning-200';
                  statusIcon = <Clock size={16} className="mr-1" />;
                  break;
                case 'selected':
                  statusColor = 'text-success-600 bg-success-200';
                  statusIcon = <CheckCircle size={16} className="mr-1" />;
                  break;
                case 'rejected':
                  statusColor = 'text-error-600 bg-error-200';
                  statusIcon = <XCircle size={16} className="mr-1" />;
                  break;
                case 'finalist':
                  statusColor = 'text-accent-600 bg-accent-200';
                  statusIcon = <Award size={16} className="mr-1" />;
                  break;
                default:
                  statusColor = 'text-gray-600 bg-gray-200';
                  statusIcon = null;
              }
              
              return (
                <div key={status} className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${statusColor} capitalize flex items-center`}>
                        {statusIcon}
                        {status}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-gray-600">
                        {stats.submissionsByStatus[status]}
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                    <div 
                      style={{ width: `${(stats.submissionsByStatus[status] / stats.totalSubmissions) * 100}%` }} 
                      className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${status === 'pending' ? 'bg-warning-500' : status === 'selected' ? 'bg-success-500' : status === 'rejected' ? 'bg-error-500' : status === 'finalist' ? 'bg-accent-500' : 'bg-gray-500'}`}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/admin/participants">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary-100 text-primary-600 mr-4">
                <Users size={24} />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Manage Participants</h3>
                <p className="text-sm text-gray-500">View and manage contest participants</p>
              </div>
            </div>
          </Card>
        </Link>
        
        <Link to="/admin/judges">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-accent-100 text-accent-600 mr-4">
                <Award size={24} />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Manage Judges</h3>
                <p className="text-sm text-gray-500">Assign and manage contest judges</p>
              </div>
            </div>
          </Card>
        </Link>
        
        <Link to="/admin/settings">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-secondary-100 text-secondary-600 mr-4">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Contest Settings</h3>
                <p className="text-sm text-gray-500">Configure contest parameters and rules</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;