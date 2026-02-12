
import Home from "./templates/Home";
import Single from "./templates/Single";
import Search from "./templates/Search";
import NotFound from "./templates/NotFound";
import Header from "./components/Header";
import Footer from "./components/Footer";

const defaultTheme = {
    id: "default",
    name: "Default Theme",
    version: "1.0.0",
    author: "NextWP-lite",
    description: "Clean, modern, typography-focused theme with dark mode support.",
    templates: {
        Home,
        Single,
        Search,
        NotFound,
    },
    components: {
        Header,
        Footer,
    },
};

export default defaultTheme;
