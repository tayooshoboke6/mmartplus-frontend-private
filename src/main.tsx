import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider } from 'antd'
import './index.css'
import App from './App.tsx'
import { setupMockApi } from './mocks'

// Initialize the mock API if in development mode
if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_API === 'true') {
  setupMockApi().then(() => {
    console.log('Mock API initialized successfully');
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider>
      <App />
    </ConfigProvider>
  </StrictMode>,
)
