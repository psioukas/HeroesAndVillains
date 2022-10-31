import { Button as MButton, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledButton = styled(MButton, {
    shouldForwardProp: (prop: string) =>
        !['bgColor', 'textColor', 'activeBgColor', 'activeTextColor'].includes(prop),
})<IButton>(({ theme, textColor, bgColor, activeBgColor, activeTextColor }) => ({
    backgroundColor: bgColor,
    color: textColor ?? theme.palette.common.white,
    padding: theme.spacing(2.5),
    height: theme.spacing(10),
    textTransform: 'capitalize',
    '&:hover': {
        backgroundColor: bgColor,
        color: textColor ?? theme.palette.common.white,
    },
    '&:active': {
        backgroundColor: activeBgColor ?? bgColor,
        color: activeTextColor ?? textColor ?? theme.palette.common.white,
    },
    '&.MuiButton-text': {
        transition: 'transform 250ms',
        backgroundColor: 'transparent',
        '&:active': {
            color: theme.palette.common.black,
        },
    },
}));
interface IButton extends ButtonProps {
    textColor?: string;
    bgColor?: string;
    activeBgColor?: string;
    activeTextColor?: string;
}
const Button = (props: IButton) => {
    return <StyledButton disableFocusRipple disableRipple disableElevation {...props} />;
};

export default Button;
