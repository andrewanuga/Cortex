/// <reference types="chrome" />
import { GoogleGenAI } from "@google/genai"; // adjust if you use @google/generative-ai
import { ThemeProvider } from "@/components/theme-provider";
import Header from "./components/header";
import Body from "./container/body";
import Footer from "./components/Footer";
import { useState, useMemo, useCallback } from "react";
import {
  // Code,
  Eraser,
  FastForward,
  Image,
  Languages,
  Pen,
  SearchCheck,
  VideoIcon,
} from "lucide-react";
// import type { Media } from "@/App";

// ---------- React Flow types ----------
import type { Node, Edge } from "reactflow";
// -------------------------------------

interface ButtonState {
  state: boolean;
  key: string;
  icon: React.ReactElement;
  text: string;
}

// Unified Media type (used in App & Body)
export interface Media {
  type: "image" | "video" | "graph";
  url?: string; // image / video
  data?: { nodes: Node[]; edges: Edge[] }; // graph
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  media?: Media[];
}

/* ---------- Research types ---------- */
interface TabContent {
  title: string;
  url: string;
  text: string;
}
interface Summary {
  num: number;
  title: string;
  url: string;
  summary: string;
}
interface GraphNode {
  id: string;
  label: string;
  type: string;
}
interface GraphEdge {
  source: string;
  target: string;
  label: string;
}
interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

/* ---------- Tab extraction script ---------- */
const extractTextCode = `
  () => {
    const selectors = 'p, h1, h2, h3, h4, h5, h6, article, [role="main"], li';
    const texts = Array.from(document.querySelectorAll(selectors))
      .slice(0, 30)
      .map(el => el.textContent?.trim())
      .filter(Boolean)
      .join('\\n\\n');
    return {
      title: document.title.slice(0, 100),
      url: window.location.href,
      text: texts.slice(0, 4000)
    };
  }
`;

