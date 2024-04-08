import {Box, BoxProps} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useEffect, useState} from "react";

const StyledImageContainer = styled(Box)<BoxProps>(() => ({
    '& > img': {
        borderRadius: '50%',
        userSelect: 'none',
        pointerEvents: 'none',
    },
}));

interface IHeroAvatar extends BoxProps {
    src: string;
    alt?: string;
    height?: string | number;
    width?: string | number;
}

const HeroAvatar = ({src, alt, ...props}: IHeroAvatar) => {
    const [imgUrl, setImgUrl] = useState(src);
    useEffect(() => {
        const imgEl = document.createElement('img');
        imgEl.onload = () => setImgUrl(src)
        imgEl.onerror = () => setImgUrl('https://via.placeholder.com/150');
        imgEl.src = src;
    }, [src])
    return (
        <StyledImageContainer display={props.display ?? 'inline'} {...props}>
            <img
                src={imgUrl}
                alt={alt ?? 'hero avatar'}
                height={props.height ?? '100%'}
                width={props.width ?? '100%'}
            />
        </StyledImageContainer>
    );
};

export default HeroAvatar;
