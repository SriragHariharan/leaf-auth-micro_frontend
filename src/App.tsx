import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import 'hostApp/themeBootstrap';

import './index.scss'
import ImageCarousel from './components/ImageCarousel'
import OtpForm from './components/OtpForm'
import LoginForm  from './components/LoginForm';
import SignupForm from './components/SignupForm';
import EnterEmailForm from './components/EnterEmailForm';
import ResetPassword from './components/ResetPassword';
import { Toaster, toastOptions } from 'hostApp/toast';


const App = () => (
    <Router>
      <Toaster position={toastOptions.position} toastOptions={{ duration: toastOptions.duration }} />
      <div className="h-screen w-screen flex">
        <div className="hidden lg:block w-1/2 h-full">
          <ImageCarousel />
        </div>
        <div className="w-full lg:w-1/2 h-full bg-ds-surface-card">
          <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signup" element={<SignupForm />} />
              <Route path="/confirm-email" element={<EnterEmailForm />} />
              <Route path="/otp" element={<OtpForm />} />
              <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </div>
      </div>
    </Router>
)

export default App;
const rootElement = document.getElementById('app')
if (!rootElement) throw new Error('Failed to find the root element')

const root = ReactDOM.createRoot(rootElement as HTMLElement)

root.render(<App />)