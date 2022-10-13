import React from 'react'
import Canvas from './Components/Canvas';
import Toolbox from './Components/Toolbox';

function App() {
  return (
    <>
      <Toolbox />
      <Canvas
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </>
  );
}

export default App;
