import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSupabase } from '../../contexts/SupabaseContext';
import { useToast } from '../../contexts/ToastContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface Submission {
  id: string;
  title: string;
  genre: string;
  status: string;
  stage: string;
  created_at: string;
}

const ManuscriptPage: React.FC = () => {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [manuscript, setManuscript] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    
    const fetchSubmission = async () => {
      try {
        // First check if user has a selected submission for manuscript stage
        const { data, error } = await supabase
          .from('submissions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'selected')
          .eq('stage', 'manuscript')
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          setSubmission(data as Submission);
          
          // Check if manuscript already exists
          if (data.manuscript_url) {
            setManuscript(data.manuscript_url);
          }
        } else {
          // If not found, redirect to submission page
          showToast({
            message: 'You need to be selected for the manuscript stage first.',
            type: 'info',
          });
          navigate('/submission');
        }
      } catch (error) {
        console.error('Error fetching submission:', error);
        showToast({
          message: 'Failed to load your submission.',
          type: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmission();
  }, [user, supabase, navigate, showToast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type (PDF only)
      if (selectedFile.type !== 'application/pdf') {
        showToast({
          message: 'Only PDF files are accepted.',
          type: 'error',
        });
        return;
      }
      
      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        showToast({
          message: 'File size cannot exceed 10MB.',
          type: 'error',
        });
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !submission || !user) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `manuscripts/${submission.id}/${fileName}`;
      
      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('contest-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          onUploadProgress: (progress) => {
            setUploadProgress(Math.round((progress.loaded / progress.total) * 100));
          },
        });

      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('contest-files')
        .getPublicUrl(filePath);
      
      // Update submission with manuscript URL
      const { error: updateError } = await supabase
        .from('submissions')
        .update({
          manuscript_url: urlData.publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', submission.id);

      if (updateError) throw updateError;
      
      setManuscript(urlData.publicUrl);
      showToast({
        message: 'Your manuscript has been uploaded successfully!',
        type: 'success',
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      showToast({
        message: error.message || 'Failed to upload manuscript.',
        type: 'error',
      });
    } finally {
      setIsUploading(false);
      setFile(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Card elevation="md" className="p-8 text-center">
          <AlertCircle size={48} className="text-warning-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Not Eligible for Manuscript Submission</h2>
          <p className="text-gray-600 mb-6">
            You need to be selected in the first stage to submit a manuscript.
          </p>
          <Button
            variant="primary"
            onClick={() => navigate('/submission')}
          >
            Go to Submission Page
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manuscript Submission</h1>
        <p className="mt-2 text-lg text-gray-600">
          Stage 2: Upload your complete manuscript for evaluation
        </p>
      </div>

      <Card elevation="md" className="p-6 md:p-8">
        <div className="bg-success-50 p-4 rounded-lg mb-6">
          <div className="flex">
            <CheckCircle size={24} className="text-success-500 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-success-700">Congratulations!</h3>
              <p className="text-success-600">
                Your submission "{submission.title}" has been selected for the manuscript stage. 
                Please upload your complete manuscript in PDF format.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Submission Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <p className="text-sm text-gray-500">Title</p>
              <p className="text-gray-900 font-medium">{submission.title}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Genre</p>
              <p className="text-gray-900 font-medium capitalize">{submission.genre}</p>
            </div>
          </div>
        </div>

        {manuscript ? (
          <div className="bg-primary-50 p-6 rounded-lg mb-6">
            <div className="flex items-center mb-4">
              <FileText size={24} className="text-primary-600 mr-2" />
              <h3 className="text-lg font-medium text-primary-800">Manuscript Uploaded</h3>
            </div>
            <p className="text-primary-700 mb-4">
              Your manuscript has been successfully uploaded and is ready for review.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={() => window.open(manuscript, '_blank')}
              >
                View Manuscript
              </Button>
              <Button
                variant="secondary"
                onClick={() => setManuscript(null)}
              >
                Replace Manuscript
              </Button>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-6">
            <FileText size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Your Manuscript</h3>
            <p className="text-gray-600 mb-4">
              Please upload your complete manuscript in PDF format (max 10MB).
            </p>
            
            {isUploading ? (
              <div className="w-full max-w-md mx-auto">
                <div className="mb-2 flex justify-between text-sm text-gray-600">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary-600 h-2.5 rounded-full" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <>
                <input
                  type="file"
                  id="manuscript"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="flex flex-col sm:flex-row justify-center gap-4 items-center">
                  <label
                    htmlFor="manuscript"
                    className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Select PDF File
                  </label>
                  {file && (
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-3">{file.name}</span>
                      <Button
                        variant="primary"
                        leftIcon={<Upload size={16} />}
                        onClick={handleUpload}
                      >
                        Upload
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-3">What Happens Next?</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Our jury will evaluate all manuscripts from selected participants.</li>
            <li>Two finalists per genre will be selected to proceed to the public voting stage.</li>
            <li>Finalists will be notified via email and must confirm their participation.</li>
            <li>Public voting will determine one winner per genre.</li>
          </ol>
        </div>
      </Card>
    </div>
  );
};

export default ManuscriptPage;