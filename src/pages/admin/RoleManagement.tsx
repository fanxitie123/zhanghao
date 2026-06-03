import { useState } from 'react';
import { Plus, Edit, Trash2, Search, Save, X, CheckSquare, Square, Shield, Database } from 'lucide-react';

interface Permission {
  id: string;
  type: 'function' | 'data';
  module: string;
  name: string;
  code: string;
  description: string;
  status: 'active' | 'inactive';
}

interface Role {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  functionPermissions: string[]; // 功能权限代码数组
  dataPermissions: string[]; // 数据权限代码数组
  createdAt: string;
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

const mockRoles: Role[] = [
  { 
    id: '1', 
    name: '系统管理员', 
    description: '拥有系统全部权限', 
    status: 'active', 
    functionPermissions: ['user:view', 'user:create', 'user:edit', 'user:delete', 'role:view', 'role:manage', 'permission:view', 'permission:manage', 'config:view', 'config:edit', 'knowledge:view', 'knowledge:upload', 'knowledge:delete', 'qa:ask', 'qa:history', 'stats:view'],
    dataPermissions: ['data:all'],
    createdAt: '2024-01-01' 
  },
  { 
    id: '2', 
    name: '部门管理员', 
    description: '管理本部门数据', 
    status: 'active', 
    functionPermissions: ['user:view', 'role:view', 'knowledge:view', 'knowledge:upload', 'knowledge:delete', 'qa:ask', 'qa:history'],
    dataPermissions: ['data:department', 'data:public'],
    createdAt: '2024-01-05' 
  },
  { 
    id: '3', 
    name: '普通用户', 
    description: '基础使用权限', 
    status: 'active', 
    functionPermissions: ['knowledge:view', 'qa:ask', 'qa:history'],
    dataPermissions: ['data:public', 'data:readonly'],
    createdAt: '2024-01-10' 
  },
];

export default function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [permissions] = useState<Permission[]>(mockPermissions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newRole, setNewRole] = useState({ 
    name: '', 
    description: '', 
    functionPermissions: [] as string[], 
    dataPermissions: [] as string[] 
  });

  const functionPermissions = permissions.filter(p => p.type === 'function' && p.status === 'active');
  const dataPermissions = permissions.filter(p => p.type === 'data' && p.status === 'active');

  const groupedFunctionPermissions = functionPermissions.reduce((acc, p) => {
    if (!acc[p.module]) acc[p.module] = [];
    acc[p.module].push(p);
    return acc;
  }, {} as Record<string, Permission[]>);

  const filteredRoles = roles.filter(role => 
    role.name.includes(searchQuery) || role.description.includes(searchQuery)
  );

