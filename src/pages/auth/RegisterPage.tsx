import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import ReCAPTCHA from 'react-google-recaptcha';
import { Lock, Mail, User, UserCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

interface RegisterFormValues {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  agreeTerms: boolean;
}

const RegisterPage: React.FC = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = React.createRef<ReCAPTCHA>();

  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm<RegisterFormValues>();

  const password = watch('password', '');

  const onSubmit = async (data: RegisterFormValues) => {
    if (!data.agreeTerms || !captchaToken) {
      showToast({
        message: !captchaToken ? 'Please complete the CAPTCHA verification' : 'You must agree to the terms',
        type: 'error'
      });
      return;
    }

    setIsLoading(true);
    try {
      await signUp(data.email, data.password, {
        full_name: data.fullName,
        role: 'participant',
      });
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-500">
              Sign in
            </Link>
          </p>
        </div>

        <Card elevation="lg" className="px-8 py-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Full Name"
              type="text"
              leftIcon={<User size={18} />}
              {...register('fullName', {
                required: 'Full name is required',
              })}
              error={errors.fullName?.message}
            />

            <Input
              label="Email address"
              type="email"
              leftIcon={<Mail size={18} />}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Please enter a valid email',
                },
              })}
              error={errors.email?.message}
            />

            <Input
              label="Password"
              type="password"
              leftIcon={<Lock size={18} />}
              helperText="Must be at least 6 characters"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              error={errors.password?.message}
            />

            <Input
              label="Confirm Password"
              type="password"
              leftIcon={<Lock size={18} />}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: value =>
                  value === password || 'The passwords do not match',
              })}
              error={errors.confirmPassword?.message}
            />

            <div className="bg-primary-50 p-4 rounded-lg flex items-start">
              <AlertCircle size={20} className="text-primary-600 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-primary-700">
                Only participants can register directly. Judges are invited by administrators.
              </p>
            </div>

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
                  <Link to="/terms" className="text-primary-600 hover:text-primary-500">
                    Terms and Conditions
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy-policy" className="text-primary-600 hover:text-primary-500">
                    Privacy Policy
                  </Link>
                </label>
                {errors.agreeTerms && (
                  <p className="mt-1 text-sm text-error-600">{errors.agreeTerms.message}</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-center mb-4">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                onChange={(token) => setCaptchaToken(token)}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              leftIcon={<UserCheck size={18} />}
            >
              Create Account
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;