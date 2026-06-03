import { useState } from 'react';
import { ChevronLeft, MoreHorizontal } from 'lucide-react';

interface Activity {
  id: number;
  title: string;
  image: string;
  date: string;
  location: string;
  createdAt: string;
  price: number;
  status: 'pending' | 'participated';
}

const mockActivities: Activity[] = [
  {
    id: 1,
    title: '经开区志愿服务活动',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=volunteer%20activity%20with%20children%20colorful%20playground&image_size=landscape_4_3',
    date: '2025-06-16',
    location: '赣州 | 经开区妇联中心',
    createdAt: '2025-06-16 12:00:00',
    price: 2.5,
    status: 'pending'
  },
  {
    id: 2,
    title: '经开区志愿服务活动动一动动一动动一动...',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=outdoor%20volunteer%20event%20people%20gathered%20park&image_size=landscape_4_3',
    date: '2025-06-16',
    location: '赣州 | 经开区妇联中心',
    createdAt: '2025-06-16 12:00:00',
    price: 2.5,
    status: 'participated'
  }
];

type TabType = 'all' | 'pending' | 'participated';

export default function MyActivities() {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const filteredActivities = mockActivities.filter(activity => {
    if (activeTab === 'all') return true;
    return activity.status === activeTab;
  });

  const tabs = [
    { key: 'all', label: '全部' },
    { key: 'pending', label: '待参与' },
    { key: 'participated', label: '已参与' }
  ] as const;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <button className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">我的活动</h1>
          <button className="p-2 -mr-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreHorizontal className="w-6 h-6 text-gray-700" />
          </button>
        </div>
        
        <div className="flex border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.key
                  ? 'text-orange-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-orange-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </header>

      <main className="px-4 py-4 space-y-4">
        {filteredActivities.map(activity => (
          <div
            key={activity.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <div className="relative">
              <img
                src={activity.image}
                alt={activity.title}
                className="w-full h-32 object-cover"
              />
              <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-full ${
                activity.status === 'pending'
                  ? 'bg-orange-500 text-white'
                  : 'bg-green-500 text-white'
              }`}>
                {activity.status === 'pending' ? '待参与' : '已参与'}
              </span>
            </div>
            
            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-2 truncate">
                {activity.title}
              </h3>
              
              <div className="space-y-1 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                  <span>时间: {activity.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                  <span>地点: {activity.location}</span>
                </div>
                {activity.status === 'participated' && (
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                    <span>创建时间: {activity.createdAt}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <span className="text-sm text-gray-400">¥{activity.price.toFixed(2)}</span>
                <button className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                  activity.status === 'pending'
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                  {activity.status === 'pending' ? '立即参与' : '查看详情'}
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredActivities.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <p>暂无活动</p>
          </div>
        )}
      </main>
    </div>
  );
}