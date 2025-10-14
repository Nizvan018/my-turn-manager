import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Client from "./pages/client/Client";
import Control from "./pages/control/Control";
import ModalProvider from "./context/Modal.provider";

import "@fontsource-variable/lexend";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/control" element={
                    <ModalProvider>
                        <div id="modal"></div>
                        <Control />
                    </ModalProvider>
                } />
                <Route path="/client" element={<Client />} />
            </Routes>
        </Router>
    )
}
