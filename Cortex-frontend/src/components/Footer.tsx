
const Footer = () => {
  return (
    <div className='w-full h-16 flex justify-center items-center mt-2 px-2 mx-2 p-1 glass-dark  backdrop-blur-lg gap-2'>
     <input type="text" placeholder="Type a message..." className='w-full h-12 p-2 rounded-md bg-black/30 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-white/70' />
    <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-1 focus:ring-slate-800 focus:ring-offset-1 focus:ring-offset-slate-500">
        <span className="absolute inset-[-100%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
            Send
        </span>
    </button>
    </div>
  )
}

export default Footer