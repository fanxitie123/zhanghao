import { useEffect, useRef } from 'react';
import { RefreshCw, Maximize2, Minimize2 } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { MessageBubble } from './MessageBubble';

export function ChatArea() {
  const { messages, isThinking, addMessage } = useChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleRegenerate = () => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'assistant') {
      addMessage({ role: 'user', content: '重新回答' });
    }
  };

  const handleFollowUp = (question: string) => {
    addMessage({ role: 'user', content: question });
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <div className="flex-1 overflow-y-auto p-6" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
              <span className="text-2xl">赣</span>
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">欢迎使用纪检监察大模型</h3>
            <p className="text-sm text-gray-400">请输入问题，我将为您提供专业的解答</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble 
              key={message.id} 
              message={message} 
              onRegenerate={handleRegenerate}
              onFollowUp={handleFollowUp}
            />
          ))
        )}

        {isThinking && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 bg-gray-100 px-4 py-3 rounded-lg">
              <RefreshCw className="w-4 h-4 text-gray-400 animate-spin" />
              <span className="text-sm text-gray-500">正在思考中...</span>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
              监察对象的违法行为有哪些？
            </button>
            <button className="px-3 py-1.5 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
              监察对象的处分种类有哪些？
            </button>
            <button className="px-3 py-1.5 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
              监察对象与公务员的区别是什么？
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">请输入问题，Ctrl+Enter 换行</span>
          <div className="flex-1 h-px bg-gray-200" />
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
