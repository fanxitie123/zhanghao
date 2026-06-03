const STORAGE_KEY = 'media-tools-accounts'
const CURRENT_USER_KEY = 'media-tools-current-user'

export interface Account {
  id: string
  username: string
  createdAt: number
}

// 获取所有账号
export function getAccounts(): Account[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

// 保存账号
export function saveAccount(username: string): Account {
  const accounts = getAccounts()
  const newAccount: Account = {
    id: Date.now().toString(),
    username,
    createdAt: Date.now()
  }
  accounts.push(newAccount)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts))
  return newAccount
}

// 验证账号
export function validateAccount(username: string): boolean {
  const accounts = getAccounts()
  return accounts.some(account => account.username === username)
}

// 删除账号
export function deleteAccount(id: string): void {
  const accounts = getAccounts()
  const filtered = accounts.filter(account => account.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

// 登录
export function login(username: string): boolean {
  if (validateAccount(username)) {
    localStorage.setItem(CURRENT_USER_KEY, username)
    return true
  }
  return false
}

// 登出
export function logout(): void {
  localStorage.removeItem(CURRENT_USER_KEY)
}

// 检查是否已登录
export function isLoggedIn(): boolean {
  return !!localStorage.getItem(CURRENT_USER_KEY)
}

// 获取当前用户
export function getCurrentUser(): string | null {
  return localStorage.getItem(CURRENT_USER_KEY)
}
