import { useState, useRef } from 'react';
import { Search, Plus, Edit2, Trash2, ChevronDown, ChevronRight, Save, X, Upload, FolderPlus, FolderEdit, Trash2 as FolderDeleteIcon, CheckCircle, AlertCircle, GripVertical } from 'lucide-react';

interface SensitiveWord {
  id: string;
  word: string;
  createdAt: string;
}

interface SensitiveCategory {
  id: string;
  name: string;
  description: string;
  count: number;
  words: SensitiveWord[];
}

const mockCategories: SensitiveCategory[] = [
  {
    id: '1',
    name: '政治敏感',
    description: '涉及政治人物、事件等敏感内容',
    count: 15,
    words: [
      { id: '1-1', word: '敏感词1', createdAt: '2024-01-15 10:30:25' },
      { id: '1-2', word: '敏感词2', createdAt: '2024-01-15 11:00:15' },
      { id: '1-3', word: '敏感词3', createdAt: '2024-01-14 14:20:30' },
    ]
  },
  {
    id: '2',
    name: '色情低俗',
    description: '涉及色情、低俗、淫秽等内容',
    count: 23,
    words: [
      { id: '2-1', word: '敏感词4', createdAt: '2024-01-15 09:15:40' },
      { id: '2-2', word: '敏感词5', createdAt: '2024-01-14 16:30:20' },
    ]
  },
  {
    id: '3',
    name: '暴力恐怖',
    description: '涉及暴力、恐怖主义等内容',
    count: 8,
    words: [
      { id: '3-1', word: '敏感词6', createdAt: '2024-01-13 10:45:10' },
      { id: '3-2', word: '敏感词7', createdAt: '2024-01-12 15:20:00' },
      { id: '3-3', word: '敏感词8', createdAt: '2024-01-12 09:30:45' },
      { id: '3-4', word: '敏感词9', createdAt: '2024-01-11 11:15:30' },
    ]
  },
  {
    id: '4',
    name: '恶意攻击',
    description: '涉及人身攻击、侮辱、诽谤等内容',
    count: 12,
    words: [
      { id: '4-1', word: '敏感词10', createdAt: '2024-01-15 14:00:00' },
    ]
  },
];

