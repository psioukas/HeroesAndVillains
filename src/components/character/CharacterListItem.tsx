import {IconButton, Menu, MenuItem, Paper, PaperProps, Typography} from '@mui/material';
import {styled, useTheme} from '@mui/material/styles';
import {observer} from 'mobx-react-lite';
import React, {useEffect, useRef, useState} from 'react';
import Store from '../../store';
import {ICharacter} from '../../types';
import CharacterAvatar from './CharacterAvatar';
import {Workspaces} from '@mui/icons-material';

const StyledCharacterListItem = styled(Paper)<PaperProps>(({theme}) => ({
    background: theme.palette.common.white,
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(9),
    [theme.breakpoints.up('sm')]: {
        display: 'flex',
        gap: theme.spacing(4),
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        minHeight: theme.spacing(17.5),
        height: theme.spacing(17.5),
    },
    [theme.breakpoints.down('sm')]: {
        display: 'grid',
        gridTemplateAreas: `
        "character-avatar character-name"
        "character-avatar character-type"
        "character-description character-description"
        `,
        paddingBlock: theme.spacing(4),
        columnGap: theme.spacing(6),
        gridTemplateColumns: `${theme.spacing(11.5)} 1fr`,
        gridTemplateRows: `${theme.spacing(5.75)} ${theme.spacing(5.75)} 1fr`,
        minHeight: theme.spacing(27),
        height: theme.spacing(27),
        '&>:last-child': {
            marginTop: theme.spacing(2),
        },
    },
}));

const CharacterListItem: React.FC<{ character: ICharacter }> = ({character}) => {
    const theme = useTheme();
    const listItemRef = useRef<HTMLDivElement>(null);
    const [openItemContextMenu, setOpenItemContextMenu] = useState<boolean>(false);
    const [mouseOver, setMouseOver] = useState<boolean>(false);
    const handleHoverStart = () => {
        setMouseOver(true);
    };
    const handleHoverFinish = () => {
        setMouseOver(false);
    };
    useEffect(() => {
        if (Store.selectedCharacterId === character.id) {
            Store.setSelectedCharacter('');
            if (listItemRef.current) {
                listItemRef.current.scrollIntoView({
                    behavior: 'smooth',
                    inline: 'center',
                    block: 'center',
                });

            }
        }
    }, [character]);

    function handleListItemAction(action: string) {
        switch (action) {
            case 'delete':
                if (window.confirm('Are you sure you want to delete this character?')) {
                    Store.deleteCharacter(character);
                }
                break
            case 'update':
                Store.modals.updateCharacter(character)
                break
        }
        setOpenItemContextMenu(false)
    }

    return (
        <>
            <StyledCharacterListItem
                id={`character-list-item-${character.id}`}
                ref={listItemRef}
                elevation={mouseOver ? 3 : 0}
                onMouseEnter={handleHoverStart}
                onMouseLeave={handleHoverFinish}
                onTouchStart={handleHoverStart}
                onTouchEnd={handleHoverFinish}
                onClick={(e) => {

                    if (e.currentTarget === listItemRef.current)
                        Store.showCharacterDetails(character.id);
                }}
            >
                <CharacterAvatar
                    src={character.avatarUrl}
                    alt={`${character.fullName} avatar`}
                    height={theme.spacing(11.25)}
                    width={theme.spacing(11.25)}
                    mr={5}
                    gridArea={'character-avatar'}
                />
                <Typography
                    variant={'body1'}
                    fontWeight={'bolder'}
                    flex={4}
                    whiteSpace={'nowrap'}
                    overflow={'hidden'}
                    textOverflow={'ellipsis'}
                    gridArea={'character-name'}
                >
                    {character.fullName}
                </Typography>
                <Typography
                    variant={'body1'}
                    flex={3}
                    whiteSpace={'nowrap'}
                    overflow={'hidden'}
                    textOverflow={'ellipsis'}
                    gridArea={'character-type'}
                >
                    {character.type.name}
                </Typography>
                <Typography
                    variant={'body1'}
                    flex={4}
                    whiteSpace={'nowrap'}
                    overflow={'hidden'}
                    textOverflow={'ellipsis'}
                    gridArea={'character-description'}
                >
                    {character.description}
                </Typography>

                <IconButton sx={{
                    transition: 'transform 400ms ease-in-out',
                    '&:hover': {
                        transform: 'rotate(120deg)',
                    }
                }}
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setOpenItemContextMenu(true)
                            }}
                >
                    <Workspaces/>
                </IconButton>

            </StyledCharacterListItem>
            <Menu open={openItemContextMenu}
                  anchorEl={listItemRef.current}
                  onClose={() => {
                      setOpenItemContextMenu(false)
                  }}
                  anchorOrigin={{horizontal: 'right', vertical: "center"}}>
                <MenuItem onClick={() => handleListItemAction('delete')}>Delete</MenuItem>
                <MenuItem onClick={() => handleListItemAction('update')}>Update
                </MenuItem>
            </Menu>
        </>
    );
};

export default observer(CharacterListItem);
