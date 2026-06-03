import { useState } from 'react';
import { Plus, Edit, Trash2, Search, ChevronRight, ChevronDown, RefreshCw } from 'lucide-react';

interface Department {
  id: string;
  name: string;
  parentId: string | null;
  level: number;
  status: 'active' | 'inactive';
  memberCount: number;
  createdAt: string;
  children?: Department[];
}

const mockDepartments: Department[] = [
  { id: '1', name: '市纪委监委', parentId: null, level: 1, status: 'active', memberCount: 150, createdAt: '2024-01-01' },
  { id: '2', name: '办公室', parentId: '1', level: 2, status: 'active', memberCount: 30, createdAt: '2024-01-02' },
  { id: '3', name: '组织部', parentId: '1', level: 2, status: 'active', memberCount: 25, createdAt: '2024-01-02' },
  { id: '4', name: '宣传部', parentId: '1', level: 2, status: 'active', memberCount: 20, createdAt: '2024-01-02' },
  { id: '5', name: '第一纪检监察室', parentId: '1', level: 2, status: 'active', memberCount: 15, createdAt: '2024-01-03' },
  { id: '6', name: '第二纪检监察室', parentId: '1', level: 2, status: 'active', memberCount: 15, createdAt: '2024-01-03' },
  { id: '7', name: '综合科', parentId: '2', level: 3, status: 'active', memberCount: 10, createdAt: '2024-01-04' },
  { id: '8', name: '秘书科', parentId: '2', level: 3, status: 'active', memberCount: 8, createdAt: '2024-01-04' },
  { id: '9', name: '人事科', parentId: '3', level: 3, status: 'active', memberCount: 12, createdAt: '2024-01-04' },
];

const buildTree = (departments: Department[]): Department[] => {
  const map = new Map<string, Department>();
  const roots: Department[] = [];
  
  departments.forEach(dept => map.set(dept.id, { ...dept, children: [] }));
  
  departments.forEach(dept => {
    const node = map.get(dept.id)!;
    if (dept.parentId) {
      const parent = map.get(dept.parentId);
      if (parent) parent.children!.push(node);
    } else {
      roots.push(node);
    }
  });
  
  return roots;
};

export default function OrganizationManagement() {
  const [departments] = useState<Department[]>(mockDepartments);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['1']));
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  const treeData = buildTree(departments);
  
  const filteredDepartments = departments.filter(d => 
    d.name.includes(searchQuery)
  );

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const handleSync = () => {
    alert('正在与赣纪通组织架构同步...');
  };

  const renderTree = (nodes: Department[], depth = 0) => {
    return nodes.map(node => {
      const hasChildren = node.children && node.children.length > 0;
      const isExpanded = expandedIds.has(node.id);
      
      return (
        <div key={node.id}>
          <div 
            className={`flex items-center gap-2 py-3 px-4 hover:bg-gray-50 cursor-pointer transition-colors ${
              selectedDepartment?.id === node.id ? 'bg-gray-100' : ''
            }`}
            onClick={() => {
              if (hasChildren) toggleExpand(node.id);
              setSelectedDepartment(node);
            }}
            style={{ paddingLeft: `${depth * 24 + 16}px` }}
          >
            {hasChildren && (
              <button className="p-1 hover:bg-gray-200 rounded">
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </button>
            )}
            {!hasChildren && <span className="w-6" />}
            <div className="flex-1 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${node.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="font-medium text-gray-900">{node.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">{node.memberCount} 人</span>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          {hasChildren && isExpanded && renderTree(node.children!, depth + 1)}
        </div>
      );
    });
  };

  return (
    <div className="flex gap-6">
      <div className="flex-1 bg-white rounded-xl shadow-sm">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索部门..."
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
            />
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
              新增部门
            </button>
          </div>
        </div>

        <div className="max-h-[600px] overflow-y-auto">
          {searchQuery ? (
            <div className="p-4">
              {filteredDepartments.length > 0 ? (
                <table className="w-full">
                  <tbody>
                    {filteredDepartments.map(dept => (
                      <tr 
                        key={dept.id}
                        className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedDepartment(dept)}
                      >
                        <td className="py-3 px-4">
                          <span className={`w-2 h-2 rounded-full mr-2 ${dept.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`} />
                          {dept.name}
                        </td>
                        <td className="py-3 px-4 text-gray-500">层级 {dept.level}</td>
                        <td className="py-3 px-4 text-gray-500">{dept.memberCount} 人</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center text-gray-500 py-8">未找到匹配的部门</p>
              )}
            </div>
          ) : (
            renderTree(treeData)
          )}
        </div>
      </div>

      <div className="w-80 bg-white rounded-xl shadow-sm">
        {selectedDepartment ? (
          <>
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">部门详情</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">部门名称</label>
                <p className="text-gray-900 font-medium">{selectedDepartment.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">层级</label>
                <p className="text-gray-900">第 {selectedDepartment.level} 级</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">状态</label>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  selectedDepartment.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {selectedDepartment.status === 'active' ? '启用' : '禁用'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">成员数量</label>
                <p className="text-gray-900">{selectedDepartment.memberCount} 人</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">创建时间</label>
                <p className="text-gray-900">{selectedDepartment.createdAt}</p>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <button className="w-full flex items-center gap-2 justify-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Edit className="w-4 h-4" />
                  编辑部门
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Search className="w-8 h-8" />
            </div>
            <p>请选择一个部门</p>
          </div>
        )}
      </div>
    </div>
  );
}
