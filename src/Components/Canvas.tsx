import { XMarkIcon } from '@heroicons/react/24/outline';

import React, {
	useCallback,
	useEffect,
	useRef,
	useState,
	SetStateAction
} from 'react';

interface CanvasProps {
	tools?: string | null
	setTools: React.Dispatch<SetStateAction<string | null>>
	strokeColor: string | null
	width: number
	height: number
	showModal: boolean | null
	setShowModal: React.Dispatch<SetStateAction<boolean | null>>
	showFileModal: boolean | null
	setShowFileModal: React.Dispatch<SetStateAction<boolean | null>>
}

type Coordinate = {
	x: number
	y: number
};

// type Shapes = {
// 	x: number
// 	y: number
// 	radius?: number
// 	width?: number
// 	height?: number
// 	color?: string | undefined | null
// }

const Canvas = ({
	tools,
	setTools,
	strokeColor,
	width,
	height,
	showModal,
	setShowModal,
	setShowFileModal,
	showFileModal
}: CanvasProps) => {

	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const imageUploadRef = useRef<HTMLInputElement | null>(null)
	// const contextRef = useRef<CanvasRenderingContext2D | null | undefined>(null)


	const [isPainting, setIsPainting] = useState(false)
	const [mousePosition, setMousePosition] = useState<Coordinate | undefined>(undefined)
	const [text, setText] = useState<string>('')
	const [image, setImage] = useState<File | null>(null)
	const [uploadResult, setUploadResult] = useState<any>(null)

	const startPaint = useCallback((event: MouseEvent) => {
		const coordinates = getCoordinates(event);
		if (coordinates) {
			setMousePosition(coordinates);
			setIsPainting(true);
		}
	}, []);

	const paint = useCallback(
		(event: MouseEvent) => {
			if (isPainting) {
				const newMousePosition = getCoordinates(event);
				if (mousePosition && newMousePosition) {
					if (!canvasRef.current) {
						return
					}

					const oldCanvas: HTMLCanvasElement = canvasRef.current
					const context = oldCanvas.getContext('2d')

					if (!context) {
						return
					}
					context.strokeStyle = strokeColor ? strokeColor : 'black'
					context.lineJoin = 'round'
					context.lineWidth = 5

					switch (tools) {
						case 'rectangleTool':
							if (context) {
								context.clearRect(
									0, 0,
									oldCanvas.width,
									oldCanvas.height
								)

								context.strokeRect(
									mousePosition.x, mousePosition.y,
									newMousePosition.x - mousePosition.x,
									newMousePosition.y - mousePosition.y
								)
							}
							break
						case 'ovalTool':
							if (context) {
								context.clearRect(
									0, 0,
									oldCanvas.width,
									oldCanvas.height
								)

								context.beginPath()
								context.arc(
									mousePosition.x, mousePosition.y,
									Math.ceil(newMousePosition.x - mousePosition.x / newMousePosition.y - mousePosition.y),
									0, 2 * Math.PI,
									false
								)
								context.stroke()
							}
							break
						case 'lineTool': {
							if (context) {
								context.clearRect(0, 0, oldCanvas.width, oldCanvas.height)
								context.beginPath()
								context.moveTo(mousePosition.x, mousePosition.y)
								context.lineTo(newMousePosition.x, newMousePosition.y)
								context.stroke()
							}
							break
						}
						case 'generateImage': {
							const img = document.getElementById('image-upload') as HTMLImageElement
							if (!img) {
								return
							}
							context.drawImage(
								img, mousePosition.x, mousePosition.y,
								img.width > 500 ? Math.ceil(img.width) / 4 : img.width,
								img.height > 500 ? Math.ceil(img.height) / 4 : img.height
							)
							break
						}
						case 'generateText': {
							context.font = '18px Arial'
							context.fillStyle = strokeColor ? strokeColor : 'black'
							context.fillText(text, mousePosition.x, mousePosition.y)
							break
						}
						case 'eraserTool': {
							if (context) {
								context.clearRect(
									0, 0,
									oldCanvas.width, oldCanvas.height
								)
							}
							break
						}
						default:
							if (context) {
								context.beginPath()
								context.moveTo(mousePosition.x, mousePosition.y)
								context.lineTo(newMousePosition.x, newMousePosition.y)
								context.closePath()
								context.stroke()
							}
							setMousePosition(newMousePosition);
							break
					}

				}
			}
		},
		// eslint-disable-next-line
		[isPainting, mousePosition]
	);

	const exitPaint = useCallback(() => {
		if (!canvasRef.current) {
			return
		}
		setIsPainting(false)
		setMousePosition(undefined)
	}, []);

	const getCoordinates = (event: MouseEvent): Coordinate | undefined => {
		if (!canvasRef.current) {
			return
		}

		const canvas: HTMLCanvasElement = canvasRef.current
		return { x: event.pageX - canvas.offsetLeft, y: event.pageY - canvas.offsetTop }
	};

	useEffect(() => {
		if (!canvasRef.current) {
			return
		}
		const canvas: HTMLCanvasElement = canvasRef.current
		canvas.addEventListener('mousedown', startPaint)
		return () => {
			canvas.removeEventListener('mousedown', startPaint)
		}
	}, [startPaint]);

	useEffect(() => {
		if (!canvasRef.current) {
			return
		}
		const canvas: HTMLCanvasElement = canvasRef.current
		canvas.addEventListener('mousemove', paint)
		return () => {
			canvas.removeEventListener('mousemove', paint)
		}
	}, [paint])

	useEffect(() => {
		if (!canvasRef.current) {
			return
		}
		const canvas: HTMLCanvasElement = canvasRef.current
		canvas.addEventListener('mouseup', exitPaint)
		canvas.addEventListener('mouseleave', exitPaint)
		return () => {
			canvas.removeEventListener('mouseup', exitPaint)
			canvas.removeEventListener('mouseleave', exitPaint)
		};
	}, [exitPaint])

	useEffect(() => {
		let fileReader: FileReader, isCancel = false
		if (image) {
			fileReader = new FileReader()
			fileReader.onload = (e: any) => {
				const { result } = e.target
				if (result && !isCancel) {
					setUploadResult(result)
				}
			}
			fileReader.readAsDataURL(image)
		}

		return () => {
			isCancel = true
			if (fileReader && fileReader.readyState === 1) {
				fileReader.abort()
			}
		}
	}, [image])

	// console.log(image)
	console.log(uploadResult, "THIS IS UPLOAD RESULT")

	return (
		<React.Fragment>
			<canvas ref={canvasRef} height={height} width={width} />
			<div
				className={`${showModal ? 'absolute flex flex-col' : 'hidden'} justify-center items-center top-0 left-0 w-full h-full bg-slate-800 bg-opacity-50`}>
				<div
					tabIndex={0}
					className='bg-white rounded p-10 flex flex-col space-y-8'>
					<>
						<div className='flex flex-row items-center justify-between'>
							<h3 className='font-semibold'>Create Text</h3>
							<button
								onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
									e.preventDefault()
									setText('')
									setShowModal(false)
								}}
							>
								<XMarkIcon className='w-8 h-8' />
							</button>
						</div>
						<div className='flex flex-col space-y-2'>
							<input
								value={text ? text : ''}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
									e.preventDefault()
									setText(e.target.value)
								}}
								className={`w-[500px] placeholder:text-slate-400 focus:outline-green-500 rounded border-2 p-4 
									 ${!text ? 'border-pink-500' : 'border-slate-500 p-4'}`}
								placeholder='Input Your Text' />
							{!text && (
								<span className='text-pink-500'>Text cannot be empty!</span>
							)}
						</div>
						<div className='flex flex-row justify-end items-center space-x-4'>
							<button
								onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
									e.preventDefault()
									setText('')
								}}
								className='bg-green-700 text-white px-6 py-2 rounded disabled:bg-slate-500'>
								Clear
							</button>
							<button
								disabled={text ? false : true}
								onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
									e.preventDefault()
									setTools('generateText')
									setShowModal(false)
								}}
								className='bg-slate-600 text-white px-6 py-2 rounded disabled:bg-slate-500'>
								Generate
							</button>
						</div>
					</>
				</div>
			</div>
			<div
				className={`${showFileModal ? 'absolute flex flex-col' : 'hidden'} justify-center items-center top-0 left-0 w-full h-full bg-slate-800 bg-opacity-50`}>
				<div
					tabIndex={0}
					className='bg-white rounded p-10 flex flex-col space-y-8'>
					<>
						<div className='flex flex-row items-center justify-between'>
							<h3 className='font-semibold'>Upload an Image</h3>
							<button
								onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
									e.preventDefault()
									setImage(null)
									setShowFileModal(false)
								}}
							>
								<XMarkIcon className='w-8 h-8' />
							</button>
						</div>
						<div className='flex flex-col space-y-2'>
							<button
								onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
									e.preventDefault()
									imageUploadRef.current?.click()
								}}
								className='font-semibold bg-slate-300 p-6 rounded flex space-y-4
										   flex-col justify-center items-center min-w-[500px] min-h-[250px] cursor-pointer'>
								{uploadResult ?
									(
										<img
											id='image-upload'
											className='max-w-[450px] rounded'
											src={uploadResult}
											alt='preview' />
									) : (<></>)}
								<p>
									{image ? image.name : 'Upload an Image'}
								</p>
							</button>
							<input
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
									e.preventDefault()
									const imageMimeType = /image\/(png|jpg|jpeg)/i;
									if (e.target.files?.length) {
										const file = e.target.files[0]
										if (!file.type.match(imageMimeType)) {
											alert('Image extension type is not valid!')
											return
										}
										setImage(file)
									}
								}}
								accept='.png, .jpg, .jpeg'
								ref={imageUploadRef}
								type={'file'}
								className='hidden' />
						</div>
						<div className='flex flex-row justify-end items-center space-x-4'>
							<button
								onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
									e.preventDefault()
									setUploadResult(null)
									setImage(null)
								}}
								className='bg-green-700 text-white px-6 py-2 rounded disabled:bg-slate-500'>
								Clear
							</button>
							<button
								disabled={uploadResult ? false : true}
								onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
									e.preventDefault()
									setTools('generateImage')
									setShowFileModal(false)
								}}
								className='bg-slate-600 text-white px-6 py-2 rounded disabled:bg-slate-500'>
								Generate
							</button>
						</div>
					</>
				</div>
			</div>
		</React.Fragment>
	);
};

Canvas.defaultProps = {
	width: window.innerWidth,
	height: window.innerHeight,
};

export default Canvas;
