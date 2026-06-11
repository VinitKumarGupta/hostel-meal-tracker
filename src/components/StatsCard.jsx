import React from 'react';
import { FiTrendingUp, FiAward, FiPieChart } from 'react-icons/fi';

export const StatsCard = ({ roommates = [] }) => {
  // Calculations
  const totalBreakfast = roommates.reduce((sum, r) => sum + (r.breakfast || 0), 0);
  const totalLunch = roommates.reduce((sum, r) => sum + (r.lunch || 0), 0);
  const totalDinner = roommates.reduce((sum, r) => sum + (r.dinner || 0), 0);
  const totalMeals = totalBreakfast + totalLunch + totalDinner;

  // Find roommate with highest total meals (Meal Leader)
  let leader = null;
  let maxMeals = -1;

  roommates.forEach((r) => {
    const userTotal = (r.breakfast || 0) + (r.lunch || 0) + (r.dinner || 0);
    if (userTotal > maxMeals && userTotal > 0) {
      maxMeals = userTotal;
      leader = r.name;
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Meals Card */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-100/40 flex items-center space-x-4">
        <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-600">
          <FiTrendingUp className="h-6 w-6" />
        </div>
        <div>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Total Meals Tracked</span>
          <span className="text-3xl font-extrabold text-gray-800">{totalMeals}</span>
          <span className="text-xs text-gray-500 block mt-0.5">by {roommates.length} roommates</span>
        </div>
      </div>

      {/* Distribution Card */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-100/40 flex flex-col justify-between">
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

      {/* Leader Card */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-100/40 flex items-center space-x-4">
        <div className="p-4 rounded-2xl bg-amber-50 text-amber-500">
          <FiAward className="h-6 w-6" />
        </div>
        <div>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Top Meal Consumer</span>
          {leader ? (
            <>
              <span className="text-xl font-extrabold text-gray-800 block truncate max-w-[170px] sm:max-w-none">{leader}</span>
              <span className="text-xs text-gray-500 block mt-0.5">{maxMeals} meals consumed</span>
            </>
          ) : (
            <>
              <span className="text-lg font-bold text-gray-400 block mt-1">No data yet</span>
              <span className="text-xs text-gray-400 block mt-0.5">Start logging meals</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
