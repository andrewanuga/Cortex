// import { ModeToggle } from "./mode-toggle"
import { More } from "./More"

const Header = () => {
    return (
        <div className="w-full h-auto mt-2 px-2 mx-2  flex items-center justify-between p-1 glass-dark bg-black/20 backdrop-blur-lg border border-white/10 rounded-xl">
            <section className="w-auto h-auto flex justify-center items-center">
                <img src="logo.png" alt="logo" className="w-5 h-5" />
                {/* <p className="font-bold text-lg bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">CORTEX</p> */}
            </section>
            <section className="">
                <p className="font-bold text-lg bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">Home</p>
            </section>
            <section className="w-auto h-auto flex gap-2 justify-center items-center">
                <More />
                {/* <ModeToggle /> */}
            </section>
        </div>
    )
}

export default Header