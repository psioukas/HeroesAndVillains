import DeleteIcon from '@mui/icons-material/Delete'
import { Box, BoxProps, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import Store from '../../store'
import Button from '../Button'
import CharacterAvatar from '../character/CharacterAvatar'

const StyledCharacterDetailsView = styled(Box)<BoxProps>(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
        gap: theme.spacing(2),
    },
    [theme.breakpoints.down('sm')]: {
        height: '100%',
        '& .btnDelete': {
            position: 'absolute',
            bottom: theme.spacing(4.5),
            left: 0,
            right: 0,
        },
    },
}))

const CharacterDetailsView = () => {
    const character = Store.selectedCharacter
    useEffect(() => {
        if (character && !window.location.pathname.includes(character.id)) {
            window.history.pushState(
                undefined,
                '',
                `${window.location.origin}/details/${character.id}`
            )
        }
        return () => {
            window.history.pushState(undefined, '', `${window.location.origin}`)
        }
    }, [character])

    const handleDeleteCharacter = async () => {
        if (!character) return
        // const successfull: boolean = await CharacterApiRequests.deleteCharacter(character.id);
        // if (successfull) {
        Store.notification.show('Please wait deleting character', 'info')
        setTimeout(() => {
            Store.deleteCharacter(character)
            setTimeout(() => {
                Store.notification.show(
                    'Character deleted successfully',
                    'success'
                )
            }, 100)
        }, 1100)
    }

    return character ? (
        <StyledCharacterDetailsView data-testid="character-details-view">
            <CharacterAvatar
                src={character.avatarUrl}
                alt="character avatar"
                width={94}
                height={94}
                style={{ alignSelf: 'center' }}
                mt={Store.isMobile ? 10 : 0}
            />

            <Typography
                alignSelf={'center'}
                fontWeight={'bold'}
                variant="body1"
                mt={Store.isMobile ? 10 : 0}
                mb={Store.isMobile ? 0.5 : 0}
            >
                {character.fullName}
            </Typography>
            <Typography
                alignSelf={'center'}
                variant="body2"
                mb={Store.isMobile ? 8 : 0}
            >
                {character.type.name}
            </Typography>
            <Typography alignSelf={'center'} variant="body2">
                {character.description}
            </Typography>
            <Button
                variant={'text'}
                textColor={'#bb4d5f'}
                startIcon={<DeleteIcon />}
                onClick={handleDeleteCharacter}
                className={'btnDelete'}
            >
                Delete character
            </Button>
        </StyledCharacterDetailsView>
    ) : null
}

export default observer(CharacterDetailsView)
