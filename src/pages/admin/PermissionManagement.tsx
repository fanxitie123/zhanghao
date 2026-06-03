import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Save, X, Eye, EyeOff, Shield, Database } from 'lucide-react';

interface Permission {
  id: string;
  type: 'function' | 'data';
  module: string;
  name: string;
  code: string;
  description: string;
  status: 'active' | 'inactive';
}

const mockPermissions: Permission[] = [
  { id: '1', type: 'function', module: '用户管理', name: '查看用户', code: 'user:view', description: '查看用户列表和详情', status: 'active' },
  { id: '2', type: 'function', module: '用户管理', name: '创建用户', code: 'user:create', description: '创建新用户', status: 'active' },
  { id: '3', type: 'function', module: '用户管理', name: '编辑用户', code: 'user:edit', description: '编辑用户信息', status: 'active' },
  { id: '4', type: 'function', module: '用户管理', name: '删除用户', code: 'user:delete', description: '删除用户', status: 'active' },
  { id: '5', type: 'function', module: '角色管理', name: '查看角色', code: 'role:view', description: '查看角色列表和详情', status: 'active' },
  { id: '6', type: 'function', module: '角色管理', name: '管理角色', code: 'role:manage', description: '创建、编辑、删除角色', status: 'active' },
  { id: '7', type: 'function', module: '权限管理', name: '查看权限', code: 'permission:view', description: '查看权限配置', status: 'active' },
  { id: '8', type: 'function', module: '权限管理', name: '配置权限', code: 'permission:manage', description: '配置权限项', status: 'active' },
  { id: '9', type: 'function', module: '系统配置', name: '查看配置', code: 'config:view', description: '查看系统配置', status: 'active' },
  { id: '10', type: 'function', module: '系统配置', name: '修改配置', code: 'config:edit', description: '修改系统配置', status: 'active' },
  { id: '11', type: 'function', module: '知识库管理', name: '查看文档', code: 'knowledge:view', description: '查看知识库文档', status: 'active' },
  { id: '12', type: 'function', module: '知识库管理', name: '上传文档', code: 'knowledge:upload', description: '上传文档到知识库', status: 'active' },
  { id: '13', type: 'function', module: '知识库管理', name: '删除文档', code: 'knowledge:delete', description: '删除知识库文档', status: 'active' },
  { id: '14', type: 'function', module: '问答模块', name: '发起问答', code: 'qa:ask', description: '发起AI问答请求', status: 'active' },
  { id: '15', type: 'function', module: '问答模块', name: '查看历史', code: 'qa:history', description: '查看问答历史记录', status: 'active' },
  { id: '16', type: 'function', module: '数据统计', name: '查看统计', code: 'stats:view', description: '查看系统统计数据', status: 'active' },
  { id: '17', type: 'data', module: '数据权限', name: '全部数据', code: 'data:all', description: '访问所有数据', status: 'active' },
  { id: '18', type: 'data', module: '数据权限', name: '本部门数据', code: 'data:department', description: '仅访问本部门数据', status: 'active' },
  { id: '19', type: 'data', module: '数据权限', name: '公共数据', code: 'data:public', description: '仅访问公共数据', status: 'active' },
  { id: '20', type: 'data', module: '数据权限', name: '只读数据', code: 'data:readonly', description: '仅可查看数据', status: 'active' },
];

const modules = ['全部', '用户管理', '角色管理', '权限管理', '系统配置', '知识库管理', '问答模块', '数据统计', '数据权限'];

