import { FiPieChart, FiClock } from 'react-icons/fi';

export const StatsCard = ({ roommates = [], logs = [] }) => {
  // Calculations
  const totalBreakfast = roommates.reduce((sum, r) => sum + (r.breakfast || 0), 0);
  const totalLunch = roommates.reduce((sum, r) => sum + (r.lunch || 0), 0);
  const totalDinner = roommates.reduce((sum, r) => sum + (r.dinner || 0), 0);
  const totalMeals = totalBreakfast + totalLunch + totalDinner;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Recent Activity Logs Card */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-100/40 flex flex-col justify-between min-h-[260px]">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
            <FiClock className="h-5 w-5" />
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Your Recent Activity (Last 50)</span>
        </div>
        <div className="flex-1 overflow-y-auto max-h-[180px] pr-1 space-y-2 custom-scrollbar">
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-6 text-center">
              <span className="text-xs text-gray-400 italic">No recent activity logged yet</span>
              <span className="text-[10px] text-gray-400/80 mt-0.5">Start logging meals to see history</span>
            </div>
          ) : (
            logs.map((log) => {
              let formattedTime = 'Just now';
              if (log.timestamp) {
                let date;
                if (typeof log.timestamp.toDate === 'function') {
                  date = log.timestamp.toDate();
                } else if (log.timestamp.seconds) {
                  date = new Date(log.timestamp.seconds * 1000);
                } else {
                  date = new Date(log.timestamp);
                }
                
                if (date instanceof Date && !isNaN(date)) {
                  const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  formattedTime = `${dateStr}, ${timeStr}`;
                }
              }
              const mealEmoji = log.mealType === 'breakfast' ? '🍳' : log.mealType === 'lunch' ? '🍛' : '🍕';
              return (
                <div key={log.id} className="flex items-center justify-between text-xs py-2 px-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-100 rounded-2xl transition-colors duration-100">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-sm">{mealEmoji}</span>
                    <span className="font-bold text-slate-700 capitalize">{log.mealType} added</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-100 px-2 py-0.5 rounded-full">{formattedTime}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Distribution Card */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-100/40 flex flex-col justify-between min-h-[260px]">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600">
            <FiPieChart className="h-5 w-5" />
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Meal Distribution</span>
        </div>
        <div className="space-y-2">
          {/* Breakfast Mini Bar */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
              <span>Breakfast ({totalBreakfast})</span>
              <span>{totalMeals > 0 ? Math.round((totalBreakfast / totalMeals) * 100) : 0}%</span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-orange-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${totalMeals > 0 ? (totalBreakfast / totalMeals) * 100 : 0}%` }}
              />
            </div>
          </div>
          {/* Lunch Mini Bar */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
              <span>Lunch ({totalLunch})</span>
              <span>{totalMeals > 0 ? Math.round((totalLunch / totalMeals) * 100) : 0}%</span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-blue-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${totalMeals > 0 ? (totalLunch / totalMeals) * 100 : 0}%` }}
              />
            </div>
          </div>
          {/* Dinner Mini Bar */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
              <span>Dinner ({totalDinner})</span>
              <span>{totalMeals > 0 ? Math.round((totalDinner / totalMeals) * 100) : 0}%</span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-purple-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${totalMeals > 0 ? (totalDinner / totalMeals) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
