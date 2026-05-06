import React, { useEffect, useState } from 'react';
import { KeyRound, Loader2, AlertCircle, AlertTriangle, Clock3 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { LEAF_BACKEND_URL, LEAF_USER_ID, OTP_TIMER_INTERVAL } from '../constants/constants';
import { showErrorToast, showSuccessToast } from '../helpers/toastify';
import { useNavigate } from 'react-router';

import '../index.scss';
import AuthBrand from './AuthBrand';
import { designRecipes } from 'hostApp/designRecipes';

interface FormData {
  otp: string;
}

const OtpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      otp: '',
    },
  });

  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null); // Store interval ID
  const [loading, setLoading] = useState<boolean>(false); // Create loading state

  const navigate = useNavigate();

  // Function to format the time left in mm:ss format
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const useGlobalStore = async () => {
    const { default: globalStore } = await import('hostApp/GlobalStore'); // Import the Zustand store
    return globalStore;
  };

  // Initialize the timer
  const startTimer = () => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prevTime - 1000; // Decrease the time by 1 second
      });
    }, 1000);
    setTimerInterval(interval); // Store the interval
  };

  useEffect(() => {
    const storedTime = localStorage.getItem('otpTimerStart');
    const currentTime = Date.now();

    let initialTime = OTP_TIMER_INTERVAL; // Default to 5 minutes (300000ms)

    if (storedTime) {
      const timeElapsed = currentTime - Number(storedTime);
      initialTime = Math.max(0, OTP_TIMER_INTERVAL - timeElapsed); // Calculate remaining time
    } else {
      localStorage.setItem('otpTimerStart', currentTime.toString()); // Start a new timer if it doesn't exist
    }

    setTimeLeft(initialTime);  // Set initial time left
    startTimer();  // Start the timer with initial time

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval); // Cleanup on component unmount
      }
    };
  }, []);

  const onSubmit = async(data: FormData) => {
    setLoading(true);
    const userID = localStorage.getItem(LEAF_USER_ID);
    const globalStore = await useGlobalStore();

    axios.post(LEAF_BACKEND_URL + "/user/auth/confirm-otp", { ...data, userID })
      .then(resp => {
        const { accessToken, refreshToken, username, profilePicture } = resp?.data?.data;
        localStorage.clear();
        // Update Zustand store
        globalStore.getState().setAccessToken(accessToken);
        globalStore.getState().setRefreshToken(refreshToken);
        globalStore.getState().setUsername(username);
        globalStore.getState().setProfilePic(profilePicture);
        navigate("/");
      })
      .catch(err => showErrorToast(err?.response?.data?.error?.message))
      .finally(() => {
        setLoading(false);
      });
  };

  const resendOtpRequest = async () => {
    const userID = localStorage.getItem(LEAF_USER_ID);
    try {
        const resp = await axios.post(LEAF_BACKEND_URL + "/user/auth/resend-otp", { userID });
        console.log(resp.data); // Log the response for debugging
        showSuccessToast("OTP has been resent to your email."); // Notify user
    } catch (err: any) {
        showErrorToast(err?.response?.data?.error?.message);
    }
  };

  // Resend OTP logic
  const resendOtp = (): void => {
    resendOtpRequest();
    const currentTime = Date.now();
    localStorage.setItem('otpTimerStart', currentTime.toString()); // Update the stored time
    setTimeLeft(OTP_TIMER_INTERVAL); // Reset the timer to 5 minutes (300000ms)

    if (timerInterval) {
      clearInterval(timerInterval); // Clear existing interval before starting a new one
    }

    startTimer(); // Start the timer again from 5 minutes
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

        <h2 className="text-3xl font-semibold tracking-tight text-ds-text-primary">Enter the OTP</h2>
        <p className="mt-2 text-ds-text-muted">
          We sent an OTP to your email address. Please enter it below to continue.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          {/* OTP Field */}
          <div>
            <label htmlFor="otp" className="mb-1.5 block text-sm font-medium text-ds-text-secondary">
              OTP
            </label>
            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ds-text-muted peer-focus:text-ds-brand-600 transition-colors" />
              <input
                id="otp"
                type="text"
                placeholder="000000"
                {...register('otp', {
                  required: 'OTP is required',
                  pattern: {
                    value: /^[0-9]{6}$/, // Assuming OTP is a 6-digit number
                    message: 'OTP must be 6 digits',
                  },
                })}
                className={`${inputBase} ${errors.otp ? inputError : ''} text-center font-medium tracking-[0.3em]`}
              />
            </div>
            {errors.otp && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-ds-state-danger">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.otp.message}
              </p>
            )}
          </div>

          <div className="flex justify-start">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${timeLeft <= 0 ? 'bg-ds-state-dangerSoft text-ds-state-danger ring-ds-state-danger/30' : 'bg-ds-state-successSoft text-ds-state-success ring-ds-brand-100'}`}
            >
              <Clock3 className="h-3.5 w-3.5" />
              {timeLeft <= 0 ? 'OTP expired' : `Time left ${formatTime(timeLeft)}`}
            </span>
          </div>

          <button
            type="submit"
            className={`${designRecipes.buttonPrimary} flex h-11 w-full items-center justify-center gap-2 px-4 shadow-dsBrand active:scale-[0.99] ${loading ? 'cursor-not-allowed shadow-none' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit OTP'
            )}
          </button>
        </form>

        <p className="mt-6 flex items-start gap-2 rounded-xl bg-ds-state-warningSoft p-3 text-xs text-ds-state-warning ring-1 ring-inset ring-ds-state-warning/30">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          Do not refresh the page. Refreshing might cause the OTP to expire.
        </p>

        {/* Resend OTP button */}
        {timeLeft <= 0 && (
          <p className="mt-8 text-center text-sm text-ds-text-secondary">
            Didn’t receive an OTP?{' '}
            <span onClick={resendOtp} className="cursor-pointer font-medium text-ds-brand-600 hover:text-ds-brand-700 hover:underline">
              Resend OTP
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default OtpForm;