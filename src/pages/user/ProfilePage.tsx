import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSupabase } from '../../contexts/SupabaseContext';
import { useToast } from '../../contexts/ToastContext';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

interface ProfileFormValues {
  fullName: string;
  email: string;
}

interface Submission {
  id: string;
  title: string;
  genre: string;
  status: string;
  stage: string;
  created_at: string;
}

const ProfilePage: React.FC = () => {
  const { user, profile, updateProfile } = useAuth();
  const { supabase } = useSupabase();
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);

  const { 
    register, 
    handleSubmit, 
    setValue,
    formState: { errors } 
  } = useForm<ProfileFormValues>();

  useEffect(() => {
    if (profile) {
      setValue('fullName', profile.full_name || '');
      setValue('email', profile.email || '');
    }
    
    if (user) {
      fetchSubmissions();
    }
  }, [profile, user, setValue]);

  const fetchSubmissions = async () => {
    if (!user) return;
    
    setIsLoadingSubmissions(true);
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setSubmissions(data as Submission[]);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setIsLoadingSubmissions(false);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      await updateProfile({
        full_name: data.fullName,
      });
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-warning-100 text-warning-800';
      case 'selected':
        return 'bg-success-100 text-success-800';
      case 'rejected':
        return 'bg-error-100 text-error-800';
      case 'finalist':
        return 'bg-accent-100 text-accent-800';
      case 'winner':
        return 'bg-primary-100 text-primary-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStageBadgeClass = (stage: string) => {
    switch (stage) {
      case 'submission':
        return 'bg-gray-100 text-gray-800';
      case 'manuscript':
        return 'bg-secondary-100 text-secondary-800';
      case 'voting':
        return 'bg-primary-100 text-primary-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRequestDataDeletion = async () => {
    if (!user) return;
    
    if (confirm('Are you sure you want to request deletion of all your data? This cannot be undone.')) {
      try {
        // Create a data deletion request
        const { error } = await supabase
          .from('deletion_requests')
          .insert({
            user_id: user.id,
            status: 'pending',
          });
          
        if (error) throw error;
        
        showToast({
          message: 'Your data deletion request has been submitted.',
          type: 'success',
        });
      } catch (error) {
        console.error('Error requesting data deletion:', error);
        showToast({
          message: 'Failed to submit data deletion request.',
          type: 'error',
        });
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
        <p className="mt-2 text-lg text-gray-600">
          Manage your personal information and track your submissions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="p-6">
            <div className="text-center mb-4">
              <div className="h-24 w-24 rounded-full bg-primary-100 mx-auto flex items-center justify-center">
                <User size={36} className="text-primary-600" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                {profile?.full_name || 'User'}
              </h2>
              <p className="text-gray-500">{profile?.role || 'participant'}</p>
            </div>
            
            <div className="mt-6 border-t pt-6">
              <h3 className="text-base font-medium text-gray-900 mb-4">Data Privacy</h3>
              <Button
                variant="outline"
                fullWidth
                onClick={handleRequestDataDeletion}
                className="text-error-600 border-error-300 hover:bg-error-50"
              >
                Request Data Deletion
              </Button>
              <p className="mt-2 text-xs text-gray-500">
                This will initiate the process to delete all your personal data in compliance with GDPR.
              </p>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  leftIcon={<User size={18} />}
                  {...register('fullName', {
                    required: 'Full name is required',
                  })}
                  error={errors.fullName?.message}
                />
                
                <Input
                  label="Email Address"
                  leftIcon={<Mail size={18} />}
                  disabled
                  {...register('email')}
                  helperText="Email cannot be changed"
                />
                
                <div className="pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isLoading}
                  >
                    Update Profile
                  </Button>
                </div>
              </div>
            </form>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Submissions</h2>
            
            {isLoadingSubmissions ? (
              <div className="text-center py-8">
                <div className="inline-block">
                  <svg className="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <AlertCircle size={36} className="text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">You haven't made any submissions yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Genre
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stage
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {submissions.map((submission) => (
                      <tr key={submission.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {submission.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {submission.genre}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(submission.status)} capitalize`}>
                            {submission.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStageBadgeClass(submission.stage)} capitalize`}>
                            {submission.stage}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(submission.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;