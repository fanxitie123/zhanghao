import { useState } from 'react';
import { Save, RotateCcw } from 'lucide-react';

interface KnowledgeParams {
  chunkStrategy: 'fixed' | 'smart';
  chunkSize: number;
  chunkOverlap: number;
  separator: string;
}

const defaultParams: KnowledgeParams = {
  chunkStrategy: 'smart',
  chunkSize: 512,
  chunkOverlap: 64,
  separator: '。！？\n\n',
};

export default function KnowledgeConfig() {
  const [params, setParams] = useState<KnowledgeParams>(defaultParams);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setParams(defaultParams);
  };

  const handleStrategyChange = (strategy: 'fixed' | 'smart') => {
    setParams({ ...params, chunkStrategy: strategy });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">知识库参数配置</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            重置
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              saved ? 'bg-green-600' : 'bg-primary-600'
            } text-white`}
          >
            <Save className="w-4 h-4" />
            {saved ? '已保存' : '保存配置'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            分块策略
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => handleStrategyChange('fixed')}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl border-2 transition-all duration-200 ${
                params.chunkStrategy === 'fixed'
                  ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                params.chunkStrategy === 'fixed'
                  ? 'border-primary-500 bg-primary-500'
                  : 'border-gray-300'
              }`}>
                {params.chunkStrategy === 'fixed' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                )}
              </div>
              <span className="text-sm font-medium">固定长度</span>
            </button>
            <button
              type="button"
              onClick={() => handleStrategyChange('smart')}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl border-2 transition-all duration-200 ${
                params.chunkStrategy === 'smart'
                  ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                params.chunkStrategy === 'smart'
                  ? 'border-primary-500 bg-primary-500'
                  : 'border-gray-300'
              }`}>
                {params.chunkStrategy === 'smart' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                )}
              </div>
              <span className="text-sm font-medium">智能分块</span>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            {params.chunkStrategy === 'fixed' 
              ? '固定长度：按固定字符数分割，适用于结构化文档' 
              : '智能分块：根据语义自动分割，保持内容完整性'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              分块大小 (Chunk Size)
            </label>
            <input
              type="number"
              min="128"
              max="2048"
              step="128"
              value={params.chunkSize}
              onChange={(e) => setParams({ ...params, chunkSize: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-xs text-gray-500 mt-1">每个知识块的最大字符数，范围: 128-2048</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              分块重叠 (Chunk Overlap)
            </label>
            <input
              type="number"
              min="0"
              max="512"
              step="16"
              value={params.chunkOverlap}
              onChange={(e) => setParams({ ...params, chunkOverlap: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-xs text-gray-500 mt-1">相邻知识块之间的重叠字符数，范围: 0-512</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            分割符
          </label>
          <input
            type="text"
            value={params.separator}
            onChange={(e) => setParams({ ...params, separator: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="。！？\n\n"
          />
          <p className="text-xs text-gray-500 mt-1">用于分割文本的字符，支持多个字符，用英文逗号分隔</p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">当前配置摘要</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">分块策略：</span>
              <span className="font-medium">{params.chunkStrategy === 'fixed' ? '固定长度' : '智能分块'}</span>
            </div>
            <div>
              <span className="text-gray-600">分块大小：</span>
              <span className="font-medium">{params.chunkSize} 字符</span>
            </div>
            <div>
              <span className="text-gray-600">重叠大小：</span>
              <span className="font-medium">{params.chunkOverlap} 字符</span>
            </div>
            <div>
              <span className="text-gray-600">分割符：</span>
              <span className="font-medium">{params.separator.length} 个字符</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
