import { useState } from 'react';
import { Search, Download, ThumbsUp, ThumbsDown, AlertCircle, Eye, X, MessageSquare, ChevronDown, ChevronUp, ChevronRight, User, Bot } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

interface FeedbackRecord {
  id: string;
  userName: string;
  userID: string;
  question: string;
  answer: string;
  rating: '满意' | '不满意';
  reason: string;
  timestamp: string;
  conversation: ChatMessage[];
}

const mockFeedbackData: FeedbackRecord[] = [
  { 
    id: '1', 
    userName: '张三', 
    userID: 'U001', 
    question: '谈谈监察对象的范围', 
    answer: '监察对象是指所有依法行使公权力的公职人员，包括：1. 中国共产党机关、人民代表大会及其常务委员会机关、人民政府、监察委员会、人民法院、人民检察院、中国人民政治协商会议各级委员会机关、民主党派机关和工商业联合会机关的公务员，以及参照《中华人民共和国公务员法》管理的人员；2. 法律、法规授权或者受国家机关依法委托管理公共事务的组织中从事公务的人员；3. 国有企业管理人员；4. 公办的教育、科研、文化、医疗卫生、体育等单位中从事管理的人员；5. 基层群众性自治组织中从事管理的人员；6. 其他依法履行公职的人员。', 
    rating: '满意', 
    reason: '', 
    timestamp: '2024-01-15 10:35:20',
    conversation: [
      { id: '1-1', role: 'user', content: '你好，我想了解一下监察对象的范围', time: '2024-01-15 10:30:00' },
      { id: '1-2', role: 'assistant', content: '您好！监察对象是指所有依法行使公权力的公职人员。具体包括中国共产党机关、人民代表大会及其常务委员会机关、人民政府、监察委员会、人民法院、人民检察院等机关的公务员，以及参照公务员法管理的人员。', time: '2024-01-15 10:30:15' },
      { id: '1-3', role: 'user', content: '还有其他类型吗？', time: '2024-01-15 10:32:00' },
      { id: '1-4', role: 'assistant', content: '是的，还包括法律、法规授权或者受国家机关依法委托管理公共事务的组织中从事公务的人员，国有企业管理人员，公办事业单位中从事管理的人员，基层群众性自治组织中从事管理的人员，以及其他依法履行公职的人员。', time: '2024-01-15 10:32:30' },
      { id: '1-5', role: 'user', content: '谈谈监察对象的范围', time: '2024-01-15 10:35:00' },
      { id: '1-6', role: 'assistant', content: '监察对象是指所有依法行使公权力的公职人员，包括：1. 中国共产党机关、人民代表大会及其常务委员会机关、人民政府、监察委员会、人民法院、人民检察院、中国人民政治协商会议各级委员会机关、民主党派机关和工商业联合会机关的公务员，以及参照《中华人民共和国公务员法》管理的人员；2. 法律、法规授权或者受国家机关依法委托管理公共事务的组织中从事公务的人员；3. 国有企业管理人员；4. 公办的教育、科研、文化、医疗卫生、体育等单位中从事管理的人员；5. 基层群众性自治组织中从事管理的人员；6. 其他依法履行公职的人员。', time: '2024-01-15 10:35:20' },
    ]
  },
  { 
    id: '2', 
    userName: '李四', 
    userID: 'U002', 
    question: '监察对象的处分种类有哪些？', 
    answer: '警告、记过、记大过、降级、撤职、开除', 
    rating: '不满意', 
    reason: '回答不够详细，希望有更多案例说明', 
    timestamp: '2024-01-15 10:30:15',
    conversation: [
      { id: '2-1', role: 'user', content: '监察对象的处分种类有哪些？', time: '2024-01-15 10:25:00' },
      { id: '2-2', role: 'assistant', content: '警告、记过、记大过、降级、撤职、开除', time: '2024-01-15 10:30:15' },
    ]
  },
  { 
    id: '3', 
    userName: '王五', 
    userID: 'U003', 
    question: '政务处分与行政处分的区别', 
    answer: '政务处分适用于所有监察对象，包括公务员、事业单位人员、国有企业管理人员等；行政处分主要适用于行政机关公务员。政务处分是监察机关作出的，行政处分是行政机关作出的。', 
    rating: '满意', 
    reason: '', 
    timestamp: '2024-01-15 09:50:30',
    conversation: [
      { id: '3-1', role: 'user', content: '政务处分与行政处分有什么区别？', time: '2024-01-15 09:45:00' },
      { id: '3-2', role: 'assistant', content: '政务处分与行政处分的主要区别在于适用范围和作出机关。政务处分适用于所有监察对象，包括公务员、事业单位人员、国有企业管理人员等；行政处分主要适用于行政机关公务员。', time: '2024-01-15 09:48:00' },
      { id: '3-3', role: 'user', content: '作出机关有什么不同？', time: '2024-01-15 09:49:00' },
      { id: '3-4', role: 'assistant', content: '政务处分是由监察机关作出的，而行政处分是由行政机关作出的。', time: '2024-01-15 09:50:30' },
    ]
  },
  { 
    id: '4', 
    userName: '张三', 
    userID: 'U001', 
    question: '如何认定职务违法？', 
    answer: '职务违法行为需具备主体、主观、客观、客体四个要件。主体是国家机关工作人员或其他依法从事公务的人员；主观方面包括故意或过失；客观方面表现为违反职务廉洁性或职责要求的行为；客体是职务行为的廉洁性和正常的管理秩序。', 
    rating: '不满意', 
    reason: '法律条款引用不明确', 
    timestamp: '2024-01-14 15:25:00',
    conversation: [
      { id: '4-1', role: 'user', content: '如何认定职务违法？', time: '2024-01-14 15:20:00' },
      { id: '4-2', role: 'assistant', content: '职务违法行为需具备主体、主观、客观、客体四个要件。主体是国家机关工作人员或其他依法从事公务的人员；主观方面包括故意或过失；客观方面表现为违反职务廉洁性或职责要求的行为；客体是职务行为的廉洁性和正常的管理秩序。', time: '2024-01-14 15:25:00' },
    ]
  },
  { 
    id: '5', 
    userName: '赵六', 
    userID: 'U004', 
    question: '监察机关的职责有哪些？', 
    answer: '监督、调查、处置三项主要职责。监督职责是指对公职人员依法履职、秉公用权、廉洁从政从业以及道德操守情况进行监督检查；调查职责是指对涉嫌贪污贿赂、滥用职权、玩忽职守、权力寻租、利益输送、徇私舞弊以及浪费国家资财等职务违法和职务犯罪进行调查；处置职责是指对违法的公职人员依法作出政务处分决定，对履行职责不力、失职失责的领导人员进行问责，对涉嫌职务犯罪的，将调查结果移送人民检察院依法审查、提起公诉，向监察对象所在单位提出监察建议。', 
    rating: '满意', 
    reason: '', 
    timestamp: '2024-01-14 14:15:45',
    conversation: [
      { id: '5-1', role: 'user', content: '监察机关的职责有哪些？', time: '2024-01-14 14:10:00' },
      { id: '5-2', role: 'assistant', content: '监察机关主要有三项职责：监督、调查、处置。', time: '2024-01-14 14:12:00' },
      { id: '5-3', role: 'user', content: '能详细说说吗？', time: '2024-01-14 14:13:00' },
      { id: '5-4', role: 'assistant', content: '监督职责是指对公职人员依法履职、秉公用权、廉洁从政从业以及道德操守情况进行监督检查；调查职责是指对涉嫌贪污贿赂、滥用职权、玩忽职守、权力寻租、利益输送、徇私舞弊以及浪费国家资财等职务违法和职务犯罪进行调查；处置职责是指对违法的公职人员依法作出政务处分决定，对履行职责不力、失职失责的领导人员进行问责，对涉嫌职务犯罪的，将调查结果移送人民检察院依法审查、提起公诉，向监察对象所在单位提出监察建议。', time: '2024-01-14 14:15:45' },
    ]
  },
];

