import { useState } from 'react';
import { Save, RotateCcw } from 'lucide-react';

interface QaRules {
  maxAnswerLength: number;
  citationEnabled: boolean;
  citationFormat: string;
  followUpQuestions: number;
  sensitiveWords: string[];
}

const defaultRules: QaRules = {
  maxAnswerLength: 2000,
  citationEnabled: true,
  citationFormat: '[来源]',
  followUpQuestions: 3,
  sensitiveWords: ['涉密', '保密', '内部资料', '未公开'],
};

export default function QaRules() {
  const [rules, setRules] = useState<QaRules>(defaultRules);
  const [saved, setSaved] = useState(false);
  const [newSensitiveWord, setNewSensitiveWord] = useState('');

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setRules(defaultRules);
  };

  const handleAddSensitiveWord = () => {
    if (newSensitiveWord.trim() && !rules.sensitiveWords.includes(newSensitiveWord.trim())) {
      setRules({ ...rules, sensitiveWords: [...rules.sensitiveWords, newSensitiveWord.trim()] });
      setNewSensitiveWord('');
    }
  };

  const handleRemoveSensitiveWord = (word: string) => {
    setRules({ ...rules, sensitiveWords: rules.sensitiveWords.filter(w => w !== word) });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">问答规则配置</h3>
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
              回答长度限制
            </label>
            <input
              type="number"
              min="500"
              max="8000"
              step="100"
              value={rules.maxAnswerLength}
              onChange={(e) => setRules({ ...rules, maxAnswerLength: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-xs text-gray-500 mt-1">AI回答的最大字符数，范围: 500-8000</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              后续问题引导数量
            </label>
            <input
              type="number"
              min="0"
              max="10"
              step="1"
              value={rules.followUpQuestions}
              onChange={(e) => setRules({ ...rules, followUpQuestions: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-xs text-gray-500 mt-1">回答后自动生成的后续问题数量，范围: 0-10</p>
          </div>
        </div>

        <div className="mt-8">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={rules.citationEnabled}
              onChange={(e) => setRules({ ...rules, citationEnabled: e.target.checked })}
              className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700">启用引用文件标注</span>
          </label>
          {rules.citationEnabled && (
            <div className="ml-8 mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                引用标注格式
              </label>
              <input
                type="text"
                value={rules.citationFormat}
                onChange={(e) => setRules({ ...rules, citationFormat: e.target.value })}
                className="w-48 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="text-xs text-gray-500 mt-1">如: [来源]、(来源)、【来源】等格式</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">敏感词过滤规则</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">添加敏感词</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSensitiveWord}
              onChange={(e) => setNewSensitiveWord(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddSensitiveWord()}
              placeholder="输入敏感词后按回车添加"
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              onClick={handleAddSensitiveWord}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              添加
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {rules.sensitiveWords.map((word) => (
            <span
              key={word}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-sm"
            >
              {word}
              <button
                onClick={() => handleRemoveSensitiveWord(word)}
                className="hover:text-red-900"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <p className="text-xs text-gray-500 mt-4">
          提示：当AI回答中包含敏感词时，系统将自动进行脱敏处理或拒绝回答
        </p>
      </div>
    </div>
  );
}
