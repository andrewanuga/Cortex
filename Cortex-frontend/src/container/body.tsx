// src/container/body.tsx
import Context from "@/components/context";
import { HoverBorderGradient } from "../components/ui/hover-border-gradient";
import { Recent } from "@/components/Recent";
import { RefreshCcwDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import Loader from "@/components/loader";
import TypingEffect from "@/components/typing-effect";
import CreateElemt from '../components/createElemt';
import type { Dispatch, SetStateAction } from "react";
import React, { useRef, useEffect } from "react";
// import type { Media } from "@/App";

// ---------- React Flow ----------
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  Node,
  Edge,
} from "reactflow";
import "reactflow/dist/style.css";
// ---------------------------------

// ---------- Types ----------
interface ButtonState {
  state: boolean;
  key: string;
  icon: React.ReactNode;
  text: string;
}

interface Media {
  type: "image" | "video" | "graph";
  url?: string;               // image / video
  data?: { nodes: Node[]; edges: Edge[] }; // graph
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  media?: Media[];
}
interface Messagees {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  media?: Media[];
}

interface BodyProps {
  buttonStates: ButtonState[];
  handleButtonClick: (index: number) => void;
  activeCount: number;
  maxSelection: number;
  chat: boolean;
  setChat: Dispatch<SetStateAction<boolean>>;
  loader: boolean;
  aiLoader: boolean;
  userPrompt: string;
  chatHistory: Messagees[];
  setChatHistory: Dispatch<SetStateAction<Message[]>>;
}
// ---------------------------

const Body: React.FC<BodyProps> = ({
  buttonStates,
  handleButtonClick,
  activeCount,
  maxSelection,
  chat,
  setChat,
  loader,
  aiLoader,
  userPrompt,
  chatHistory,
  setChatHistory,
}) => {
  // ---------- Helpers ----------
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleRefresh = () => {
    setChatHistory([]);
    setChat(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  // ----------------------------

  return (
    <div className="w-[95%] h-[70%] gap-1 mb-3 flex flex-wrap justify-start items-start mt-2 px-2 mx-2 p-1 glass-dark bg-black/10 backdrop-blur-lg rounded-xl">
      {/* ------------------- CHAT MODE ------------------- */}
      {chat ? (
        <>
          <Button
            variant="outline"
            size="icon-lg"
            className="flex w-auto h-auto p-2 mt-1 cursor-pointer"
            onClick={handleRefresh}
          >
            <span>Refresh </span>
            <RefreshCcwDot />
          </Button>

          <div className="w-full h-[78%] webkit-green mb-3 mt-2 px-2 mx-2 p-1 glass-dark bg-black/10 backdrop-blur-lg rounded-xl overflow-y-auto">
            <div className="flex flex-col gap-4 py-4">
              {/* ---- CHAT HISTORY ---- */}
              {chatHistory.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? "justify-end" : "justify-start"} mb-3`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.isUser
                        ? "bg-gradient-to-r from-indigo-600/50 to-violet-600/70 text-white"
                        : "bg-slate-800/50 text-white"
                    }`}
                  >
                    {/* Text */}
                    <div className="text-sm whitespace-pre-wrap">{message.text}</div>

                    {/* Media */}
                    {message.media?.map((m, i) => (
                      <div key={i} className="mt-2">
                        {m.type === "image" ? (
                          <img
                            src={m.url}
                            alt="AI generated"
                            className="max-w-full rounded-md shadow-sm"
                          />
                        ) : m.type === "video" ? (
                          <video controls className="max-w-full rounded-md shadow-sm">
                            <source src={m.url} type="video/mp4" />
                            Your browser does not support video.
                          </video>
                        ) : m.type === "graph" ? (
                          <GraphViewer data={m.data!} />
                        ) : null}
                      </div>
                    ))}

                    {/* Timestamp */}
                    <div
                      className={`text-xs mt-1 ${message.isUser ? "text-indigo-200" : "text-slate-400"} text-right`}
                    >
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}

              {/* ---- TYPING USER PROMPT (if not yet in history) ---- */}
              {userPrompt &&
                !chatHistory.some((m) => m.text === userPrompt && m.isUser) && (
                  <div className="flex justify-end mb-3">
                    <div className="bg-gradient-to-r from-indigo-600/50 to-violet-600/70 max-w-[80%] px-4 py-2 rounded-lg text-white">
                      <div className="text-sm whitespace-pre-wrap">
                        <CreateElemt prompt={userPrompt} />
                      </div>
                      <div className="text-xs mt-1 text-indigo-200 text-right">
                        {formatTime(new Date())}
                      </div>
                    </div>
                  </div>
                )}

              {/* ---- AI LOADER ---- */}
              {aiLoader && (
                <div className="flex justify-start">
                  <div className="">
                    <Loader />
                  </div>
                </div>
              )}

              {/* ---- AI RESPONSE (typing effect) ---- */}
              {loader === false &&
                chatHistory.length > 0 &&
                chatHistory[chatHistory.length - 1].isUser === false && (
                  <div className="flex justify-start">
                    <TypingEffect
                      text={chatHistory[chatHistory.length - 1].text}
                      speed={20}
                      startDelay={100}
                      showCopyButton={true}
                      onCopy={handleCopy}
                      className="bg-slate-800/50 text-white px-4 py-2 rounded-lg max-w-[80%]"
                    />
                  </div>
                )}
            </div>
          </div>
        </>
      ) : (
        /* ------------------- NON-CHAT MODE ------------------- */
        <>
          <Recent />
          <HoverBorderGradient
            containerClassName="rounded-sm h-auto"
            as="div"
            className="flex-wrap flex items-center space-x-2 glass-dark backdrop-blur-lg"
          >
            <div className="my-2 flex gap-2 items-center font-light">
              <span className="w-auto h-auto m-2 text-black bg-white rounded-full px-2 shadow shadow-emerald-600">
                Easy Access
              </span>
              <span className="text-xs text-white/70">
                ({activeCount}/{maxSelection} selected)
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {buttonStates.map((item, index) => (
                <Context
                  key={item.key}
                  index={index}
                  state={item.state}
                  icon={item.icon}
                  text={item.text}
                  btntext={item.key}
                  buttonclicked={handleButtonClick}
                  disabled={!item.state && activeCount >= maxSelection}
                />
              ))}
            </div>
          </HoverBorderGradient>
        </>
      )}
    </div>
  );
};

/* -----------------------------------------------------------------
   GraphViewer – renders the knowledge graph inside a chat bubble
   ----------------------------------------------------------------- */
const GraphViewer = ({ data }: { data: { nodes: Node[]; edges: Edge[] } }) => {
  const { fitView } = useReactFlow();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Auto-fit once the component mounts / data changes
  useEffect(() => {
    const timer = setTimeout(() => fitView({ padding: 0.2, duration: 300 }), 50);
    return () => clearTimeout(timer);
  }, [fitView, data]);

  return (
    <div
      ref={wrapperRef}
      className="h-64 bg-black/50 rounded-md overflow-hidden border border-white/10"
    >
      <ReactFlow
        nodes={data.nodes}
        edges={data.edges}
        fitView
        minZoom={0.3}
        maxZoom={2}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default Body;