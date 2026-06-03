import { useState } from 'react';
import { Search, BookOpen, Clock, Eye, ChevronRight, X } from 'lucide-react';
import { useKnowledgeStore } from '../store/knowledgeStore';

export default function KnowledgeBase() {
  const { categories, selectedCategory, searchQuery, setSelectedCategory, setSearchQuery, getFilteredItems } = useKnowledgeStore();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const filteredItems = getFilteredItems();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const getItemById = (id: string) => {
    return filteredItems.find(item => item.id === id);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col">
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
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            <BookOpen className="w-5 h-5" />
            <span>纪检监察大箱</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-50 text-primary-700 font-medium">
            <BookOpen className="w-5 h-5" />
            <span>知识库</span>
          </button>
        </nav>

        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="搜索知识库..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="px-3">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">分类</h3>
          <div className="space-y-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{category.icon}</span>
                  {category.name}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  selectedCategory === category.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 pt-4">
          <div className="space-y-2">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedItem === item.id
                    ? 'bg-primary-50 border border-primary-200'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <h4 className="text-sm font-medium text-gray-900 truncate">{item.title}</h4>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.summary}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.createdAt}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {item.views}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white">
        {selectedItem ? (
          <>
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {getItemById(selectedItem)?.title}
                  </h2>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span>{getItemById(selectedItem)?.createdAt}</span>
                    <span>浏览量: {getItemById(selectedItem)?.views}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {getItemById(selectedItem)?.content}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <BookOpen className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">欢迎使用知识库</h3>
            <p className="text-sm text-gray-400">请从左侧选择一篇文档进行查看</p>
          </div>
        )}
      </div>
    </div>
  );
}
