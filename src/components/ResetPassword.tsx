import { Leaf } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import zxcvbn from 'zxcvbn';

import '../index.scss'
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import { LEAF_BACKEND_URL } from '../constants/constants';
import { showErrorToast, showSuccessToast } from '../helpers/toastify';
import { useNavigate } from 'react-router';

interface FormData {
  password: string;
  confirmPassword: string;
}

const ResetPassword = () => {
  const [passwordStrength, setPasswordStrength] = useState<string>('');
  const [passwordScore, setPasswordScore] = useState<number>(0);

    const [token, setToken] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
      const params = new URLSearchParams(window.location.search); // Parse query string
      const tokenParam = params.get('token'); // Extract the 'token' parameter
      setToken(tokenParam); // Set the token value in state
    }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  // Handle password strength
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    const result = zxcvbn(password);

    setPasswordStrength(result.feedback.suggestions.join(' '));
    setPasswordScore(result.score);
  };

  // Validate confirm password
  const validateConfirmPassword = (value: string) => {
    // Check if password matches confirmPassword
    if (value !== password) {
      return 'Passwords do not match';  // Return error message
    }
    return true;  // Return true if passwords match
  };

  const onSubmit = (data: FormData) => {
    console.log(data);
    axios.post(LEAF_BACKEND_URL + "/user/auth/reset-password", 
      { ...data }, 
      {
        headers: {'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        navigate("/login")
        showSuccessToast(res?.data?.message);
      })
      .catch(err => showErrorToast(err?.response?.data?.error?.message));

  };

  // Function to determine the strength level for display
  const getStrengthLabel = (score: number): string => {
    switch (score) {
      case 0:
        return 'Very Weak';
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Strong';
      case 4:
        return 'Very Strong';
      default:
        return '';
    }
  };

  return (
    <div className="h-full w-full flex flex-col justify-center items-center px-8 lg:px-16">
      <ToastContainer />
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <Leaf className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-900">leaf</h1>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Reset Your Password</h2>
        <p className="text-gray-600 mb-8">Please enter a new password for your account</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              id="password"
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
              onChange={handlePasswordChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword', {
                required: 'Confirm password is required',
                validate: validateConfirmPassword, // Custom validation for matching passwords
              })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>}
          </div>

          {/* Password Strength Meter */}
          <div className="mt-2">
            <p className="text-sm text-gray-600">Password Strength: {getStrengthLabel(passwordScore)}</p>
            <div className="w-full h-1 mt-1 bg-gray-200">
              <div
                className={`h-full ${passwordScore === 0 ? 'bg-red-600' : passwordScore === 1 ? 'bg-yellow-500' : passwordScore === 2 ? 'bg-orange-400' : passwordScore === 3 ? 'bg-green-400' : 'bg-green-600'}`}
                style={{ width: `${(passwordScore / 4) * 100}%` }}
              />
            </div>
            {passwordStrength && <p className="text-sm text-gray-500 mt-1">{passwordStrength}</p>}
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-green-600 py-2 px-4 text-white font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Reset Password
          </button>
        </form>

      </div>
    </div>
  );
};

export default ResetPassword;