import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../socket";
import { PhoneOff, Mic, Video } from "lucide-react";

const VideoRoom = () => {
  const { id } = useParams(); // sessionId

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    startCamera();

    socket.emit("join-video-room", id);

    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleIceCandidate);

    return () => {
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
    };
  }, []);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localVideoRef.current.srcObject = stream;
    streamRef.current = stream;
  };

  const createPeer = () => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    streamRef.current.getTracks().forEach((track) => {
      peer.addTrack(track, streamRef.current);
    });

    peer.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          candidate: event.candidate,
          roomId: id,
        });
      }
    };

    peerRef.current = peer;
    return peer;
  };

  const handleOffer = async ({ offer }) => {
    const peer = createPeer();
    await peer.setRemoteDescription(offer);

    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    socket.emit("answer", { answer, roomId: id });
  };

  const handleAnswer = async ({ answer }) => {
    await peerRef.current.setRemoteDescription(answer);
  };

  const handleIceCandidate = async ({ candidate }) => {
    try {
      await peerRef.current.addIceCandidate(candidate);
    } catch {}
  };

  const startCall = async () => {
    const peer = createPeer();
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    socket.emit("offer", { offer, roomId: id });
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* REMOTE VIDEO (MAIN) */}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover bg-black"
      />

      {/* LOCAL VIDEO (PIP) */}
      <div className="absolute bottom-24 right-6 w-56 h-40 rounded-xl overflow-hidden border border-white/20 shadow-lg">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover bg-black"
        />
      </div>

      {/* TOP INFO BAR */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full text-sm text-white shadow">
        Session ID: {id}
      </div>

      {/* BOTTOM CONTROLS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-black/50 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl">
        <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
          <Mic size={20} />
        </button>

        <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
          <Video size={20} />
        </button>

        <button
          onClick={startCall}
          className="w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 flex items-center justify-center"
        >
          <span className="text-sm font-semibold">Call</span>
        </button>

        <button className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center">
          <PhoneOff size={20} />
        </button>
      </div>
    </div>
  );
};

export default VideoRoom;
