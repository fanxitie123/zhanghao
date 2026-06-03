import { useState } from 'react';
import { Save, RotateCcw } from 'lucide-react';

interface ModelParams {
  temperature: number;
  topP: number;
  maxLength: number;
  repetitionPenalty: number;
}

const defaultParams: ModelParams = {
  temperature: 0.7,
  topP: 0.9,
  maxLength: 2048,
  repetitionPenalty: 1.1,
};

export default function ModelConfig() {
  const [params, setParams] = useState<ModelParams>(defaultParams);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setParams(defaultParams);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">模型参数配置</h3>
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

      <div className="grid grid-cols-2 gap-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            温度 (Temperature)
          </label>
          <input
            type="number"
            min="0"
            max="2"
            step="0.1"
            value={params.temperature}
            onChange={(e) => setParams({ ...params, temperature: parseFloat(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <p className="text-xs text-gray-500 mt-1">控制输出随机性，值越高越随机，范围: 0-2</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Top-P
          </label>
          <input
            type="number"
            min="0"
            max="1"
            step="0.05"
            value={params.topP}
            onChange={(e) => setParams({ ...params, topP: parseFloat(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <p className="text-xs text-gray-500 mt-1">控制词汇多样性，值越小越集中，范围: 0-1</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            最大生成长度
          </label>
          <input
            type="number"
            min="128"
            max="8192"
            step="128"
            value={params.maxLength}
            onChange={(e) => setParams({ ...params, maxLength: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <p className="text-xs text-gray-500 mt-1">AI回答的最大字符数，范围: 128-8192</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            重复惩罚 (Repetition Penalty)
          </label>
          <input
            type="number"
            min="1"
            max="2"
            step="0.1"
            value={params.repetitionPenalty}
            onChange={(e) => setParams({ ...params, repetitionPenalty: parseFloat(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <p className="text-xs text-gray-500 mt-1">控制重复内容，值越高惩罚越强，范围: 1-2</p>
        </div>
      </div>
    </div>
  );
}
