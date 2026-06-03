import { MessageSquare, BookOpen, Plus, User, ChevronRight, Layout, Image, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useChatStore } from '../store/chatStore';
import { cn } from '../lib/utils';

export function Sidebar() {
  const navigate = useNavigate();
  const { sessions, currentSessionId, setCurrentSession, createNewSession } = useChatStore();

  return (
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
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-50 text-primary-700 font-medium"
        >
          <MessageSquare className="w-5 h-5" />
          <span>纪检监察大箱</span>
        </button>
        <button 
          onClick={() => navigate('/knowledge')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <BookOpen className="w-5 h-5" />
          <span>知识库</span>
        </button>
        <button 
          onClick={() => navigate('/media-tools')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <Image className="w-5 h-5" />
          <span>媒体工具</span>
        </button>
      </nav>

      <button 
        onClick={createNewSession}
        className="mx-3 mt-2 flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>开启新的对话</span>
      </button>

      <div className="flex-1 overflow-y-auto">
        <div className="p-3">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">最近对话</h3>
          <div className="space-y-1">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => {
                  navigate('/');
                  setCurrentSession(session.id);
                }}
                className={cn(
                  'w-full text-left px-3 py-2.5 rounded-lg transition-colors',
                  currentSessionId === session.id
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-medium truncate">{session.title}</span>
                  <ChevronRight className={cn(
                    'w-4 h-4 flex-shrink-0 transition-opacity',
                    currentSessionId === session.id ? 'opacity-100' : 'opacity-0'
                  )} />
                </div>
                <p className="text-xs text-gray-400 truncate mt-1">{session.lastMessage}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-gray-200 space-y-2">
        <button 
          onClick={() => navigate('/admin')}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors font-medium"
        >
          <Layout className="w-4 h-4" />
          <span>切换到管理端</span>
        </button>
        
        <button 
          onClick={() => navigate('/profile')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
            <User className="w-4 h-4 text-primary-600" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-gray-700">管理员</p>
            <p className="text-xs text-gray-400">系统管理员</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  );
}
