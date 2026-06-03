import React, { useState, useEffect } from 'react'
import { getAccounts, saveAccount, deleteAccount, type Account } from '../lib/auth'
import { Plus, Trash2, Copy, Check, ArrowLeft, Key } from 'lucide-react'

interface AccountGeneratorProps {
  onGoBack: () => void
}

export function AccountGenerator({ onGoBack }: AccountGeneratorProps) {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [newUsername, setNewUsername] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    loadAccounts()
  }, [])

  const loadAccounts = () => {
    setAccounts(getAccounts())
  }

  const generateRandomUsername = () => {
    const adjectives = ['happy', 'smart', 'brave', 'clever', 'swift', 'calm', 'bright', 'eager', 'gentle', 'kind']
    const nouns = ['panda', 'tiger', 'dragon', 'phoenix', 'eagle', 'wolf', 'fox', 'bear', 'lion', 'dolphin']
    const numbers = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
    const noun = nouns[Math.floor(Math.random() * nouns.length)]
    setNewUsername(`${adjective}-${noun}-${numbers}`)
  }

  const handleSave = () => {
    if (!newUsername.trim()) {
      return
    }
    saveAccount(newUsername.trim())
    setNewUsername('')
    loadAccounts()
  }

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个账号吗？')) {
      deleteAccount(id)
      loadAccounts()
    }
  }

  const handleCopy = (username: string, id: string) => {
    navigator.clipboard.writeText(username)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={onGoBack}
            className="flex items-center gap-2 bg-white/20 backdrop-blur text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            返回登录
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Key className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">账号生成器</h1>
            <p className="text-gray-600">生成和管理账号，只有这里生成的账号才能登录</p>
          </div>

          <div className="flex gap-4 mb-8">
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="输入账号或点击随机生成"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
            <button
              onClick={generateRandomUsername}
              className="bg-gray-100 text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-200 transition-all"
            >
              随机生成
            </button>
            <button
              onClick={handleSave}
              disabled={!newUsername.trim()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
            >
              <Plus className="w-5 h-5" />
              保存
            </button>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">已保存的账号</h2>
            {accounts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                还没有账号，点击上方按钮生成一个！
              </div>
            ) : (
              <div className="space-y-3">
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg"
                  >
                    <div className="flex-1 font-mono text-lg text-gray-800">
                      {account.username}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(account.createdAt).toLocaleString()}
                    </div>
                    <button
                      onClick={() => handleCopy(account.username, account.id)}
                      className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                      title="复制"
                    >
                      {copiedId === account.id ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(account.id)}
                      className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                      title="删除"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="text-center text-white/80 text-sm">
          提示：账号保存在本地浏览器中，清除浏览器数据会丢失所有账号
        </div>
      </div>
    </div>
  )
}
