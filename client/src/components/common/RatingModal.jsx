import { useState } from "react";

const RatingModal = ({ open, onClose, onSubmit, otherUser }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-96 p-6">
        <h2 className="text-xl font-semibold mb-2">
          Rate {otherUser?.name}
        </h2>

        <p className="text-sm text-gray-500 mb-4">
          How was your session?
        </p>

        {/* ⭐ Stars */}
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              onClick={() => setRating(s)}
              className={`text-2xl ${
                rating >= s ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              ★
            </button>
          ))}
        </div>

        {/* Feedback */}
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Optional feedback"
          className="w-full border rounded p-2 mb-4"
        />

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            Skip
          </button>

          <button
            disabled={rating === 0}
            onClick={() => onSubmit(rating, feedback)}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
