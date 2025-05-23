import React, { useEffect, useState } from 'react';
import { useSupabase } from '../../contexts/SupabaseContext';
import { useToast } from '../../contexts/ToastContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Search, User, UserPlus, Edit, Trash2, Award } from 'lucide-react';

interface Judge {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  assigned_genre?: string;
  evaluation_count: number;
}

const JudgesPage: React.FC = () => {
  const { supabase } = useSupabase();
  const { showToast } = useToast();
  
  const [judges, setJudges] = useState<Judge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddJudgeForm, setShowAddJudgeForm] = useState(false);
  const [newJudgeEmail, setNewJudgeEmail] = useState('');
  const [newJudgeName, setNewJudgeName] = useState('');
  const [newJudgeGenre, setNewJudgeGenre] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchJudges();
  }, []);

  const fetchJudges = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_judges_with_evaluations');
      
      if (error) throw error;
      
      setJudges(data || []);
    } catch (error) {
      console.error('Error fetching judges:', error);
      showToast({
        message: 'Failed to load judges',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredJudges = judges.filter(judge => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      judge.email.toLowerCase().includes(searchTerm) ||
      judge.full_name.toLowerCase().includes(searchTerm) ||
      (judge.assigned_genre && judge.assigned_genre.toLowerCase().includes(searchTerm))
    );
  });

  const handleAddJudge = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newJudgeEmail || !newJudgeName) {
      showToast({
        message: 'Email and name are required',
        type: 'error',
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // First check if user already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('email', newJudgeEmail)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      if (existingUser) {
        // Update role to judge if user exists
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            role: 'judge',
            full_name: newJudgeName,
            assigned_genre: newJudgeGenre || null,
          })
          .eq('id', existingUser.id);
        
        if (updateError) throw updateError;
        
        showToast({
          message: 'User updated to judge role successfully',
          type: 'success',
        });
      } else {
        // Create a new user with judge role
        // In a real app, you'd use auth.admin.createUser or invite via email
        // This is simplified for the demo
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            email: newJudgeEmail,
            full_name: newJudgeName,
            role: 'judge',
            assigned_genre: newJudgeGenre || null,
          });
        
        if (insertError) throw insertError;
        
        showToast({
          message: 'Judge added successfully',
          type: 'success',
        });
      }
      
      // Reset form and refresh judge list
      setNewJudgeEmail('');
      setNewJudgeName('');
      setNewJudgeGenre('');
      setShowAddJudgeForm(false);
      fetchJudges();
    } catch (error: any) {
      console.error('Error adding judge:', error);
      showToast({
        message: error.message || 'Failed to add judge',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteJudge = async (judgeId: string) => {
    if (confirm('Are you sure you want to remove this judge? This action cannot be undone.')) {
      try {
        // In a real app, you might just change the role instead of deleting
        const { error } = await supabase
          .from('profiles')
          .update({ role: 'participant' })
          .eq('id', judgeId);
        
        if (error) throw error;
        
        showToast({
          message: 'Judge removed successfully',
          type: 'success',
        });
        
        fetchJudges();
      } catch (error) {
        console.error('Error removing judge:', error);
        showToast({
          message: 'Failed to remove judge',
          type: 'error',
        });
      }
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Judges</h1>
        <div className="flex items-center space-x-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAddJudgeForm(!showAddJudgeForm)}
            leftIcon={<UserPlus size={18} />}
          >
            {showAddJudgeForm ? "Cancel" : "Add Judge"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchJudges}
            leftIcon={<Award size={18} />}
          >
            Refresh List
          </Button>
        </div>
      </div>

      {/* Add Judge Form */}
      {showAddJudgeForm && (
        <Card className="mb-6 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Judge</h2>
          <form onSubmit={handleAddJudge}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Input
                label="Email"
                type="email"
                value={newJudgeEmail}
                onChange={(e) => setNewJudgeEmail(e.target.value)}
                placeholder="judge@example.com"
                required
              />
              <Input
                label="Full Name"
                type="text"
                value={newJudgeName}
                onChange={(e) => setNewJudgeName(e.target.value)}
                placeholder="John Doe"
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned Genre
                </label>
                <select
                  value={newJudgeGenre}
                  onChange={(e) => setNewJudgeGenre(e.target.value)}
                  className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 focus:outline-none transition-colors"
                >
                  <option value="">No genre assigned</option>
                  <option value="fiction">Fiction</option>
                  <option value="non-fiction">Non-Fiction</option>
                  <option value="poetry">Poetry</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
              >
                Add Judge
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="w-full md:w-64">
          <Input
            placeholder="Search judges..."
            leftIcon={<Search size={18} />}
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Judges List */}
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
        ) : filteredJudges.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-gray-500">No judges found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned Genre
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Evaluations
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredJudges.map((judge) => (
                  <tr key={judge.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                          <Award size={16} className="text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {judge.full_name || 'Anonymous'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{judge.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {judge.assigned_genre ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800 capitalize">
                          {judge.assigned_genre}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">Not assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {judge.evaluation_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-primary-600 hover:text-primary-900 mr-3">
                        <Edit size={18} />
                      </button>
                      <button 
                        className="text-error-600 hover:text-error-900"
                        onClick={() => handleDeleteJudge(judge.id)}
                      >
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
    </div>
  );
};

export default JudgesPage;