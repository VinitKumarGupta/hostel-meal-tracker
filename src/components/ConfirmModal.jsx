import { useState } from "react";
import { FiAlertTriangle } from "react-icons/fi";

export const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    mealType,
    isGlobal = false,
}) => {
    const [confirmText, setConfirmText] = useState("");

    if (!isOpen) return null;

    const handleClose = () => {
        setConfirmText("");
        onClose();
    };

    const handleConfirm = () => {
        setConfirmText("");
        onConfirm();
    };

    // Capitalize meal name
    const capitalizedMeal = mealType
        ? mealType.charAt(0).toUpperCase() + mealType.slice(1)
        : "";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={handleClose}
            />

            {/* Modal Card */}
            <div className="relative bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-gray-100 transform transition-all scale-100 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-red-50 p-2.5 rounded-full text-red-500">
                        <FiAlertTriangle className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-950">
                        {mealType === 'logs' ? 'Clear Activity Logs' : 'Confirm Reset'}
                    </h3>
                </div>

                <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed">
                    {isGlobal ? (
                        <>
                            Are you sure you want to{" "}
                            <span className="font-semibold text-red-600">
                                reset all meal counts
                            </span>{" "}
                            for all roommates? This will set everyone's counts
                            to 0. This action cannot be undone.
                        </>
                    ) : mealType === 'logs' ? (
                        <>
                            Are you sure you want to{" "}
                            <span className="font-semibold text-red-600">
                                clear all your activity logs
                            </span>? This action cannot be undone.
                        </>
                    ) : (
                        <>
                            Are you sure you want to reset your{" "}
                            <span className="font-semibold text-gray-900">
                                {capitalizedMeal}
                            </span>{" "}
                            count? This action cannot be undone.
                        </>
                    )}
                </p>

                {isGlobal && (
                    <div className="mb-6 space-y-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Type{" "}
                            <span className="text-red-600 font-extrabold">
                                BILL PAID
                            </span>{" "}
                            to confirm
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 text-sm text-gray-800 font-semibold transition-all duration-200 placeholder:text-gray-400"
                            placeholder="Enter confirmation text..."
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                        />
                    </div>
                )}

                <div className="flex space-x-3 justify-end">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="flex-1 sm:flex-none px-5 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 active:bg-gray-300 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={
                            isGlobal && confirmText.trim() !== "BILL PAID"
                        }
                        className="flex-1 sm:flex-none px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 active:bg-red-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-150 shadow-md shadow-red-200 disabled:shadow-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
