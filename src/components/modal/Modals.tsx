import CloseIcon from '@mui/icons-material/Close'
import {
    Box,
    BoxProps,
    IconButton,
    Modal,
    Paper,
    PaperProps,
    SvgIconProps,
    Typography,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { observer } from 'mobx-react-lite'
import Store from '../../store'
import AddCharacterView from './AddCharacterView'
import CharacterDetailsView from './CharacterDetailsView'
import AddCharacterTypeView from './AddCharacterTypeView.tsx'
import UpdateCharacterView from './UpdateCharacterView.tsx'

const StyledModalBody = styled(Paper)<PaperProps>(({ theme }) => ({
    position: 'absolute',
    paddingBlock: theme.spacing(6),
    background: theme.palette.background.default,
    outline: 'none',
    [theme.breakpoints.up('sm')]: {
        width: theme.spacing(90),
        left: '50%',
        top: '50%',
        transform: 'translate(-50%,-50%)',
        paddingInline: theme.spacing(9),
    },
    [theme.breakpoints.down('sm')]: {
        height: '100%',
        width: '100%',
        left: 0,
        top: 0,
        paddingInline: theme.spacing(4.5),
    },
}))

const StyledModalHeader = styled(Box)<BoxProps>(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    height: theme.spacing(6.25),
}))

const StyledModalContent = styled(Box)<BoxProps>(({ theme }) => ({
    width: '100%',
    height: `calc(100% - ${theme.spacing(6.25)})`,
}))

const StyledIconButton = styled(IconButton)<SvgIconProps>(() => ({
    color: '#7f7f7f',
    marginLeft: 'auto',
    '&:hover ': {
        color: '#4d4d4d',
    },
    '&: active': {
        color: '#272727',
    },
}))
const Modals = () => {
    return (
        <Modal
            open={Store.modals.isAnyModalOpen}
            onClose={Store.modals.closeOpenModal}
            sx={{
                width: Store.isMobile ? '100%' : 'auto',
            }}
        >
            <StyledModalBody>
                <StyledModalHeader>
                    {Store.modals.activeModalTitle && (
                        <Typography variant={'h6'}>
                            {Store.modals.activeModalTitle}
                        </Typography>
                    )}
                    <StyledIconButton
                        data-testid="close-button"
                        aria-label="close modal"
                        disableFocusRipple
                        disableTouchRipple
                        onClick={Store.modals.closeOpenModal}
                    >
                        <CloseIcon fontSize={'medium'} />
                    </StyledIconButton>
                </StyledModalHeader>
                <StyledModalContent>
                    {Store.modals.character.add.visible && <AddCharacterView />}
                    {Store.modals.character.addType.visible && (
                        <AddCharacterTypeView />
                    )}
                    {Store.modals.character.update.visible && (
                        <UpdateCharacterView />
                    )}
                    {Store.modals.character.showDetails.visible && (
                        <CharacterDetailsView />
                    )}
                </StyledModalContent>
            </StyledModalBody>
        </Modal>
    )
}
export default observer(Modals)
