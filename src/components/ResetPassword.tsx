import { Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import '../index.scss';
import axios from 'axios';
import { LEAF_BACKEND_URL } from '../constants/constants';
import { showErrorToast, showSuccessToast } from '../helpers/toastify';
import { useNavigate } from 'react-router';
import AuthBrand from './AuthBrand';
import { designRecipes } from 'hostApp/designRecipes';

interface FormData {
  password: string;
  confirmPassword: string;
}

const ResetPassword = () => {
  const [loading, setLoading] = useState<boolean>(false); // Create loading state
  const [token, setToken] = useState<string | null>(null);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search); // Parse query string
    const tokenParam = params.get('token'); // Extract the 'token' parameter
    setToken(tokenParam); // Set the token value in state
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // Validate confirm password
  const validateConfirmPassword = (value: string) => {
    const password = watch('password');
    // Check if password matches confirmPassword
    if (value !== password) {
      return 'Passwords do not match';  // Return error message
    }
    return true;  // Return true if passwords match
  };

  const onSubmit = (data: FormData) => {
    setLoading(true); // Set loading to true when the request starts
    axios.post(LEAF_BACKEND_URL + "/user/auth/reset-password", 
      { ...data }, 
      {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        showSuccessToast(res?.data?.message);
        navigate("/login");
      })
      .catch(err => showErrorToast(err?.response?.data?.error?.message))
      .finally(() => {
        setLoading(false); // Set loading to false when the request is complete
      });
  };

  const inputBase = `${designRecipes.inputBase} peer h-11 border-transparent pl-10 pr-3 text-base`;
  const inputError = designRecipes.inputError;

  return (
    <div className="relative h-full w-full flex flex-col justify-center items-center px-8 lg:px-16 overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-ds-brand-100/50 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-ds-brand-50/70 blur-3xl"
      />
      <div className="relative w-full max-w-md">
        <AuthBrand className="mb-10" />

        <h2 className="text-3xl font-semibold tracking-tight text-ds-text-primary">Reset your password</h2>
        <p className="mt-2 text-ds-text-muted">Please enter a new password for your account</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ds-text-secondary">
              New Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ds-text-muted peer-focus:text-ds-brand-600 transition-colors" />
              <input
                id="password"
                type={showPwd ? 'text' : 'password'}
                placeholder="Create a strong password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                })}
                className={`${inputBase} pr-10 ${errors.password ? inputError : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ds-text-muted hover:text-ds-text-secondary transition-colors"
                aria-label={showPwd ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-ds-state-danger">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-ds-text-secondary">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ds-text-muted peer-focus:text-ds-brand-600 transition-colors" />
              <input
                id="confirmPassword"
                type={showConfirmPwd ? 'text' : 'password'}
                placeholder="Re-enter your new password"
                {...register('confirmPassword', {
                  required: 'Confirm password is required',
                  validate: validateConfirmPassword, // Custom validation for matching passwords
                })}
                className={`${inputBase} pr-10 ${errors.confirmPassword ? inputError : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPwd((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ds-text-muted hover:text-ds-text-secondary transition-colors"
                aria-label={showConfirmPwd ? 'Hide confirm password' : 'Show confirm password'}
                tabIndex={-1}
              >
                {showConfirmPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-ds-state-danger">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className={`${designRecipes.buttonPrimary} flex h-11 w-full items-center justify-center gap-2 px-4 shadow-dsBrand active:scale-[0.99] ${loading ? 'cursor-not-allowed shadow-none' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Resetting...
              </>
            ) : (
              'Reset password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;