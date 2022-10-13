import { useState } from 'react'
import Canvas from './Components/Canvas';
import Toolbox from './Components/Toolbox';

function App() {
	const [tool, setTool] = useState<string | null>(null);
	const [strokeColor, setStrokeColor] = useState<string | null>(null)

	console.log(`Selected tool is ${tool}`)

	return (
		<>
			<Toolbox
				setStrokeColor={setStrokeColor}
				setTools={setTool}
			/>
			<Canvas
				strokeColor={strokeColor}
				tools={tool}
				width={window.innerWidth}
				height={window.innerHeight}
			/>
		</>
	);
}

export default App;
