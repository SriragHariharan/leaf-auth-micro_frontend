import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.scss'
import { ImageCarousel } from './components/ImageCarousel'
import { OtpForm } from './components/OtpForm'

const App = () => (
    <div className="h-screen w-screen flex">
      <div className="hidden lg:block w-1/2 h-full">
        <ImageCarousel />
      </div>
      <div className="w-full lg:w-1/2 h-full bg-white">
        <OtpForm />
      </div>
    </div>
)
const rootElement = document.getElementById('app')
if (!rootElement) throw new Error('Failed to find the root element')

const root = ReactDOM.createRoot(rootElement as HTMLElement)

root.render(<App />)