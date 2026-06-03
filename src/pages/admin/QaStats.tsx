import { useState } from 'react';
import { Calendar, ThumbsUp, ThumbsDown, TrendingUp } from 'lucide-react';

interface DailyQaStats {
  date: string;
  total: number;
  satisfied: number;
  unsatisfied: number;
}

const mockQaStats: DailyQaStats[] = [
  { date: '01-09', total: 120, satisfied: 105, unsatisfied: 15 },
  { date: '01-10', total: 135, satisfied: 118, unsatisfied: 17 },
  { date: '01-11', total: 98, satisfied: 85, unsatisfied: 13 },
  { date: '01-12', total: 156, satisfied: 138, unsatisfied: 18 },
  { date: '01-13', total: 189, satisfied: 165, unsatisfied: 24 },
  { date: '01-14', total: 172, satisfied: 152, unsatisfied: 20 },
  { date: '01-15', total: 210, satisfied: 188, unsatisfied: 22 },
];

const totals = {
  total: mockQaStats.reduce((sum, day) => sum + day.total, 0),
  satisfied: mockQaStats.reduce((sum, day) => sum + day.satisfied, 0),
  unsatisfied: mockQaStats.reduce((sum, day) => sum + day.unsatisfied, 0),
};

const satisfactionRate = ((totals.satisfied / totals.total) * 100).toFixed(1);
const unsatisfactionRate = ((totals.unsatisfied / totals.total) * 100).toFixed(1);

export default function QaStats() {
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
              <p className="text-2xl font-bold text-gray-900">{totals.total}</p>
              <p className="text-sm text-gray-500 mt-1">问答总数</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-600">{satisfactionRate}%</p>
              <p className="text-sm text-gray-500 mt-1">满意率</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <ThumbsUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>+2.3% 较上周</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-red-600">{unsatisfactionRate}%</p>
              <p className="text-sm text-gray-500 mt-1">不满意率</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <ThumbsDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>-1.8% 较上周</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{totals.satisfied}</p>
              <p className="text-sm text-gray-500 mt-1">满意数</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <ThumbsUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">每日问答效果趋势</h3>
        <div className="flex items-end justify-between gap-4 h-64">
          {mockQaStats.map((day) => {
            const satisfiedPercent = (day.satisfied / day.total) * 100;
            const unsatisfiedPercent = (day.unsatisfied / day.total) * 100;
            return (
              <div key={day.date} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col gap-1" style={{ height: '200px' }}>
                  <div
                    className="w-full bg-green-500 rounded-t"
                    style={{ height: `${satisfiedPercent}%` }}
                    title={`满意: ${day.satisfied} (${satisfiedPercent.toFixed(0)}%)`}
                  />
                  <div
                    className="w-full bg-red-500 rounded-t"
                    style={{ height: `${unsatisfiedPercent}%` }}
                    title={`不满意: ${day.unsatisfied} (${unsatisfiedPercent.toFixed(0)}%)`}
                  />
                </div>
                <span className="text-xs text-gray-500 mt-2">{day.date}</span>
                <span className="text-xs text-gray-600">{day.total}次</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded" />
            <span className="text-sm text-gray-600">满意</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded" />
            <span className="text-sm text-gray-600">不满意</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">满意度对比分析</h3>
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="#22c55e"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 88 * (parseFloat(satisfactionRate) / 100)} ${2 * Math.PI * 88}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-green-600">{satisfactionRate}%</span>
                <span className="text-xs text-gray-500">满意率</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="#ef4444"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 88 * (parseFloat(unsatisfactionRate) / 100)} ${2 * Math.PI * 88}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-red-600">{unsatisfactionRate}%</span>
                <span className="text-xs text-gray-500">不满意率</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
