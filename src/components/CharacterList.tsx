import { Box, BoxProps, Typography } from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import { observer } from 'mobx-react-lite'
import Store from '../store'
import { ICharacter } from '../types'
import CharacterListItem from './character/CharacterListItem'

const StyledCharacterList = styled(Box)<ICharacterList>(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    overflowY: 'scroll',
    gap: theme.spacing(2),
    paddingRight: theme.spacing(2.5),

    [theme.breakpoints.up('sm')]: {
        height: `calc(100% - ${theme.spacing(72)})`,
        paddingTop: theme.spacing(3.5),
        paddingRight: theme.spacing(2.5),
    },
    [theme.breakpoints.down('sm')]: {
        height: `calc(100% - ${theme.spacing(40)})`,
    },
}))
const StyledCharacterListHeader = styled(Box)<ICharacterList>(({ theme }) => ({
    display: 'flex',
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(9),
    gap: theme.spacing(4),
}))

interface ICharacterList extends BoxProps {}

const CharacterList = () => {
    const theme = useTheme()

    const characters = Store.characters
    return (
        <>
            {characters.length > 0 ? (
                <>
                    {!Store.isMobile && (
                        <StyledCharacterListHeader>
                            <Box
                                style={{
                                    width: theme.spacing(11.25),
                                    marginRight: theme.spacing(5),
                                }}
                            />
                            <Typography variant="body1" flex={4}>
                                Character
                            </Typography>
                            <Typography variant="body1" flex={3}>
                                Type
                            </Typography>
                            <Typography variant="body1" flex={4}>
                                Description
                            </Typography>
                        </StyledCharacterListHeader>
                    )}

                    <StyledCharacterList>
                        {characters.map((character: ICharacter) => (
                            <CharacterListItem
                                key={character.id}
                                character={character}
                            />
                        ))}
                    </StyledCharacterList>
                </>
            ) : (
                <Box
                    width={'100%'}
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                >
                    <Typography>No character found!</Typography>
                </Box>
            )}
        </>
    )
}

export default observer(CharacterList)
