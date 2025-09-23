import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Client from "./pages/client/Client";
import Control from "./pages/control/Control";

import "@fontsource-variable/lexend";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<h1>Hola</h1>} />
                <Route path="/control" element={<Control />} />
                <Route path="/client" element={<Client />} />
            </Routes>
        </Router>
    )
}
