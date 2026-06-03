import { useState } from 'react';
import { Search, Filter, Download, RefreshCw, MessageSquare, ChevronLeft, ChevronRight, X, User, Bot } from 'lucide-react';

interface ChatLogItem {
  id: string;
  account: string;
  role: string;
  createTime: string;
  updateTime: string;
  title: string;
  messageCount: number;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

const mockChatLogs: ChatLogItem[] = [
  { id: '1', account: 'zhangsan', role: '系统管理员', createTime: '2024-01-15 10:30:25', updateTime: '2024-01-15 11:45:30', title: '谈谈监察对象的范围', messageCount: 12 },
  { id: '2', account: 'lisi', role: '部门管理员', createTime: '2024-01-15 09:20:10', updateTime: '2024-01-15 10:15:45', title: '政务处分的种类有哪些', messageCount: 8 },
  { id: '3', account: 'wangwu', role: '普通用户', createTime: '2024-01-14 16:45:30', updateTime: '2024-01-14 17:20:15', title: '如何认定职务违法', messageCount: 15 },
  { id: '4', account: 'zhaoliu', role: '普通用户', createTime: '2024-01-14 14:10:20', updateTime: '2024-01-14 15:05:40', title: '监察机关的职责是什么', messageCount: 6 },
  { id: '5', account: 'sunqi', role: '普通用户', createTime: '2024-01-14 10:55:15', updateTime: '2024-01-14 11:30:25', title: '纪律处分与政务处分的区别', messageCount: 10 },
  { id: '6', account: 'zhouba', role: '部门管理员', createTime: '2024-01-13 15:30:40', updateTime: '2024-01-13 16:25:50', title: '如何进行线索处置', messageCount: 20 },
  { id: '7', account: 'wujiu', role: '普通用户', createTime: '2024-01-13 11:20:35', updateTime: '2024-01-13 12:10:45', title: '什么是四种形态', messageCount: 7 },
  { id: '8', account: 'zhengshi', role: '普通用户', createTime: '2024-01-12 09:40:50', updateTime: '2024-01-12 10:50:20', title: '如何理解党纪严于国法', messageCount: 18 },
];

const mockChatMessages: Record<string, ChatMessage[]> = {
  '1': [
    { id: '1-1', role: 'user', content: '谈谈监察对象的范围', time: '2024-01-15 10:30:25' },
    { id: '1-2', role: 'assistant', content: '监察对象是指所有依法行使公权力的公职人员，包括：1. 中国共产党机关、人民代表大会及其常务委员会机关、人民政府、监察委员会、人民法院、人民检察院、中国人民政治协商会议各级委员会机关、民主党派机关和工商业联合会机关的公务员，以及参照《中华人民共和国公务员法》管理的人员；2. 法律、法规授权或者受国家机关依法委托管理公共事务的组织中从事公务的人员；3. 国有企业管理人员；4. 公办的教育、科研、文化、医疗卫生、体育等单位中从事管理的人员；5. 基层群众性自治组织中从事管理的人员；6. 其他依法履行公职的人员。', time: '2024-01-15 10:30:30' },
    { id: '1-3', role: 'user', content: '村委会主任属于监察对象吗', time: '2024-01-15 11:00:15' },
    { id: '1-4', role: 'assistant', content: '是的，村委会主任属于基层群众性自治组织中从事管理的人员，属于监察对象范围。', time: '2024-01-15 11:00:20' },
  ],
  '2': [
    { id: '2-1', role: 'user', content: '政务处分的种类有哪些', time: '2024-01-15 09:20:10' },
    { id: '2-2', role: 'assistant', content: '根据《中华人民共和国公职人员政务处分法》，政务处分的种类包括：1. 警告；2. 记过；3. 记大过；4. 降级；5. 撤职；6. 开除。', time: '2024-01-15 09:20:15' },
  ],
};

export default function ChatLog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const pageSize = 10;

  const filteredLogs = mockChatLogs.filter(log => {
    const matchesSearch = log.account.includes(searchQuery) || 
                         log.title.includes(searchQuery);
    const matchesRole = filterRole === 'all' || log.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredLogs.length / pageSize);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleViewChat = (id: string) => {
    setSelectedChatId(id);
  };

  const handleCloseModal = () => {
    setSelectedChatId(null);
  };

  const selectedChat = selectedChatId ? mockChatLogs.find(log => log.id === selectedChatId) : null;
  const selectedMessages = selectedChatId ? mockChatMessages[selectedChatId] || [] : [];

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
              placeholder="搜索账号、对话标题..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterRole}
              onChange={(e) => {
                setFilterRole(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">全部角色</option>
              <option value="系统管理员">系统管理员</option>
              <option value="部门管理员">部门管理员</option>
              <option value="普通用户">普通用户</option>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">角色</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">更新时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">对话标题</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">对话数量</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedLogs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.account}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.createTime}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.updateTime}</td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate" title={log.title}>{log.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {log.messageCount}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleViewChat(log.id)}
                    className="text-sm text-primary-600 hover:text-primary-800 font-medium"
                  >
                    对话记录
                  </button>
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

      {/* 对话记录弹窗 */}
      {selectedChatId && selectedChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedChat.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  帐号：{selectedChat.account} | 角色：{selectedChat.role} | 创建时间：{selectedChat.createTime}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedMessages.length > 0 ? (
                selectedMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] ${message.role === 'user' ? 'items-end' : 'items-start'} flex gap-3`}>
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-primary-600" />
                        </div>
                      )}
                      <div className={`${message.role === 'user' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-900'} rounded-xl px-4 py-3`}>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs text-gray-500 mt-2">{message.time}</p>
                      </div>
                      {message.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>暂无对话记录</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
