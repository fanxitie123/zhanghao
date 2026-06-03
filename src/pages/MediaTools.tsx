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

export default function MediaTools() {
  const [activeTool, setActiveTool] = useState<ToolType>('compressor');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">媒体工具</h1>
          <p className="text-gray-600 text-lg">图片压缩、文档转换与背景去除一站式处理</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-2 mb-8 inline-flex rounded-xl">
          {(Object.keys(toolConfig) as ToolType[]).map((tool) => {
            const config = toolConfig[tool];
            const Icon = config.icon;
            return (
              <button
                key={tool}
                onClick={() => setActiveTool(tool)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTool === tool
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {config.label}
              </button>
            );
          })}
        </div>

        <div className="mb-6">
          <p className="text-gray-500">{toolConfig[activeTool].description}</p>
        </div>

        {activeTool === 'compressor' && <ImageCompressor />}
        {activeTool === 'document' && <DocumentToImage />}
        {activeTool === 'background-remover' && <ImageBackgroundRemover />}
      </div>
    </div>
  );
}