export default function SensitiveWord() {
  const [categories, setCategories] = useState<SensitiveCategory[]>(mockCategories);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingWord, setEditingWord] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addMode, setAddMode] = useState<'single' | 'batch'>('single');
  const [newWord, setNewWord] = useState('');
  const [batchWords, setBatchWords] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [importResult, setImportResult] = useState<{ success: number; failed: number; duplicates: number } | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryMode, setCategoryMode] = useState<'create' | 'edit'>('create');
  const [editingCategory, setEditingCategory] = useState<SensitiveCategory | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleEditWord = (categoryId: string, wordId: string, word: string) => {
    setEditingWord(`${categoryId}-${wordId}`);
    setEditingValue(word);
  };

  const handleSaveWordEdit = (categoryId: string, wordId: string) => {
    if (!editingValue.trim()) return;
    setCategories(prev => prev.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          words: category.words.map(w => 
            w.id === wordId ? { ...w, word: editingValue } : w
          )
        };
      }
      return category;
    }));
    setEditingWord(null);
    setEditingValue('');
  };

  const handleCancelWordEdit = () => {
    setEditingWord(null);
    setEditingValue('');
  };

  const handleDeleteWord = (categoryId: string, wordId: string) => {
    if (confirm('确定要删除这个敏感词吗？')) {
      setCategories(prev => prev.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            count: category.count - 1,
            words: category.words.filter(w => w.id !== wordId)
          };
        }
        return category;
      }));
    }
  };

  const handleAddSingleWord = () => {
    if (!newWord.trim() || !selectedCategoryId) return;

    const targetCategory = categories.find(c => c.id === selectedCategoryId);
    if (targetCategory && targetCategory.words.some(w => w.word === newWord.trim())) {
      alert('该敏感词已存在');
      return;
    }

    const newWordItem: SensitiveWord = {
      id: `${selectedCategoryId}-${Date.now()}`,
      word: newWord.trim(),
      createdAt: new Date().toLocaleString('zh-CN')
    };

    setCategories(prev => prev.map(category => {
      if (category.id === selectedCategoryId) {
        return {
          ...category,
          count: category.count + 1,
          words: [...category.words, newWordItem]
        };
      }
      return category;
    }));

    setNewWord('');
    setSelectedCategoryId('');
    setShowAddModal(false);

    if (!expandedCategories.includes(selectedCategoryId)) {
      setExpandedCategories(prev => [...prev, selectedCategoryId]);
    }
  };

  const handleAddBatchWords = () => {
    if (!batchWords.trim() || !selectedCategoryId) return;

    const words = batchWords.split(/[\n,，；;]/).map(w => w.trim()).filter(w => w);
    if (words.length === 0) {
      alert('请输入敏感词');
      return;
    }

    const targetCategory = categories.find(c => c.id === selectedCategoryId);
    const existingWords = targetCategory ? targetCategory.words.map(w => w.word) : [];
    
    let successCount = 0;
    let duplicateCount = 0;
    const newWordItems: SensitiveWord[] = [];

    words.forEach(word => {
      if (existingWords.includes(word)) {
        duplicateCount++;
      } else {
        newWordItems.push({
          id: `${selectedCategoryId}-${Date.now()}-${successCount}`,
          word,
          createdAt: new Date().toLocaleString('zh-CN')
        });
        successCount++;
      }
    });

    if (newWordItems.length > 0) {
      setCategories(prev => prev.map(category => {
        if (category.id === selectedCategoryId) {
          return {
            ...category,
            count: category.count + newWordItems.length,
            words: [...category.words, ...newWordItems]
          };
        }
        return category;
      }));
    }

    setImportResult({ success: successCount, failed: 0, duplicates: duplicateCount });
    setBatchWords('');

    if (!expandedCategories.includes(selectedCategoryId)) {
      setExpandedCategories(prev => [...prev, selectedCategoryId]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setBatchWords(content);
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) {
      alert('请输入分类名称');
      return;
    }

    if (categories.some(c => c.name === newCategoryName.trim())) {
      alert('该分类名称已存在');
      return;
    }

    const newCategory: SensitiveCategory = {
      id: Date.now().toString(),
      name: newCategoryName.trim(),
      description: newCategoryDesc.trim() || '暂无描述',
      count: 0,
      words: []
    };

    setCategories(prev => [...prev, newCategory]);
    setNewCategoryName('');
    setNewCategoryDesc('');
    setShowCategoryModal(false);
    setSelectedCategoryId(newCategory.id);
    setExpandedCategories(prev => [...prev, newCategory.id]);
    setShowAddModal(true);
  };

  const handleEditCategory = (category: SensitiveCategory) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setNewCategoryDesc(category.description);
    setCategoryMode('edit');
    setShowCategoryModal(true);
  };

  const handleSaveCategoryEdit = () => {
    if (!newCategoryName.trim() || !editingCategory) return;

    if (categories.some(c => c.name === newCategoryName.trim() && c.id !== editingCategory.id)) {
      alert('该分类名称已存在');
      return;
    }

    setCategories(prev => prev.map(c => {
      if (c.id === editingCategory.id) {
        return {
          ...c,
          name: newCategoryName.trim(),
          description: newCategoryDesc.trim() || '暂无描述'
        };
      }
      return c;
    }));

    setEditingCategory(null);
    setNewCategoryName('');
    setNewCategoryDesc('');
    setShowCategoryModal(false);
  };

  const handleDeleteCategory = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    if (category.count > 0) {
      alert(`该分类下还有 ${category.count} 个敏感词，请先删除敏感词后再删除分类`);
      return;
    }

    if (confirm(`确定要删除分类 "${category.name}" 吗？`)) {
      setCategories(prev => prev.filter(c => c.id !== categoryId));
      setExpandedCategories(prev => prev.filter(id => id !== categoryId));
    }
  };

  const filteredCategories = categories.map(category => ({
    ...category,
    words: category.words.filter(word => 
      word.word.includes(searchQuery)
    )
  })).filter(category => 
    category.name.includes(searchQuery) || 
    category.description.includes(searchQuery) ||
    category.words.length > 0
  );

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setAddMode('single');
    setNewWord('');
    setBatchWords('');
    setSelectedCategoryId('');
    setImportResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCloseCategoryModal = () => {
    setShowCategoryModal(false);
    setEditingCategory(null);
    setNewCategoryName('');
    setNewCategoryDesc('');
    setCategoryMode('create');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索敏感词或分类..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setCategoryMode('create');
              setEditingCategory(null);
              setNewCategoryName('');
              setNewCategoryDesc('');
              setShowCategoryModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FolderPlus className="w-4 h-4" />
            新建分类
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            添加敏感词
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredCategories.length > 0 ? (
          filteredCategories.map(category => (
            <div 
              key={category.id} 
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="flex items-center gap-4 flex-1 text-left"
                >
                  <GripVertical className="w-4 h-4 text-gray-300 cursor-grab" />
                  {expandedCategories.includes(category.id) ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.description}</p>
                  </div>
                </button>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-full">
                    {category.count} 个敏感词
                  </span>
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="编辑分类"
                  >
                    <FolderEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="删除分类"
                  >
                    <FolderDeleteIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {expandedCategories.includes(category.id) && (
                <div className="border-t border-gray-100">
                  <div className="divide-y divide-gray-50">
                    {category.words.length > 0 ? (
                      category.words.map(word => (
                        <div 
                          key={word.id} 
                          className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            {editingWord === `${category.id}-${word.id}` ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={editingValue}
                                  onChange={(e) => setEditingValue(e.target.value)}
                                  className="px-3 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                  autoFocus
                                />
                                <button
                                  onClick={() => handleSaveWordEdit(category.id, word.id)}
                                  className="p-1 text-green-600 hover:bg-green-50 rounded"
                                >
                                  <Save className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={handleCancelWordEdit}
                                  className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <span className="text-gray-900">{word.word}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">{word.createdAt}</span>
                            {editingWord !== `${category.id}-${word.id}` && (
                              <>
                                <button
                                  onClick={() => handleEditWord(category.id, word.id, word.word)}
                                  className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteWord(category.id, word.id)}
                                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center text-gray-500">
                        <p>该分类下暂无敏感词</p>
                        <button
                          onClick={() => {
                            setSelectedCategoryId(category.id);
                            setShowAddModal(true);
                          }}
                          className="mt-2 text-sm text-primary-600 hover:text-primary-800"
                        >
                          点击添加敏感词
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-gray-500">未找到匹配的分类</p>
          </div>
        )}
      </div>

      {/* 添加敏感词弹窗 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">添加敏感词</h3>
              <button
                onClick={handleCloseAddModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex border-b border-gray-200">
              <button
                onClick={() => {
                  setAddMode('single');
                  setImportResult(null);
                }}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  addMode === 'single' 
                    ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                单个添加
              </button>
              <button
                onClick={() => {
                  setAddMode('batch');
                  setImportResult(null);
                }}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  addMode === 'batch' 
                    ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                批量导入
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">选择分类</label>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">请选择分类</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>

              {addMode === 'single' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">敏感词内容</label>
                  <input
                    type="text"
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value)}
                    placeholder="请输入敏感词"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      批量导入敏感词
                      <span className="text-gray-400 font-normal ml-2">（每行一个，或用逗号、分号分隔）</span>
                    </label>
                    <textarea
                      value={batchWords}
                      onChange={(e) => setBatchWords(e.target.value)}
                      placeholder="请输入敏感词，每行一个&#10;例如：&#10;敏感词1&#10;敏感词2&#10;敏感词3"
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">或上传文件</label>
                    <label className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-primary-300 hover:bg-primary-50 transition-colors">
                      <Upload className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-500">点击上传 .txt 文件</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".txt"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-400 mt-1">支持 .txt 格式文件，编码 UTF-8</p>
                  </div>

                  {importResult && (
                    <div className={`p-3 rounded-lg ${
                      importResult.success > 0 ? 'bg-green-50' : 'bg-gray-50'
                    }`}>
                      <div className="flex items-center gap-2">
                        {importResult.success > 0 ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-gray-400" />
                        )}
                        <span className="text-sm">
                          成功导入 <span className="font-medium text-green-600">{importResult.success}</span> 个敏感词
                          {importResult.duplicates > 0 && (
                            <span className="ml-2">，跳过 <span className="font-medium text-gray-500">{importResult.duplicates}</span> 个重复项</span>
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
              <button
                onClick={handleCloseAddModal}
                className="px-6 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={addMode === 'single' ? handleAddSingleWord : handleAddBatchWords}
                disabled={addMode === 'single' 
                  ? (!newWord.trim() || !selectedCategoryId) 
                  : (!batchWords.trim() || !selectedCategoryId)
                }
                className="px-6 py-2 text-sm text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                {addMode === 'single' ? '确定' : '导入'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 分类管理弹窗 */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {categoryMode === 'create' ? '新建分类' : '编辑分类'}
              </h3>
              <button
                onClick={handleCloseCategoryModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">分类名称 *</label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="请输入分类名称"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">分类描述</label>
                <textarea
                  value={newCategoryDesc}
                  onChange={(e) => setNewCategoryDesc(e.target.value)}
                  placeholder="请输入分类描述（可选）"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
              <button
                onClick={handleCloseCategoryModal}
                className="px-6 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={categoryMode === 'create' ? handleCreateCategory : handleSaveCategoryEdit}
                disabled={!newCategoryName.trim()}
                className="px-6 py-2 text-sm text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                {categoryMode === 'create' ? '创建' : '保存'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
