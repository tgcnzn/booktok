import React, { useEffect, useState } from 'react';
import { useSupabase } from '../../contexts/SupabaseContext';
import { useToast } from '../../contexts/ToastContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Search, User, CheckCircle, XCircle, Trash2, Edit, Database } from 'lucide-react';

interface Participant {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  submission_count: number;
}

const ParticipantsPage: React.FC = () => {
  const { supabase } = useSupabase();
  const { showToast } = useToast();
  
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDeletionRequests, setShowDeletionRequests] = useState(false);
  const [deletionRequests, setDeletionRequests] = useState<any[]>([]);

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    setIsLoading(true);
    try {
      // Using Supabase function to join profiles with submission counts
      const { data, error } = await supabase.rpc('get_participants_with_submissions');
      
      if (error) throw error;
      
      setParticipants(data || []);
    } catch (error) {
      console.error('Error fetching participants:', error);
      showToast({
        message: 'Failed to load participants',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDeletionRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('deletion_requests')
        .select(`
          id,
          user_id,
          status,
          created_at,
          profiles (
            email,
            full_name
          )
        `)
        .eq('status', 'pending');
      
      if (error) throw error;
      
      setDeletionRequests(data || []);
      setShowDeletionRequests(true);
    } catch (error) {
      console.error('Error fetching deletion requests:', error);
      showToast({
        message: 'Failed to load deletion requests',
        type: 'error',
      });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredParticipants = participants.filter(participant => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      participant.email.toLowerCase().includes(searchTerm) ||
      participant.full_name.toLowerCase().includes(searchTerm)
    );
  });

  const toggleSelectParticipant = (id: string) => {
    if (selectedParticipants.includes(id)) {
      setSelectedParticipants(selectedParticipants.filter(pId => pId !== id));
    } else {
      setSelectedParticipants([...selectedParticipants, id]);
    }
  };

  const selectAllParticipants = () => {
    if (selectedParticipants.length === filteredParticipants.length) {
      setSelectedParticipants([]);
    } else {
      setSelectedParticipants(filteredParticipants.map(p => p.id));
    }
  };

  const handleDeleteParticipants = async () => {
    if (!selectedParticipants.length) return;
    
    if (confirm(`Are you sure you want to delete ${selectedParticipants.length} participant(s)? This action cannot be undone.`)) {
      setIsProcessing(true);
      try {
        // Delete participants (this would need RLS policies to be set up correctly)
        const { error } = await supabase
          .from('profiles')
          .delete()
          .in('id', selectedParticipants);
        
        if (error) throw error;
        
        showToast({
          message: `Successfully deleted ${selectedParticipants.length} participant(s)`,
          type: 'success',
        });
        
        setSelectedParticipants([]);
        fetchParticipants();
      } catch (error) {
        console.error('Error deleting participants:', error);
        showToast({
          message: 'Failed to delete participants',
          type: 'error',
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleDeletionRequest = async (requestId: string, userId: string, approve: boolean) => {
    setIsProcessing(true);
    try {
      if (approve) {
        // Delete user data
        const { error: profileError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userId);
        
        if (profileError) throw profileError;
        
        // Update request status
        const { error: requestError } = await supabase
          .from('deletion_requests')
          .update({ status: 'completed' })
          .eq('id', requestId);
        
        if (requestError) throw requestError;
        
        showToast({
          message: 'User data deleted successfully',
          type: 'success',
        });
      } else {
        // Reject request
        const { error } = await supabase
          .from('deletion_requests')
          .update({ status: 'rejected' })
          .eq('id', requestId);
        
        if (error) throw error;
        
        showToast({
          message: 'Deletion request rejected',
          type: 'info',
        });
      }
      
      // Refresh deletion requests
      fetchDeletionRequests();
      fetchParticipants();
    } catch (error) {
      console.error('Error processing deletion request:', error);
      showToast({
        message: 'Failed to process deletion request',
        type: 'error',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Participants</h1>
        <div className="flex items-center space-x-3">
          <Button
            variant={showDeletionRequests ? "primary" : "outline"}
            size="sm"
            onClick={() => {
              if (!showDeletionRequests) {
                fetchDeletionRequests();
              } else {
                setShowDeletionRequests(false);
              }
            }}
            leftIcon={<Database size={18} />}
          >
            {showDeletionRequests ? "Show Participants" : "Deletion Requests"}
          </Button>
          {!showDeletionRequests && (
            <Button
              variant="primary"
              size="sm"
              onClick={fetchParticipants}
              leftIcon={<User size={18} />}
            >
              Refresh List
            </Button>
          )}
        </div>
      </div>

      {/* Search and Bulk Actions */}
      {!showDeletionRequests && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
            <div className="w-full md:w-64">
              <Input
                placeholder="Search participants..."
                leftIcon={<Search size={18} />}
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={selectAllParticipants}
              >
                {selectedParticipants.length === filteredParticipants.length && filteredParticipants.length > 0
                  ? "Deselect All"
                  : "Select All"}
              </Button>
              {selectedParticipants.length > 0 && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleDeleteParticipants}
                  isLoading={isProcessing}
                  leftIcon={<Trash2 size={18} />}
                >
                  Delete Selected ({selectedParticipants.length})
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Participant List */}
      {!showDeletionRequests ? (
        <Card>
          {isLoading ? (
            <div className="text-center p-8">
              <div className="inline-block">
                <svg className="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </div>
          ) : filteredParticipants.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-gray-500">No participants found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        checked={selectedParticipants.length === filteredParticipants.length && filteredParticipants.length > 0}
                        onChange={selectAllParticipants}
                      />
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submissions
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredParticipants.map((participant) => (
                    <tr key={participant.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          checked={selectedParticipants.includes(participant.id)}
                          onChange={() => toggleSelectParticipant(participant.id)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <User size={16} className="text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {participant.full_name || 'Anonymous'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{participant.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                          {participant.submission_count}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(participant.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-primary-600 hover:text-primary-900 mr-3">
                          <Edit size={18} />
                        </button>
                        <button className="text-error-600 hover:text-error-900">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      ) : (
        // Deletion Requests
        <Card>
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">GDPR Data Deletion Requests</h2>
            <p className="text-sm text-gray-600">
              Requests from users to delete their personal data in compliance with GDPR regulations.
            </p>
          </div>
          
          {deletionRequests.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-gray-500">No pending deletion requests</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Request Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {deletionRequests.map((request) => (
                    <tr key={request.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <User size={16} className="text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {request.profiles?.full_name || 'Anonymous'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{request.profiles?.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(request.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          className="text-success-600 hover:text-success-900 mr-3"
                          onClick={() => handleDeletionRequest(request.id, request.user_id, true)}
                          disabled={isProcessing}
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button 
                          className="text-error-600 hover:text-error-900"
                          onClick={() => handleDeletionRequest(request.id, request.user_id, false)}
                          disabled={isProcessing}
                        >
                          <XCircle size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default ParticipantsPage;