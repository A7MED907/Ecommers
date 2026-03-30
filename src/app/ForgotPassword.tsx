import { useState } from 'react';
import { useNavigate } from 'react-router';
import { authAPI } from '../services/api';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'verify' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ================ Validation ================
  const validateEmail = () => {
    const errors: string[] = [];

    if (!email.trim()) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Please enter a valid email address');
    }

    return errors;
  };

  const validateResetCode = () => {
    const errors: string[] = [];

    if (!resetCode.trim()) {
      errors.push('Reset code is required');
    } else if (resetCode.length < 6) {
      errors.push('Reset code must be at least 6 characters');
    }

    return errors;
  };

  const validatePassword = () => {
    const errors: string[] = [];

    if (!newPassword.trim()) {
      errors.push('New password is required');
    } else if (newPassword.length < 6) {
      errors.push('Password must be at least 6 characters');
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      errors.push('Password must contain at least one uppercase letter, one lowercase letter, and one number');
    }

    if (!confirmPassword.trim()) {
      errors.push('Please confirm your password');
    } else if (newPassword !== confirmPassword) {
      errors.push('Passwords do not match');
    }

    return errors;
  };

  // ================ Step 1: Email Submission ================
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    const errors = validateEmail();
    if (errors.length > 0) {
      toast.error(errors[0]);
      return;
    }

    try {
      setIsLoading(true);
      await authAPI.forgotPassword(email);
      toast.success('Reset code sent to your email');
      setStep('verify');
    } catch (error: any) {
      console.error('Forgot password error:', error);
      
      let errorMessage = 'Failed to send reset code. Please try again.';
      
      if (error.message) {
        if (error.message.includes('404') || error.message.includes('not found')) {
          errorMessage = 'Email address not found. Please check your email or register.';
        } else if (error.message.includes('400') || error.message.includes('bad request')) {
          errorMessage = 'Invalid email address. Please enter a valid email.';
        } else if (error.message.includes('429') || error.message.includes('too many')) {
          errorMessage = 'Too many requests. Please wait a few minutes before trying again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // ================ Step 2: Verify Reset Code ================
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate reset code
    const errors = validateResetCode();
    if (errors.length > 0) {
      toast.error(errors[0]);
      return;
    }

    try {
      setIsLoading(true);
      await authAPI.verifyResetCode(resetCode);
      toast.success('Code verified successfully');
      setStep('reset');
    } catch (error: any) {
      console.error('Verify code error:', error);
      
      let errorMessage = 'Invalid reset code. Please try again.';
      
      if (error.message) {
        if (error.message.includes('400') || error.message.includes('invalid') || error.message.includes('expired')) {
          errorMessage = 'Invalid or expired reset code. Please request a new one.';
        } else if (error.message.includes('429') || error.message.includes('too many')) {
          errorMessage = 'Too many attempts. Please wait a few minutes before trying again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // ================ Step 3: Reset Password ================
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password
    const errors = validatePassword();
    if (errors.length > 0) {
      toast.error(errors[0]);
      return;
    }

    try {
      setIsLoading(true);
      await authAPI.resetPassword(email, newPassword);
      toast.success('Password reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error: any) {
      console.error('Reset password error:', error);
      
      let errorMessage = 'Failed to reset password. Please try again.';
      
      if (error.message) {
        if (error.message.includes('400') || error.message.includes('bad request')) {
          errorMessage = 'Invalid request. Please try again.';
        } else if (error.message.includes('401') || error.message.includes('unauthorized')) {
          errorMessage = 'Session expired. Please start the password reset process again.';
        } else if (error.message.includes('429') || error.message.includes('too many')) {
          errorMessage = 'Too many attempts. Please wait a few minutes before trying again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              Reset Your Password
            </h1>
            <p className="text-blue-100">
              {step === 'email' && 'Enter your email to receive a reset code'}
              {step === 'verify' && 'Enter the code sent to your email'}
              {step === 'reset' && 'Create a new password'}
            </p>
          </div>

          {/* Form Container */}
          <div className="p-8">
            {/* Step 1: Email */}
            {step === 'email' && (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Reset Code
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Step 2: Verify Code */}
            {step === 'verify' && (
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reset Code
                  </label>
                  <input
                    type="text"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    placeholder="Enter the 6-digit code from your email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify Code
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="w-full text-blue-600 hover:text-blue-700 font-medium py-2"
                  disabled={isLoading}
                >
                  Back to Email
                </button>
              </form>
            )}

            {/* Step 3: Reset Password */}
            {step === 'reset' && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Resetting...
                    </>
                  ) : (
                    <>
                      Reset Password
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('verify')}
                  className="w-full text-blue-600 hover:text-blue-700 font-medium py-2"
                  disabled={isLoading}
                >
                  Back to Verification
                </button>
              </form>
            )}

            {/* Footer Link */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600 text-sm">
                Remember your password?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                  disabled={isLoading}
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
