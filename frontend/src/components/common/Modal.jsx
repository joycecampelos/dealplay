import { X } from "lucide-react";

export default function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-start bg-black/50 overflow-y-auto">
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-6xl p-6 relative animate-fade-in mt-20 mb-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        {title && (
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pr-6">
            {title}
          </h2>
        )}

        <div className="max-h-[80vh] overflow-y-auto pr-2">
          {children}
        </div>
      </div>
    </div>
  );
}
