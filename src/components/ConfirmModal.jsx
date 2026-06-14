import { FiAlertTriangle } from 'react-icons/fi';

export const ConfirmModal = ({ isOpen, onClose, onConfirm, mealType, isGlobal = false }) => {
  if (!isOpen) return null;

  // Capitalize meal name
  const capitalizedMeal = mealType ? mealType.charAt(0).toUpperCase() + mealType.slice(1) : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-gray-100 transform transition-all scale-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-red-50 p-2.5 rounded-full text-red-500">
            <FiAlertTriangle className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-950">Confirm Reset</h3>
        </div>
        
        <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed">
          {isGlobal ? (
            <>
              Are you sure you want to <span className="font-semibold text-red-600">reset all meal counts</span> for all roommates? This will set everyone's counts to 0 and cannot be undone.
            </>
          ) : (
            <>
              Are you sure you want to reset your <span className="font-semibold text-gray-900">{capitalizedMeal}</span> count? This action cannot be undone.
            </>
          )}
        </p>
        
        <div className="flex space-x-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 sm:flex-none px-5 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 active:bg-gray-300 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 sm:flex-none px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 active:bg-red-800 transition-colors duration-150 shadow-md shadow-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
