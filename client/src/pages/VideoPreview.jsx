import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const VideoPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  useEffect(() => {
    const startPreview = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        streamRef.current = stream;
        videoRef.current.srcObject = stream;
      } catch (err) {
        alert("Camera or microphone permission denied");
      }
    };

    startPreview();

    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const toggleMic = () => {
    streamRef.current.getAudioTracks().forEach((t) => {
      t.enabled = !micOn;
    });
    setMicOn(!micOn);
  };

  const toggleCam = () => {
    streamRef.current.getVideoTracks().forEach((t) => {
      t.enabled = !camOn;
    });
    setCamOn(!camOn);
  };

  const joinCall = () => {
    navigate(`/video/${id}`, {
      state: { micOn, camOn },
    });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">
      <div className="w-[420px] bg-[#020617] rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-center">
          Ready to join?
        </h2>

        {/* Video Preview */}
        <div className="bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-56 object-cover"
          />
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <button
            onClick={toggleMic}
            className={`px-4 py-2 rounded ${
              micOn ? "bg-gray-700" : "bg-red-600"
            }`}
          >
            {micOn ? "Mic On" : "Mic Off"}
          </button>

          <button
            onClick={toggleCam}
            className={`px-4 py-2 rounded ${
              camOn ? "bg-gray-700" : "bg-red-600"
            }`}
          >
            {camOn ? "Cam On" : "Cam Off"}
          </button>
        </div>

        {/* Join */}
        <button
          onClick={joinCall}
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg"
        >
          Join now
        </button>
      </div>
    </div>
  );
};

export default VideoPreview;
