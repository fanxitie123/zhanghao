import { useState } from 'react';
import { Image, FileText, Eraser } from 'lucide-react';
import ImageCompressor from './ImageCompressor';
import DocumentToImage from './DocumentToImage';
import ImageBackgroundRemover from './ImageBackgroundRemover';

type ToolType = 'compressor' | 'document' | 'background-remover';

const toolConfig: Record<ToolType, { label: string; icon: typeof Image; description: string }> = {
  compressor: {
    label: '图片压缩',
    icon: Image,
    description: '上传图片进行无损压缩，保持高清画质'
  },
  document: {
    label: '文档转图片',
    icon: FileText,
    description: '将 Excel、Word 文档转换为高清图片'
  },
  'background-remover': {
    label: '图片抠图',
    icon: Eraser,
    description: '一键去除图片背景，支持白色、绿幕、蓝幕或自定义颜色'
  }
};

export default function SimpleTools() {
  const [activeTool, setActiveTool] = useState<ToolType>('compressor');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">媒体工具集</h1>
          <p className="text-gray-600 text-xl">图片压缩、文档转换与背景去除一站式处理</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {(Object.keys(toolConfig) as ToolType[]).map((tool) => {
              const config = toolConfig[tool];
              const Icon = config.icon;
              return (
                <button
                  key={tool}
                  onClick={() => setActiveTool(tool)}
                  className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 font-semibold transition-all ${
                    activeTool === tool
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {config.label}
                </button>
              );
            })}
          </div>

          <div className="p-6">
            <div className="mb-8 bg-gray-50 rounded-lg p-4">
              <p className="text-gray-600 text-center text-lg">{toolConfig[activeTool].description}</p>
            </div>

            {activeTool === 'compressor' && <ImageCompressor />}
            {activeTool === 'document' && <DocumentToImage />}
            {activeTool === 'background-remover' && <ImageBackgroundRemover />}
          </div>
        </div>

        <div className="mt-12 text-center text-gray-400 text-sm">
          <p>使用现代浏览器以获得最佳体验</p>
        </div>
      </div>
    </div>
  );
}
