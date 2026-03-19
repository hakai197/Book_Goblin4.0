import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import Books from '../pages/Books'
import Discover from '../pages/Discover'
import Admin from '../admin/Admin'
import GetStarted from '../pages/GetStarted'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/books" element={<Books />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/getstarted" element={<GetStarted />} />
    </Routes>
  )
}
