import { AlertTriangle, Loader2 } from "lucide-react";

/**
 * A custom confirmation modal for delete actions.
 * @param {boolean} open - Whether the modal is open.
 * @param {function} onClose - Function to call when the modal should close.
 * @param {function} onConfirm - Function to call when the delete is confirmed.
 * @param {string} title - The title of the modal.
 * @param {string} message - The message body of the modal.
 * @param {boolean} isLoading - Whether the delete action is in progress.
 */
const ConfirmDeleteModal = ({ onClose, onConfirm, title, message, isLoading }) => {
    return (
        <div className="bg-[#1f1f1f] text-white p-6 rounded-lg max-w-md w-full border border-gray-700 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
                <div className="bg-red-900/30 p-3 rounded-full border border-red-500/50">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <div>
                    <h2 className="text-xl font-bold !text-white">{title || "Confirm Delete"}</h2>
                    <p className="text-gray-400 text-sm mt-1">{message || "Are you sure you want to delete this item? This action cannot be undone."}</p>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all duration-200 disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg shadow-red-900/20 disabled:opacity-50"
                >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isLoading ? "Deleting..." : "Delete Permanently"}
                </button>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;
