import { ModeToggle } from "./mode-toggle"

const Header = () => {
    return (
        <div className="w-full h-auto mt-2 px-2 mx-2  flex items-center justify-between p-1 glass-dark bg-black/20 backdrop-blur-lg border border-white/10 rounded-xl">
            <section>
                <img src="logo.png" alt="logo" className="w-5 h-5" />
            </section>
            <h2>Home</h2>
            <ModeToggle />
        </div>
    )
}

export default Header