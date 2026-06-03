import { useState } from 'react';
import { Search, Filter, Download, RefreshCw, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';

interface LoginLogItem {
  id: string;
  account: string;
  name: string;
  role: string;
  loginTime: string;
  loginIp: string;
  deviceId: string;
  result: 'success' | 'failed';
  failReason?: string;
}

const mockLoginLogs: LoginLogItem[] = [
  { id: '1', account: 'zhangsan', name: '张三', role: '系统管理员', loginTime: '2024-01-15 10:30:25', loginIp: '192.168.1.101', deviceId: 'device-001', result: 'success' },
  { id: '2', account: 'lisi', name: '李四', role: '部门管理员', loginTime: '2024-01-15 10:28:12', loginIp: '192.168.1.102', deviceId: 'device-002', result: 'success' },
  { id: '3', account: 'wangwu', name: '王五', role: '普通用户', loginTime: '2024-01-15 10:25:45', loginIp: '192.168.1.103', deviceId: 'device-003', result: 'failed', failReason: '密码错误' },
  { id: '4', account: 'zhaoliu', name: '赵六', role: '普通用户', loginTime: '2024-01-15 10:20:33', loginIp: '192.168.1.104', deviceId: 'device-004', result: 'success' },
  { id: '5', account: 'sunqi', name: '孙七', role: '普通用户', loginTime: '2024-01-15 10:18:19', loginIp: '192.168.1.105', deviceId: 'device-005', result: 'failed', failReason: '账号已锁定' },
  { id: '6', account: 'zhouba', name: '周八', role: '部门管理员', loginTime: '2024-01-15 10:15:42', loginIp: '192.168.1.106', deviceId: 'device-006', result: 'success' },
  { id: '7', account: 'wujiu', name: '吴九', role: '普通用户', loginTime: '2024-01-15 10:12:30', loginIp: '192.168.1.107', deviceId: 'device-007', result: 'success' },
  { id: '8', account: 'zhengshi', name: '郑十', role: '普通用户', loginTime: '2024-01-15 10:10:15', loginIp: '192.168.1.108', deviceId: 'device-008', result: 'failed', failReason: '验证码错误' },
];

export default function LoginLog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterResult, setFilterResult] = useState<'all' | 'success' | 'failed'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredLogs = mockLoginLogs.filter(log => {
    const matchesSearch = log.account.includes(searchQuery) || 
                         log.name.includes(searchQuery) || 
                         log.loginIp.includes(searchQuery);
    const matchesFilter = filterResult === 'all' || log.result === filterResult;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredLogs.length / pageSize);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="搜索账号、姓名、IP..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterResult}
              onChange={(e) => {
                setFilterResult(e.target.value as 'all' | 'success' | 'failed');
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">全部结果</option>
              <option value="success">登录成功</option>
              <option value="failed">登录失败</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4" />
            刷新
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            导出
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">帐号</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">姓名</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">角色</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">登录时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">登录IP</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">设备标识</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">登录结果</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">失败原因</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedLogs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.account}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.loginTime}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.loginIp}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.deviceId}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    log.result === 'success' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {log.result === 'success' ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        成功
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        失败
                      </>
                    )}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {log.failReason || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          显示 {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredLogs.length)} 条，共 {filteredLogs.length} 条记录
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 py-2 text-sm text-gray-700">{currentPage} / {totalPages}</span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
