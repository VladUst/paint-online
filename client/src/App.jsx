import ToolBar from "./components/ToolBar";
import SettingBar from "./components/SettingBar";
import Canvas from "./components/Canvas";
import './styles/app.scss';
const App = () => {
  return (
    <div className="app">
      <ToolBar/>
      <SettingBar/>
      <Canvas/>
    </div>
  );
}

export default App;
