import { useState } from 'react';
import { User, Mail, Building2, Shield, MessageSquare, Trash2, ChevronRight, RefreshCw, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useChatStore } from '../store/chatStore';

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  createdAt: string;
}

const mockUserInfo = {
  name: '张三',
  username: 'zhangsan',
  email: 'zhangsan@example.com',
  department: '办公室',
  role: '系统管理员',
  syncStatus: '已同步',
  lastSyncTime: '2024-01-15 10:30',
};

const mockChatHistory: ChatHistory[] = [
  { id: '1', title: '谈谈监察对象的范围', lastMessage: '监察对象是指所有依法行使公权力的公职人员...', createdAt: '2024-01-15 10:30' },
  { id: '2', title: '监察对象的处分种类有哪些？', lastMessage: '根据《中华人民共和国公职人员政务处分法》...', createdAt: '2024-01-14 15:45' },
  { id: '3', title: '政务处分与行政处分的区别', lastMessage: '政务处分与行政处分在法律依据、适用对象等方面存在区别...', createdAt: '2024-01-13 09:20' },
];

export default function Profile() {
  const navigate = useNavigate();
  const { sessions, deleteSession } = useChatStore();
  const [activeTab, setActiveTab] = useState<'info' | 'history'>('info');
  const [syncing, setSyncing] = useState(false);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      alert('已与赣纪通同步成功！');
    }, 1500);
  };

  const handleLogout = () => {
    if (confirm('确定要退出登录吗？')) {
      navigate('/login');
    }
  };

  const handleContinueChat = (sessionId: string) => {
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col h-full">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">赣</span>
            </div>
            <div>
              <h1 className="font-semibold text-gray-900 text-sm">赣州市纪委监委</h1>
              <p className="text-xs text-gray-500">大模型应用平台</p>
            </div>
          </div>
        </div>

        <nav className="p-3 space-y-1">
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
            <span>纪检监察大箱</span>
          </button>
          <button 
            onClick={() => navigate('/knowledge')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Shield className="w-5 h-5" />
            <span>知识库</span>
          </button>
        </nav>

        <div className="flex-1" />

        <div className="p-3 border-t border-gray-200">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary-50 text-primary-700">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <User className="w-4 h-4 text-primary-600" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">{mockUserInfo.name}</p>
              <p className="text-xs text-primary-500">{mockUserInfo.role}</p>
            </div>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-8">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('info')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'info' ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                个人信息管理
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'history' ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                我的对话记录
              </button>
            </div>

            {activeTab === 'info' && (
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
                      <User className="w-10 h-10 text-primary-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{mockUserInfo.name}</h2>
                      <p className="text-gray-500">{mockUserInfo.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    退出登录
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">账号</label>
                      <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-lg">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{mockUserInfo.username}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">邮箱</label>
                      <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-lg">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{mockUserInfo.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">所属部门</label>
                      <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-lg">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{mockUserInfo.department}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">同步状态</label>
                      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${mockUserInfo.syncStatus === '已同步' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                          <span className="text-gray-700">{mockUserInfo.syncStatus}</span>
                        </div>
                        <button
                          onClick={handleSync}
                          disabled={syncing}
                          className="flex items-center gap-1 px-3 py-1 text-sm text-primary-600 hover:bg-primary-50 rounded transition-colors"
                        >
                          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                          {syncing ? '同步中...' : '同步'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <span className="font-medium">提示：</span>您的账号信息已与赣纪通同步，如需修改个人信息请前往赣纪通平台。
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="p-8">
                <div className="space-y-4">
                  {(sessions.length > 0 ? sessions : mockChatHistory).map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                          <MessageSquare className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{session.title}</h3>
                          <p className="text-sm text-gray-500 truncate max-w-md">{session.lastMessage}</p>
                          <p className="text-xs text-gray-400 mt-1">{session.createdAt}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleContinueChat(session.id)}
                          className="px-4 py-2 text-sm text-primary-600 hover:bg-primary-100 rounded-lg transition-colors"
                        >
                          继续对话
                        </button>
                        <button
                          onClick={() => deleteSession(session.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {sessions.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">暂无对话记录</p>
                    <button
                      onClick={() => navigate('/')}
                      className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      开始新对话
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
