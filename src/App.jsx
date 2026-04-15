import AppRoutes from "./routes/AppRoutes"

import { Toaster } from 'react-hot-toast'; // 1. Import karein

export default function App() {
  return (
    <>
      {/* 2. Toaster ko yahan rakhein */}
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            background: '#18181b', // Dark theme ke liye
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }} 
      />
      <AppRoutes />
    </>
  );
}