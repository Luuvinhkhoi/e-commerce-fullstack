import logo from './logo.svg';
import './App.css';
import { Header } from './Components/Header/header';
import { Banner } from './Components/SlideBanner/Banner';
import { Main } from './Components/Main/main';
function App() {
  return (
    <div className="App">
      <Header></Header>
      <Banner></Banner>
      <Main></Main>
    </div>
  );
}

export default App;
