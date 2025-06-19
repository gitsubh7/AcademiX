// src/components/Dialog.jsx
export default function Dialog({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        {children}
        <div className="text-right mt-6">
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
