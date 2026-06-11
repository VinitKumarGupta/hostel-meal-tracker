import React from "react";
import { FiSun, FiCoffee, FiMoon } from "react-icons/fi";

export const UserCard = ({ user, isCurrentUser }) => {
    const { name = "Roommate", breakfast = 0, lunch = 0, dinner = 0 } = user;
    const totalMeals = breakfast + lunch + dinner;

    // Generate initials for avatar
    const getInitials = (str) => {
        return str
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    };

    // Determine avatar background gradient based on name string hash
    const getAvatarGradient = (str) => {
        const colors = [
            "from-indigo-400 to-blue-500",
            "from-emerald-400 to-teal-500",
            "from-orange-400 to-amber-500",
            "from-pink-400 to-rose-500",
            "from-purple-400 to-indigo-500",
            "from-cyan-400 to-blue-500",
        ];
        let sum = 0;
        for (let i = 0; i < str.length; i++) {
            sum += str.charCodeAt(i);
        }
        return colors[sum % colors.length];
    };

    return (
        <div
            className={`relative flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-white border transition-all duration-200 ${
                isCurrentUser
                    ? "border-indigo-200 bg-indigo-50/10 shadow-lg shadow-indigo-50/30 ring-1 ring-indigo-100"
                    : "border-gray-100 shadow-sm hover:border-gray-200"
            }`}
        >
            {/* User Info */}
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <div
                    className={`flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-br ${getAvatarGradient(name)} text-white font-bold text-sm shadow-md`}
                >
                    {getInitials(name)}
                </div>
                <div>
                    <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-gray-800 text-base leading-tight">
                            {name}
                        </h4>
                        {isCurrentUser && (
                            <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                You
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {totalMeals} total meals this week
                    </p>
                </div>
            </div>

            {/* Meal Breakdown Badges */}
            <div className="grid grid-cols-3 gap-3 sm:flex sm:items-center sm:space-x-4">
                {/* Breakfast */}
                <div className="flex flex-col sm:flex-row items-center sm:space-x-1.5 bg-orange-50/50 sm:bg-transparent rounded-xl p-2 sm:p-0 text-center sm:text-left">
                    <div className="p-1.5 rounded-lg bg-orange-50 text-orange-500 sm:inline-flex hidden">
                        <FiSun className="h-4 w-4" />
                    </div>
                    <div>
                        <div className="text-[10px] sm:hidden font-semibold text-orange-600">
                            Breakfast
                        </div>
                        <div className="text-sm font-bold text-gray-800">
                            {breakfast}{" "}
                            <span className="text-xs font-normal text-gray-400 sm:inline hidden">
                                breakfasts
                            </span>
                        </div>
                    </div>
                </div>

                {/* Lunch */}
                <div className="flex flex-col sm:flex-row items-center sm:space-x-1.5 bg-blue-50/50 sm:bg-transparent rounded-xl p-2 sm:p-0 text-center sm:text-left">
                    <div className="p-1.5 rounded-lg bg-blue-50 text-blue-500 sm:inline-flex hidden">
                        <FiCoffee className="h-4 w-4" />
                    </div>
                    <div>
                        <div className="text-[10px] sm:hidden font-semibold text-blue-600">
                            Lunch
                        </div>
                        <div className="text-sm font-bold text-gray-800">
                            {lunch}{" "}
                            <span className="text-xs font-normal text-gray-400 sm:inline hidden">
                                lunches
                            </span>
                        </div>
                    </div>
                </div>

                {/* Dinner */}
                <div className="flex flex-col sm:flex-row items-center sm:space-x-1.5 bg-purple-50/50 sm:bg-transparent rounded-xl p-2 sm:p-0 text-center sm:text-left">
                    <div className="p-1.5 rounded-lg bg-purple-50 text-purple-500 sm:inline-flex hidden">
                        <FiMoon className="h-4 w-4" />
                    </div>
                    <div>
                        <div className="text-[10px] sm:hidden font-semibold text-purple-600">
                            Dinner
                        </div>
                        <div className="text-sm font-bold text-gray-800">
                            {dinner}{" "}
                            <span className="text-xs font-normal text-gray-400 sm:inline hidden">
                                dinners
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserCard;
