import { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Save, X } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  type: string;
  format: string;
  content: string;
  exportRule: string;
  createdAt: string;
}

const mockTemplates: Template[] = [
  { id: '1', name: '纪检监察建议书', type: '纪检监察', format: 'docx', content: '尊敬的[单位名称]：\n\n根据[检查/调查]发现，你单位存在以下问题：\n\n[问题描述]\n\n请你单位于[日期]前整改到位，并将整改情况书面报告我委。\n\n特此建议。\n\n[发文单位]\n[日期]', exportRule: 'PDF, DOCX', createdAt: '2024-01-10' },
  { id: '2', name: '立案审查决定书', type: '案件办理', format: 'docx', content: '关于对[被审查人姓名]立案审查的决定\n\n根据《中华人民共和国监察法》有关规定，经[批准机关]批准，决定对[被审查人姓名]涉嫌[问题类型]问题立案审查调查。\n\n[审查机关]\n[日期]', exportRule: 'PDF, DOCX', createdAt: '2024-01-12' },
  { id: '3', name: '政务处分决定书', type: '政务处分', format: 'docx', content: '政务处分决定书\n\n[被处分人姓名]，[性别]，[出生年月]，[职务]，[工作单位]。\n\n经调查，[被处分人姓名]存在[违纪违法事实]。\n\n依据[法律条款]，决定给予[被处分人姓名][处分种类]处分。\n\n[处分机关]\n[日期]', exportRule: 'PDF, DOCX', createdAt: '2024-01-15' },
];

export default function DocumentTemplate() {
  const [templates, setTemplates] = useState<Template[]>(mockTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    type: '',
    format: 'docx',
    content: '',
    exportRule: 'PDF',
  });

  const handleAdd = () => {
    const template: Template = {
      id: String(Date.now()),
      name: newTemplate.name,
      type: newTemplate.type,
      format: newTemplate.format,
      content: newTemplate.content,
      exportRule: newTemplate.exportRule,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTemplates([...templates, template]);
    setNewTemplate({ name: '', type: '', format: 'docx', content: '', exportRule: 'PDF' });
  };

  const handleDelete = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
  };

  const handleSave = () => {
    if (selectedTemplate) {
      setTemplates(templates.map(t => 
        t.id === selectedTemplate.id ? selectedTemplate : t
      ));
      setIsEditing(false);
    }
  };

  const types = ['纪检监察', '案件办理', '政务处分', '信访举报', '其他'];
  const exportRules = ['PDF', 'DOCX', 'PDF, DOCX'];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">公文模板管理</h3>
          <button
            onClick={() => setSelectedTemplate(null)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            新增模板
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">模板名称</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">类型</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">格式</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">导出规则</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">创建时间</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((template) => (
                <tr key={template.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-600">{template.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{template.type}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{template.format}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{template.exportRule}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{template.createdAt}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setSelectedTemplate(template); setIsEditing(false); }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="预览"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { setSelectedTemplate(template); setIsEditing(true); }}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        title="编辑"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(template.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
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

      {selectedTemplate && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {isEditing ? '编辑模板' : '预览模板'}
            </h3>
            <button
              onClick={() => setSelectedTemplate(null)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">模板名称</label>
              <input
                type="text"
                value={selectedTemplate.name}
                onChange={(e) => setSelectedTemplate({ ...selectedTemplate, name: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  isEditing ? 'border-gray-200' : 'border-gray-100 bg-gray-50'
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">类型</label>
              <select
                value={selectedTemplate.type}
                onChange={(e) => setSelectedTemplate({ ...selectedTemplate, type: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  isEditing ? 'border-gray-200' : 'border-gray-100 bg-gray-50'
                }`}
              >
                {types.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">格式</label>
              <select
                value={selectedTemplate.format}
                onChange={(e) => setSelectedTemplate({ ...selectedTemplate, format: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  isEditing ? 'border-gray-200' : 'border-gray-100 bg-gray-50'
                }`}
              >
                <option value="docx">DOCX</option>
                <option value="pdf">PDF</option>
                <option value="txt">TXT</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">导出规则</label>
              <select
                value={selectedTemplate.exportRule}
                onChange={(e) => setSelectedTemplate({ ...selectedTemplate, exportRule: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  isEditing ? 'border-gray-200' : 'border-gray-100 bg-gray-50'
                }`}
              >
                {exportRules.map(rule => <option key={rule} value={rule}>{rule}</option>)}
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">模板内容</label>
            <textarea
              value={selectedTemplate.content}
              onChange={(e) => setSelectedTemplate({ ...selectedTemplate, content: e.target.value })}
              disabled={!isEditing}
              rows={10}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none ${
                isEditing ? 'border-gray-200' : 'border-gray-100 bg-gray-50'
              }`}
            />
          </div>

          {isEditing && (
            <div className="flex justify-end mt-6">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                保存修改
              </button>
            </div>
          )}
        </div>
      )}

      {!selectedTemplate && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">新增公文模板</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">模板名称</label>
              <input
                type="text"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">类型</label>
              <select
                value={newTemplate.type}
                onChange={(e) => setNewTemplate({ ...newTemplate, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">请选择类型</option>
                {types.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">格式</label>
              <select
                value={newTemplate.format}
                onChange={(e) => setNewTemplate({ ...newTemplate, format: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="docx">DOCX</option>
                <option value="pdf">PDF</option>
                <option value="txt">TXT</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">导出规则</label>
              <select
                value={newTemplate.exportRule}
                onChange={(e) => setNewTemplate({ ...newTemplate, exportRule: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {exportRules.map(rule => <option key={rule} value={rule}>{rule}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">模板内容</label>
            <textarea
              value={newTemplate.content}
              onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
              rows={10}
              placeholder="请输入模板内容，支持占位符如 [单位名称]、[日期] 等"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>
          <div className="flex justify-end mt-6">
            <button
              onClick={handleAdd}
              disabled={!newTemplate.name || !newTemplate.type}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                newTemplate.name && newTemplate.type
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" />
              创建模板
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
