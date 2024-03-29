import { Box, BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import {useState} from "react";

const StyledImageContainer = styled(Box)<BoxProps>(() => ({
    '& > img': {
        borderRadius: '50%',
        userSelect: 'none',
        pointerEvents: 'none',
    },
}));

interface IHeroAvatar extends BoxProps {
    src?: string;
    alt?: string;
    height?: string | number;
    width?: string | number;
}
const HeroAvatar = ({ src, alt, ...props }: IHeroAvatar) => {
    const [imgUrl,setImgUrl] = useState(src);

    return (
        <StyledImageContainer display={props.display ?? 'inline'} {...props}>
            <img
                src={imgUrl}
                alt={alt ?? 'hero avatar'}
                height={props.height ?? '100%'}
                width={props.width ?? '100%'}
                onError={() => setImgUrl('https://via.placeholder.com/150')}
            />
        </StyledImageContainer>
    );
};

export default HeroAvatar;
