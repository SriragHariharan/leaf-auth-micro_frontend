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
import { designRecipes } from 'hostApp/designRecipes';


const App = () => (
    <Router>
      <Toaster position={toastOptions.position} toastOptions={{ duration: toastOptions.duration }} />
      <div className={designRecipes.authSplitLayout}>
        <div className={designRecipes.authSplitCarouselCol}>
          <ImageCarousel />
        </div>
        <div className={designRecipes.authSplitFormCol}>
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