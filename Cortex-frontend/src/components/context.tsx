//Context.tsx
interface ContextProps {
  key?: string;
  icon: React.ReactNode;
  text: string;
  btntext: string;
  buttonclicked: (e: number) => void;
  index: number;
  state?: boolean;
  disabled?: boolean;
}

const Context = ({ icon, text, btntext, buttonclicked, index, disabled }: ContextProps) => {
  return (
    <div className={`w-full h-auto flex justify-between items-center px-4 py-2 glass-dark bg-black/10 rounded-xl border border-gray-50/10 backdrop-blur-lg ${
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    }`}>
      <div className="flex items-center text-[13px] space-x-4">
        <div className="text-white dark:text-black w-auto h-auto rounded-full dark:bg-white bg-black p-1">
          {icon}
        </div>
        <p>{text}</p>
      </div>
      <button
        onClick={() => !disabled && buttonclicked(index)}
        disabled={disabled}
        className={`bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6 text-white inline-block ${
          disabled ? 'cursor-not-allowed opacity-50' : ''
        }`}
      >
        <span className="absolute inset-0 overflow-hidden rounded-full">
          <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </span>
        <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10 ">
          <span className="text-[10px]">{btntext}</span>
          <svg
            fill="none"
            height="16"
            viewBox="0 0 24 24"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.75 8.75L14.25 12L10.75 15.25"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
        </div>
        <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
      </button>
    </div>
  );
};

export default Context;