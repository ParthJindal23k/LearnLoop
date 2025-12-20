import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../socket";

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

    streamRef.current.getTracks().forEach(track => {
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
    <div className="h-screen bg-black flex flex-col items-center justify-center gap-4">
      <div className="flex gap-4">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          className="w-64 h-48 bg-gray-800 rounded"
        />
        <video
          ref={remoteVideoRef}
          autoPlay
          className="w-64 h-48 bg-gray-800 rounded"
        />
      </div>

      <button
        onClick={startCall}
        className="bg-blue-600 px-4 py-2 rounded text-white"
      >
        Start Call
      </button>
    </div>
  );
};

export default VideoRoom;
