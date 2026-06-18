
import { FiSun, FiCoffee, FiMoon, FiPlus, FiMinus, FiRefreshCw } from 'react-icons/fi';

export const MealCard = ({ mealType, count = 0, onIncrement, onDecrement, onReset }) => {
  // Setup configs based on mealType
  const configs = {
    breakfast: {
      title: 'Breakfast',
      icon: <FiSun className="h-6 w-6" />,
      colorClass: 'text-orange-600',
      bgColorClass: 'bg-orange-50 hover:bg-orange-100/70',
      borderColorClass: 'border-orange-100',
      btnClass: 'bg-orange-600 hover:bg-orange-700 active:bg-orange-800 shadow-orange-100 text-white',
      badgeClass: 'bg-orange-100 text-orange-800',
      iconContainer: 'bg-orange-100 text-orange-600',
    },
    lunch: {
      title: 'Lunch',
      icon: <FiCoffee className="h-6 w-6" />,
      colorClass: 'text-blue-600',
      bgColorClass: 'bg-blue-50 hover:bg-blue-100/70',
      borderColorClass: 'border-blue-100',
      btnClass: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-blue-100 text-white',
      badgeClass: 'bg-blue-100 text-blue-800',
      iconContainer: 'bg-blue-100 text-blue-600',
    },
    dinner: {
      title: 'Dinner',
      icon: <FiMoon className="h-6 w-6" />,
      colorClass: 'text-purple-600',
      bgColorClass: 'bg-purple-50 hover:bg-purple-100/70',
      borderColorClass: 'border-purple-100',
      btnClass: 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800 shadow-purple-100 text-white',
      badgeClass: 'bg-purple-100 text-purple-800',
      iconContainer: 'bg-purple-100 text-purple-600',
    },
  };

  const config = configs[mealType] || configs.breakfast;

  return (
    <div className={`flex flex-col bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-2xl hover:shadow-gray-100/80 transition-all duration-300`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-2xl ${config.iconContainer}`}>
            {config.icon}
          </div>
          <h3 className="font-bold text-gray-800 text-lg">{config.title}</h3>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${config.badgeClass}`}>
          Today Tracker
        </span>
      </div>

      {/* Counter Controls */}
      <div className="flex items-center justify-between my-auto py-2">
        <button
          type="button"
          onClick={onDecrement}
          disabled={count <= 0}
          aria-label={`Decrement ${config.title}`}
          className={`flex items-center justify-center h-14 w-14 rounded-2xl border-2 border-gray-100 bg-white text-gray-600 hover:bg-gray-50 active:bg-gray-100 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-all duration-150 shadow-sm`}
        >
          <FiMinus className="h-6 w-6" />
        </button>

        <span className="text-5xl font-black text-gray-900 tracking-tight min-w-[3rem] text-center">
          {count}
        </span>

        <button
          type="button"
          onClick={onIncrement}
          aria-label={`Increment ${config.title}`}
          className={`flex items-center justify-center h-14 w-14 rounded-2xl transition-all duration-150 shadow-lg ${config.btnClass}`}
        >
          <FiPlus className="h-6 w-6" />
        </button>
      </div>

      {/* Reset Row */}
      <div className="mt-8 border-t border-gray-50 pt-4 flex justify-end">
        <button
          type="button"
          onClick={onReset}
          className={`flex items-center space-x-2 text-xs font-semibold px-4 py-2.5 rounded-xl border border-transparent transition-all duration-150 ${config.bgColorClass} ${config.colorClass}`}
        >
          <FiRefreshCw className="h-3.5 w-3.5" />
          <span>Reset {config.title}</span>
        </button>
      </div>
    </div>
  );
};

export default MealCard;
