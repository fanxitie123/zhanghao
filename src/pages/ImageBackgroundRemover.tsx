import { useState, useRef } from 'react';
import { Upload, Download, X, Eraser, RefreshCw, Image as ImageIcon, Palette, Trash2, Sparkles } from 'lucide-react';

interface ProcessedImage {
  id: string;
  originalUrl: string;
  processedUrl: string;
  fileName: string;
  blob: Blob;
}

export default function ImageBackgroundRemover() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tolerance, setTolerance] = useState(80);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [toolMode, setToolMode] = useState<'auto' | 'white' | 'color' | 'green' | 'blue'>('auto');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorPickerPosition, setColorPickerPosition] = useState({ x: 0, y: 0 });
  const isProcessingRef = useRef(false);
  const currentImageUrlRef = useRef<string | null>(null);
  const imgElementRef = useRef<HTMLImageElement>(null);

  // 计算颜色之间的感知距离（更符合人眼）
  const colorDistance = (c1: { r: number; g: number; b: number }, c2: { r: number; g: number; b: number }) => {
    const rMean = (c1.r + c2.r) / 2;
    const r = c1.r - c2.r;
    const g = c1.g - c2.g;
    const b = c1.b - c2.b;
    return Math.sqrt((2 + rMean / 256) * r * r + 4 * g * g + (2 + (255 - rMean) / 256) * b * b);
  };

  // 快速检测背景颜色
  const detectBackgroundColor = (ctx: CanvasRenderingContext2D, width: number, height: number): { r: number; g: number; b: number } => {
    console.log('开始检测背景色');
    
    // 一次性获取整个边缘区域的像素数据，而不是逐个获取
    const sampleColors: { r: number; g: number; b: number }[] = [];
    
    // 获取图片的像素数据
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    // 从四个角和边缘采样，简化采样策略
    const samplePoints = [
      { x: 5, y: 5 },
      { x: width - 5, y: 5 },
      { x: 5, y: height - 5 },
      { x: width - 5, y: height - 5 },
      { x: Math.floor(width / 2), y: 5 },
      { x: Math.floor(width / 2), y: height - 5 },
      { x: 5, y: Math.floor(height / 2) },
      { x: width - 5, y: Math.floor(height / 2) }
    ];
    
    for (const point of samplePoints) {
      const idx = (point.y * width + point.x) * 4;
      sampleColors.push({
        r: data[idx],
        g: data[idx + 1],
        b: data[idx + 2]
      });
    }
    
    // 统计最常见的颜色
    const colorCounts = new Map<string, number>();
    let bestColor = { r: 255, g: 255, b: 255 };
    let maxCount = 0;
    
    for (const color of sampleColors) {
      // 简化颜色精度，避免过于精确的匹配
      const key = `${Math.round(color.r / 10)},${Math.round(color.g / 10)},${Math.round(color.b / 10)}`;
      const count = (colorCounts.get(key) || 0) + 1;
      colorCounts.set(key, count);
      
      if (count > maxCount) {
        maxCount = count;
        bestColor = color;
      }
    }
    
    console.log('检测到的背景色:', bestColor);
    return bestColor;
  };

  // 简化高效的智能抠图算法
  const smartRemoveBackground = (ctx: CanvasRenderingContext2D, originalCtx: CanvasRenderingContext2D, width: number, height: number, backgroundColor: { r: number; g: number; b: number }) => {
    console.log('开始智能抠图，图片尺寸:', width, 'x', height);
    
    const imageData = originalCtx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    // 如果图片太大，先缩小处理范围（避免卡死）
    const maxDimension = 1000;
    const scale = Math.min(1, maxDimension / Math.max(width, height));
    
    console.log('处理缩放:', scale);
    
    // 简单但有效的全局颜色抠图
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      const distance = colorDistance({ r, g, b }, backgroundColor);
      
      // 只有与背景色足够接近的像素才被移除
      if (distance < tolerance * 1.2) {
        data[i + 3] = 0;
      }
    }
    
    console.log('抠图完成');
    ctx.putImageData(imageData, 0, 0);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const file = files[0];
    const url = URL.createObjectURL(file);
    setOriginalImage(url);
    setProcessedImage(null);
    currentImageUrlRef.current = url;
  };

  const getColorToRemove = () => {
    switch (toolMode) {
      case 'auto':
        // 自动检测模式会在 processImage 中处理
        return null;
      case 'white':
        return { r: 255, g: 255, b: 255 };
      case 'green':
        return { r: 0, g: 255, b: 0 };
      case 'blue':
        return { r: 0, g: 0, b: 255 };
      case 'color':
        if (!selectedColor) return null;
        const hex = selectedColor.replace('#', '');
        return {
          r: parseInt(hex.substring(0, 2), 16),
          g: parseInt(hex.substring(2, 4), 16),
          b: parseInt(hex.substring(4, 6), 16)
        };
      default:
        return { r: 255, g: 255, b: 255 };
    }
  };

  const processImage = () => {
    console.log('=== 点击了去除背景按钮 ===');
    console.log('originalCanvasRef:', originalCanvasRef.current);
    console.log('canvasRef:', canvasRef.current);
    
    // 重置处理状态，避免卡住
    isProcessingRef.current = false;
    setIsProcessing(true);
    
    if (!originalCanvasRef.current || !canvasRef.current) {
      console.error('Canvas引用不存在');
      setIsProcessing(false);
      return;
    }

    const originalCanvas = originalCanvasRef.current;
    console.log('originalCanvas尺寸:', originalCanvas.width, 'x', originalCanvas.height);

    // 如果 canvas 尺寸为 0，尝试重新绘制图片
    if (originalCanvas.width === 0 || originalCanvas.height === 0) {
      console.log('Canvas尺寸为0，尝试重新绘制');
      const img = imgElementRef.current;
      if (img && img.naturalWidth > 0) {
        console.log('从img重新绘制，尺寸:', img.naturalWidth, 'x', img.naturalHeight);
        originalCanvas.width = img.naturalWidth;
        originalCanvas.height = img.naturalHeight;
        const ctx = originalCanvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
        }
      } else {
        console.error('无法获取图片尺寸');
        setIsProcessing(false);
        return;
      }
    }

    const canvas = canvasRef.current;
    canvas.width = originalCanvas.width;
    canvas.height = originalCanvas.height;

    const ctx = canvas.getContext('2d');
    const originalCtx = originalCanvas.getContext('2d');
    if (!ctx || !originalCtx) {
      console.error('Canvas 2D上下文获取失败');
      setIsProcessing(false);
      return;
    }

    try {
      console.log('处理模式:', toolMode);
      
      if (toolMode === 'auto') {
        const backgroundColor = detectBackgroundColor(originalCtx, originalCanvas.width, originalCanvas.height);
        console.log('检测到的背景色:', backgroundColor);
        smartRemoveBackground(ctx, originalCtx, originalCanvas.width, originalCanvas.height, backgroundColor);
      } else {
        const colorToRemove = getColorToRemove();
        if (!colorToRemove) {
          console.error('没有指定要去除的颜色');
          setIsProcessing(false);
          return;
        }

        const imageData = originalCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          const distance = Math.sqrt(
            Math.pow(r - colorToRemove.r, 2) +
            Math.pow(g - colorToRemove.g, 2) +
            Math.pow(b - colorToRemove.b, 2)
          );

          if (distance < tolerance) {
            data[i + 3] = 0;
          }
        }

        ctx.putImageData(imageData, 0, 0);
      }

      const resultUrl = canvas.toDataURL('image/png');
      console.log('处理完成，结果URL长度:', resultUrl.length);
      setProcessedImage(resultUrl);
    } catch (error) {
      console.error('处理失败:', error);
    }
    
    setIsProcessing(false);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (toolMode !== 'color' || !originalCanvasRef.current) return;

    const canvas = originalCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height));

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hex = `#${pixel[0].toString(16).padStart(2, '0')}${pixel[1].toString(16).padStart(2, '0')}${pixel[2].toString(16).padStart(2, '0')}`;
    setSelectedColor(hex);
  };

  const downloadImage = () => {
    if (!processedImage) return;

    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'transparent-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const saveToGallery = () => {
    if (!processedImage || !originalImage) return;

    fetch(processedImage)
      .then(res => res.blob())
      .then(blob => {
        const newImage: ProcessedImage = {
          id: Date.now().toString(),
          originalUrl: originalImage,
          processedUrl: processedImage,
          fileName: `transparent-${Date.now()}.png`,
          blob
        };
        setImages(prev => [...prev, newImage]);
      });
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const reset = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setSelectedColor(null);
    currentImageUrlRef.current = null;
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadGalleryImage = (img: ProcessedImage) => {
    const url = URL.createObjectURL(img.blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = img.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {!originalImage ? (
          <div className="text-center">
            <div className="bg-white rounded-xl shadow-sm p-16">
              <div className="flex flex-col items-center justify-center">
                <div className="relative">
                  <Eraser className="w-16 h-16 text-primary-400 mb-6" />
                  <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-1 -right-4" />
                </div>
                <p className="text-2xl font-bold text-gray-800 mb-2">智能一键抠图</p>
                <p className="text-gray-500 mb-2">自动识别背景和主体，无需任何操作</p>
                <p className="text-gray-400 text-sm mb-8">上传图片即可一键完成背景去除</p>
                
                <label className="flex flex-col items-center justify-center w-full max-w-md h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-white hover:border-primary-400 hover:bg-primary-50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-12 h-12 text-primary-400 mb-4" />
                    <p className="mb-2 text-sm text-gray-600">
                      <span className="font-semibold">点击上传图片</span>
                    </p>
                    <p className="text-xs text-gray-400">支持 JPG、PNG、WebP 格式</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex flex-wrap items-center gap-4 justify-between">
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    onClick={reset}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    重新上传
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setToolMode('auto')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
                        toolMode === 'auto'
                          ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white border-primary-500 shadow-sm'
                          : 'text-gray-700 bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        智能抠图
                      </div>
                    </button>
                    <span className="text-gray-400">|</span>
                    <button
                      onClick={() => setToolMode('white')}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-all ${
                        toolMode === 'white'
                          ? 'bg-gray-800 text-white border-gray-800'
                          : 'text-gray-700 bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      白色背景
                    </button>
                    <button
                      onClick={() => setToolMode('green')}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-all ${
                        toolMode === 'green'
                          ? 'bg-green-500 text-white border-green-500'
                          : 'text-gray-700 bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      绿幕
                    </button>
                    <button
                      onClick={() => setToolMode('blue')}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg border-transition-all ${
                        toolMode === 'blue'
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'text-gray-700 bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      蓝幕
                    </button>
                    <button
                      onClick={() => setToolMode('color')}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-all ${
                        toolMode === 'color'
                          ? 'bg-primary-500 text-white border-primary-500'
                          : 'text-gray-700 bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Palette className="w-4 h-4" />
                        选择颜色
                      </div>
                    </button>
                  </div>

                  {toolMode === 'color' && (
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={selectedColor || '#ffffff'}
                        onChange={(e) => setSelectedColor(e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border-2 border-gray-200"
                      />
                      <span className="text-sm text-gray-600">{selectedColor || '点击图片选择'}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">容差:</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={tolerance}
                      onChange={(e) => setTolerance(parseInt(e.target.value))}
                      className="w-32"
                    />
                    <span className="text-sm text-gray-600 w-12 text-right">{tolerance}</span>
                  </div>

                  <button
                    onClick={processImage}
                    disabled={isProcessing}
                    className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Eraser className="w-4 h-4" />
                    )}
                    {isProcessing ? '处理中...' : '去除背景'}
                  </button>
                </div>
              </div>
            </div>

            {/* 隐藏的canvas用于处理 */}
            <div className="hidden">
              <canvas ref={originalCanvasRef} />
              <canvas ref={canvasRef} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-gray-500" />
                    <p className="font-medium text-gray-800">原图</p>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 flex items-center justify-center min-h-[400px]">
                  <div className="relative" style={{ maxWidth: '100%', maxHeight: '500px' }}>
                    <img
                      ref={imgElementRef}
                      src={originalImage}
                      alt="原图"
                      className="max-w-full max-h-[500px] object-contain"
                      onLoad={(e) => {
                        console.log('=== 图片加载完成 ===');
                        const img = e.target as HTMLImageElement;
                        console.log('图片尺寸:', img.naturalWidth, 'x', img.naturalHeight);
                        
                        if (originalCanvasRef.current) {
                          const canvas = originalCanvasRef.current;
                          canvas.width = img.naturalWidth;
                          canvas.height = img.naturalHeight;
                          const ctx = canvas.getContext('2d');
                          if (ctx) {
                            ctx.drawImage(img, 0, 0);
                            console.log('Canvas已绘制图片');
                            // 如果是自动模式，自动处理
                            if (toolMode === 'auto' && !processedImage) {
                              console.log('准备自动处理...');
                              setTimeout(() => {
                                if (!processedImage) {
                                  console.log('开始自动处理');
                                  processImage();
                                }
                              }, 800);
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eraser className="w-4 h-4 text-primary-500" />
                    <p className="font-medium text-gray-800">处理结果</p>
                  </div>
                  {processedImage && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={saveToGallery}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        添加到列表
                      </button>
                      <button
                        onClick={downloadImage}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        下载
                      </button>
                    </div>
                  )}
                </div>
                <div className="p-4 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center min-h-[400px] relative">
                  {processedImage ? (
                    <img
                      src={processedImage}
                      alt="处理后"
                      className="max-w-full max-h-[500px] object-contain relative z-10"
                    />
                  ) : (
                    <div className="text-center text-gray-500">
                      {isProcessing ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                          <p>正在处理...</p>
                        </div>
                      ) : (
                        <div>
                          <p className="mb-2">点击"去除背景"按钮处理图片</p>
                          {toolMode === 'auto' && (
                            <p className="text-xs text-gray-400">或稍等几秒，系统会自动处理</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                      backgroundSize: '20px 20px',
                      backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                    }}
                  />
                </div>
              </div>
            </div>

            {images.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-gray-500" />
                    <p className="font-medium text-gray-800">处理历史</p>
                  </div>
                  <span className="text-sm text-gray-500">{images.length} 张图片</span>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((img) => (
                      <div key={img.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div className="relative bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-2">
                          <img
                            src={img.processedUrl}
                            alt={img.fileName}
                            className="w-full h-40 object-contain relative z-10"
                          />
                          <div
                            className="absolute inset-0 opacity-20"
                            style={{
                              backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                              backgroundSize: '20px 20px',
                              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                            }}
                          />
                        </div>
                        <div className="p-3 border-t border-gray-100">
                          <p className="text-sm text-gray-600 truncate mb-3">{img.fileName}</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => downloadGalleryImage(img)}
                              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
                            >
                              <Download className="w-3.5 h-3.5" />
                              下载
                            </button>
                            <button
                              onClick={() => removeImage(img.id)}
                              className="px-3 py-2 text-xs text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
