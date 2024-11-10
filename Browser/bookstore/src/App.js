import logo from './logo.svg';
import './App.css';
import { Header } from './Components/Header/header';
import { Banner } from './Components/SlideBanner/Banner';
function App() {
  return (
    <div className="App">
      <Header></Header>
      <Banner></Banner>
    </div>
  );
}

export default App;
