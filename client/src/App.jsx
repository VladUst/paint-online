import ToolBar from "./components/ToolBar";
import SettingBar from "./components/SettingBar";
import Canvas from "./components/Canvas";
import './styles/app.scss';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
const App = () => {
  return (
      <BrowserRouter>
          <div className="app">
              <Routes>
                  <Route path='/:id' element={<><ToolBar/><SettingBar/><Canvas/></>}/>
                  <Route
                      path="*"
                      element={<Navigate to={`f${(+new Date()).toString(16)}`} replace />}
                  />
              </Routes>
          </div>
      </BrowserRouter>
  );
}

export default App;