  const handleAdd = () => {
    if (!newRole.name) return;
    const role: Role = {
      id: String(Date.now()),
      name: newRole.name,
      description: newRole.description,
      status: 'active',
      functionPermissions: [...newRole.functionPermissions],
      dataPermissions: [...newRole.dataPermissions],
      createdAt: new Date().toISOString().split('T')[0],
    };
    setRoles([...roles, role]);
    setNewRole({ name: '', description: '', functionPermissions: [], dataPermissions: [] });
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个角色吗？')) {
      setRoles(roles.filter(r => r.id !== id));
    }
  };

  const handleSave = () => {
    if (selectedRole) {
      setRoles(roles.map(r => r.id === selectedRole.id ? selectedRole : r));
      setIsEditing(false);
    }
  };

  const togglePermission = (currentPermissions: string[], code: string) => {
    return currentPermissions.includes(code) 
      ? currentPermissions.filter(p => p !== code)
      : [...currentPermissions, code];
  };

  const getPermissionName = (code: string) => {
    return permissions.find(p => p.code === code)?.name || code;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索角色..."
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
            />
          </div>
          <button
            onClick={() => { setSelectedRole(null); setIsEditing(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            新增角色
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">角色名称</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">描述</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">状态</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">权限配置</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">创建时间</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoles.map((role) => (
                <tr key={role.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900 font-medium">{role.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{role.description}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      role.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {role.status === 'active' ? '启用' : '禁用'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="flex items-center gap-1 text-primary-600">
                        <Shield className="w-3.5 h-3.5" />
                        {role.functionPermissions.length}
                      </span>
                      <span className="flex items-center gap-1 text-green-600">
                        <Database className="w-3.5 h-3.5" />
                        {role.dataPermissions.length}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{role.createdAt}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setSelectedRole(role); setIsEditing(true); }}
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="编辑"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(role.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
      </div>

      {(selectedRole !== null && isEditing) || (!selectedRole && isEditing) ? (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedRole ? '编辑角色' : '新增角色'}
            </h3>
            <button
              onClick={() => { setIsEditing(false); setSelectedRole(null); }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">角色名称</label>
                <input
                  type="text"
                  value={selectedRole?.name || newRole.name}
                  onChange={(e) => {
                    if (selectedRole) setSelectedRole({ ...selectedRole, name: e.target.value });
                    else setNewRole({ ...newRole, name: e.target.value });
                  }}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">角色描述</label>
                <input
                  type="text"
                  value={selectedRole?.description || newRole.description}
                  onChange={(e) => {
                    if (selectedRole) setSelectedRole({ ...selectedRole, description: e.target.value });
                    else setNewRole({ ...newRole, description: e.target.value });
                  }}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary-600" />
                  功能权限
                </h4>
                <span className="text-sm text-gray-500">
                  已选择 {((selectedRole?.functionPermissions || newRole.functionPermissions)).length} / {functionPermissions.length}
                </span>
              </div>
              <div className="space-y-4">
                {Object.keys(groupedFunctionPermissions).map(module => (
                  <div key={module} className="border border-gray-200 rounded-xl p-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">{module}</h5>
                    <div className="flex flex-wrap gap-2">
                      {groupedFunctionPermissions[module].map(permission => {
                        const currentPermissions = selectedRole?.functionPermissions || newRole.functionPermissions;
                        const hasPermission = currentPermissions.includes(permission.code);
                        return (
                          <button
                            key={permission.id}
                            onClick={() => {
                              if (selectedRole) {
                                setSelectedRole({
                                  ...selectedRole,
                                  functionPermissions: togglePermission(currentPermissions, permission.code)
                                });
                              } else {
                                setNewRole({
                                  ...newRole,
                                  functionPermissions: togglePermission(currentPermissions, permission.code)
                                });
                              }
                            }}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                              hasPermission
                                ? 'bg-primary-100 text-primary-700 border border-primary-300'
                                : 'bg-gray-50 text-gray-600 border border-gray-200 hover:border-gray-300'
                            }`}
                            title={permission.description}
                          >
                            {hasPermission ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
                            {permission.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <Database className="w-4 h-4 text-green-600" />
                  数据权限
                </h4>
                <span className="text-sm text-gray-500">
                  已选择 {((selectedRole?.dataPermissions || newRole.dataPermissions)).length} / {dataPermissions.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {dataPermissions.map(permission => {
                  const currentPermissions = selectedRole?.dataPermissions || newRole.dataPermissions;
                  const hasPermission = currentPermissions.includes(permission.code);
                  return (
                    <button
                      key={permission.id}
                      onClick={() => {
                        if (selectedRole) {
                          setSelectedRole({
                            ...selectedRole,
                            dataPermissions: togglePermission(currentPermissions, permission.code)
                          });
                        } else {
                          setNewRole({
                            ...newRole,
                            dataPermissions: togglePermission(currentPermissions, permission.code)
                          });
                        }
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                        hasPermission
                          ? 'bg-green-100 text-green-700 border border-green-300'
                          : 'bg-gray-50 text-gray-600 border border-gray-200 hover:border-gray-300'
                      }`}
                      title={permission.description}
                    >
                      {hasPermission ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                      {permission.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedRole && !isEditing && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">权限摘要</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">功能权限：</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {selectedRole.functionPermissions.slice(0, 5).map(code => (
                        <span key={code} className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded text-xs">
                          {getPermissionName(code)}
                        </span>
                      ))}
                      {selectedRole.functionPermissions.length > 5 && (
                        <span className="text-gray-500">+{selectedRole.functionPermissions.length - 5} 项</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">数据权限：</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {selectedRole.dataPermissions.map(code => (
                        <span key={code} className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                          {getPermissionName(code)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => { setIsEditing(false); setSelectedRole(null); }}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={selectedRole ? handleSave : handleAdd}
                disabled={!((selectedRole?.name) || newRole.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  ((selectedRole?.name) || newRole.name)
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Save className="w-4 h-4" />
                {selectedRole ? '保存修改' : '创建角色'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
