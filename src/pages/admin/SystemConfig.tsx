import { useState } from 'react';
import { Save, RotateCcw, Clock, FileImage, FileText, Shield } from 'lucide-react';

interface SystemConfig {
  sessionTimeout: number;
  fileUploadFormats: string[];
  maxFileSize: number;
  enableLog: boolean;
  logRetentionDays: number;
  enableAudit: boolean;
}

const defaultConfig: SystemConfig = {
  sessionTimeout: 30,
  fileUploadFormats: ['doc', 'docx', 'pdf', 'txt', 'jpg', 'png'],
  maxFileSize: 50,
  enableLog: true,
  logRetentionDays: 30,
  enableAudit: true,
};

export default function SystemConfig() {
  const [config, setConfig] = useState<SystemConfig>(defaultConfig);
  const [saved, setSaved] = useState(false);
  const [newFormat, setNewFormat] = useState('');

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setConfig(defaultConfig);
  };

  const addFormat = () => {
    if (newFormat.trim() && !config.fileUploadFormats.includes(newFormat.trim())) {
      setConfig({ ...config, fileUploadFormats: [...config.fileUploadFormats, newFormat.trim()] });
      setNewFormat('');
    }
  };

  const removeFormat = (format: string) => {
    setConfig({ ...config, fileUploadFormats: config.fileUploadFormats.filter(f => f !== format) });
  };

  const allFormats = ['doc', 'docx', 'pdf', 'txt', 'jpg', 'png', 'gif', 'bmp', 'xls', 'xlsx', 'ppt', 'pptx'];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">系统基础参数配置</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
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
          <div className="bg-blue-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900">会话配置</h4>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                会话超时时间（分钟）
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="5"
                  max="120"
                  step="5"
                  value={config.sessionTimeout}
                  onChange={(e) => setConfig({ ...config, sessionTimeout: parseInt(e.target.value) })}
                  className="w-32 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-500">分钟</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">用户无操作超过此时间将自动退出登录</p>
            </div>
          </div>

          <div className="bg-green-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <FileImage className="w-5 h-5 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900">文件上传配置</h4>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                最大文件大小（MB）
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="1"
                  max="200"
                  step="5"
                  value={config.maxFileSize}
                  onChange={(e) => setConfig({ ...config, maxFileSize: parseInt(e.target.value) })}
                  className="w-32 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-500">MB</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">单个文件上传的最大大小限制</p>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-xl p-6 col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">允许上传的文件格式</h4>
                <p className="text-xs text-gray-500">用户可上传的文件类型</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {config.fileUploadFormats.map((format) => (
                <span
                  key={format}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white rounded-full text-sm border border-gray-200"
                >
                  {format}
                  <button
                    onClick={() => removeFormat(format)}
                    className="hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <select
                value={newFormat}
                onChange={(e) => setNewFormat(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">选择格式</option>
                {allFormats.filter(f => !config.fileUploadFormats.includes(f)).map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
              <button
                onClick={addFormat}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
              >
                添加
              </button>
            </div>
          </div>

          <div className="bg-purple-50 rounded-xl p-6 col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">安全日志配置</h4>
                <p className="text-xs text-gray-500">系统日志与审计相关设置</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-8">
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.enableLog}
                    onChange={(e) => setConfig({ ...config, enableLog: e.target.checked })}
                    className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">启用系统日志</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">记录系统操作日志</p>
              </div>
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.enableAudit}
                    onChange={(e) => setConfig({ ...config, enableAudit: e.target.checked })}
                    className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">启用审计日志</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">记录用户操作审计信息</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  日志保留天数
                </label>
                <input
                  type="number"
                  min="7"
                  max="365"
                  step="7"
                  value={config.logRetentionDays}
                  onChange={(e) => setConfig({ ...config, logRetentionDays: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <p className="text-xs text-gray-500 mt-1">日志自动清理周期</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6">
        <h4 className="text-sm font-medium text-gray-700 mb-4">配置摘要</h4>
        <div className="grid grid-cols-4 gap-6 text-sm">
          <div className="bg-white rounded-lg p-4">
            <span className="text-gray-500">会话超时</span>
            <p className="text-lg font-semibold text-gray-900 mt-1">{config.sessionTimeout} 分钟</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <span className="text-gray-500">最大文件大小</span>
            <p className="text-lg font-semibold text-gray-900 mt-1">{config.maxFileSize} MB</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <span className="text-gray-500">允许格式</span>
            <p className="text-lg font-semibold text-gray-900 mt-1">{config.fileUploadFormats.length} 种</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <span className="text-gray-500">日志保留</span>
            <p className="text-lg font-semibold text-gray-900 mt-1">{config.logRetentionDays} 天</p>
          </div>
        </div>
      </div>
    </div>
  );
}
