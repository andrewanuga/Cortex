import { useState } from 'react';
import { X, Maximize2 } from 'lucide-react';

const ButtonRevealApp = () => {
  // Your existing state variables
  const [showSummarize, setShowSummarize] = useState(false);
  const [showTranslate, setShowTranslate] = useState(false);
  const [showWrite, setShowWrite] = useState(false);
  const [showImages, setShowImages] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [simplify, setSimplify] = useState(false);
  const [code, setCode] = useState(false);
  const [research, setResearch] = useState(false);

  // Array of all your state variables for easier mapping
  const buttonStates = [
    { state: showSummarize, setState: setShowSummarize, key: 'summarize' },
    { state: showTranslate, setState: setShowTranslate, key: 'translate' },
    { state: showWrite, setState: setShowWrite, key: 'write' },
    { state: showImages, setState: setShowImages, key: 'images' },
    { state: showVideo, setState: setShowVideo, key: 'video' },
    { state: simplify, setState: setSimplify, key: 'simplify' },
    { state: code, setState: setCode, key: 'code' },
    { state: research, setState: setResearch, key: 'research' },
  ];

  // Content for each revealed element
  const elementContent = {
    summarize: {
      title: "Text Summarization",
      description: "AI-powered text summarization that extracts key points and creates concise summaries.",
      icon: "📝",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50"
    },
    translate: {
      title: "Language Translation",
      description: "Translate text between 100+ languages with context-aware accuracy.",
      icon: "🌐",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50"
    },
    write: {
      title: "Content Writing",
      description: "Generate engaging content for blogs, articles, and social media posts.",
      icon: "✍️",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50"
    },
    images: {
      title: "Image Generation",
      description: "Create stunning visual content from text descriptions using advanced AI models.",
      icon: "🖼️",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50"
    },
    video: {
      title: "Video Creation",
      description: "Generate and edit videos with automated scene detection and editing tools.",
      icon: "🎬",
      color: "from-yellow-500 to-amber-500",
      bgColor: "bg-yellow-50"
    },
    simplify: {
      title: "Text Simplification",
      description: "Make complex text easier to understand while preserving the core meaning.",
      icon: "💡",
      color: "from-teal-500 to-blue-500",
      bgColor: "bg-teal-50"
    },
    code: {
      title: "Code Generation",
      description: "Generate, explain, and debug code in multiple programming languages.",
      icon: "💻",
      color: "from-indigo-500 to-purple-500",
      bgColor: "bg-indigo-50"
    },
    research: {
      title: "Research Assistant",
      description: "Gather and analyze information from multiple sources efficiently.",
      icon: "🔍",
      color: "from-gray-500 to-gray-700",
      bgColor: "bg-gray-50"
    }
  };

  // Button labels
  const buttonLabels = [
    "Summarize",
    "Translate",
    "Write",
    "Generate Images",
    "Create Video",
    "Simplify",
    "Generate Code",
    "Research"
  ];

  // Handle button click - toggle specific element
  const handleButtonClick = (index: number) => {
    const buttonState = buttonStates[index];
    buttonState.setState(!buttonState.state);
  };

  // Close specific element
  const handleClose = (index: number) => {
    const buttonState = buttonStates[index];
    buttonState.setState(false);
  };

  // Close all elements
  const closeAll = () => {
    buttonStates.forEach(({ setState }) => setState(false));
  };

  // Show all elements
  const showAll = () => {
    buttonStates.forEach(({ setState }) => setState(true));
  };

  // Count visible elements
  const visibleCount = buttonStates.filter(state => state.state).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            AI Tools Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Click on any tool to reveal its interface. Multiple tools can be open simultaneously.
          </p>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          <button
            onClick={showAll}
            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
          >
            <Maximize2 size={18} />
            Show All Tools
          </button>
          <button
            onClick={closeAll}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
          >
            <X size={18} />
            Close All ({visibleCount})
          </button>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {buttonStates.map(({ state, key }, index) => (
            <button
              key={key}
              onClick={() => handleButtonClick(index)}
              className={`p-6 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                state
                  ? `bg-gradient-to-r ${elementContent[key as keyof typeof elementContent].color} text-white shadow-2xl`
                  : 'bg-white text-gray-700 shadow-lg hover:shadow-xl border-2 border-gray-100'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-2xl">
                  {elementContent[key as keyof typeof elementContent].icon}
                </span>
                <span>{buttonLabels[index]}</span>
                {state && (
                  <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Revealed Elements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {buttonStates.map(({ state, key }, index) => (
            <div
              key={key}
              className={`transition-all duration-500 transform ${
                state
                  ? 'opacity-100 scale-100 max-h-[500px]'
                  : 'opacity-0 scale-95 max-h-0 overflow-hidden'
              }`}
            >
              <div className={`p-6 rounded-2xl shadow-2xl border-l-4 ${elementContent[key as keyof typeof elementContent].bgColor} relative`}>
                {/* Close Button */}
                <button
                  onClick={() => handleClose(index)}
                  className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 flex items-center justify-center shadow-lg border-2 border-white hover:scale-110"
                >
                  <X size={16} />
                </button>

                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">
                    {elementContent[key as keyof typeof elementContent].icon}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {elementContent[key as keyof typeof elementContent].title}
                    </h3>
                    <div className={`w-16 h-1 rounded-full bg-gradient-to-r ${elementContent[key as keyof typeof elementContent].color}`}></div>
                  </div>
                </div>

                {/* Content */}
                <p className="text-gray-600 mb-6">
                  {elementContent[key as keyof typeof elementContent].description}
                </p>

                {/* Example Input/Output */}
                <div className="space-y-3">
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Input:
                    </label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder={`Enter text to ${buttonLabels[index].toLowerCase()}...`}
                    />
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Output:
                    </label>
                    <div className="p-3 bg-white rounded border border-gray-200 min-h-[60px] text-gray-500">
                      Results will appear here...
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <button className={`px-6 py-2 bg-gradient-to-r ${elementContent[key as keyof typeof elementContent].color} text-white rounded-lg font-semibold hover:shadow-lg transition-all`}>
                    Process
                  </button>
                  <button
                    onClick={() => handleClose(index)}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {visibleCount === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔧</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">
              No tools active
            </h3>
            <p className="text-gray-500">
              Click on any tool above to get started
            </p>
          </div>
        )}

        {/* Status Footer */}
        <div className="fixed bottom-6 right-6 bg-black bg-opacity-80 text-white px-4 py-3 rounded-xl backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold">
                {visibleCount} tool{visibleCount !== 1 ? 's' : ''} active
              </span>
            </div>
            <button
              onClick={closeAll}
              className="p-1 hover:bg-red-500 rounded transition-colors"
              title="Close all"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ButtonRevealApp;