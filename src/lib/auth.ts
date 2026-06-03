const STORAGE_KEY = 'media-tools-accounts'
const CURRENT_USER_KEY = 'media-tools-current-user'
// 预设测试账号
const TEST_ACCOUNT = 'test-account-1234'

export interface Account {
  id: string
  username: string
  createdAt: number
}

// 初始化：如果没有账号，自动创建测试账号
function initAccounts() {
  try {
    const accounts = getAccounts()
    if (accounts.length === 0) {
      console.log('[Auth] 首次访问，自动创建测试账号:', TEST_ACCOUNT)
      saveAccount(TEST_ACCOUNT)
    }
  } catch (e) {
    console.error('[Auth] 初始化账号失败:', e)
  }
}

// 获取所有账号
export function getAccounts(): Account[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    const accounts = data ? JSON.parse(data) : []
    console.log('[Auth] 当前所有账号:', accounts)
    return accounts
  } catch (e) {
    console.error('[Auth] 获取账号失败:', e)
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
  console.log('[Auth] 账号保存成功:', newAccount)
  return newAccount
}

// 验证账号（包含预设测试账号）
export function validateAccount(username: string): boolean {
  console.log('[Auth] 验证账号:', username)
  
  // 检查测试账号
  if (username === TEST_ACCOUNT) {
    console.log('[Auth] 测试账号验证通过')
    return true
  }
  
  // 检查本地保存的账号
  const accounts = getAccounts()
  const isValid = accounts.some(account => account.username === username)
  console.log('[Auth] 本地账号验证结果:', isValid)
  return isValid
}

// 删除账号
export function deleteAccount(id: string): void {
  const accounts = getAccounts()
  const filtered = accounts.filter(account => account.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  console.log('[Auth] 账号删除成功:', id)
}

// 登录
export function login(username: string): boolean {
  console.log('[Auth] 尝试登录:', username)
  
  if (validateAccount(username)) {
    localStorage.setItem(CURRENT_USER_KEY, username)
    console.log('[Auth] 登录成功')
    return true
  }
  
  console.log('[Auth] 登录失败')
  return false
}

// 登出
export function logout(): void {
  localStorage.removeItem(CURRENT_USER_KEY)
  console.log('[Auth] 已登出')
}

// 检查是否已登录
export function isLoggedIn(): boolean {
  const isLogged = !!localStorage.getItem(CURRENT_USER_KEY)
  console.log('[Auth] 登录状态:', isLogged)
  return isLogged
}

// 获取当前用户
export function getCurrentUser(): string | null {
  return localStorage.getItem(CURRENT_USER_KEY)
}

// 确保初始化
initAccounts()
