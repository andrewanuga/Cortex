import { ThemeProvider } from "@/components/theme-provider"
import Header from "./components/header";
import Body from "./components/body";
import Footer from "./components/Footer";

const App = () => {
  return(
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className = "w-full h-dvh flex justify-center poppins items-centre bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <div className="charcoal-bg flex flex-wrap justify-start items-start shadow shadow-indigo-100 rounded-md" style={{ width: '400px', minHeight: '300px' }}>
          <Header />
          <Body />
          <Footer />
        </div>
      </div>
    </ThemeProvider>
)};

export default App