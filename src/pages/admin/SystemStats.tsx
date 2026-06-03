import { useState } from 'react';
import { Calendar, Users, MessageSquare, FileText, TrendingUp } from 'lucide-react';

interface DailyStats {
  date: string;
  activeUsers: number;
  chatCount: number;
  qaCount: number;
  knowledgeViews: number;
}

const mockDailyStats: DailyStats[] = [
  { date: '01-09', activeUsers: 45, chatCount: 120, qaCount: 95, knowledgeViews: 68 },
  { date: '01-10', activeUsers: 52, chatCount: 135, qaCount: 108, knowledgeViews: 72 },
  { date: '01-11', activeUsers: 38, chatCount: 98, qaCount: 78, knowledgeViews: 55 },
  { date: '01-12', activeUsers: 61, chatCount: 156, qaCount: 125, knowledgeViews: 88 },
  { date: '01-13', activeUsers: 72, chatCount: 189, qaCount: 152, knowledgeViews: 105 },
  { date: '01-14', activeUsers: 68, chatCount: 172, qaCount: 140, knowledgeViews: 95 },
  { date: '01-15', activeUsers: 85, chatCount: 210, qaCount: 175, knowledgeViews: 120 },
];

const totals = {
  activeUsers: mockDailyStats.reduce((sum, day) => sum + day.activeUsers, 0),
  chatCount: mockDailyStats.reduce((sum, day) => sum + day.chatCount, 0),
  qaCount: mockDailyStats.reduce((sum, day) => sum + day.qaCount, 0),
  knowledgeViews: mockDailyStats.reduce((sum, day) => sum + day.knowledgeViews, 0),
};

export default function SystemStats() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-gray-400" />
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="week">本周</option>
            <option value="month">本月</option>
            <option value="quarter">本季度</option>
            <option value="year">本年</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{totals.activeUsers}</p>
              <p className="text-sm text-gray-500 mt-1">活跃用户数</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>+12.5% 较上周</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{totals.chatCount}</p>
              <p className="text-sm text-gray-500 mt-1">对话总量</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>+8.3% 较上周</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{totals.qaCount}</p>
              <p className="text-sm text-gray-500 mt-1">问答次数</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>+15.2% 较上周</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{totals.knowledgeViews}</p>
              <p className="text-sm text-gray-500 mt-1">知识库访问量</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-sm text-red-600">
            <TrendingUp className="w-4 h-4" />
            <span>-2.1% 较上周</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">每日趋势</h3>
        <div className="flex items-end justify-between gap-4 h-64">
          {mockDailyStats.map((day) => (
            <div key={day.date} className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col gap-1" style={{ height: '200px' }}>
                <div
                  className="w-full bg-blue-500 rounded-t"
                  style={{ height: `${(day.activeUsers / 100) * 100}%` }}
                  title={`活跃用户: ${day.activeUsers}`}
                />
                <div
                  className="w-full bg-green-500 rounded-t"
                  style={{ height: `${(day.chatCount / 250) * 100}%` }}
                  title={`对话总量: ${day.chatCount}`}
                />
                <div
                  className="w-full bg-purple-500 rounded-t"
                  style={{ height: `${(day.qaCount / 200) * 100}%` }}
                  title={`问答次数: ${day.qaCount}`}
                />
                <div
                  className="w-full bg-orange-500 rounded-t"
                  style={{ height: `${(day.knowledgeViews / 150) * 100}%` }}
                  title={`知识库访问: ${day.knowledgeViews}`}
                />
              </div>
              <span className="text-xs text-gray-500 mt-2">{day.date}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded" />
            <span className="text-sm text-gray-600">活跃用户</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded" />
            <span className="text-sm text-gray-600">对话总量</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded" />
            <span className="text-sm text-gray-600">问答次数</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded" />
            <span className="text-sm text-gray-600">知识库访问</span>
          </div>
        </div>
      </div>
    </div>
  );
}
