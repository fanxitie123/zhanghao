import { useState, useRef } from 'react';
import { Upload, Download, X, Image as ImageIcon, Trash2, Settings2, ZoomIn, Eye, Split } from 'lucide-react';
import imageCompression from 'browser-image-compression';

interface CompressedImage {
  id: string;
  originalFile: File;
  originalSize: number;
  compressedFile: File;
  compressedSize: number;
  originalPreview: string;
  compressedPreview: string;
}

interface PreviewModalData {
  image: CompressedImage;
  mode: 'original' | 'compressed' | 'compare';
}

type CompressionMode = 'lossless' | 'high-quality' | 'balanced' | 'compressed';

const modeSettings: Record<CompressionMode, { quality: number; label: string; description: string }> = {
  'lossless': { quality: 1.0, label: '无损', description: '保持原始质量，仅优化文件结构' },
  'high-quality': { quality: 0.95, label: '高质量', description: '质量优先，轻微压缩' },
  'balanced': { quality: 0.85, label: '平衡', description: '质量与大小平衡' },
  'compressed': { quality: 0.7, label: '高压缩', description: '文件更小，质量略有下降' },
};

export default function ImageCompressor() {
  const [images, setImages] = useState<CompressedImage[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionMode, setCompressionMode] = useState<CompressionMode>('high-quality');
  const [maxWidthOrHeight, setMaxWidthOrHeight] = useState<number | null>(null);
  const [convertToWebP, setConvertToWebP] = useState(false);
  const [preserveExif, setPreserveExif] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [previewModal, setPreviewModal] = useState<PreviewModalData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCompressionRatio = (original: number, compressed: number): string => {
    const ratio = ((original - compressed) / original * 100).toFixed(1);
    return ratio + '%';
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsCompressing(true);

    try {
      const newImages: CompressedImage[] = [];
      const quality = modeSettings[compressionMode].quality;

      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          continue;
        }

        const options = {
          maxSizeMB: 10,
          maxWidthOrHeight: maxWidthOrHeight || undefined,
          useWebWorker: true,
          fileType: convertToWebP ? 'image/webp' : file.type,
          initialQuality: quality,
          preserveExif: preserveExif,
          onProgress: (progress: number) => {
            console.log(`Compressing: ${progress}%`);
          },
        };

        const compressedFile = await imageCompression(file, options);

        const originalPreview = URL.createObjectURL(file);
        const compressedPreview = URL.createObjectURL(compressedFile);

        newImages.push({
          id: Date.now() + Math.random().toString(36).substr(2, 9),
          originalFile: file,
          originalSize: file.size,
          compressedFile: compressedFile,
          compressedSize: compressedFile.size,
          originalPreview,
          compressedPreview,
        });
      }

      setImages(prev => [...prev, ...newImages]);
    } catch (error) {
      console.error('压缩失败:', error);
      alert('图片压缩失败，请重试');
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDownload = (image: CompressedImage) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(image.compressedFile);
    const ext = convertToWebP ? 'webp' : image.originalFile.name.split('.').pop();
    const name = image.originalFile.name.replace(/\.[^/.]+$/, '') + `_compressed.${ext}`;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    images.forEach(image => handleDownload(image));
  };

  const handleRemoveImage = (id: string) => {
    setImages(prev => {
      const removed = prev.find(img => img.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.originalPreview);
        URL.revokeObjectURL(removed.compressedPreview);
      }
      return prev.filter(img => img.id !== id);
    });
  };

  const handleClearAll = () => {
    images.forEach(img => {
      URL.revokeObjectURL(img.originalPreview);
      URL.revokeObjectURL(img.compressedPreview);
    });
    setImages([]);
  };

  const totalOriginalSize = images.reduce((sum, img) => sum + img.originalSize, 0);
  const totalCompressedSize = images.reduce((sum, img) => sum + img.compressedSize, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">图片无损压缩</h1>
          <p className="text-gray-600 text-lg">智能压缩算法，保持高清画质，显著减小文件体积</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">压缩模式</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(Object.keys(modeSettings) as CompressionMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setCompressionMode(mode)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      compressionMode === mode
                        ? 'border-primary-500 bg-primary-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <p className={`font-semibold mb-1 ${
                      compressionMode === mode ? 'text-primary-700' : 'text-gray-900'
                    }`}>
                      {modeSettings[mode].label}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {modeSettings[mode].description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
              >
                <Settings2 className="w-4 h-4" />
                {showAdvanced ? '收起高级设置' : '展开高级设置'}
              </button>

              {showAdvanced && (
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">最大尺寸</label>
                    <select
                      value={maxWidthOrHeight || 'original'}
                      onChange={(e) => setMaxWidthOrHeight(e.target.value === 'original' ? null : parseInt(e.target.value))}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="original">保持原尺寸</option>
                      <option value={3840}>4K (3840px)</option>
                      <option value={2560}>2K (2560px)</option>
                      <option value={1920}>Full HD (1920px)</option>
                      <option value={1280}>HD (1280px)</option>
                      <option value={800}>Web (800px)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={convertToWebP}
                        onChange={(e) => setConvertToWebP(e.target.checked)}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm font-medium text-gray-700">转换为 WebP 格式</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preserveExif}
                        onChange={(e) => setPreserveExif(e.target.checked)}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm font-medium text-gray-700">保留 EXIF 信息</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-white hover:border-primary-400 hover:bg-primary-50 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-12 h-12 mb-4 text-gray-400" />
              <p className="mb-2 text-sm text-gray-600">
                <span className="font-semibold">点击上传</span> 或拖拽文件到此处
              </p>
              <p className="text-xs text-gray-400">支持 JPG、PNG、GIF、WebP 格式，支持批量上传</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </div>

        {isCompressing && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center mb-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mb-4"></div>
            <p className="text-gray-600">正在压缩图片，请稍候...</p>
          </div>
        )}

        {images.length > 0 && (
          <>
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-6 mb-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-8">
                  <div>
                    <p className="text-sm text-gray-600">原始大小</p>
                    <p className="text-2xl font-bold text-gray-900">{formatSize(totalOriginalSize)}</p>
                  </div>
                  <div className="text-3xl text-primary-600">→</div>
                  <div>
                    <p className="text-sm text-gray-600">压缩后大小</p>
                    <p className="text-2xl font-bold text-primary-600">{formatSize(totalCompressedSize)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">节省空间</p>
                    <p className="text-2xl font-bold text-green-600">{getCompressionRatio(totalOriginalSize, totalCompressedSize)}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleDownloadAll}
                    className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    下载全部 ({images.length})
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    清空全部
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <div key={image.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{image.originalFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatSize(image.originalSize)} → {formatSize(image.compressedSize)}
                        <span className="text-green-600 ml-2">-{getCompressionRatio(image.originalSize, image.compressedSize)}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveImage(image.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 p-4">
                    <div className="group relative">
                      <p className="text-xs text-gray-500 mb-2 text-center">原图</p>
                      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={image.originalPreview}
                          alt="Original"
                          className="w-full h-full object-contain"
                        />
                        <button
                          onClick={() => setPreviewModal({ image, mode: 'original' })}
                          className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
                        >
                          <ZoomIn className="w-8 h-8 text-white" />
                        </button>
                      </div>
                    </div>
                    <div className="group relative">
                      <p className="text-xs text-gray-500 mb-2 text-center">压缩后</p>
                      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={image.compressedPreview}
                          alt="Compressed"
                          className="w-full h-full object-contain"
                        />
                        <button
                          onClick={() => setPreviewModal({ image, mode: 'compressed' })}
                          className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
                        >
                          <ZoomIn className="w-8 h-8 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 pt-0 flex gap-2">
                    <button
                      onClick={() => setPreviewModal({ image, mode: 'compare' })}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Split className="w-4 h-4" />
                      对比查看
                    </button>
                    <button
                      onClick={() => handleDownload(image)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      下载
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {images.length === 0 && !isCompressing && (
          <div className="bg-white rounded-xl shadow-sm p-16 text-center">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg">还没有上传图片</p>
            <p className="text-gray-400 text-sm mt-2">点击上方区域开始上传图片</p>
          </div>
        )}
      </div>

      {/* 预览模态框 */}
      {previewModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
            {/* 模态框头部 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {previewModal.mode === 'original' && '原图预览'}
                  {previewModal.mode === 'compressed' && '压缩后预览'}
                  {previewModal.mode === 'compare' && '对比查看'}
                </h2>
                <div className="text-sm text-gray-500">
                  {previewModal.image.originalFile.name}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {previewModal.mode === 'compare' ? (
                  <>
                    <button
                      onClick={() => setPreviewModal({ ...previewModal, mode: 'original' })}
                      className="px-3 py-1 text-sm text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      仅原图
                    </button>
                    <button
                      onClick={() => setPreviewModal({ ...previewModal, mode: 'compressed' })}
                      className="px-3 py-1 text-sm text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      仅压缩后
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setPreviewModal({ ...previewModal, mode: 'compare' })}
                    className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <Split className="w-4 h-4" />
                    对比查看
                  </button>
                )}
                <button
                  onClick={() => setPreviewModal(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* 模态框内容 */}
            <div className="p-4 overflow-auto max-h-[calc(90vh-120px)]">
              {previewModal.mode === 'compare' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 原图 */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">原图</h3>
                      <span className="text-sm text-gray-500">{formatSize(previewModal.image.originalSize)}</span>
                    </div>
                    <div className="relative bg-white rounded-lg overflow-hidden flex items-center justify-center">
                      <img
                        src={previewModal.image.originalPreview}
                        alt="Original"
                        className="max-w-full max-h-[60vh] object-contain"
                      />
                    </div>
                  </div>

                  {/* 压缩后 */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">压缩后</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{formatSize(previewModal.image.compressedSize)}</span>
                        <span className="text-sm font-medium text-green-600">-{getCompressionRatio(previewModal.image.originalSize, previewModal.image.compressedSize)}</span>
                      </div>
                    </div>
                    <div className="relative bg-white rounded-lg overflow-hidden flex items-center justify-center">
                      <img
                        src={previewModal.image.compressedPreview}
                        alt="Compressed"
                        className="max-w-full max-h-[60vh] object-contain"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">
                      {previewModal.mode === 'original' ? '原图' : '压缩后'}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {formatSize(previewModal.mode === 'original' ? previewModal.image.originalSize : previewModal.image.compressedSize)}
                      </span>
                      {previewModal.mode === 'compressed' && (
                        <span className="text-sm font-medium text-green-600">-{getCompressionRatio(previewModal.image.originalSize, previewModal.image.compressedSize)}</span>
                      )}
                    </div>
                  </div>
                  <div className="relative bg-white rounded-lg overflow-hidden flex items-center justify-center">
                    <img
                      src={previewModal.mode === 'original' ? previewModal.image.originalPreview : previewModal.image.compressedPreview}
                      alt={previewModal.mode === 'original' ? 'Original' : 'Compressed'}
                      className="max-w-full max-h-[70vh] object-contain"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 模态框底部 */}
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
              <button
                onClick={() => setPreviewModal(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                关闭
              </button>
              <button
                onClick={() => handleDownload(previewModal.image)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                下载压缩图
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
