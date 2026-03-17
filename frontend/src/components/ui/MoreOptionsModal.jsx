export default function MoreOptionsModal({ onClose, onDelete }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-80 rounded-lg p-4 text-center">
        <button
          onClick={onDelete}
          className="text-red-500 font-semibold block w-full py-2 border-b"
        >
          Delete
        </button>

        <button className="block w-full py-2 border-b">
          Report
        </button>

        <button onClick={onClose} className="block w-full py-2">
          Cancel
        </button>
      </div>
    </div>
  );
}