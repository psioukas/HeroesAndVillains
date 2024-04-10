import { Box, BoxProps, CircularProgress } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useEffect, useState } from 'react'

const StyledImageContainer = styled(Box)<BoxProps>(() => ({
    '& > img': {
        borderRadius: '50%',
        userSelect: 'none',
        pointerEvents: 'none',
    },
}))

interface ICharacterAvatar extends BoxProps {
    src: string
    alt?: string
    height?: string | number
    width?: string | number
}

const CharacterAvatar = ({ src, alt, ...props }: ICharacterAvatar) => {
    const [imgUrl, setImgUrl] = useState(src)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        setLoading(true)
        setImgUrl(src)
    }, [src])

    return (
        <StyledImageContainer {...props}>
            {loading && (
                <CircularProgress
                    size={'10'}
                    color={'primary'}
                    sx={{ display: 'block' }}
                />
            )}
            <img
                src={imgUrl}
                onLoad={() => {
                    setTimeout(() => setLoading(false), 450)
                }}
                onError={() => {
                    setImgUrl('https://via.placeholder.com/150')
                    setTimeout(() => setLoading(false), 450)
                }}
                style={{ display: loading ? 'none' : 'inline-block' }}
                alt={alt ?? 'character avatar'}
                height={props.height ?? '100%'}
                width={props.width ?? '100%'}
            />
        </StyledImageContainer>
    )
}

export default CharacterAvatar
