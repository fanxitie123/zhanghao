import { useState } from 'react';
import { Bot, Copy, ThumbsUp, Share2, ExternalLink, FileText, RefreshCw, Download, X, Check } from 'lucide-react';
import { Message } from '../store/chatStore';

interface MessageBubbleProps {
  message: Message;
  onRegenerate?: () => void;
  onFollowUp?: (question: string) => void;
}

export function MessageBubble({ message, onRegenerate, onFollowUp }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState<'satisfied' | 'unsatisfied' | null>(null);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [followUpExpanded, setFollowUpExpanded] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRating = (type: 'satisfied' | 'unsatisfied') => {
    setRating(type);
    if (type === 'satisfied') {
      setShowRating(false);
    }
  };

  const toggleReason = (reason: string) => {
    setSelectedReasons(prev => 
      prev.includes(reason) 
        ? prev.filter(r => r !== reason)
        : [...prev, reason]
    );
  };

  const confirmRating = () => {
    setShowRating(false);
    alert('评价已提交，感谢您的反馈！');
  };

  const handleExport = () => {
    alert('正在生成Word文档...');
    setTimeout(() => {
      alert('文档已生成，开始下载！');
    }, 1500);
  };

  const followUpQuestions = [
    '监察对象的具体范围是什么？',
    '政务处分的种类有哪些？',
    '如何认定职务违法？',
    '监察机关的职责是什么？',
  ];

  const ratingReasons = [
    '有害/不安全',
    '虚假信息',
    '没有帮助',
    '其他',
  ];

  const sources = [
    { id: '1', name: '中华人民共和国监察法', page: '第15条', excerpt: '监察对象是指所有依法行使公权力的公职人员' },
    { id: '2', name: '公职人员政务处分法', page: '第2条', excerpt: '本法适用于监察机关对违法的公职人员给予政务处分的活动' },
  ];

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`max-w-[70%] ${isUser ? 'items-end' : 'items-start'} flex`}>
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-3 flex-shrink-0">
            <Bot className="w-4 h-4 text-primary-600" />
          </div>
        )}
        
        <div className={isUser ? 'bg-primary-600 text-white rounded-2xl rounded-br-md' : 'bg-white rounded-2xl rounded-bl-md shadow-sm border border-gray-100'}>
          {message.thinking && (
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                <span className="text-xs font-medium text-gray-500">深度思考中</span>
              </div>
              <div className="text-xs text-gray-500 space-y-1 max-h-40 overflow-y-auto">
                {message.thinking.map((step, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-primary-500 font-medium">{index + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="p-4">
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">
              {message.content}
            </div>
          </div>

          {!isUser && message.sources && sources.length > 0 && (
            <div className="px-4 pb-3">
              <div className="flex items-center gap-2 mb-2">
                <ExternalLink className="w-3 h-3 text-gray-400" />
                <span className="text-xs font-medium text-gray-500">引用来源</span>
              </div>
              <div className="space-y-2">
                {sources.map((source) => (
                  <button
                    key={source.id}
                    className="w-full text-left px-3 py-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-medium text-blue-700">{source.name}</span>
                        <span className="text-xs text-blue-500">{source.page}</span>
                      </div>
                      <ExternalLink className="w-3 h-3 text-blue-400 group-hover:text-blue-600" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{source.excerpt}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {!isUser && followUpQuestions.length > 0 && (
            <div className="px-4 pb-3">
              <button
                onClick={() => setFollowUpExpanded(!followUpExpanded)}
                className="flex items-center gap-2 text-xs text-gray-500 hover:text-primary-600 transition-colors"
              >
                <span>相关问题</span>
                <span className={`transition-transform ${followUpExpanded ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {followUpExpanded && (
                <div className="mt-2 space-y-2">
                  {followUpQuestions.slice(0, 4).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => onFollowUp?.(question)}
                      className="w-full text-left px-3 py-2 bg-gray-50 rounded-lg hover:bg-primary-50 hover:text-primary-700 transition-colors text-xs text-gray-600"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {!isUser && (
            <div className="px-4 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors text-xs"
                  title="复制回答"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? '已复制' : '复制'}
                </button>

                <button
                  onClick={() => setShowRating(true)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors text-xs ${
                    rating === 'satisfied' 
                      ? 'bg-green-100 text-green-700' 
                      : rating === 'unsatisfied'
                      ? 'bg-red-100 text-red-700'
                      : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
                  }`}
                  title="评价"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  {rating === 'satisfied' ? '满意' : rating === 'unsatisfied' ? '不满意' : '评价'}
                </button>

                <button
                  onClick={handleExport}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors text-xs"
                  title="导出"
                >
                  <Download className="w-3.5 h-3.5" />
                  导出
                </button>

                <button
                  onClick={onRegenerate}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors text-xs"
                  title="重新生成"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  重新生成
                </button>

                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors text-xs" title="分享">
                  <Share2 className="w-3.5 h-3.5" />
                  分享
                </button>
              </div>

              {showRating && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-gray-700">您对回答满意吗？</span>
                    <button onClick={() => setShowRating(false)} className="p-1 hover:bg-gray-200 rounded">
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => handleRating('satisfied')}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                        rating === 'satisfied' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      满意
                    </button>
                    <button
                      onClick={() => handleRating('unsatisfied')}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                        rating === 'unsatisfied' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      不满意
                    </button>
                  </div>
                  {rating === 'unsatisfied' && (
                    <div>
                      <p className="text-xs text-gray-500 mb-2">请选择不满意的原因（可多选）</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {ratingReasons.map((reason) => (
                          <button
                            key={reason}
                            onClick={() => toggleReason(reason)}
                            className={`px-3 py-1 rounded-full text-xs transition-colors ${
                              selectedReasons.includes(reason)
                                ? 'bg-red-100 text-red-700 border-2 border-red-300'
                                : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:border-gray-200'
                            }`}
                          >
                            {reason}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="请输入补充描述（可选）"
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <button
                        onClick={confirmRating}
                        className="w-full mt-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                      >
                        提交评价
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
