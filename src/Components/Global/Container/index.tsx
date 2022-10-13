import React from 'react'

type Props = {
    children?: | JSX.Element | JSX.Element[]
}

const Container: React.FunctionComponent<Props> = ({
    children
}: Props) => {    

    return (
        <div className='w-full bg-black'>
            {children}
        </div>
    )
}

export default Container