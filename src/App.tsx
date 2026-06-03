import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import SimpleTools from './pages/SimpleTools'
import { Login } from './pages/Login'
import { AccountGenerator } from './pages/AccountGenerator'
import { isLoggedIn, logout, getCurrentUser } from './lib/auth'
import { LogOut, User } from 'lucide-react'

// 带退出按钮的包装组件
function ToolsWithLogout() {
  const currentUser = getCurrentUser()
  
  const handleLogout = () => {
    logout()
    window.location.reload()
  }

  return (
    <div className="min-h-screen relative">
      {/* 顶部导航栏 */}
      <div className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur border-b border-gray-200 px-6 py-4 flex justify-between items-center z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="font-medium text-gray-700">{currentUser}</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all"
        >
          <LogOut className="w-4 h-4" />
          退出登录
        </button>
      </div>
      {/* 给顶部留出空间 */}
      <div className="pt-20">
        <SimpleTools />
      </div>
    </div>
  )
}

export default function App() {
  const [view, setView] = useState<'login' | 'tools' | 'generator'>('login')
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    setAuthenticated(isLoggedIn())
  }, [])

  const handleLoginSuccess = () => {
    setAuthenticated(true)
    setView('tools')
  }

  const handleGoToGenerator = () => {
    setView('generator')
  }

  const handleGoBack = () => {
    setView('login')
  }

  if (authenticated || isLoggedIn()) {
    return <ToolsWithLogout />
  }

  return (
    <>
      {view === 'login' && (
        <Login onLoginSuccess={handleLoginSuccess} onGoToGenerator={handleGoToGenerator} />
      )}
      {view === 'generator' && (
        <AccountGenerator onGoBack={handleGoBack} />
      )}
    </>
  )
}
