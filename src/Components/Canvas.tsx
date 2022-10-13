import React, { useCallback, useEffect, useRef, useState } from 'react';

interface CanvasProps {
	tools?: string | null
	strokeColor: string | null
	width: number
	height: number
}

type Coordinate = {
	x: number
	y: number
};

type Shapes = {
	x: number
	y: number
	radius?: number
	width?: number
	height?: number
	color?: string | undefined | null
}

const Canvas = ({
	tools,
	strokeColor,
	width,
	height
}: CanvasProps) => {

	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const contextRef = useRef<CanvasRenderingContext2D | null | undefined>(null)


	const [isPainting, setIsPainting] = useState(false)
	const [mousePosition, setMousePosition] = useState<Coordinate | undefined>(undefined)
	const [shapes, setShapes] = useState<Shapes[]>([])

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
									Math.ceil( newMousePosition.x - mousePosition.x / newMousePosition.y - mousePosition.y ),
									0, 2 * Math.PI,
									false
								)
								context.stroke()
							}
							break
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
		setIsPainting(false);
		setMousePosition(undefined);
	}, []);

	const getCoordinates = (event: MouseEvent): Coordinate | undefined => {
		if (!canvasRef.current) {
			return;
		}

		const canvas: HTMLCanvasElement = canvasRef.current;
		return { x: event.pageX - canvas.offsetLeft, y: event.pageY - canvas.offsetTop };
	};

	// const drawLine = (originalMousePosition: Coordinate, newMousePosition: Coordinate) => {
	// 	if (!canvasRef.current) {
	// 		return;
	// 	}
	// 	const canvas: HTMLCanvasElement = canvasRef.current;
	// 	contextRef.current = canvas.getContext('2d')
	// 	if (contextRef.current) {
	// 		const context = contextRef.current
	// 		context.strokeStyle = strokeColor ? strokeColor : 'black';
	// 		context.lineJoin = 'round';
	// 		context.lineWidth = 5;

	// 		context.beginPath();
	// 		context.moveTo(originalMousePosition.x, originalMousePosition.y);
	// 		context.lineTo(newMousePosition.x, newMousePosition.y);
	// 		context.closePath();
	// 		context.stroke();

	// 	}
	// };

	useEffect(() => {
		if (!canvasRef.current) {
			return;
		}
		const canvas: HTMLCanvasElement = canvasRef.current;
		canvas.addEventListener('mousedown', startPaint);
		return () => {
			canvas.removeEventListener('mousedown', startPaint);
		};
	}, [startPaint]);

	useEffect(() => {
		if (!canvasRef.current) {
			return;
		}
		const canvas: HTMLCanvasElement = canvasRef.current;
		canvas.addEventListener('mousemove', paint);
		return () => {
			canvas.removeEventListener('mousemove', paint);
		};
	}, [paint]);

	useEffect(() => {
		if (!canvasRef.current) {
			return;
		}
		const canvas: HTMLCanvasElement = canvasRef.current;
		canvas.addEventListener('mouseup', exitPaint);
		canvas.addEventListener('mouseleave', exitPaint);
		return () => {
			canvas.removeEventListener('mouseup', exitPaint);
			canvas.removeEventListener('mouseleave', exitPaint);
		};
	}, [exitPaint]);

	console.log(shapes)

	return <canvas ref={canvasRef} height={height} width={width} />;
};

Canvas.defaultProps = {
	width: window.innerWidth,
	height: window.innerHeight,
};

export default Canvas;
