import { useState } from 'react';
import { Calendar, FileText, Download, Tag, BarChart2 } from 'lucide-react';

interface CategoryStats {
  category: string;
  icon: string;
  count: number;
  views: number;
  downloads: number;
}

interface DocumentStats {
  id: string;
  title: string;
  category: string;
  views: number;
  downloads: number;
  type: string;
}

const mockCategoryStats: CategoryStats[] = [
  { category: '法律法规', icon: '📖', count: 15, views: 2580, downloads: 890 },
  { category: '政策文件', icon: '📋', count: 12, views: 1856, downloads: 678 },
  { category: '典型案例', icon: '💼', count: 8, views: 3210, downloads: 1256 },
  { category: '工作指南', icon: '📝', count: 10, views: 1420, downloads: 489 },
];

const mockDocumentStats: DocumentStats[] = [
  { id: '1', title: '中华人民共和国监察法', category: '法律法规', views: 1256, downloads: 456, type: 'pdf' },
  { id: '2', title: '公职人员政务处分法', category: '法律法规', views: 987, downloads: 321, type: 'pdf' },
  { id: '3', title: '某国企高管贪污腐败案分析', category: '典型案例', views: 1534, downloads: 567, type: 'doc' },
  { id: '4', title: '监察机关监督执法工作规定', category: '政策文件', views: 856, downloads: 289, type: 'pdf' },
  { id: '5', title: '监察机关调查工作流程指南', category: '工作指南', views: 723, downloads: 234, type: 'doc' },
  { id: '6', title: '中国共产党纪律处分条例', category: '法律法规', views: 689, downloads: 215, type: 'pdf' },
];

const totals = {
  documents: mockCategoryStats.reduce((sum, cat) => sum + cat.count, 0),
  views: mockCategoryStats.reduce((sum, cat) => sum + cat.views, 0),
  downloads: mockCategoryStats.reduce((sum, cat) => sum + cat.downloads, 0),
};

export default function KnowledgeStats() {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedType, setSelectedType] = useState('全部');

  const categories = ['全部', ...mockCategoryStats.map(c => c.category)];
  const types = ['全部', 'pdf', 'doc'];

  const filteredDocuments = mockDocumentStats.filter(doc => {
    const matchCategory = selectedCategory === '全部' || doc.category === selectedCategory;
    const matchType = selectedType === '全部' || doc.type === selectedType;
    return matchCategory && matchType;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <Tag className="w-5 h-5 text-gray-400" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {types.map(type => <option key={type} value={type}>{type === '全部' ? '全部类型' : type.toUpperCase()}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totals.documents}</p>
              <p className="text-sm text-gray-500">文档总数</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <BarChart2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totals.views.toLocaleString()}</p>
              <p className="text-sm text-gray-500">总访问量</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Download className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totals.downloads.toLocaleString()}</p>
              <p className="text-sm text-gray-500">总下载量</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">分类访问统计</h3>
          <div className="space-y-4">
            {mockCategoryStats.map((cat) => {
              const maxViews = Math.max(...mockCategoryStats.map(c => c.views));
              const widthPercent = (cat.views / maxViews) * 100;
              return (
                <div key={cat.category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{cat.icon}</span>
                      {cat.category}
                    </span>
                    <span className="text-sm text-gray-500">{cat.views.toLocaleString()} 次</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                      style={{ width: `${widthPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">高频使用文档 Top 5</h3>
          <div className="space-y-3">
            {mockDocumentStats.slice(0, 5).map((doc, index) => (
              <div key={doc.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  index === 0 ? 'bg-yellow-100 text-yellow-600' :
                  index === 1 ? 'bg-gray-100 text-gray-600' :
                  index === 2 ? 'bg-orange-100 text-orange-600' :
                  'bg-gray-100 text-gray-500'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{doc.title}</p>
                  <p className="text-xs text-gray-500">{doc.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{doc.views}次访问</p>
                  <p className="text-xs text-gray-400">{doc.downloads}次下载</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">文档详情列表</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">文档标题</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">分类</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">类型</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">访问量</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">下载量</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-600">{doc.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{doc.title}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{doc.category}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      {doc.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{doc.views}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{doc.downloads}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-500">共 {filteredDocuments.length} 条记录</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50">上一页</button>
            <span className="px-3 py-1 text-sm text-gray-600">1</span>
            <button className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50">下一页</button>
          </div>
        </div>
      </div>
    </div>
  );
}
