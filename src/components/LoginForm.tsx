import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import axios from 'axios';
import { AUTH_PATHS, authUrl, GOOGLE_OAUTH_CLIENT_ID } from '../constants/constants';
import { showErrorToast } from 'hostApp/toast';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

interface FormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

import '../index.scss'
import AuthBrand from './AuthBrand';
import { designRecipes } from 'hostApp/designRecipes';

const useGlobalStore = async () => {
  const { default: globalStore } = await import('hostApp/GlobalStore');
  return globalStore;
};

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const navigate = useNavigate();

  const handleOauthSignup = async(data:Object) => {
    const globalStore = await useGlobalStore();

    axios.post(authUrl(AUTH_PATHS.oauthSignup), { ...data })
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

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const globalStore = await useGlobalStore();

    axios.post(authUrl(AUTH_PATHS.login), { ...data })
    .then(resp => {
      const { accessToken, refreshToken, username, profilePicture } = resp?.data?.data;
      globalStore.getState().setAccessToken(accessToken);
      globalStore.getState().setRefreshToken(refreshToken);
      globalStore.getState().setUsername(username);
      globalStore.getState().setProfilePic(profilePicture);
      navigate("/");
    })
    .catch(err => {
      showErrorToast(err?.response?.data?.error?.message);
      console.log(err?.response?.data?.error?.message);
    })
    .finally(() => {
      setLoading(false);
    });
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_OAUTH_CLIENT_ID || ''}>
      <div className={designRecipes.authFormShell}>
        <div aria-hidden="true" className={designRecipes.authDecorBlurTop} />
        <div aria-hidden="true" className={designRecipes.authDecorBlurBottom} />

        <div className={designRecipes.authFormContent}>
          <AuthBrand className="mb-10" />

          <h2 className="text-3xl font-semibold tracking-tight text-ds-text-primary">Welcome back</h2>
          <p className="mt-2 text-ds-text-muted">Please enter your details to sign in</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className={designRecipes.formLabel}>
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
                  className={`peer ${designRecipes.inputWithIcon} ${errors.email ? designRecipes.inputError : ''}`}
                />
              </div>
              {errors.email && (
                <p className={designRecipes.formError}>
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className={designRecipes.formLabel}>
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ds-text-muted peer-focus:text-ds-brand-600 transition-colors" />
                <input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Enter your password"
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

            <div className="flex justify-end">
              <Link to="/confirm-email" className={designRecipes.linkBrand}>
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={loading} className={designRecipes.buttonSubmitFull}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className={designRecipes.authDivider}>
            <span>or continue with</span>
          </div>

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
            Don't have an account?{' '}
            <Link to="/signup" className={designRecipes.linkBrand}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginForm;
