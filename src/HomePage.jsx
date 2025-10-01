import { useContext } from 'react';
import { AppContext } from './App';
import StarBorder from './components/StarBorder';
import './HomePage.css';

function HomePage() {
  const { navigate } = useContext(AppContext);

  return (
    <div className="home-page">
      <h1 className="home-title">MAKE<br/>IDEAS<br/>INFINITE</h1>
      <StarBorder
        color="#6366F1"
        speed="4s"
        thickness={2}
        onClick={() => navigate('select')}
        className="home-button"
      >
        Get Started
      </StarBorder>
    </div>
  );
}

export default HomePage;
