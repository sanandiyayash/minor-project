import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
// import { CookiesProvider } from 'react-cookie'

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <React.StrictMode>
      {/* <CookiesProvider> */}

      <BrowserRouter>
        <App />
      </BrowserRouter>
      {/* </CookiesProvider> */}
    </React.StrictMode>
  </>
)
