import { useState, KeyboardEvent, useRef } from 'react';
import { Send, Plus, History, Database, Users, Upload, X, FileText } from 'lucide-react';
import { useChatStore } from '../store/chatStore';

export function InputArea() {
  const [input, setInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string; type: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addMessage } = useChatStore();

  const handleSend = () => {
    if (input.trim() || uploadedFiles.length > 0) {
      addMessage({ role: 'user', content: input, files: uploadedFiles });
      setInput('');
      setUploadedFiles([]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.ctrlKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setUploading(true);
      setTimeout(() => {
        const newFiles = Array.from(files).map(file => ({
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
          type: file.type.split('/')[1] || file.name.split('.').pop() || 'unknown'
        }));
        setUploadedFiles(prev => [...prev, ...newFiles]);
        setUploading(false);
      }, 500);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const allowedExtensions = ['txt', 'pdf', 'doc', 'docx', 'wps', 'xls', 'xlsx'];

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
          <History className="w-3 h-3" />
          AI搜索
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
          <Database className="w-3 h-3" />
          知识库
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
          <Users className="w-3 h-3" />
          部门
        </button>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mb-4 space-y-2">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 truncate">{file.name}</p>
                <p className="text-xs text-gray-400">{file.size} · {file.type.toUpperCase()}</p>
              </div>
              <button onClick={() => removeFile(index)} className="p-1 hover:bg-gray-200 rounded">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={allowedExtensions.map(ext => `.${ext}`).join(',')}
          onChange={handleFileChange}
          className="hidden"
        />
        
        <div className="flex-1 relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="请输入问题，支持上传文档 (txt, pdf, doc, docx, wps, xls, xlsx)，大小限制30MB"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            rows={2}
          />
          <div className="absolute bottom-3 right-3">
            <span className="text-xs text-gray-400">Ctrl+Enter 换行</span>
          </div>
        </div>

        <button 
          onClick={handleSend}
          disabled={!input.trim() && uploadedFiles.length === 0}
          className="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-4 mt-2">
        <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors">
          <Upload className="w-3 h-3" />
          上传文档
        </button>
        <span className="text-xs text-gray-400">支持: txt, pdf, doc, docx, wps, xls, xlsx (最大30MB)</span>
      </div>
    </div>
  );
}