const App = () => {
  const [userPrompt, setUserPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiLoader, setAiLoader] = useState(false);
  const [chat, setChat] = useState(false);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [features, setFeatures] = useState({
    summarize: false,
    translate: false,
    write: false,
    images: false,
    video: false,
    simplify: false,
    code: false,
    research: false,
  });

  const buttonStates = useMemo(
    (): ButtonState[] => [
      {
        state: features.summarize,
        key: "summarize",
        icon: <FastForward className="w-5 h-5" />,
        text: "Summarize with AI",
      },
      {
        state: features.translate,
        key: "translate",
        icon: <Languages className="w-5 h-5" />,
        text: "Translate with AI",
      },
      {
        state: features.write,
        key: "write",
        icon: <Pen className="w-5 h-5" />,
        text: "Write content with AI",
      },
      {
        state: features.images,
        key: "images",
        icon: <Image className="w-5 h-5" />,
        text: "Generate Images with AI",
      },
      {
        state: features.video,
        key: "video",
        icon: <VideoIcon className="w-5 h-5" />,
        text: "Generate Video with AI",
      },
      {
        state: features.simplify,
        key: "simplify",
        icon: <Eraser className="w-5 h-5" />,
        text: "Simplify with AI",
      },
      // {
      //   state: features.code,
      //   key: "code",
      //   icon: <Code className="w-5 h-5" />,
      //   text: "Code with AI",
      // },
      {
        state: features.research,
        key: "research",
        icon: <SearchCheck className="w-5 h-5" />,
        text: "Research with AI",
      },
    ],
    [features]
  );

  const activeCount = buttonStates.filter((s) => s.state).length;
  const maxSelection = 3;

  const toggleFeature = (key: string) => {
    const cur = features[key as keyof typeof features];
    if (!cur && activeCount >= maxSelection) return;
    setFeatures((p) => ({ ...p, [key]: !cur }));
  };

  /* ---------- Load open tabs ---------- */
  const loadTabs = useCallback(async (): Promise<TabContent[]> => {
    const tabs = await chrome.tabs.query({
      currentWindow: true,
      url: ["http://*/*", "https://*/*"],
    });

    const results = await Promise.all(
      tabs.map(async (tab): Promise<TabContent | null> => {
        try {
          const [{ result }] = await chrome.scripting.executeScript({
            target: { tabId: tab.id! },
            func: eval(extractTextCode) as () => TabContent,
          });
          return result as TabContent;
        } catch {
          return null;
        }
      })
    );
    return results.filter(Boolean) as TabContent[];
  }, []);

  /* ---------- Main send handler ---------- */
  const send = useCallback(
    async (prompt: string) => {
      if (!prompt.trim()) return;

      setIsLoading(true);
      setAiLoader(true);
      setChat(true);

      const userMsg: Message = {
        id: Date.now().toString(),
        text: prompt,
        isUser: true,
        timestamp: new Date(),
      };
      setChatHistory((p) => [...p, userMsg]);

      const ai = new GoogleGenAI({
        apiKey: "YOUR_API_KEY_HERE", // <-- replace or load from chrome.storage
      });
      const media: Media[] = [];

      try {
        /* ---------- RESEARCH ---------- */
        let synthesis = "";
        let graphData: GraphData | null = null;

        if (features.research) {
          const tabsContent = await loadTabs();

          if (tabsContent.length === 0) {
            synthesis = "No open tabs found for research.";
          } else {
            // Summaries (parallel)
            const summaries: Summary[] = await Promise.all(
              tabsContent.slice(0, 10).map(async (tab, i) => {
                const resp = await ai.models.generateContent({
                  model: "gemini-2.5-flash",
                  contents: `Summarize key points in 150-200 words:\nTitle: ${tab.title}\n\n${tab.text}`,
                });
                return {
                  num: i + 1,
                  title: tab.title,
                  url: tab.url,
                  summary: resp.text ?? "",
                };
              })
            );

            // Synthesis
            const synthPrompt = `
**User Prompt:** ${prompt}

**Tabs (${summaries.length}):**
${summaries
  .map(
    (s) => `[${s.num}] ${s.title}\n${s.url}\n\n${s.summary}\n\n`
  )
  .join("")}

**Task:** Synthesize key arguments. Identify **consensus** & **conflicts**. Draft a 300-500 word introduction with inline citations [1], [2], etc.`;

            const synthResp = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: synthPrompt,
            });
            synthesis = synthResp.text ?? "";

            // Knowledge graph
            const graphPrompt = `
Extract a **connected knowledge graph** (max 20 nodes) as JSON.
Relevant to "${prompt}".

{
  "nodes": [{"id":"str","label":"short","type":"argument|concept|entity"}],
  "edges": [{"source":"id","target":"id","label":"supports|contradicts|part_of|related"}]
}

**Summaries:**
${summaries
  .map((s) => `[${s.num}] ${s.summary.slice(0, 1000)}`)
  .join("\n\n")}

Output **only** valid JSON.`;

            const graphResp = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: graphPrompt,
            });
            const raw = (graphResp.text ?? "{}")
              .replace(/```json|```/g, "")
              .trim();
            graphData = JSON.parse(raw) as GraphData | null;

            // Position nodes only if graphData is valid
            if (graphData && Array.isArray(graphData.nodes) && Array.isArray(graphData.edges)) {
              const nodes = graphData.nodes.map((node: GraphNode, i: number) => ({
                ...node,
                position: {
                  x: Math.cos(i / 5) * 200 + Math.random() * 100,
                  y: Math.sin(i / 5) * 200 + Math.random() * 100,
                },
                data: { label: node.label },
              })) as Node[];

              media.push({
                type: "graph",
                data: { nodes, edges: graphData.edges as Edge[] },
              });
            }
          }
        }

        /* ---------- IMAGES ---------- */
        if (features.images) {
          const resp = await ai.models.generateImages({
            model: "imagen-4.0-generate-001",
            prompt,
            config: { numberOfImages: 4 },
          });

          for (const img of resp.generatedImages ?? []) {
            const b64 = img?.image?.imageBytes;
            if (!b64) continue;
            const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
            const url = URL.createObjectURL(
              new Blob([bytes], { type: "image/png" })
            );
            media.push({ type: "image", url });
          }
        }

        /* ---------- VIDEO ---------- */
        if (features.video) {
          // The real Google lib returns a URL or base64; adapt as needed
          // Below is a placeholder – replace with actual response handling
          // const op = await ai.models.generateVideos({
          //   model: "veo-3.1-generate-preview",
          //   prompt,
          // });
          // polling loop omitted for brevity – use your existing code
          // Assume final result gives a URL or base64
          const videoUrl = "https://example.com/generated.mp4"; // <-- replace
          if (videoUrl) media.push({ type: "video", url: videoUrl });
        }

        /* ---------- TEXT RESPONSE ---------- */
        let aiText = synthesis;
        if (!features.research) {
          const txtResp = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
          });
          aiText = txtResp.text ?? "";
        }

        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          text: aiText,
          isUser: false,
          timestamp: new Date(),
          media: media.length ? media : undefined,
        };
        setChatHistory((p) => [...p, aiMsg]);
      } catch (e) {
        console.error(e);
        const err: Message = {
          id: (Date.now() + 1).toString(),
          text: "Error – check console.",
          isUser: false,
          timestamp: new Date(),
        };
        setChatHistory((p) => [...p, err]);
      } finally {
        setIsLoading(false);
        setAiLoader(false);
        setUserPrompt("");
      }
    },
    [features, loadTabs]
  );

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="w-full h-dvh flex justify-center poppins items-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <div
          className="charcoal-bg h-full flex flex-wrap justify-start items-start shadow shadow-indigo-100 rounded-md"
          style={{ width: "400px", minHeight: "300px" }}
        >
          <Header />
          <Body
            buttonStates={buttonStates}
            handleButtonClick={(i) => toggleFeature(buttonStates[i].key)}
            activeCount={activeCount}
            maxSelection={maxSelection}
            chat={chat}
            setChat={setChat}
            loader={isLoading}
            aiLoader={aiLoader}
            userPrompt={userPrompt}
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
          />
          <Footer
            buttonStates={buttonStates}
            prompt={userPrompt}
            setUserPrompt={setUserPrompt}
            isLoading={isLoading}
            setChat={setChat}
            send={send}
            features={features}
          />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;