export default function PermissionManagement() {
  const [permissions, setPermissions] = useState<Permission[]>(mockPermissions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState('全部');
  const [selectedType, setSelectedType] = useState<'all' | 'function' | 'data'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [newPermission, setNewPermission] = useState<{
    type: 'function' | 'data';
    module: string;
    name: string;
    code: string;
    description: string;
  }>({
    type: 'function',
    module: '',
    name: '',
    code: '',
    description: '',
  });

  const filteredPermissions = permissions.filter(p => {
    const matchSearch = p.name.includes(searchQuery) || p.code.includes(searchQuery) || p.description.includes(searchQuery);
    const matchModule = selectedModule === '全部' || p.module === selectedModule;
    const matchType = selectedType === 'all' || p.type === selectedType;
    return matchSearch && matchModule && matchType;
  });

  const handleAdd = () => {
    if (!newPermission.name || !newPermission.code || !newPermission.module) return;
    const permission: Permission = {
      id: String(Date.now()),
      ...newPermission,
      status: 'active',
    };
    setPermissions([...permissions, permission]);
    setNewPermission({ type: 'function', module: '', name: '', code: '', description: '' });
    setIsModalOpen(false);
  };

  const handleSave = () => {
    if (editingPermission) {
      setPermissions(permissions.map(p => p.id === editingPermission.id ? editingPermission : p));
      setIsModalOpen(false);
      setEditingPermission(null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个权限项吗？')) {
      setPermissions(permissions.filter(p => p.id !== id));
    }
  };

  const toggleStatus = (id: string) => {
    setPermissions(permissions.map(p => 
      p.id === id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p
    ));
  };

  const openEditModal = (permission: Permission) => {
    setEditingPermission({ ...permission });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingPermission(null);
    setNewPermission({ type: 'function', module: '', name: '', code: '', description: '' });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索权限名称、编码或描述..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-80"
              />
            </div>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {modules.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">全部类型</option>
              <option value="function">功能权限</option>
              <option value="data">数据权限</option>
            </select>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            新增权限
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">权限类型</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">所属模块</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">权限名称</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">权限编码</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">描述</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">状态</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredPermissions.map(permission => (
                <tr key={permission.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${
                      permission.type === 'function' 
                        ? 'bg-primary-100 text-primary-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {permission.type === 'function' ? (
                        <Shield className="w-3 h-3" />
                      ) : (
                        <Database className="w-3 h-3" />
                      )}
                      {permission.type === 'function' ? '功能' : '数据'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{permission.module}</td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{permission.name}</td>
                  <td className="py-3 px-4 text-sm font-mono text-gray-500">{permission.code}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 max-w-xs">{permission.description}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      permission.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {permission.status === 'active' ? '启用' : '禁用'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleStatus(permission.id)}
                        className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                        title={permission.status === 'active' ? '禁用' : '启用'}
                      >
                        {permission.status === 'active' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => openEditModal(permission)}
                        className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                        title="编辑"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(permission.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="删除"
                      >
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
          <span className="text-sm text-gray-500">共 {filteredPermissions.length} 条记录</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50">上一页</button>
            <span className="px-3 py-1 text-sm text-gray-600">1</span>
            <button className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50">下一页</button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingPermission ? '编辑权限' : '新增权限'}
              </h3>
              <button
                onClick={() => { setIsModalOpen(false); setEditingPermission(null); }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">权限类型</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => editingPermission 
                      ? setEditingPermission({ ...editingPermission, type: 'function' }) 
                      : setNewPermission({ ...newPermission, type: 'function' })
                    }
                    className={`flex-1 px-4 py-2 rounded-lg text-sm border-2 transition-colors ${
                      (editingPermission?.type || newPermission.type) === 'function'
                        ? 'bg-primary-100 text-primary-700 border-primary-300'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Shield className="w-4 h-4" />
                      功能权限
                    </div>
                  </button>
                  <button
                    onClick={() => editingPermission 
                      ? setEditingPermission({ ...editingPermission, type: 'data' }) 
                      : setNewPermission({ ...newPermission, type: 'data' })
                    }
                    className={`flex-1 px-4 py-2 rounded-lg text-sm border-2 transition-colors ${
                      (editingPermission?.type || newPermission.type) === 'data'
                        ? 'bg-green-100 text-green-700 border-green-300'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Database className="w-4 h-4" />
                      数据权限
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">所属模块</label>
                <select
                  value={editingPermission?.module || newPermission.module}
                  onChange={(e) => editingPermission
                    ? setEditingPermission({ ...editingPermission, module: e.target.value })
                    : setNewPermission({ ...newPermission, module: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">请选择模块</option>
                  {modules.filter(m => m !== '全部').map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">权限名称</label>
                <input
                  type="text"
                  value={editingPermission?.name || newPermission.name}
                  onChange={(e) => editingPermission
                    ? setEditingPermission({ ...editingPermission, name: e.target.value })
                    : setNewPermission({ ...newPermission, name: e.target.value })
                  }
                  placeholder="例如：查看用户"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">权限编码</label>
                <input
                  type="text"
                  value={editingPermission?.code || newPermission.code}
                  onChange={(e) => editingPermission
                    ? setEditingPermission({ ...editingPermission, code: e.target.value })
                    : setNewPermission({ ...newPermission, code: e.target.value })
                  }
                  placeholder="例如：user:view"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">权限描述</label>
                <textarea
                  value={editingPermission?.description || newPermission.description}
                  onChange={(e) => editingPermission
                    ? setEditingPermission({ ...editingPermission, description: e.target.value })
                    : setNewPermission({ ...newPermission, description: e.target.value })
                  }
                  placeholder="描述这个权限的用途"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
              <button
                onClick={() => { setIsModalOpen(false); setEditingPermission(null); }}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={editingPermission ? handleSave : handleAdd}
                disabled={!((editingPermission?.name && editingPermission?.code) || (newPermission.name && newPermission.code && newPermission.module))}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  ((editingPermission?.name && editingPermission?.code) || (newPermission.name && newPermission.code && newPermission.module))
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Save className="w-4 h-4 inline mr-1" />
                {editingPermission ? '保存修改' : '创建权限'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
