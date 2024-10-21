import "./App.css"
import ToolBar from "./components/ToolBar";
import SettingBar from "./components/SettingBar";
import Canvas from "./components/Canvas";
import {Provider} from "react-redux";
import store from "./store/store";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";

function Root() {
    return (
        <>
            <Provider store={store}>
                <div className="App">
                    <ToolBar></ToolBar>
                    <SettingBar></SettingBar>
                    <Canvas></Canvas>
                </div>
            </Provider>
        </>
    )
}
function App(){

    return (
        <BrowserRouter>
            <Routes>
                <Route path={"/:id"} element={Root()}></Route>
                <Route path={"/"} element={<Navigate to={`f${(+new Date).toString(16)}`}></Navigate>}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App
