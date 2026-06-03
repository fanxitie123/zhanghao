import { useState } from 'react';
import { Search, Filter, Download, RefreshCw, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

interface OperationLogItem {
  id: string;
  account: string;
  name: string;
  role: string;
  operationTime: string;
  operationModule: string;
  operationType: '新增' | '删除' | '修改' | '查询' | '导入' | '导出';
  operationResult: 'success' | 'failed';
  errorDetail?: string;
}

const mockOperationLogs: OperationLogItem[] = [
  { id: '1', account: 'zhangsan', name: '张三', role: '系统管理员', operationTime: '2024-01-15 10:30:25', operationModule: '角色管理', operationType: '新增', operationResult: 'success' },
  { id: '2', account: 'lisi', name: '李四', role: '部门管理员', operationTime: '2024-01-15 10:28:12', operationModule: '知识库管理', operationType: '导入', operationResult: 'success' },
  { id: '3', account: 'wangwu', name: '王五', role: '普通用户', operationTime: '2024-01-15 10:25:45', operationModule: '账号管理', operationType: '修改', operationResult: 'failed', errorDetail: '用户名已存在' },
  { id: '4', account: 'zhaoliu', name: '赵六', role: '普通用户', operationTime: '2024-01-15 10:20:33', operationModule: '组织架构', operationType: '查询', operationResult: 'success' },
  { id: '5', account: 'sunqi', name: '孙七', role: '普通用户', operationTime: '2024-01-15 10:18:19', operationModule: '知识库管理', operationType: '导出', operationResult: 'success' },
  { id: '6', account: 'zhouba', name: '周八', role: '部门管理员', operationTime: '2024-01-15 10:15:42', operationModule: '角色管理', operationType: '删除', operationResult: 'failed', errorDetail: '该角色下存在用户，无法删除' },
  { id: '7', account: 'wujiu', name: '吴九', role: '普通用户', operationTime: '2024-01-15 10:12:30', operationModule: '系统配置', operationType: '修改', operationResult: 'success' },
  { id: '8', account: 'zhengshi', name: '郑十', role: '普通用户', operationTime: '2024-01-15 10:10:15', operationModule: '知识库管理', operationType: '新增', operationResult: 'failed', errorDetail: '文件格式不支持' },
];

const operationTypes = ['新增', '删除', '修改', '查询', '导入', '导出'];
const operationModules = ['角色管理', '权限管理', '组织架构', '账号管理', '知识库管理', '系统配置', '模型配置'];

export default function OperationLog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModule, setFilterModule] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredLogs = mockOperationLogs.filter(log => {
    const matchesSearch = log.account.includes(searchQuery) || 
                         log.name.includes(searchQuery) ||
                         log.operationModule.includes(searchQuery);
    const matchesModule = filterModule === 'all' || log.operationModule === filterModule;
    const matchesType = filterType === 'all' || log.operationType === filterType;
    return matchesSearch && matchesModule && matchesType;
  });

  const totalPages = Math.ceil(filteredLogs.length / pageSize);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getTypeColor = (type: string) => {
    switch (type) {
      case '新增': return 'bg-green-100 text-green-700';
      case '删除': return 'bg-red-100 text-red-700';
      case '修改': return 'bg-blue-100 text-blue-700';
      case '查询': return 'bg-gray-100 text-gray-700';
      case '导入': return 'bg-purple-100 text-purple-700';
      case '导出': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

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
              placeholder="搜索账号、姓名、模块..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterModule}
              onChange={(e) => {
                setFilterModule(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">全部模块</option>
              {operationModules.map(module => (
                <option key={module} value={module}>{module}</option>
              ))}
            </select>
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">全部类型</option>
              {operationTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作模块</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作类型</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作结果</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">异常报错详情</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedLogs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.account}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.operationTime}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.operationModule}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(log.operationType)}`}>
                    {log.operationType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    log.operationResult === 'success' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {log.operationResult === 'success' ? (
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
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                  {log.errorDetail ? (
                    <div className="flex items-start gap-2 text-red-600">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span className="truncate" title={log.errorDetail}>{log.errorDetail}</span>
                    </div>
                  ) : (
                    '-'
                  )}
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
