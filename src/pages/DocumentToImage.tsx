import { useState, useRef } from 'react';
import { Download, X, FileText, FileSpreadsheet, FileImage, Trash2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import mammoth from 'mammoth';

interface DocumentImage {
  id: string;
  fileName: string;
  preview: string;
  blob: Blob;
}

export default function DocumentToImage() {
  const [documents, setDocuments] = useState<DocumentImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageFormat, setImageFormat] = useState<'png' | 'jpeg'>('png');
  const [imageQuality, setImageQuality] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [processingInfo, setProcessingInfo] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsProcessing(true);
    setErrorMessage('');
    setProcessingInfo('');

    try {
      const newImages: DocumentImage[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProcessingInfo(`正在处理: ${file.name} (${i + 1}/${files.length})`);
        
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        
        if (fileExtension === 'xlsx' || fileExtension === 'xls') {
          try {
            const images = await processExcel(file);
            newImages.push(...images);
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : '未知错误';
            console.error(`处理Excel失败: ${file.name}`, error);
            setErrorMessage(prev => prev ? `${prev}\n处理 ${file.name} 时出错: ${errorMsg}` : `处理 ${file.name} 时出错: ${errorMsg}`);
          }
        } else if (fileExtension === 'docx') {
          try {
            const images = await processWord(file);
            newImages.push(...images);
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : '未知错误';
            console.error(`处理Word失败: ${file.name}`, error);
            setErrorMessage(prev => prev ? `${prev}\n处理 ${file.name} 时出错: ${errorMsg}` : `处理 ${file.name} 时出错: ${errorMsg}`);
          }
        } else {
          setErrorMessage(prev => prev ? `${prev}\n不支持的文件格式: ${fileExtension}` : `不支持的文件格式: ${fileExtension}`);
        }
      }

      if (newImages.length > 0) {
        setDocuments(prev => [...prev, ...newImages]);
      } else if (!errorMessage) {
        setErrorMessage('未成功转换任何文档，请检查文件格式是否正确');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '未知错误';
      console.error('处理失败:', error);
      setErrorMessage(`文档处理失败: ${errorMsg}`);
    } finally {
      setIsProcessing(false);
      setProcessingInfo('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const processExcel = async (file: File): Promise<DocumentImage[]> => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
    const images: DocumentImage[] = [];
    const sheetNames = Object.keys(workbook.Sheets);

    for (const sheetName of sheetNames) {
      setProcessingInfo(`正在处理工作表: ${sheetName}`);
      
      const sheet = workbook.Sheets[sheetName];
      const merges = sheet['!merges'] || [];
      
      let minRow = Infinity;
      let maxRow = 0;
      let minCol = Infinity;
      let maxCol = 0;
      
      for (const cellAddr in sheet) {
        if (cellAddr[0] === '!') continue;
        const { r, c } = XLSX.utils.decode_cell(cellAddr);
        minRow = Math.min(minRow, r);
        maxRow = Math.max(maxRow, r);
        minCol = Math.min(minCol, c);
        maxCol = Math.max(maxCol, c);
      }
      
      if (minRow === Infinity) {
        minRow = 0;
        maxRow = 0;
        minCol = 0;
        maxCol = 0;
      }
      
      const maxRows = maxRow + 1;
      const maxCols = maxCol + 1;

      const cellData: Array<Array<{ v: string, isMerged: boolean, mergeInfo?: { rowspan: number, colspan: number } }>> = [];
      const renderedCells = new Set<string>();

      for (let row = 0; row < maxRows; row++) {
        const rowData: Array<{ v: string, isMerged: boolean, mergeInfo?: { rowspan: number, colspan: number } }> = [];
        for (let col = 0; col < maxCols; col++) {
          const cellAddr = XLSX.utils.encode_cell({ r: row, c: col });
          const cell = sheet[cellAddr];
          let cellValue = '';
          let isMerged = false;
          let mergeInfo = undefined;

          for (const merge of merges) {
            if (row >= merge.s.r && row <= merge.e.r && col >= merge.s.c && col <= merge.e.c) {
              if (row === merge.s.r && col === merge.s.c) {
                const colspan = merge.e.c - merge.s.c + 1;
                const rowspan = merge.e.r - merge.s.r + 1;
                mergeInfo = { colspan, rowspan };
              } else {
                isMerged = true;
              }
            }
          }

          if (cell && !isMerged) {
            if (cell.w) {
              cellValue = cell.w;
            } else if (cell.t === 's' || cell.t === 'str') {
              cellValue = cell.v;
            } else if (cell.t === 'n') {
              const num = cell.v;
              if (Number.isInteger(num)) {
                cellValue = String(Math.floor(num));
              } else {
                cellValue = String(num);
              }
            } else if (cell.t === 'b') {
              cellValue = cell.v ? 'TRUE' : 'FALSE';
            } else if (cell.t === 'd') {
              cellValue = new Date(cell.v).toLocaleDateString();
            } else {
              cellValue = String(cell.v || '');
            }
          }

          rowData.push({ v: cellValue, isMerged, mergeInfo });
        }
        cellData.push(rowData);
      }

      const colWidths: number[] = [];
      const canvasTemp = document.createElement('canvas');
      const ctxTemp = canvasTemp.getContext('2d')!;
      ctxTemp.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      
      for (let col = 0; col < maxCols; col++) {
        let maxWidth = 80;
        for (let row = 0; row < maxRows; row++) {
          const cell = cellData[row]?.[col];
          if (cell?.v) {
            const text = cell.v;
            const textWidth = ctxTemp.measureText(text).width;
            maxWidth = Math.max(maxWidth, textWidth + 60);
          }
        }
        colWidths.push(maxWidth);
      }

      const rowHeights: number[] = [];
      for (let row = 0; row < maxRows; row++) {
        rowHeights.push(45);
      }

      const totalWidth = colWidths.reduce((a, b) => a + b, 0) + 80;
      const tableHeight = rowHeights.reduce((a, b) => a + b, 0);
      const totalHeight = tableHeight + 100;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('无法创建Canvas上下文');
      }

      const scale = 2;
      canvas.width = totalWidth * scale;
      canvas.height = totalHeight * scale;
      ctx.scale(scale, scale);

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, totalWidth, totalHeight);

      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${file.name} - ${sheetName}`, totalWidth / 2, 35);

      ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      
      const mergedCellsMap = new Map<string, { colspan: number, rowspan: number }>();
      for (const merge of merges) {
        const key = `${merge.s.r},${merge.s.c}`;
        mergedCellsMap.set(key, {
          colspan: merge.e.c - merge.s.c + 1,
          rowspan: merge.e.r - merge.s.r + 1
        });
      }

      const processedCells = new Set<string>();

      let currentY = 50;

      for (let row = 0; row < maxRows; row++) {
        let currentX = 40;
        
        for (let col = 0; col < maxCols; col++) {
          const cellKey = `${row},${col}`;
          
          if (processedCells.has(cellKey)) {
            currentX += colWidths[col];
            continue;
          }

          const mergeInfo = mergedCellsMap.get(cellKey);
          
          let cellWidth = colWidths[col];
          let cellHeight = rowHeights[row];
          
          if (mergeInfo) {
            for (let i = col + 1; i < col + mergeInfo.colspan && i < maxCols; i++) {
              cellWidth += colWidths[i];
            }
            
            for (let i = row + 1; i < row + mergeInfo.rowspan && i < maxRows; i++) {
              cellHeight += rowHeights[i];
            }
            
            for (let r = row; r < row + mergeInfo.rowspan && r < maxRows; r++) {
              for (let c = col; c < col + mergeInfo.colspan && c < maxCols; c++) {
                processedCells.add(`${r},${c}`);
              }
            }
          } else {
            processedCells.add(cellKey);
          }

          const cell = cellData[row]?.[col];
          const isHeader = row === 0;
          
          if (isHeader) {
            ctx.fillStyle = '#f3f4f6';
            ctx.fillRect(currentX, currentY, cellWidth, cellHeight);
            ctx.fillStyle = '#1f2937';
            ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          } else if (row % 2 === 1) {
            ctx.fillStyle = '#f9fafb';
            ctx.fillRect(currentX, currentY, cellWidth, cellHeight);
            ctx.fillStyle = '#374151';
            ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          } else {
            ctx.fillStyle = '#374151';
            ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          }
          
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const displayText = cell?.v || '';
          ctx.fillText(displayText, currentX + cellWidth / 2, currentY + cellHeight / 2);

          ctx.strokeStyle = '#d1d5db';
          ctx.lineWidth = 1;
          ctx.strokeRect(currentX, currentY, cellWidth, cellHeight);

          if (mergeInfo) {
            let moveX = 0;
            for (let i = col; i < col + mergeInfo.colspan && i < maxCols; i++) {
              moveX += colWidths[i];
            }
            currentX += moveX;
          } else {
            currentX += cellWidth;
          }
        }
        
        currentY += rowHeights[row];
      }

      ctx.strokeStyle = '#9ca3af';
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 50, totalWidth - 80, tableHeight);

      const mimeType = imageFormat === 'png' ? 'image/png' : 'image/jpeg';
      const quality = imageFormat === 'jpeg' ? imageQuality : undefined;
      
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => {
          if (b) {
            resolve(b);
          } else {
            reject(new Error('Canvas转换失败'));
          }
        }, mimeType, quality);
      });
      const preview = URL.createObjectURL(blob);

      images.push({
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        fileName: `${file.name.replace(/\.[^/.]+$/, '')}_${sheetName}.${imageFormat}`,
        preview,
        blob,
      });
    }

    return images;
  };

  const htmlToImageBlob = (element: HTMLElement, format: 'png' | 'jpeg', quality: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('无法创建Canvas上下文'));
          return;
        }

        const scale = 2;
        
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '0';
        tempContainer.style.padding = '0';
        tempContainer.style.margin = '0';
        tempContainer.style.border = 'none';
        tempContainer.style.zIndex = '-1';
        tempContainer.style.background = 'white';
        tempContainer.style.width = 'auto';
        tempContainer.style.maxWidth = 'none';
        tempContainer.style.minWidth = 'unset';
        tempContainer.style.height = 'auto';
        tempContainer.appendChild(element.cloneNode(true));
        document.body.appendChild(tempContainer);
        
        const innerElement = tempContainer.firstChild as HTMLElement;
        innerElement.style.position = 'relative';
        innerElement.style.left = '0';
        innerElement.style.top = '0';
        innerElement.style.maxWidth = 'none';
        innerElement.style.width = 'auto';
        innerElement.style.minWidth = 'unset';
        innerElement.style.height = 'auto';
        innerElement.style.display = 'block';
        innerElement.style.overflow = 'visible';
        
        innerElement.style.width = 'auto';
        innerElement.style.height = 'auto';
        
        const rect = innerElement.getBoundingClientRect();
        let width = Math.max(rect.width, innerElement.scrollWidth, innerElement.offsetWidth, 200);
        let height = Math.max(rect.height, innerElement.scrollHeight, innerElement.offsetHeight, 100);
        
        innerElement.style.width = 'auto';
        innerElement.style.height = 'auto';
        
        const rect2 = innerElement.getBoundingClientRect();
        const finalWidth = Math.max(width, rect2.width, innerElement.scrollWidth, innerElement.offsetWidth);
        const finalHeight = Math.max(height, rect2.height, innerElement.scrollHeight, innerElement.offsetHeight);
        
        document.body.removeChild(tempContainer);
        
        element.style.width = 'auto';
        element.style.maxWidth = 'none';
        element.style.minWidth = 'unset';
        element.style.height = 'auto';
        element.style.display = 'block';
        
        canvas.width = Math.max(finalWidth * scale, 400);
        canvas.height = Math.max(finalHeight * scale, 200);
        ctx.scale(scale, scale);

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, Math.max(finalWidth, 200), Math.max(finalHeight, 100));

        const svgData = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${Math.max(finalWidth, 200)}" height="${Math.max(finalHeight, 100)}">
  <foreignObject x="0" y="0" width="${Math.max(finalWidth, 200)}" height="${Math.max(finalHeight, 100)}">
    <div xmlns="http://www.w3.org/1999/xhtml" style="width:100%;height:auto;display:block;min-width:unset;max-width:none;">${element.outerHTML}</div>
  </foreignObject>
</svg>`;

        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
          try {
            ctx.drawImage(img, 0, 0, finalWidth, finalHeight);
            
            URL.revokeObjectURL(url);
            
            const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
            const q = format === 'jpeg' ? quality : undefined;
            
            canvas.toBlob((b) => {
              if (b) {
                resolve(b);
              } else {
                reject(new Error('Canvas转换失败'));
              }
            }, mimeType, q);
          } catch (e) {
            URL.revokeObjectURL(url);
            reject(new Error('Canvas绘制失败: ' + (e as Error).message));
          }
        };
        
        img.onerror = (e) => {
          URL.revokeObjectURL(url);
          console.error('SVG图片加载失败:', e);
          fallbackToCanvasRender(element, format, quality, resolve, reject);
        };
        
        img.src = url;
      } catch (e) {
        console.error('HTML转图片失败:', e);
        fallbackToCanvasRender(element, format, quality, resolve, reject);
      }
    });
  };

  const fallbackToCanvasRender = (element: HTMLElement, format: 'png' | 'jpeg', quality: number, resolve: (value: Blob) => void, reject: (reason?: unknown) => void) => {
    try {
      const table = element.querySelector('table');
      if (!table) {
        reject(new Error('未找到表格元素'));
        return;
      }

      const rows = table.querySelectorAll('tr');
      const cells: string[][] = [];
      
      rows.forEach((row) => {
        const rowCells = row.querySelectorAll('td, th');
        const rowData: string[] = [];
        rowCells.forEach((cell) => {
          rowData.push(cell.textContent || '');
        });
        cells.push(rowData);
      });

      const maxCols = Math.max(...cells.map(row => row.length));
      const maxRows = cells.length;

      const colWidths: number[] = [];
      for (let col = 0; col < maxCols; col++) {
        let maxWidth = 80;
        for (let row = 0; row < maxRows; row++) {
          const cell = cells[row]?.[col] || '';
          maxWidth = Math.max(maxWidth, Math.min(cell.length * 8 + 32, 250));
        }
        colWidths.push(maxWidth);
      }

      const totalWidth = colWidths.reduce((a, b) => a + b, 0) + 80;
      const totalHeight = maxRows * 32 + 80;

      const canvas = document.createElement('canvas');
      canvas.width = totalWidth * 2;
      canvas.height = totalHeight * 2;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('无法创建Canvas上下文'));
        return;
      }

      ctx.scale(2, 2);

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, totalWidth, totalHeight);

      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';

      let currentY = 50;
      ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

      cells.forEach((row, rowIndex) => {
        const bgColor = rowIndex % 2 === 0 ? '#ffffff' : '#f9fafb';
        ctx.fillStyle = bgColor;
        ctx.fillRect(40, currentY, totalWidth - 80, 30);

        let currentX = 40;
        for (let col = 0; col < maxCols; col++) {
          const cell = row?.[col] || '';
          const isHeader = rowIndex === 0;
          const cellWidth = colWidths[col];

          if (isHeader) {
            ctx.fillStyle = '#f3f4f6';
            ctx.fillRect(currentX, currentY, cellWidth, 30);
            ctx.fillStyle = '#1f2937';
            ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          } else {
            ctx.fillStyle = '#374151';
            ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          }
          
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const displayText = cell.length > 30 ? cell.substring(0, 30) + '...' : cell;
          ctx.fillText(displayText, currentX + cellWidth / 2, currentY + 15);

          ctx.strokeStyle = '#d1d5db';
          ctx.lineWidth = 1;
          ctx.strokeRect(currentX, currentY, cellWidth, 30);

          currentX += cellWidth;
        }
        currentY += 30;
      });

      ctx.strokeStyle = '#9ca3af';
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 50, totalWidth - 80, maxRows * 30);

      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      const q = format === 'jpeg' ? quality : undefined;
      
      canvas.toBlob((b) => {
        if (b) {
          resolve(b);
        } else {
          reject(new Error('Canvas转换失败'));
        }
      }, mimeType, q);
    } catch (e) {
      reject(new Error('备用渲染失败: ' + (e as Error).message));
    }
  };

  const processWord = async (file: File): Promise<DocumentImage[]> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ 
      arrayBuffer,
      includeDefaultStyleMap: true,
      styleMap: [
        "p[style-name='Heading 1'] => h1:fresh",
        "p[style-name='Heading 2'] => h2:fresh",
        "p[style-name='Heading 3'] => h3:fresh",
        "p[style-name='Heading 4'] => h4:fresh",
        "p[style-name='Heading 5'] => h5:fresh",
        "p[style-name='Heading 6'] => h6:fresh",
        "p[style-name='Title'] => h1:fresh",
        "p[style-name='Subtitle'] => p.subtitle:fresh",
        "p[style-name='Normal'] => p:fresh",
        "p[style-name='List Paragraph'] => p:fresh",
        "r[style-name='Emphasis'] => em",
        "r[style-name='Strong'] => strong",
        "r:fresh"
      ]
    });
    
    // 创建主容器
    const container = document.createElement('div');
    
    // 添加文档标题
    const title = document.createElement('h2');
    title.textContent = file.name;
    title.style.textAlign = 'center';
    title.style.marginBottom = '30px';
    title.style.fontSize = '20px';
    title.style.color = '#1f2937';
    title.style.fontWeight = 'bold';
    title.style.marginTop = '0';
    container.appendChild(title);
    
    // 添加转换的HTML内容
    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = result.value;
    container.appendChild(contentDiv);
    
    // 如果没有内容，添加提示
    if (!contentDiv.innerHTML || contentDiv.innerHTML.trim() === '') {
      const fallbackText = document.createElement('div');
      fallbackText.innerHTML = `
        <div style="padding: 24px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;">
          <p style="color: #374151; margin: 0; font-size: 16px;"><strong>文档内容</strong></p>
          <p style="color: #6b7280; margin: 8px 0 0 0;">文档已成功解析，但未检测到可显示的内容。</p>
        </div>
      `;
      contentDiv.appendChild(fallbackText);
    }
    
    // 设置容器样式
    container.style.padding = '40px';
    container.style.backgroundColor = '#ffffff';
    container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    container.style.width = 'auto';
    container.style.maxWidth = 'none';
    container.style.minWidth = '500px';
    container.style.fontSize = '15px';
    container.style.lineHeight = '1.8';
    container.style.color = '#374151';
    container.style.whiteSpace = 'normal';
    
    // 处理所有元素样式
    const allElements = container.querySelectorAll('*');
    allElements.forEach(el => {
      const htmlEl = el as HTMLElement;
      
      // 基础样式重置
      htmlEl.style.boxSizing = 'border-box';
      htmlEl.style.maxWidth = 'none';
      htmlEl.style.width = 'auto';
      htmlEl.style.overflow = 'visible';
      htmlEl.style.visibility = 'visible';
      htmlEl.style.position = 'relative';
      htmlEl.style.float = 'none';
      htmlEl.style.clear = 'both';
      
      // 根据标签类型设置样式
      const tagName = htmlEl.tagName?.toLowerCase() || '';
      
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
        htmlEl.style.color = '#111827';
        htmlEl.style.marginTop = '24px';
        htmlEl.style.marginBottom = '12px';
        htmlEl.style.fontWeight = '700';
        htmlEl.style.display = 'block';
        htmlEl.style.lineHeight = '1.3';
      } else if (tagName === 'p') {
        htmlEl.style.marginBottom = '14px';
        htmlEl.style.marginTop = '0';
        htmlEl.style.display = 'block';
      } else if (['ul', 'ol'].includes(tagName)) {
        htmlEl.style.marginBottom = '14px';
        htmlEl.style.marginTop = '0';
        htmlEl.style.paddingLeft = '32px';
        htmlEl.style.display = 'block';
      } else if (tagName === 'li') {
        htmlEl.style.marginBottom = '6px';
        htmlEl.style.display = 'list-item';
      } else if (tagName === 'blockquote') {
        htmlEl.style.marginBottom = '14px';
        htmlEl.style.marginTop = '14px';
        htmlEl.style.padding = '12px 20px';
        htmlEl.style.borderLeft = '4px solid #d1d5db';
        htmlEl.style.color = '#4b5563';
        htmlEl.style.backgroundColor = '#f9fafb';
        htmlEl.style.display = 'block';
      } else if (['code', 'kbd', 'samp', 'var'].includes(tagName)) {
        htmlEl.style.fontFamily = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
        htmlEl.style.backgroundColor = '#f3f4f6';
        htmlEl.style.padding = '3px 6px';
        htmlEl.style.borderRadius = '4px';
        htmlEl.style.fontSize = '0.9em';
      } else if (tagName === 'pre') {
        htmlEl.style.padding = '16px';
        htmlEl.style.backgroundColor = '#f9fafb';
        htmlEl.style.borderRadius = '6px';
        htmlEl.style.overflowX = 'auto';
        htmlEl.style.display = 'block';
        htmlEl.style.marginBottom = '14px';
      } else if (tagName === 'hr') {
        htmlEl.style.border = 'none';
        htmlEl.style.borderTop = '1px solid #e5e7eb';
        htmlEl.style.margin = '28px 0';
        htmlEl.style.display = 'block';
      } else if (tagName === 'table') {
        htmlEl.style.borderCollapse = 'collapse';
        htmlEl.style.margin = '20px 0';
        htmlEl.style.width = 'auto';
        htmlEl.style.display = 'table';
      } else if (tagName === 'tr') {
        htmlEl.style.display = 'table-row';
      } else if (['td', 'th'].includes(tagName)) {
        htmlEl.style.border = '1px solid #d1d5db';
        htmlEl.style.padding = '10px 14px';
        htmlEl.style.textAlign = 'left';
        htmlEl.style.display = 'table-cell';
      } else if (tagName === 'th') {
        htmlEl.style.backgroundColor = '#f9fafb';
        htmlEl.style.fontWeight = '600';
      } else if (['strong', 'b'].includes(tagName)) {
        htmlEl.style.fontWeight = '700';
      } else if (['em', 'i'].includes(tagName)) {
        htmlEl.style.fontStyle = 'italic';
      } else if (['u', 'ins'].includes(tagName)) {
        htmlEl.style.textDecoration = 'underline';
      } else if (tagName === 'del') {
        htmlEl.style.textDecoration = 'line-through';
      } else if (tagName === 'mark') {
        htmlEl.style.backgroundColor = '#fef08a';
        htmlEl.style.padding = '2px 4px';
        htmlEl.style.borderRadius = '3px';
      } else if (tagName === 'sub') {
        htmlEl.style.verticalAlign = 'sub';
        htmlEl.style.fontSize = '0.75em';
      } else if (tagName === 'sup') {
        htmlEl.style.verticalAlign = 'super';
        htmlEl.style.fontSize = '0.75em';
      } else if (tagName === 'img') {
        htmlEl.style.maxWidth = '100%';
        htmlEl.style.height = 'auto';
        htmlEl.style.display = 'inline-block';
      } else if (tagName === 'figure') {
        htmlEl.style.marginBottom = '20px';
        htmlEl.style.marginTop = '20px';
        htmlEl.style.display = 'block';
      } else if (tagName === 'figcaption') {
        htmlEl.style.fontSize = '13px';
        htmlEl.style.color = '#6b7280';
        htmlEl.style.marginTop = '8px';
        htmlEl.style.display = 'block';
        htmlEl.style.textAlign = 'center';
      } else if (tagName === 'small') {
        htmlEl.style.fontSize = '0.875em';
      } else if (tagName === 'div') {
        htmlEl.style.display = 'block';
      } else if (tagName === 'br') {
        htmlEl.style.display = 'block';
        htmlEl.style.content = '""';
        htmlEl.style.marginBottom = '0.5em';
      }
    });
    
    // 测量文档总高度
    const tempMeasure = document.createElement('div');
    tempMeasure.style.position = 'absolute';
    tempMeasure.style.left = '-99999px';
    tempMeasure.style.top = '0';
    tempMeasure.style.padding = '0';
    tempMeasure.style.margin = '0';
    tempMeasure.style.width = 'auto';
    tempMeasure.style.maxWidth = 'none';
    tempMeasure.style.background = 'white';
    tempMeasure.appendChild(container.cloneNode(true));
    document.body.appendChild(tempMeasure);
    
    const measureEl = tempMeasure.firstChild as HTMLElement;
    const totalHeight = Math.max(measureEl.scrollHeight, measureEl.offsetHeight, 200);
    const totalWidth = Math.max(measureEl.scrollWidth, measureEl.offsetWidth, 500);
    document.body.removeChild(tempMeasure);
    
    const MAX_PAGE_HEIGHT = 2000;
    
    // 短文档直接单页
    if (totalHeight <= MAX_PAGE_HEIGHT + 150) {
      const blob = await htmlToImageBlob(container, imageFormat, imageQuality);
      const preview = URL.createObjectURL(blob);
      
      return [{
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        fileName: `${file.name.replace(/\.[^/.]+$/, '')}.${imageFormat}`,
        preview,
        blob,
      }];
    }
    
    // 长文档分页处理
    const images: DocumentImage[] = [];
    const allChildElements = Array.from(contentDiv.children);
    
    let currentPage = document.createElement('div');
    currentPage.style.padding = '40px';
    currentPage.style.backgroundColor = '#ffffff';
    currentPage.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    currentPage.style.width = 'auto';
    currentPage.style.maxWidth = 'none';
    currentPage.style.minWidth = '500px';
    currentPage.style.fontSize = '15px';
    currentPage.style.lineHeight = '1.8';
    currentPage.style.color = '#374151';
    currentPage.style.whiteSpace = 'normal';
    
    // 添加标题
    const pageTitle = title.cloneNode(true) as HTMLElement;
    currentPage.appendChild(pageTitle);
    
    // 分页处理
    for (let i = 0; i < allChildElements.length; i++) {
      const element = allChildElements[i];
      
      // 测试添加当前元素后的高度
      const testContainer = document.createElement('div');
      testContainer.style.padding = '40px';
      testContainer.style.backgroundColor = '#ffffff';
      testContainer.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      testContainer.style.width = 'auto';
      testContainer.style.maxWidth = 'none';
      testContainer.style.minWidth = '500px';
      testContainer.style.fontSize = '15px';
      testContainer.style.lineHeight = '1.8';
      
      Array.from(currentPage.children).forEach(child => {
        testContainer.appendChild(child.cloneNode(true));
      });
      testContainer.appendChild(element.cloneNode(true));
      
      // 测量测试页面高度
      const testMeasure = document.createElement('div');
      testMeasure.style.position = 'absolute';
      testMeasure.style.left = '-99999px';
      testMeasure.style.top = '0';
      testMeasure.style.width = 'auto';
      testMeasure.style.maxWidth = 'none';
      testMeasure.style.background = 'white';
      testMeasure.appendChild(testContainer);
      document.body.appendChild(testMeasure);
      
      const testHeight = Math.max(testContainer.scrollHeight, testContainer.offsetHeight);
      document.body.removeChild(testMeasure);
      
      // 如果超过最大高度且当前页有内容，就先保存当前页
      if (testHeight > MAX_PAGE_HEIGHT && currentPage.children.length > 1) {
        const pageToSave = document.createElement('div');
        pageToSave.style.padding = '40px';
        pageToSave.style.backgroundColor = '#ffffff';
        pageToSave.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        pageToSave.style.width = 'auto';
        pageToSave.style.maxWidth = 'none';
        pageToSave.style.minWidth = '500px';
        pageToSave.style.fontSize = '15px';
        pageToSave.style.lineHeight = '1.8';
        pageToSave.style.color = '#374151';
        
        Array.from(currentPage.children).forEach(child => {
          pageToSave.appendChild(child.cloneNode(true));
        });
        
        const blob = await htmlToImageBlob(pageToSave, imageFormat, imageQuality);
        const preview = URL.createObjectURL(blob);
        
        images.push({
          id: Date.now() + Math.random().toString(36).substr(2, 9),
          fileName: `${file.name.replace(/\.[^/.]+$/, '')}_page${images.length + 1}.${imageFormat}`,
          preview,
          blob,
        });
        
        // 开始新页面
        currentPage = document.createElement('div');
        currentPage.style.padding = '40px';
        currentPage.style.backgroundColor = '#ffffff';
        currentPage.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        currentPage.style.width = 'auto';
        currentPage.style.maxWidth = 'none';
        currentPage.style.minWidth = '500px';
        currentPage.style.fontSize = '15px';
        currentPage.style.lineHeight = '1.8';
        currentPage.style.color = '#374151';
        currentPage.style.whiteSpace = 'normal';
        
        const newPageTitle = document.createElement('h2');
        newPageTitle.textContent = `${file.name} (${images.length + 1})`;
        newPageTitle.style.textAlign = 'center';
        newPageTitle.style.marginBottom = '30px';
        newPageTitle.style.fontSize = '20px';
        newPageTitle.style.color = '#1f2937';
        newPageTitle.style.fontWeight = 'bold';
        newPageTitle.style.marginTop = '0';
        currentPage.appendChild(newPageTitle);
      }
      
      // 添加当前元素到页面
      currentPage.appendChild(element.cloneNode(true));
    }
    
    // 保存最后一页
    if (currentPage.children.length > 0) {
      const blob = await htmlToImageBlob(currentPage, imageFormat, imageQuality);
      const preview = URL.createObjectURL(blob);
      
      images.push({
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        fileName: `${file.name.replace(/\.[^/.]+$/, '')}_page${images.length + 1}.${imageFormat}`,
        preview,
        blob,
      });
    }
    
    return images;
  };

  const handleDownload = (doc: DocumentImage) => {
    const url = URL.createObjectURL(doc.blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    documents.forEach(doc => handleDownload(doc));
  };

  const handleRemoveDocument = (id: string) => {
    setDocuments(prev => {
      const removed = prev.find(doc => doc.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.preview);
      }
      return prev.filter(doc => doc.id !== id);
    });
  };

  const handleClearAll = () => {
    documents.forEach(doc => {
      URL.revokeObjectURL(doc.preview);
    });
    setDocuments([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">文档转图片</h1>
          <p className="text-gray-600 text-lg">将 Excel、Word 文档转换为高清图片</p>
        </div>

        {errorMessage && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 whitespace-pre-wrap">{errorMessage}</p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">输出格式</label>
                <select
                  value={imageFormat}
                  onChange={(e) => setImageFormat(e.target.value as 'png' | 'jpeg')}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="png">PNG (无损)</option>
                  <option value="jpeg">JPEG (压缩)</option>
                </select>
              </div>
              
              {imageFormat === 'jpeg' && (
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">图片质量</label>
                  <input
                    type="range"
                    min="0.5"
                    max="1"
                    step="0.05"
                    value={imageQuality}
                    onChange={(e) => setImageQuality(parseFloat(e.target.value))}
                    className="w-32"
                  />
                  <span className="text-sm text-gray-600 w-12 text-right">{Math.round(imageQuality * 100)}%</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-white hover:border-primary-400 hover:bg-primary-50 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <div className="flex gap-4 mb-4">
                <FileSpreadsheet className="w-12 h-12 text-blue-400" />
                <FileText className="w-12 h-12 text-green-400" />
              </div>
              <p className="mb-2 text-sm text-gray-600">
                <span className="font-semibold">点击上传</span> 或拖拽文件到此处
              </p>
              <p className="text-xs text-gray-400">支持 Excel (.xlsx, .xls)、Word (.docx) 格式</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".xlsx,.xls,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </div>

        {isProcessing && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center mb-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mb-4"></div>
            <p className="text-gray-600 mb-2">正在处理文档，请稍候...</p>
            {processingInfo && (
              <p className="text-sm text-gray-500">{processingInfo}</p>
            )}
          </div>
        )}

        {documents.length > 0 && (
          <>
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-6 mb-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-600">已转换图片</p>
                  <p className="text-2xl font-bold text-gray-900">{documents.length} 张</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleDownloadAll}
                    className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    下载全部 ({documents.length})
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
              {documents.map((doc) => (
                <div key={doc.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <FileImage className="w-4 h-4 text-primary-500" />
                        <p className="text-sm font-medium text-gray-900 truncate">{doc.fileName}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveDocument(doc.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="relative bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary-400 transition-all" style={{ minHeight: '200px' }} onClick={() => setPreviewImage(doc.preview)}>
                      <img
                        src={doc.preview}
                        alt={doc.fileName}
                        className="max-w-full max-h-[300px] object-contain"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all flex items-center justify-center">
                        <span className="text-white text-lg font-medium opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-50 px-4 py-2 rounded-lg">点击放大查看</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 pt-0">
                    <button
                      onClick={() => handleDownload(doc)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      下载图片
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {documents.length === 0 && !isProcessing && (
          <div className="bg-white rounded-xl shadow-sm p-16 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg">还没有上传文档</p>
            <p className="text-gray-400 text-sm mt-2">点击上方区域上传 Excel 或 Word 文档</p>
          </div>
        )}

        {previewImage && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
            onClick={() => setPreviewImage(null)}
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div 
              className="max-w-[90vw] max-h-[90vh] bg-white rounded-xl p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={previewImage}
                alt="预览"
                className="max-w-full max-h-[85vh] object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
