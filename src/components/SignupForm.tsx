import axios from 'axios';
import { User, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { GOOGLE_OAUTH_CLIENT_ID, LEAF_BACKEND_URL, LEAF_USER_ID } from '../constants/constants';
import { showErrorToast } from '../helpers/toastify';

import '../index.scss'
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import AuthBrand from './AuthBrand';
import { designRecipes } from 'hostApp/designRecipes';

interface FormData {
  username: string;
  email: string;
  password: string;
}

const SignupForm = () => {
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: FormData) => {
    setLoading(true);
    axios.post(LEAF_BACKEND_URL + "/user/auth/signup", { ...data })
      .then(resp => {
        localStorage.setItem(LEAF_USER_ID, resp?.data?.data?.userID);
        navigate("/confirm-otp");
      })
      .catch(err => showErrorToast(err?.response?.data?.error?.message))
      .finally(() => {
        setLoading(false);
      });
  };

  /* handle oauth signup */
  const useGlobalStore = async () => {
    const { default: globalStore } = await import('hostApp/GlobalStore'); // Import the Zustand store
    return globalStore;
  };

  const handleOauthSignup = async(data:Object) => {
    const globalStore = await useGlobalStore();

    axios.post(LEAF_BACKEND_URL + "/user/auth/oauth-signup", { ...data })
      .then(resp => {
        const { accessToken, refreshToken, username, profilePicture } = resp?.data?.data;
        globalStore.getState().setAccessToken(accessToken);
        globalStore.getState().setRefreshToken(refreshToken);
        globalStore.getState().setUsername(username);
        globalStore.getState().setProfilePic(profilePicture);
        navigate("/");
      })
      .catch(err => showErrorToast(err?.response?.data?.error?.message));
  }

  const inputBase =
    `${designRecipes.inputBase} peer h-11 border-transparent pl-10 pr-3 text-base`;
  const inputError = designRecipes.inputError;

  return (
    <GoogleOAuthProvider clientId={GOOGLE_OAUTH_CLIENT_ID || ''}>
      <div className="relative h-full w-full flex flex-col justify-center items-center px-8 lg:px-16 py-10 overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-ds-brand-100/50 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-ds-brand-50/70 blur-3xl"
        />

        <div className="relative w-full max-w-md">
          <AuthBrand className="mb-8" />

          {/* Heading */}
          <h2 className="text-3xl font-semibold tracking-tight text-ds-text-primary">Create an account</h2>
          <p className="mt-2 text-ds-text-muted">Please enter your details to sign up</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-ds-text-secondary mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ds-text-muted peer-focus:text-ds-brand-600 transition-colors" />
                <input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  {...register('username', { required: 'Username is required' })}
                  className={`${inputBase} ${errors.username ? inputError : ''}`}
                />
              </div>
              {errors.username && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-ds-state-danger">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ds-text-secondary mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ds-text-muted peer-focus:text-ds-brand-600 transition-colors" />
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: 'Invalid email address',
                    },
                  })}
                  className={`${inputBase} ${errors.email ? inputError : ''}`}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-ds-state-danger">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ds-text-secondary mb-1.5">
                Password
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

            <button
              type="submit"
              disabled={loading}
              className={`${designRecipes.buttonPrimary} flex h-11 w-full items-center justify-center gap-2 px-4 shadow-dsBrand active:scale-[0.99] ${
                loading
                  ? 'cursor-not-allowed shadow-none'
                  : ''
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account…
                </>
              ) : (
                'Sign up'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-ds-border-subtle" />
            <span className="text-xs font-medium uppercase tracking-wider text-ds-text-muted">
              or continue with
            </span>
            <div className="h-px flex-1 bg-ds-border-subtle" />
          </div>

          {/* Google */}
          <div className="flex justify-center">
            <GoogleLogin
              theme="outline"
              size="large"
              width="368"
              shape="rectangular"
              text="continue_with"
              onSuccess={credentialResponse => {
                const jsonData = jwtDecode(credentialResponse?.credential!)
                console.log(jsonData);
                handleOauthSignup({...jsonData, provider: "google"})
              }}
              onError={() => {
                console.log('Login Failed');
              }}
            />
          </div>

          <p className="mt-8 text-center text-sm text-ds-text-secondary">
            Already a user?{' '}
            <Link to="/login" className="font-medium text-ds-brand-600 hover:text-ds-brand-700 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default SignupForm;
