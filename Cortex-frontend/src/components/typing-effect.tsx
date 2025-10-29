// TypingEffect.tsx
import { Banknote, ClipboardCheck, Copy } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';


interface TypingEffectProps {
  text: string;
  speed?: number;
  startDelay?: number;
  onComplete?: () => void;
  showCopyButton?: boolean;
  showCursor?: boolean;
  cursorBlinkSpeed?: number;
  className?: string;
  onCopy?: (text: string) => void;
  preserveFormatting?: boolean;
  renderMarkdown?: boolean;
}

type CopyStatus = 'idle' | 'success' | 'error' | string;


const TextProcessor = {
  /**
   * Detects if text contains code blocks, markdown, or special formatting
   */
  detectFormatting(text: string): {
    hasCodeBlocks: boolean;
    hasMarkdown: boolean;
    hasSpecialChars: boolean;
  } {
    const codeBlockRegex = /```[\s\S]*?```|`[^`]*`/g;
    const markdownRegex = /^#+|^\*|\*\*[^*]+\*\*|__[^_]+__|~~[^~]+~~|\|/gm;
    const specialCharRegex = /[<>*#_~`|\\[\]{}()&%$@!+=:;-]/g;

    return {
      hasCodeBlocks: codeBlockRegex.test(text),
      hasMarkdown: markdownRegex.test(text),
      hasSpecialChars: specialCharRegex.test(text),
    };
  },

  /**
   * Processes text to handle special characters and formatting
   */
  processTextChunk(chunk: string): string {
    // Handle common markdown and special characters
    return chunk
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*/g, '∗')
      .replace(/#/g, '＃')
      .replace(/_/g, '＿')
      .replace(/`/g, '‵')
      .replace(/\|/g, '│')
      .replace(/\\/g, '＼')
      .replace(/{/g, '｛')
      .replace(/}/g, '｝')
      .replace(/\[/g, '［')
      .replace(/\]/g, '］');
  },

  /**
   * Splits text into chunks for better typing performance with formatting
   */
  splitIntoSafeChunks(text: string, chunkSize: number = 50): string[] {
    const chunks: string[] = [];
    // let currentChunk = '';
    
    // Split by lines first to preserve line breaks
    const lines = text.split('\n');
    
    for (const line of lines) {
      if (line.length <= chunkSize) {
        // If line is small, add it as a chunk
        chunks.push(line + '\n');
      } else {
        // Split long lines into smaller chunks
        for (let i = 0; i < line.length; i += chunkSize) {
          const chunk = line.slice(i, i + chunkSize);
          chunks.push(chunk);
        }
        chunks.push('\n');
      }
    }
    
    return chunks.filter(chunk => chunk.length > 0);
  },

  /**
   * Escapes HTML entities for safe rendering
   */
  escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
};

// =============================================================================
// CUSTOM HOOKS
// =============================================================================

const useTypingEffect = (
  text: string, 
  speed: number, 
  startDelay: number, 
  onComplete?: () => void,
  preserveFormatting: boolean = true
) => {
  const [displayedText, setDisplayedText] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isTypingComplete, setIsTypingComplete] = useState<boolean>(false);
  const [isTypingStarted, setIsTypingStarted] = useState<boolean>(false);
  const [textChunks, setTextChunks] = useState<string[]>([]);

  // Pre-process text into chunks
  useEffect(() => {
    if (preserveFormatting) {
      const chunks = TextProcessor.splitIntoSafeChunks(text);
      setTextChunks(chunks);
    } else {
      setTextChunks([text]);
    }
  }, [text, preserveFormatting]);

  // Start typing after delay
  useEffect(() => {
    const startTimer = setTimeout(() => {
      setIsTypingStarted(true);
    }, startDelay);

    return () => clearTimeout(startTimer);
  }, [startDelay]);

  // Typing effect with chunk processing
  useEffect(() => {
    if (!isTypingStarted || currentIndex >= textChunks.length) {
      if (isTypingStarted && !isTypingComplete && textChunks.length > 0) {
        setIsTypingComplete(true);
        onComplete?.();
      }
      return;
    }

    const currentChunk = textChunks[currentIndex];
    let chunkIndex = 0;

    const typeChunk = () => {
      if (chunkIndex < currentChunk.length) {
        const char = preserveFormatting 
          ? TextProcessor.processTextChunk(currentChunk[chunkIndex])
          : currentChunk[chunkIndex];
        
        setDisplayedText(prev => prev + char);
        chunkIndex++;
        setTimeout(typeChunk, speed);
      } else {
        // Move to next chunk
        setCurrentIndex(prev => prev + 1);
      }
    };

    const timer = setTimeout(typeChunk, speed);
    return () => clearTimeout(timer);
  }, [
    currentIndex, 
    textChunks, 
    speed, 
    isTypingComplete, 
    isTypingStarted, 
    onComplete, 
    preserveFormatting
  ]);

  // Reset when text changes
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
    setIsTypingComplete(false);
    setIsTypingStarted(false);
  }, [text]);

  return {
    displayedText,
    isTypingComplete,
    isTypingStarted,
    formattingInfo: TextProcessor.detectFormatting(text),
  };
};

const useCopyToClipboard = (text: string, onCopy?: (text: string) => void) => {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus('success');
      onCopy?.(text);
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch (error) {
      setCopyStatus(`error: ${error}`);
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  }, [text, onCopy]);

  return {
    copyStatus,
    copyToClipboard,
  };
};

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

interface CursorProps {
  showCursor: boolean;
  isTypingComplete: boolean;
  isTypingStarted: boolean;
  cursorBlinkSpeed: number;
}

const Cursor: React.FC<CursorProps> = ({
  showCursor,
  isTypingComplete,
  isTypingStarted,
  cursorBlinkSpeed,
}) => {
  if (!showCursor || isTypingComplete || !isTypingStarted) {
    return null;
  }

  return (
    <span 
      className="cursor animate-pulse" 
      style={{ animationDuration: `${cursorBlinkSpeed}ms` }}
    >
      ▌
    </span>
  );
};

interface FormattingIndicatorProps {
  formattingInfo: {
    hasCodeBlocks: boolean;
    hasMarkdown: boolean;
    hasSpecialChars: boolean;
  };
}

const FormattingIndicator: React.FC<FormattingIndicatorProps> = ({
  formattingInfo,
}) => {
  if (!formattingInfo.hasCodeBlocks && !formattingInfo.hasMarkdown && !formattingInfo.hasSpecialChars) {
    return null;
  }

  return (
    <div className="formatting-indicator flex gap-2 text-xs text-gray-500 mb-2">
      {formattingInfo.hasCodeBlocks && (
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Code</span>
      )}
      {formattingInfo.hasMarkdown && (
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Markdown</span>
      )}
      {formattingInfo.hasSpecialChars && (
        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Formatted</span>
      )}
    </div>
  );
};

interface CopyButtonProps {
  showCopyButton: boolean;
  isTypingComplete: boolean;
  copyStatus: CopyStatus;
  onCopy: () => void;
}

const CopyButton: React.FC<CopyButtonProps> = ({
  showCopyButton,
  isTypingComplete,
  copyStatus,
  onCopy,
}) => {
  if (!showCopyButton || !isTypingComplete) {
    return null;
  }

  const getCopyIcon = () => {
    switch (copyStatus) {
      case 'success':
        return <ClipboardCheck className="w-4 h-4" />;
      case 'error':
        return <Banknote className="w-4 h-4" />;
      default:
        return <Copy className="w-4 h-4" />;
    }
  };

  const getButtonClassName = () => {
    const baseClasses = "copy-button p-2 rounded transition-colors duration-200 border";
    // const statusClasses = {
    //   idle: "bg-gray-600 hover:bg-gray-500 text-white border-gray-600",
    //   success: "bg-green-600 text-white border-green-600",
    //   error: "bg-red-600 text-white border-red-600",
    // };
    return `${baseClasses}}`;
  };

  return (
    <div className="copy-button-container w-full flex justify-end items-end mb-2">
      <button
        className={getButtonClassName()}
        onClick={onCopy}
        disabled={copyStatus === 'success'}
        aria-label="Copy text to clipboard"
      >
        {getCopyIcon()}
      </button>
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const TypingEffect: React.FC<TypingEffectProps> = ({
  text,
  speed = 30,
  startDelay = 0,
  onComplete,
  showCopyButton = true,
  showCursor = true,
  cursorBlinkSpeed = 530,
  className = '',
  onCopy,
  preserveFormatting = true,
  // renderMarkdown = false,
}) => {
  const textContainerRef = useRef<HTMLDivElement>(null);
  
  const {
    displayedText,
    isTypingComplete,
    isTypingStarted,
    formattingInfo,
  } = useTypingEffect(text, speed, startDelay, onComplete, preserveFormatting);

  const {
    copyStatus,
    copyToClipboard,
  } = useCopyToClipboard(text, onCopy);

  // Auto-scroll to bottom as text types
  useEffect(() => {
    if (textContainerRef.current) {
      textContainerRef.current.scrollTop = textContainerRef.current.scrollHeight;
    }
  }, [displayedText]);

  return (
    <div className={`typing-effect-container bg-black/30 text-[8px] w-full ${className}`}>
      <FormattingIndicator formattingInfo={formattingInfo} />
      
      <CopyButton
        showCopyButton={showCopyButton}
        isTypingComplete={isTypingComplete}
        copyStatus={copyStatus}
        onCopy={copyToClipboard}
      />
      
      <div 
        className="text-container font-mono rounded-md text-[12px] bg-black/20 leading-relaxed"
        ref={textContainerRef}
      >
        <div className={`typing-text whitespace-pre-wrap rounded-md break-words ${
          formattingInfo.hasCodeBlocks ? 'p-4 rounded' : ''
        }`}>
          {preserveFormatting ? (
            <span 
              dangerouslySetInnerHTML={{ 
                __html: TextProcessor.escapeHtml(displayedText) 
              }} 
            />
          ) : (
            displayedText
          )}
          <Cursor
            showCursor={showCursor}
            isTypingComplete={isTypingComplete}
            isTypingStarted={isTypingStarted}
            cursorBlinkSpeed={cursorBlinkSpeed}
          />
        </div>
      </div>
    </div>
  );
};

export default TypingEffect;