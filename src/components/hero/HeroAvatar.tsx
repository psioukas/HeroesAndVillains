import { Box, BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';

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
    return (
        <StyledImageContainer display={props.display ?? 'inline'} {...props}>
            <img
                src={src}
                alt={alt ?? 'hero avatar'}
                height={props.height ?? '100%'}
                width={props.width ?? '100%'}
            />
        </StyledImageContainer>
    );
};

export default HeroAvatar;
