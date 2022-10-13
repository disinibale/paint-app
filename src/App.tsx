import { useState } from 'react'
import Canvas from './Components/Canvas';
import Toolbox from './Components/Toolbox';

function App() {
	const [tool, setTool] = useState<string | null>(null);
	const [strokeColor, setStrokeColor] = useState<string | null>(null)
	const [showModal, setShowModal] = useState<boolean | null>(false)
	const [showFileModal, setShowFileModal] = useState<boolean | null>(false)

	console.log(`Selected tool is ${tool}`)

	return (
		<>
			<Toolbox
				setShowFileModal={setShowFileModal}
				setShowModal={setShowModal}
				setStrokeColor={setStrokeColor}
				setTools={setTool}
			/>
			<Canvas
				showFileModal={showFileModal}
				setShowFileModal={setShowFileModal}
				showModal={showModal}
				setShowModal={setShowModal}
				strokeColor={strokeColor}
				tools={tool}
				setTools={setTool}
				width={window.innerWidth}
				height={window.innerHeight}
			/>
		</>
	);
}

export default App;
