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
    SwatchIcon,
    VariableIcon,
    PhotoIcon
} from '@heroicons/react/24/outline'
import Tippy from '@tippyjs/react'

type Props = {
    props?: React.AllHTMLAttributes<HTMLDivElement>
    setTools: React.Dispatch<SetStateAction<string | null>>
    setStrokeColor: React.Dispatch<SetStateAction<string | null>>
    setShowModal: React.Dispatch<SetStateAction<boolean | null>>
    setShowFileModal: React.Dispatch<SetStateAction<boolean | null>>
}

export default function Toolbox({
    props,
    setTools,
    setStrokeColor,
    setShowModal,
    setShowFileModal
}: Props) {

    const colorPickerRef = useRef<HTMLInputElement | null>(null)
    // const [selectedTool, setSelectedTool] = useState<string>('')

    const iconSize = 'w-6 h-6'
    const tools = [
        {
            name: 'selectionTool',
            icon: <CursorArrowRaysIcon className={iconSize} />,
            label: 'Selection Tool',
        },
        {
            name: 'brushTool',
            icon: <PaintBrushIcon className={iconSize} />,
            label: 'Brush Tool',
        },
        {
            name: 'imageUpload',
            icon: <PhotoIcon className={iconSize} />,
            label: 'Put an Image'
        },
        {
            name: 'rectangleTool',
            icon: <Squares2X2Icon className={iconSize} />,
            label: 'Rectangles Tool',
        },
        {
            name: 'ovalTool',
            icon: <PlusCircleIcon className={iconSize} />,
            label: 'Circle Tool',
        },
        {
            name: 'lineTool',
            icon: <ArrowTrendingUpIcon className={iconSize} />,
            label: 'Line Tool',
        },
        {
            name: 'bucketTool',
            icon: <ArchiveBoxArrowDownIcon className={iconSize} />,
            label: 'Bucket Tool',
        },
        {
            name: 'textTool',
            icon: <VariableIcon className={iconSize} />,
            label: 'Text Tool'
        },
        {
            name: 'eraserTool',
            icon: <TrashIcon className={iconSize} />,
            label: 'Eraser Tool',
        },
        {
            name: 'colorPicker',
            icon: <SwatchIcon className={iconSize} />,
            label: 'Pick a Color',
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


                                        switch (tool.name) {
                                            case 'imageUpload':
                                                setShowFileModal(true)                                                
                                                break;
                                            case 'textTool':
                                                setShowModal(true)                                                
                                                break;
                                            case 'colorPicker':                                                
                                                colorPickerRef.current?.click()
                                                break;                                        
                                            default:
                                                setTools(tool.name)
                                                break;
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