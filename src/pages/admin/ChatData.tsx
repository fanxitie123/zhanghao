import { useState } from 'react';
import { Search, Download, Filter, Calendar, User, Tag } from 'lucide-react';

interface ChatRecord {
  id: string;
  userName: string;
  userID: string;
  topic: string;
  content: string;
  timestamp: string;
  duration: string;
}

const mockChatData: ChatRecord[] = [
  { id: '1', userName: '张三', userID: 'U001', topic: '监察对象范围', content: '谈谈监察对象的范围', timestamp: '2024-01-15 10:30:25', duration: '02:15' },
  { id: '2', userName: '李四', userID: 'U002', topic: '处分种类', content: '监察对象的处分种类有哪些？', timestamp: '2024-01-15 10:28:12', duration: '01:45' },
  { id: '3', userName: '王五', userID: 'U003', topic: '政务处分区别', content: '政务处分与行政处分的区别', timestamp: '2024-01-15 09:45:30', duration: '03:20' },
  { id: '4', userName: '张三', userID: 'U001', topic: '职务违法认定', content: '如何认定职务违法？', timestamp: '2024-01-14 15:20:00', duration: '02:55' },
  { id: '5', userName: '赵六', userID: 'U004', topic: '监察机关职责', content: '监察机关的职责有哪些？', timestamp: '2024-01-14 14:10:30', duration: '01:30' },
  { id: '6', userName: '李四', userID: 'U002', topic: '监察对象范围', content: '基层群众性自治组织人员是否属于监察对象？', timestamp: '2024-01-13 11:30:45', duration: '02:05' },
];

export default function ChatData() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');

  const users = ['全部', '张三', '李四', '王五', '赵六'];
  const topics = ['全部', '监察对象范围', '处分种类', '政务处分区别', '职务违法认定', '监察机关职责'];

  const filteredData = mockChatData.filter(item => {
    const matchSearch = item.userName.includes(searchQuery) || item.topic.includes(searchQuery) || item.content.includes(searchQuery);
    const matchUser = selectedUser === '' || selectedUser === '全部' || item.userName === selectedUser;
    const matchDate = selectedDate === '' || item.timestamp.includes(selectedDate);
    const matchTopic = selectedTopic === '' || selectedTopic === '全部' || item.topic === selectedTopic;
    return matchSearch && matchUser && matchDate && matchTopic;
  });

  const handleExport = () => {
    const csvContent = [
      ['ID', '用户姓名', '用户ID', '对话主题', '问题内容', '时间', '时长'].join(','),
      ...filteredData.map(item => [item.id, item.userName, item.userID, item.topic, item.content, item.timestamp, item.duration].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'chat_data.csv';
    link.click();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索对话记录..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
            />
          </div>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          导出数据
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {users.map(user => <option key={user} value={user}>{user}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-gray-400" />
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {topics.map(topic => <option key={topic} value={topic}>{topic}</option>)}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">ID</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">用户姓名</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">用户ID</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">对话主题</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">问题内容</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">时间</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">时长</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-600">{item.id}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{item.userName}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{item.userID}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{item.topic}</td>
                <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">{item.content}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{item.timestamp}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{item.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-gray-500">共 {filteredData.length} 条记录</span>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50">上一页</button>
          <span className="px-3 py-1 text-sm text-gray-600">1</span>
          <button className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50">下一页</button>
        </div>
      </div>
    </div>
  );
}
