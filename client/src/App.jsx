// client/src/App.jsx
import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import Navbar from "../components/Navbar"

export default function App() {
  return (
    <>
      <Navbar />
      <Toaster />
      <Outlet />
    </>
  )
}

