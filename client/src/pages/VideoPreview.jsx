import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch {
        toast.error("Camera or microphone permission denied");
      }
    };

    startPreview();

    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const toggleMic = () => {
    streamRef.current?.getAudioTracks().forEach((t) => {
      t.enabled = !micOn;
    });
    setMicOn(!micOn);
  };

  const toggleCam = () => {
    streamRef.current?.getVideoTracks().forEach((t) => {
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
    <div className="
      min-h-screen
      bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900
      text-white
      flex items-center justify-center
      px-3 sm:px-6
      py-4
    ">
      <div
        className="
          w-full
          max-w-md
          sm:max-w-lg
          bg-white/5
          backdrop-blur-xl
          border border-white/10
          rounded-2xl
          shadow-2xl
          p-4 sm:p-6
          space-y-5
        "
      >
        <div className="text-center">
          <h2 className="text-lg sm:text-xl font-semibold">
            Ready to join?
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Check your camera and microphone
          </p>
        </div>

        <div className="
          relative
          rounded-xl
          overflow-hidden
          bg-black
          aspect-video
        ">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />

          {!camOn && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <p className="text-sm text-gray-300">
                Camera is off
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-6 sm:gap-8">
          <button
            onClick={toggleMic}
            className={`
              w-14 h-14 sm:w-12 sm:h-12
              rounded-full
              flex items-center justify-center
              transition
              ${
                micOn
                  ? "bg-white/10 hover:bg-white/20"
                  : "bg-red-600 hover:bg-red-700"
              }
            `}
          >
            {micOn ? <Mic size={22} /> : <MicOff size={22} />}
          </button>

          <button
            onClick={toggleCam}
            className={`
              w-14 h-14 sm:w-12 sm:h-12
              rounded-full
              flex items-center justify-center
              transition
              ${
                camOn
                  ? "bg-white/10 hover:bg-white/20"
                  : "bg-red-600 hover:bg-red-700"
              }
            `}
          >
            {camOn ? <Video size={22} /> : <VideoOff size={22} />}
          </button>
        </div>

        <button
          onClick={joinCall}
          className="
            w-full
            bg-blue-600 hover:bg-blue-700
            py-3
            rounded-xl
            font-medium
            text-sm
            transition
            shadow-lg
          "
        >
          Join Session
        </button>

        <p className="text-[11px] sm:text-xs text-center text-gray-400 px-2">
          By joining, your camera and microphone settings will be applied
        </p>
      </div>
    </div>
  );
};

export default VideoPreview;
