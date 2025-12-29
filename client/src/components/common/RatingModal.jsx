import { useState } from "react";

const RatingModal = ({ open, onClose, onSubmit, otherUser }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div
        className="
          bg-white
          rounded-xl
          w-full sm:w-96
          max-w-[420px]
          p-5 sm:p-6
          max-h-[90vh]
          overflow-y-auto
        "
      >
        <h2 className="text-lg sm:text-xl font-semibold mb-2">
          Rate {otherUser?.name}
        </h2>

        <p className="text-sm text-gray-500 mb-4">
          How was your session?
        </p>

        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              onClick={() => setRating(s)}
              className={`text-2xl sm:text-3xl transition ${
                rating >= s ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Optional feedback"
          className="
            w-full
            border
            rounded-lg
            p-2.5
            text-sm
            mb-4
            resize-none
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
          "
          rows={3}
        />

        <div className="flex justify-end gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="
              px-4 py-2
              text-sm
              text-gray-600
              hover:bg-gray-100
              rounded-lg
              transition
            "
          >
            Skip
          </button>

          <button
            disabled={rating === 0}
            onClick={() => onSubmit(rating, feedback)}
            className="
              px-4 py-2
              text-sm
              bg-blue-600
              text-white
              rounded-lg
              disabled:opacity-50
              transition
            "
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
