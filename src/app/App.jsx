import { useState } from 'react';
import Landing, { LAYOUTS } from '../components/Landing';
import Photobooth from '../components/Photobooth';
import '../style/App.css';

function App() {
  const [selectedLayoutId, setSelectedLayoutId] = useState(null);

  const handleStart = (layoutId) => {
    setSelectedLayoutId(layoutId);
  };

  const handleBackToLanding = () => {
    setSelectedLayoutId(null);
  };

  if (!selectedLayoutId) {
    return <Landing onStart={handleStart} />;
  }

  const layout = LAYOUTS.find((l) => l.id === selectedLayoutId);

  return (
    <Photobooth
      maxPhotos={layout.poses}
      layoutName={layout.name}
      onBack={handleBackToLanding}
    />
  );
}

export default App;