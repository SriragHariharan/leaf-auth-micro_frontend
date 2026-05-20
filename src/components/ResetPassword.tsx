import { Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import '../index.scss';
import axios from 'axios';
import { AUTH_PATHS, authUrl } from '../constants/constants';
import { showErrorToast, showSuccessToast } from 'hostApp/toast';
import { useNavigate } from 'react-router';
import AuthBrand from './AuthBrand';
import { designRecipes } from 'hostApp/designRecipes';

interface FormData {
  password: string;
  confirmPassword: string;
}

const ResetPassword = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token');
    setToken(tokenParam);
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

  const validateConfirmPassword = (value: string) => {
    const password = watch('password');
    if (value !== password) {
      return 'Passwords do not match';
    }
    return true;
  };

  const onSubmit = (data: FormData) => {
    setLoading(true);
    axios.post(authUrl(AUTH_PATHS.resetPassword), 
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
        setLoading(false);
      });
  };

  return (
    <div className={designRecipes.authFormShell}>
      <div aria-hidden="true" className={designRecipes.authDecorBlurTop} />
      <div aria-hidden="true" className={designRecipes.authDecorBlurBottom} />
      <div className={designRecipes.authFormContent}>
        <AuthBrand className="mb-10" />

        <h2 className="text-3xl font-semibold tracking-tight text-ds-text-primary">Reset your password</h2>
        <p className="mt-2 text-ds-text-muted">Please enter a new password for your account</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <div>
            <label htmlFor="password" className={designRecipes.formLabel}>
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
                className={`peer ${designRecipes.inputWithIcon} pr-10 ${errors.password ? designRecipes.inputError : ''}`}
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
              <p className={designRecipes.formError}>
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className={designRecipes.formLabel}>
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
                  validate: validateConfirmPassword,
                })}
                className={`peer ${designRecipes.inputWithIcon} pr-10 ${errors.confirmPassword ? designRecipes.inputError : ''}`}
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
              <p className={designRecipes.formError}>
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button type="submit" className={designRecipes.buttonSubmitFull} disabled={loading}>
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
