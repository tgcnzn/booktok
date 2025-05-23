import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSupabase } from '../../contexts/SupabaseContext';
import { useToast } from '../../contexts/ToastContext';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

interface SubmissionFormValues {
  title: string;
  genre: 'fiction' | 'non-fiction' | 'poetry';
  videoUrl: string;
  synopsis: string;
  agreeTerms: boolean;
}

const SubmissionPage: React.FC = () => {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm<SubmissionFormValues>();

  const onSubmit = async (data: SubmissionFormValues) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Validate video URL (simple validation for demo)
      if (!isValidVideoUrl(data.videoUrl)) {
        throw new Error('Please enter a valid YouTube or TikTok URL');
      }
      
      // Save submission to Supabase
      const { error } = await supabase
        .from('submissions')
        .insert({
          user_id: user.id,
          title: data.title,
          genre: data.genre,
          video_url: data.videoUrl,
          synopsis: data.synopsis,
          stage: 'submission',
          status: 'pending',
        });

      if (error) throw error;

      showToast({
        message: 'Your submission has been received successfully!',
        type: 'success',
      });
      
      reset();
    } catch (error: any) {
      showToast({
        message: error.message || 'Failed to submit. Please try again.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isValidVideoUrl = (url: string) => {
    // Basic validation for YouTube and TikTok URLs
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    const tiktokRegex = /^(https?:\/\/)?(www\.)?(tiktok\.com)\/.+$/;
    return youtubeRegex.test(url) || tiktokRegex.test(url);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Submit Your Entry</h1>
        <p className="mt-2 text-lg text-gray-600">
          Stage 1: Submit your video and synopsis for initial evaluation
        </p>
      </div>

      <Card elevation="md" className="p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Submission Title"
              placeholder="Enter the title of your work"
              {...register('title', {
                required: 'Title is required',
                maxLength: {
                  value: 100,
                  message: 'Title cannot exceed 100 characters',
                },
              })}
              error={errors.title?.message}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Genre
              </label>
              <select
                className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 focus:outline-none transition-colors"
                {...register('genre', {
                  required: 'Please select a genre',
                })}
              >
                <option value="">Select a genre</option>
                <option value="fiction">Fiction</option>
                <option value="non-fiction">Non-Fiction</option>
                <option value="poetry">Poetry</option>
              </select>
              {errors.genre && (
                <p className="mt-1 text-sm text-error-600">{errors.genre.message}</p>
              )}
            </div>
          </div>

          <Input
            label="Video URL"
            placeholder="Enter YouTube or TikTok URL"
            helperText="Share a video about your work (max 3 minutes)"
            leftIcon={<Link size={18} />}
            {...register('videoUrl', {
              required: 'Video URL is required',
              validate: value => 
                isValidVideoUrl(value) || 'Please enter a valid YouTube or TikTok URL',
            })}
            error={errors.videoUrl?.message}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Synopsis
            </label>
            <textarea
              rows={6}
              className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 focus:outline-none transition-colors"
              placeholder="Write a comprehensive synopsis of your work (max 5000 characters)"
              {...register('synopsis', {
                required: 'Synopsis is required',
                minLength: {
                  value: 200,
                  message: 'Synopsis must be at least 200 characters',
                },
                maxLength: {
                  value: 5000,
                  message: 'Synopsis cannot exceed 5000 characters',
                },
              })}
            ></textarea>
            {errors.synopsis && (
              <p className="mt-1 text-sm text-error-600">{errors.synopsis.message}</p>
            )}
          </div>

          <div className="bg-primary-50 p-4 rounded-lg">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agree-terms"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  {...register('agreeTerms', {
                    required: 'You must agree to the terms and conditions',
                  })}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agree-terms" className="text-gray-700">
                  I agree to the{' '}
                  <a href="/terms" className="text-primary-600 hover:text-primary-500">
                    Terms and Conditions
                  </a>{' '}
                  and confirm that this is my original work. I understand and consent to the processing of my personal data as described in the{' '}
                  <a href="/privacy-policy" className="text-primary-600 hover:text-primary-500">
                    Privacy Policy
                  </a>.
                </label>
                {errors.agreeTerms && (
                  <p className="mt-1 text-sm text-error-600">{errors.agreeTerms.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
            >
              Submit Entry
            </Button>
          </div>
        </form>
      </Card>

      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-3">What Happens Next?</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Our judges will review all submissions and select 10 entries per genre.</li>
          <li>Selected participants will be notified via email within 30 days.</li>
          <li>If selected, you'll be invited to upload your full manuscript for the next stage.</li>
        </ol>
      </div>
    </div>
  );
};

export default SubmissionPage;