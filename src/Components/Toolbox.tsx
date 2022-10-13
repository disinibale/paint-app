import React, { useRef, useState } from 'react'
import {
    CursorArrowRaysIcon,
    PaintBrushIcon,
    PlusCircleIcon,
    Squares2X2Icon,
    ArrowTrendingUpIcon,
    ArchiveBoxArrowDownIcon,
    TrashIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline'
import Tippy from '@tippyjs/react'

type Props = {}

export default function Toolbox({ }: Props) {
    const [selectedTool, setSelectedTool] = useState<string>('')
    const [tooltipActive, setTooltipActive] = useState<boolean>(false)

    const iconSize = 'w-6 h-6'
    const tools = [
        {
            name: 'selectionTool',
            icon: <CursorArrowRaysIcon className={iconSize} />,
            label: 'Selection Tool'
        },
        {
            name: 'brushTool',
            icon: <PaintBrushIcon className={iconSize} />,
            label: 'Brush Tool'
        },
        {
            name: 'rectangleTool',
            icon: <Squares2X2Icon className={iconSize} />,
            label: 'Rectangles Tool'
        },
        {
            name: 'ovalTool',
            icon: <PlusCircleIcon className={iconSize} />,
            label: 'Ovals Tool'
        },
        {
            name: 'lineTool',
            icon: <ArrowTrendingUpIcon className={iconSize} />,
            label: 'Line Tool'
        },
        {
            name: 'bucketTool',
            icon: <ArchiveBoxArrowDownIcon className={iconSize} />,
            label: 'Bucket Tool'
        },
        {
            name: 'eraserTool',
            icon: <TrashIcon className={iconSize} />,
            label: 'Eraser Tool'
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
                                <button>
                                    {tool.icon}
                                </button>
                            </Tippy>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}