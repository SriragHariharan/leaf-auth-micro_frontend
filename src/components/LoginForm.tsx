import React from 'react';
import { Leaf } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import axios from 'axios';
import { GOOGLE_OAUTH_CLIENT_ID, LEAF_AX_TOKEN, LEAF_BACKEND_URL, LEAF_RF_TOKEN } from '../constants/constants';
import { showErrorToast } from '../helpers/toastify';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

interface FormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

import '../index.scss'
import { ToastContainer } from 'react-toastify';

const useGlobalStore = async () => {
  const { default: globalStore } = await import('hostApp/GlobalStore'); // Import the Zustand store
  return globalStore;
};

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
    //   rememberMe: false,
    },
  });

  const navigate = useNavigate();

  /* handle oauth signup */
  const handleOauthSignup = async(data:Object) => {
    const globalStore = await useGlobalStore(); 

    axios.post(LEAF_BACKEND_URL + "/user/auth/oauth-signup", { ...data })
    .then(resp => {
      const { accessToken, refreshToken } = resp?.data?.data;
      // Update Zustand store
      globalStore.getState().setAccessToken(accessToken);
      globalStore.getState().setRefreshToken(refreshToken);
      navigate("/");
    })
    .catch(err => showErrorToast(err?.response?.data?.error?.message));
  }

  

  const onSubmit = async (data: FormData) => {
    const globalStore = await useGlobalStore(); //zustand from host app

    axios.post( LEAF_BACKEND_URL + "/user/auth/login", { ...data } )
    .then(resp => {
      const { accessToken, refreshToken } = resp?.data?.data;
      // Save tokens in localStorage
      localStorage.setItem(LEAF_AX_TOKEN, accessToken);
      localStorage.setItem(LEAF_RF_TOKEN, refreshToken);

      // Update Zustand store
      console.log("Setting values to zustand")
      globalStore.getState().setAccessToken(accessToken);
      globalStore.getState().setRefreshToken(refreshToken);
      console.log(globalStore.getState());
      console.log("Setting successfull to zustand")

      navigate("/");
    })
    .catch(err => {
      showErrorToast(err?.response?.data?.error?.message);
      console.log(err?.response?.data?.error?.message)
    })
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_OAUTH_CLIENT_ID}>
      <div className="h-full w-full flex flex-col justify-center items-center px-8 lg:px-16">
        <ToastContainer />
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8">
            <Leaf className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">leaf</h1>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome back</h2>
          <p className="text-gray-600 mb-8">Please enter your details to sign in</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: 'Invalid email address',
                  },
                })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div></div>
              {/* <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  {...register('rememberMe')}
                  className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div> */}
              <Link to="/confirm-email" type="button" className="text-sm font-medium text-green-600 hover:text-green-500">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-green-600 py-2 px-4 text-white font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Sign in
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-green-600 hover:text-green-500">
              Sign up
            </Link>
          </p>

          {/* google login */}
          <hr className='my-4' />
          <div className="mt-4 flex justify-center items-center">
            <GoogleLogin
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
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginForm;