import React, {
    useRef,
    SetStateAction
} from 'react'
import {
    CursorArrowRaysIcon,
    PaintBrushIcon,
    PlusCircleIcon,
    Squares2X2Icon,
    ArrowTrendingUpIcon,
    ArchiveBoxArrowDownIcon,
    TrashIcon,
    InformationCircleIcon,
    SwatchIcon
} from '@heroicons/react/24/outline'
import Tippy from '@tippyjs/react'

type Props = {
    props?: React.AllHTMLAttributes<HTMLDivElement>,
    setTools: React.Dispatch<SetStateAction<string | null>>,
    setStrokeColor: React.Dispatch<SetStateAction<string | null>>
}

export default function Toolbox({
    props,
    setTools,
    setStrokeColor
}: Props) {

    const colorPickerRef = useRef<HTMLInputElement | null>(null)
    // const [selectedTool, setSelectedTool] = useState<string>('')

    const iconSize = 'w-6 h-6'
    const tools = [
        {
            name: 'selectionTool',
            icon: <CursorArrowRaysIcon className={iconSize} />,
            label: 'Selection Tool',
            function: () => {

            }
        },
        {
            name: 'brushTool',
            icon: <PaintBrushIcon className={iconSize} />,
            label: 'Brush Tool',
            function: () => {

            }
        },
        {
            name: 'rectangleTool',
            icon: <Squares2X2Icon className={iconSize} />,
            label: 'Rectangles Tool',
            function: () => {

            }
        },
        {
            name: 'ovalTool',
            icon: <PlusCircleIcon className={iconSize} />,
            label: 'Ovals Tool',
            function: () => {

            }
        },
        {
            name: 'lineTool',
            icon: <ArrowTrendingUpIcon className={iconSize} />,
            label: 'Line Tool',
            function: () => {

            }
        },
        {
            name: 'bucketTool',
            icon: <ArchiveBoxArrowDownIcon className={iconSize} />,
            label: 'Bucket Tool',
            function: () => {

            }
        },
        {
            name: 'eraserTool',
            icon: <TrashIcon className={iconSize} />,
            label: 'Eraser Tool',
            function: () => {

            }
        },
        {
            name: 'colorPicker',
            icon: <SwatchIcon className={iconSize} />,
            label: 'Pick a Color',
            function: () => {

            }
        }
    ]

    return (
        <div className='absolute w-full flex justify-center items-center '>
            <ul className='flex flex-row space-x-6 bg-slate-300 px-8 py-3 rounded mt-4'>
                {tools.map((tool, index) => {
                    const TipData = () => {
                        return (
                            <div
                                className='flex flex-row space-x-4 justify-center items-center p-2 rounded bg-gray-500 text-white'>
                                <InformationCircleIcon className='w-3 h-3' />
                                <span>{tool.label}</span>
                            </div>
                        )
                    }

                    return (
                        <li key={index}>
                            <Tippy
                                content={<TipData />}
                                placement={'bottom'}
                                delay={[0, 0]}>
                                <button
                                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                        e.preventDefault()
                                        setTools(tool.name)
                                        if (tool.name === 'colorPicker') {
                                            colorPickerRef.current?.click()
                                        }
                                    }}
                                >
                                    {tool.icon}
                                </button>
                            </Tippy>
                            {tool.name === 'colorPicker' && (
                                <input
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        e.preventDefault()
                                        setStrokeColor(e.target.value)
                                    }}
                                    ref={colorPickerRef}
                                    className='hidden'
                                    type={'color'} />
                            )}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}