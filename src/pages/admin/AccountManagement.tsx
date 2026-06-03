import { useState } from 'react';
import { Plus, Edit, Trash2, Search, RefreshCw, User, Mail, Building2, ToggleLeft, ToggleRight } from 'lucide-react';

interface Account {
  id: string;
  username: string;
  realName: string;
  email: string;
  department: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  createdAt: string;
}

const mockAccounts: Account[] = [
  { id: '1', username: 'admin', realName: '张三', email: 'zhangsan@example.com', department: '办公室', role: '系统管理员', status: 'active', lastLogin: '2024-01-15 10:30', createdAt: '2024-01-01' },
  { id: '2', username: 'lisi', realName: '李四', email: 'lisi@example.com', department: '组织部', role: '部门管理员', status: 'active', lastLogin: '2024-01-14 15:45', createdAt: '2024-01-02' },
  { id: '3', username: 'wangwu', realName: '王五', email: 'wangwu@example.com', department: '宣传部', role: '普通用户', status: 'active', lastLogin: '2024-01-15 09:20', createdAt: '2024-01-03' },
  { id: '4', username: 'zhaoliu', realName: '赵六', email: 'zhaoliu@example.com', department: '第一纪检监察室', role: '普通用户', status: 'inactive', lastLogin: '2024-01-10 14:00', createdAt: '2024-01-05' },
  { id: '5', username: 'sunqi', realName: '孙七', email: 'sunqi@example.com', department: '第二纪检监察室', role: '普通用户', status: 'active', lastLogin: '2024-01-15 11:00', createdAt: '2024-01-06' },
];

export default function AccountManagement() {
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  const filteredAccounts = accounts.filter(account => {
    const matchSearch = account.username.includes(searchQuery) || account.realName.includes(searchQuery) || account.email.includes(searchQuery);
    const matchRole = selectedRole === 'all' || account.role === selectedRole;
    return matchSearch && matchRole;
  });

  const toggleStatus = (id: string) => {
    setAccounts(accounts.map(account => 
      account.id === id 
        ? { ...account, status: account.status === 'active' ? 'inactive' : 'active' }
        : account
    ));
  };

  const handleSync = () => {
    alert('正在与赣纪通账号信息同步...');
  };

  const roles = ['all', '系统管理员', '部门管理员', '普通用户'];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索账号..."
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
              />
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {roles.map(role => (
                <option key={role} value={role}>
                  {role === 'all' ? '全部角色' : role}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSync}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4" />
              同步赣纪通
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              <Plus className="w-4 h-4" />
              新增账号
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">账号</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">姓名</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">邮箱</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">部门</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">角色</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">状态</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">最后登录</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((account) => (
                <tr key={account.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary-600" />
                      </div>
                      <span className="text-sm text-gray-600 font-medium">{account.username}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{account.realName}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      {account.email}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building2 className="w-4 h-4" />
                      {account.department}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      account.role === '系统管理员' ? 'bg-red-100 text-red-700' :
                      account.role === '部门管理员' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {account.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleStatus(account.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        account.status === 'active' 
                          ? 'bg-green-100 hover:bg-green-200' 
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                      title={account.status === 'active' ? '点击禁用' : '点击启用'}
                    >
                      {account.status === 'active' ? (
                        <ToggleRight className="w-5 h-5 text-green-600" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{account.lastLogin}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-500">共 {filteredAccounts.length} 条记录</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50">上一页</button>
            <span className="px-3 py-1 text-sm text-gray-600">1</span>
            <button className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50">下一页</button>
          </div>
        </div>
      </div>
    </div>
  );
}