export default function Feedback() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRating, setSelectedRating] = useState('全部');
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackRecord | null>(null);
  const [showFullConversation, setShowFullConversation] = useState(false);

  const filteredData = mockFeedbackData.filter(item => {
    const matchSearch = item.userName.includes(searchQuery) || item.question.includes(searchQuery);
    const matchRating = selectedRating === '全部' || item.rating === selectedRating;
    return matchSearch && matchRating;
  });

  const stats = {
    total: mockFeedbackData.length,
    satisfied: mockFeedbackData.filter(f => f.rating === '满意').length,
    unsatisfied: mockFeedbackData.filter(f => f.rating === '不满意').length,
  };

  const handleExport = () => {
    const csvContent = [
      ['ID', '用户姓名', '用户ID', '问题', '回答', '评价', '不满意原因', '时间'].join(','),
      ...filteredData.map(item => [item.id, item.userName, item.userID, item.question, item.answer, item.rating, item.reason, item.timestamp].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'feedback_data.csv';
    link.click();
  };

  const handleViewDetail = (record: FeedbackRecord) => {
    setSelectedFeedback(record);
    setShowFullConversation(false);
  };

  const handleCloseModal = () => {
    setSelectedFeedback(null);
    setShowFullConversation(false);
  };

  const displayMessages = showFullConversation 
    ? selectedFeedback?.conversation 
    : selectedFeedback?.conversation.slice(-2) || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <Search className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500">总评价数</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <ThumbsUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.satisfied}</p>
              <p className="text-sm text-gray-500">满意</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <ThumbsDown className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.unsatisfied}</p>
              <p className="text-sm text-gray-500">不满意</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索评价记录..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
              />
            </div>
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="全部">全部评价</option>
              <option value="满意">满意</option>
              <option value="不满意">不满意</option>
            </select>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            导出数据
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">用户姓名</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">问题</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">评价</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">不满意原因</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">时间</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-600">{item.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{item.userName}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">{item.question}</td>
                  <td className="py-3 px-4">
                    {item.rating === '满意' ? (
                      <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                        <ThumbsUp className="w-3 h-3" />
                        满意
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                        <ThumbsDown className="w-3 h-3" />
                        不满意
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {item.reason ? (
                      <span className="flex items-center gap-1 text-red-600">
                        <AlertCircle className="w-3 h-3" />
                        {item.reason}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{item.timestamp}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleViewDetail(item)}
                      className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-800 font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      查看详情
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-500">共 {filteredData.length} 条记录</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50">上一页</button>
            <span className="px-3 py-1 text-sm text-gray-600">1</span>
            <button className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50">下一页</button>
          </div>
        </div>
      </div>

      {/* 详情弹窗 */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">评价详情</h3>
                <p className="text-sm text-gray-500 mt-1">
                  用户：{selectedFeedback.userName} | ID：{selectedFeedback.userID} | 时间：{selectedFeedback.timestamp}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">问题</p>
                <p className="text-gray-900">{selectedFeedback.question}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">回答</p>
                <p className="text-gray-900 whitespace-pre-wrap">{selectedFeedback.answer}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">评价：</span>
                  {selectedFeedback.rating === '满意' ? (
                    <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                      <ThumbsUp className="w-3 h-3" />
                      满意
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                      <ThumbsDown className="w-3 h-3" />
                      不满意
                    </span>
                  )}
                </div>
                {selectedFeedback.reason && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">原因：</span>
                    <span className="text-sm text-red-600">{selectedFeedback.reason}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    对话记录
                  </h4>
                  {selectedFeedback.conversation.length > 2 && (
                    <button
                      onClick={() => setShowFullConversation(!showFullConversation)}
                      className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-800"
                    >
                      {showFullConversation ? (
                        <>
                          <ChevronUp className="w-4 h-4" />
                          收起部分对话
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          查看全部对话 ({selectedFeedback.conversation.length} 条)
                        </>
                      )}
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {displayMessages.map((message) => (
                    <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] ${message.role === 'user' ? 'items-end' : 'items-start'} flex gap-3`}>
                        {message.role === 'assistant' && (
                          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-primary-600" />
                          </div>
                        )}
                        <div className={`${message.role === 'user' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-900'} rounded-xl px-4 py-3`}>
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          <p className="text-xs text-gray-500 mt-2">{message.time}</p>
                        </div>
                        {message.role === 'user' && (
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-gray-600" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
