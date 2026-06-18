import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import {
    incrementMeal,
    decrementMeal,
    resetMeal,
    subscribeToRoommates,
    resetAllRoommateMeals,
    subscribeToUserLogs,
    subscribeToActiveNotices,
    addNotice,
    deleteNotice,
} from "../services/mealService";
import MealCard from "../components/MealCard";
import UserCard from "../components/UserCard";
import StatsCard from "../components/StatsCard";
import ConfirmModal from "../components/ConfirmModal";
import { FiLogOut, FiUser, FiInfo, FiLoader, FiRefreshCw, FiVolume2, FiTrash2 } from "react-icons/fi";

export const Dashboard = () => {
    const { currentUser, logout } = useAuth();

    // Roommates & UI state
    const [roommates, setRoommates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null); // { message: string, type: 'success' | 'error' }
    const [myLogs, setMyLogs] = useState([]);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMealType, setModalMealType] = useState(null);
    const [isGlobalModalOpen, setIsGlobalModalOpen] = useState(false);

    // Notice board state
    const [notices, setNotices] = useState([]);
    const [noticeInput, setNoticeInput] = useState("");
    const [noticeLoading, setNoticeLoading] = useState(false);

    // Helper to trigger toasts
    const triggerToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => {
            setToast(null);
        }, 3000);
    };

    // Subscribe to roommates updates in real time
    useEffect(() => {
        const unsubscribe = subscribeToRoommates((data) => {
            setRoommates(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Subscribe to current user's logs in real time
    useEffect(() => {
        if (!currentUser?.uid) return;
        const unsubscribeLogs = subscribeToUserLogs(currentUser.uid, (data) => {
            setMyLogs(data);
        });

        return () => unsubscribeLogs();
    }, [currentUser]);

    // Subscribe to active notice in real time
    useEffect(() => {
        const unsubscribe = subscribeToActiveNotices((data) => {
            setNotices(data);
        });

        return () => unsubscribe();
    }, []);

    // Find current user's profile record in roommates array
    const myProfile = roommates.find((r) => r.uid === currentUser?.uid) || {
        name: currentUser?.displayName || "You",
        breakfast: 0,
        lunch: 0,
        dinner: 0,
    };

    // Meal action handlers
    const handleIncrement = async (mealType) => {
        try {
            await incrementMeal(currentUser.uid, mealType);
            triggerToast("Count Updated", "success");
        } catch (err) {
            console.error(err);
            triggerToast(err.message || "Update failed", "error");
        }
    };

    const handleDecrement = async (mealType) => {
        try {
            await decrementMeal(currentUser.uid, mealType);
            triggerToast("Count Updated", "success");
        } catch (err) {
            console.error(err);
            triggerToast(err.message || "Count cannot go below 0", "error");
        }
    };

    const handleOpenResetModal = (mealType) => {
        setModalMealType(mealType);
        setIsModalOpen(true);
    };

    const handleConfirmReset = async () => {
        setIsModalOpen(false);
        if (!modalMealType) return;

        try {
            await resetMeal(currentUser.uid, modalMealType);
            triggerToast("Count Reset", "success");
        } catch (err) {
            console.error(err);
            triggerToast("Reset failed", "error");
        } finally {
            setModalMealType(null);
        }
    };

    const handleOpenGlobalResetModal = () => {
        setIsGlobalModalOpen(true);
    };

    const handleConfirmGlobalReset = async () => {
        setIsGlobalModalOpen(false);
        try {
            await resetAllRoommateMeals(roommates);
            triggerToast("All Meal Counts Reset", "success");
        } catch (err) {
            console.error(err);
            triggerToast("Global reset failed", "error");
        }
    };

    const handlePublishNotice = async (e) => {
        e.preventDefault();
        if (!noticeInput.trim()) return;
        setNoticeLoading(true);
        try {
            await addNotice(noticeInput);
            setNoticeInput("");
            triggerToast("Notice Published Successfully", "success");
        } catch (err) {
            console.error(err);
            triggerToast("Failed to publish notice", "error");
        } finally {
            setNoticeLoading(false);
        }
    };

    const handleDeleteNotice = async (noticeId) => {
        try {
            await deleteNotice(noticeId);
            triggerToast("Notice Deleted Successfully", "success");
        } catch (err) {
            console.error(err);
            triggerToast("Failed to delete notice", "error");
        }
    };

    // Logout handler
    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.error("Logout error: ", err);
            triggerToast("Logout Failed", "error");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center space-y-4">
                    <FiLoader className="animate-spin h-10 w-10 text-indigo-600" />
                    <p className="text-gray-500 font-medium">
                        Syncing meal tracker database...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 pb-16 relative">
            {/* Toast Notification Banner */}
            {toast && (
                <div
                    className={`fixed top-5 right-5 z-50 flex items-center space-x-2 px-5 py-3.5 rounded-2xl shadow-xl border animate-in fade-in slide-in-from-top-4 duration-300 ${
                        toast.type === "error"
                            ? "bg-red-50 text-red-800 border-red-100"
                            : "bg-emerald-50 text-emerald-800 border-emerald-100"
                    }`}
                >
                    <FiInfo className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm font-semibold">
                        {toast.message}
                    </span>
                </div>
            )}

            {/* Reset Confirmation Dialog */}
            <ConfirmModal
                isOpen={isModalOpen}
                mealType={modalMealType}
                onClose={() => {
                    setIsModalOpen(false);
                    setModalMealType(null);
                }}
                onConfirm={handleConfirmReset}
            />

            {/* Global Admin Reset Confirmation Dialog */}
            <ConfirmModal
                isOpen={isGlobalModalOpen}
                isGlobal={true}
                onClose={() => {
                    setIsGlobalModalOpen(false);
                }}
                onConfirm={handleConfirmGlobalReset}
            />

            {/* Header Bar */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-sm shadow-md shadow-indigo-200">
                            HM
                        </div>
                        <span className="font-extrabold text-gray-900 tracking-tight text-lg sm:text-xl">
                            Hostel Meal Tracker
                        </span>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">
                            <FiUser className="h-3.5 w-3.5" />
                            <span>{myProfile.name}</span>
                        </div>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex items-center space-x-1.5 px-3 sm:px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 text-xs font-bold rounded-xl transition-colors duration-150"
                        >
                            <FiLogOut className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Dashboard Main Workspace */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-10">
                {/* Notice Board Section */}
                <section aria-label="Notice Board" className="space-y-4 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center space-x-1.5">
                            <FiVolume2 className="h-3.5 w-3.5 text-amber-500" />
                            <span>Notice Board</span>
                        </h2>
                        <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-amber-100">
                            Real-Time
                        </span>
                    </div>
                    
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-100/40 space-y-4">
                        {notices.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <div className="p-3 rounded-2xl bg-amber-50 text-amber-500 mb-2">
                                    <FiVolume2 className="h-5 w-5" />
                                </div>
                                <p className="text-sm text-gray-400 font-medium">No announcements active at the moment.</p>
                            </div>
                        ) : (
                            <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                                {notices.map((notice) => {
                                    const date = notice.createdAt ? new Date(notice.createdAt.seconds * 1000) : new Date();
                                    const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                                    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                    return (
                                        <div 
                                            key={notice.id} 
                                            className="flex items-start justify-between p-4 bg-amber-50/40 border border-amber-100/30 rounded-2xl hover:bg-amber-50/60 transition-all duration-100"
                                        >
                                            <div className="flex items-start space-x-3.5">
                                                <div className="p-2.5 rounded-xl bg-amber-100 text-amber-600 flex-shrink-0 mt-0.5">
                                                    <FiVolume2 className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800 whitespace-pre-wrap leading-relaxed">{notice.text}</p>
                                                    <span className="text-[10px] font-bold text-gray-400 mt-1.5 block">
                                                        Posted on {dateStr} at {timeStr}
                                                    </span>
                                                </div>
                                            </div>
                                            {myProfile.isAdmin && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteNotice(notice.id)}
                                                    title="Delete Announcement"
                                                    className="p-2 rounded-lg bg-amber-100/50 hover:bg-red-50 text-amber-600 hover:text-red-600 transition-all duration-150 flex-shrink-0"
                                                >
                                                    <FiTrash2 className="h-3.5 w-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>

                {/* Top summary cards */}
                <section aria-label="Overview stats" className="space-y-4">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Analytics Dashboard
                    </h2>
                    <StatsCard roommates={roommates} logs={myLogs} />
                </section>

                {/* Admin Controls Panel */}
                {myProfile.isAdmin && (
                    <section
                        aria-label="Admin controls"
                        className="bg-red-50/40 border border-red-100/60 rounded-3xl p-6 shadow-xl shadow-red-50/10 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300"
                    >
                        <div>
                            <h3 className="text-xs font-bold text-red-900 uppercase tracking-wider flex items-center space-x-1.5 mb-1.5">
                                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                                <span>Admin Panel</span>
                            </h3>
                            <p className="text-xs text-red-600/80 font-medium">
                                Manage announcements and perform global system resets.
                            </p>
                        </div>

                        {/* Announcement Creator */}
                        <div className="pt-4 border-t border-red-100/50 space-y-3">
                            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Notice Board Announcement</h4>
                            <form onSubmit={handlePublishNotice} className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="text"
                                    placeholder="Type announcement notice..."
                                    disabled={noticeLoading}
                                    value={noticeInput}
                                    onChange={(e) => setNoticeInput(e.target.value)}
                                    className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 text-sm text-gray-800 disabled:bg-gray-100 disabled:text-gray-400 font-medium transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={noticeLoading || !noticeInput.trim()}
                                    className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-gray-300 text-white text-xs font-bold rounded-xl shadow-lg hover:shadow-indigo-200/50 transition-all duration-150 disabled:shadow-none focus:outline-none"
                                >
                                    {noticeLoading ? 'Publishing...' : 'Publish Notice'}
                                </button>
                            </form>
                        </div>

                        {/* Database Controls */}
                        <div className="pt-4 border-t border-red-100/50 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                            <div>
                                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Reset Database</h4>
                                <p className="text-[11px] text-gray-400 mt-0.5">
                                    Resets breakfast, lunch, dinner, and logs for all registered roommates.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handleOpenGlobalResetModal}
                                className="flex items-center justify-center space-x-2 px-5 py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-200/50 hover:shadow-red-300/50 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                <FiRefreshCw className="h-3.5 w-3.5" />
                                <span>Reset All Meal Counts</span>
                            </button>
                        </div>
                    </section>
                )}

                {/* User Counter cards */}
                <section aria-label="Personal meal counts" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Your Meal Counter
                        </h2>
                        <span className="text-xs font-semibold text-indigo-600">
                            {myProfile.name}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <MealCard
                            mealType="breakfast"
                            count={myProfile.breakfast}
                            onIncrement={() => handleIncrement("breakfast")}
                            onDecrement={() => handleDecrement("breakfast")}
                            onReset={() => handleOpenResetModal("breakfast")}
                        />
                        <MealCard
                            mealType="lunch"
                            count={myProfile.lunch}
                            onIncrement={() => handleIncrement("lunch")}
                            onDecrement={() => handleDecrement("lunch")}
                            onReset={() => handleOpenResetModal("lunch")}
                        />
                        <MealCard
                            mealType="dinner"
                            count={myProfile.dinner}
                            onIncrement={() => handleIncrement("dinner")}
                            onDecrement={() => handleDecrement("dinner")}
                            onReset={() => handleOpenResetModal("dinner")}
                        />
                    </div>
                </section>

                {/* Global roommates feed */}
                <section aria-label="All roommates list" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            All Roommates Details
                        </h2>
                    </div>

                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-100/50 space-y-4">
                        {roommates.length === 0 ? (
                            <p className="text-center text-sm text-gray-400 py-6 font-medium">
                                No roommates registered yet.
                            </p>
                        ) : (
                            roommates.map((roommate) => (
                                <UserCard
                                    key={roommate.id}
                                    user={roommate}
                                    isCurrentUser={
                                        roommate.uid === currentUser?.uid
                                    }
                                />
                            ))
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;
