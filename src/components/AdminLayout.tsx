import { useState } from 'react';
import { 
  MessageSquare, 
  ThumbsUp, 
  BarChart3, 
  FileText, 
  Layout,
  ChevronDown,
  Settings,
  BookOpen,
  AlertTriangle,
  Users,
  Key,
  Building2,
  UserCircle,
  ArrowLeft
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const menuGroups = [
    {
      title: '数据统计与分析',
      items: [
        { path: '/admin/chat', icon: MessageSquare, label: '对话数据管理' },
        { path: '/admin/feedback', icon: ThumbsUp, label: '评价反馈管理' },
        { path: '/admin/system', icon: BarChart3, label: '系统使用统计' },
        { path: '/admin/qa', icon: BarChart3, label: '问答效果统计' },
        { path: '/admin/knowledge', icon: FileText, label: '知识库使用统计' },
        { path: '/admin/login-log', icon: Users, label: '登录日志' },
        { path: '/admin/operation-log', icon: FileText, label: '操作日志' },
        { path: '/admin/chat-log', icon: MessageSquare, label: '对话日志' },
        { path: '/admin/sensitive-word', icon: AlertTriangle, label: '敏感词管理' },
      ]
    },
    {
      title: 'AI模型与参数配置',
      items: [
        { path: '/admin/model', icon: Settings, label: '模型参数配置' },
        { path: '/admin/knowledge-config', icon: BookOpen, label: '知识库参数配置' },
        { path: '/admin/template', icon: FileText, label: '公文模板配置' },
        { path: '/admin/rules', icon: Settings, label: '问答规则配置' },
      ]
    },
    {
      title: '系统管理',
      items: [
        { path: '/admin/role', icon: Users, label: '角色管理' },
        { path: '/admin/permission', icon: Key, label: '权限管理' },
        { path: '/admin/organization', icon: Building2, label: '组织架构管理' },
        { path: '/admin/account', icon: UserCircle, label: '账号管理' },
        { path: '/admin/system-config', icon: Settings, label: '系统配置' },
      ]
    },
  ];

  const activePath = location.pathname;
  const activeGroup = menuGroups.find(group => 
    group.items.some(item => item.path === activePath)
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className={`bg-white border-r border-gray-200 transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center flex-shrink-0">
              <Layout className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="font-semibold text-gray-900 text-sm">管理后台</h1>
                <p className="text-xs text-gray-500">纪检监察大模型</p>
              </div>
            )}
          </div>
        </div>

        <nav className="p-3 space-y-4">
          {menuGroups.map((group) => {
            const isGroupActive = activeGroup?.title === group.title;
            return (
              <div key={group.title}>
                {!collapsed && (
                  <h3 className={`text-xs font-semibold px-3 mb-2 ${
                    isGroupActive ? 'text-primary-600' : 'text-gray-400'
                  }`}>
                    {group.title}
                  </h3>
                )}
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePath === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                          isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute left-60 bottom-4 -translate-x-1/2 p-2 bg-white border border-gray-200 rounded-full shadow-md hover:bg-gray-50 transition-colors"
        >
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${collapsed ? '-rotate-90' : ''}`} />
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {menuGroups.flatMap(g => g.items).find(item => activePath === item.path)?.label || '管理后台'}
            </h2>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">切换到用户端</span>
              </button>
              <span className="text-sm text-gray-500">管理员</span>
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-sm font-medium text-primary-600">管</span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
