import {
    applySnapshot,
    getRoot,
    IAnyStateTreeNode,
    Instance,
    SnapshotIn,
    SnapshotOut,
    types,
} from 'mobx-state-tree'
import { baseApiUrl } from '../utils/CharacterApiRequests'
import { ICharacter, ICharacterType } from '../types'
import { v4 } from 'uuid'

const Modal = types
    .model('Modal', {
        title: types.optional(types.string, ''),
        visible: types.optional(types.boolean, false),
    })
    .actions((self) => ({
        setVisibility: (value: boolean) => {
            self.visible = value
        },
    }))
const Notification = types
    .model('Notification', {
        isVisible: types.boolean,
        msg: types.optional(types.string, ''),
        type: types.optional(types.string, ''),
    })
    .actions((self) => ({
        show: (msg: string, type: string = 'primary') => {
            self.msg = msg
            self.type = type
            self.isVisible = true
        },
        close: () => {
            self.isVisible = false
        },
    }))
const CharacterType = types.model('CharacterType', {
    id: types.identifier,
    name: types.string,
})

const Character = types.model('Character', {
    id: types.identifier,
    avatarUrl: types.string,
    description: types.string,
    fullName: types.string,
    type: CharacterType,
})

const Modals = types
    .model('Modals', {
        character: types.model({
            add: types.optional(Modal, {
                visible: false,
                title: 'Add character',
            }),
            update: types.optional(
                types.compose(
                    Modal,
                    types.model({
                        characterToUpdate: types.maybe(
                            types.reference(Character)
                        ),
                    })
                ),
                {
                    visible: false,
                    title: 'Update character',
                    characterToUpdate: undefined,
                }
            ),
            addType: types.optional(Modal, {
                visible: false,
                title: 'Add character type',
            }),
            showDetails: types.optional(Modal, {
                visible: false,
                title: 'Character details',
            }),
        }),

        confirmationModal: types.optional(Modal, { visible: false, title: '' }),
    })
    .views((self) => ({
        get activeModalTitle() {
            type ModalsType = typeof self
            const keys: string[] = Object.keys(self).filter(
                (key: string) => self[key as keyof ModalsType].visible
            )
            if (keys.length > 0) {
                return self[keys[0] as keyof ModalsType].title
            }
            return ''
        },
        get isAnyModalOpen(): boolean {
            type ModalsType = typeof self
            type CharacterModals = typeof self.character

            return (
                Object.keys(self).some(
                    (key: string) => self[key as keyof ModalsType].visible
                ) ||
                Object.keys(self.character).some(
                    (key) =>
                        self.character[key as keyof CharacterModals].visible
                )
            )
        },
    }))
    .actions((self) => ({
        closeOpenModal: () => {
            if (self.isAnyModalOpen) {
                type ModalsType = typeof self
                type CharacterModalsType = typeof self.character
                const root = rootOf(self)

                Object.keys(self)
                    .filter(
                        (key: string) => self[key as keyof ModalsType].visible
                    )
                    .forEach((key) => {
                        const isVisible = self[key as keyof ModalsType].visible
                        if (isVisible) {
                            self[key as keyof ModalsType].visible = false
                        }
                    })

                Object.keys(self.character)
                    .filter(
                        (key) =>
                            self.character[key as keyof CharacterModalsType]
                                .visible
                    )
                    .forEach((key) => {
                        const isVisible =
                            self.character[key as keyof CharacterModalsType]
                                .visible
                        if (isVisible) {
                            self.character[
                                key as keyof CharacterModalsType
                            ].visible = false
                            if (
                                key === 'showDetails' &&
                                root.selectedCharacterId.trim()
                            ) {
                                root.clearSelectedCharacter()
                            }
                        }
                    })
            }
        },
    }))

const RootStore = types
    .model('Store', {
        isMobile: types.optional(types.boolean, false),
        loading: types.optional(types.boolean, true),
        modals: types.optional(Modals, {
            confirmationModal: { visible: false, title: '' },
            character: {
                update: { visible: false, title: '' },
                add: { visible: false, title: '' },
                addType: { visible: false, title: '' },
                showDetails: { visible: false, title: '' },
            },
        }),
        characters: types.optional(types.array(Character), []),
        characterTypes: types.optional(types.array(CharacterType), [
            { id: v4(), name: 'Character' },
            {
                id: v4(),
                name: 'Villain',
            },
        ]),
        selectedCharacterId: types.optional(types.string, ''),
        notification: Notification,
        fatalError: types.maybe(
            types.model({
                msg: types.optional(types.string, ''),
                from: types.optional(types.string, ''),
            })
        ),
    })
    .actions((self) => ({
        setIsMobile: (isMobile: boolean) => {
            self.isMobile = isMobile
        },
        setLoading: (isLoading?: boolean) => {
            if (isLoading === undefined) {
                self.loading = !self.loading
            } else {
                self.loading = isLoading
            }
        },
        setCharacterTypes: (characterTypes: ICharacterType[]) => {
            self.characterTypes.replace(characterTypes)
        },
        addCharacters: (characters: ICharacter[]) => {
            characters
                .filter(
                    (character) =>
                        !self.characters.some(
                            (_character) => _character.id === character.id
                        )
                )
                .forEach((character) => {
                    if (character.avatarUrl.startsWith('/static')) {
                        character.avatarUrl = baseApiUrl + character.avatarUrl
                    }
                    self.characters.push(character)
                })
        },
        addCharacter: (character: ICharacter) => {
            self.characters.push(character)
            sessionStorage.setItem(
                'characters',
                JSON.stringify(self.characters)
            )
            self.modals.closeOpenModal()
        },
        createCharacterType: (characterType: ICharacterType) => {
            self.characterTypes.push(characterType)
            sessionStorage.setItem(
                'characterTypes',
                JSON.stringify(self.characterTypes)
            )
        },
        deleteCharacterType: (characterType?: ICharacterType) => {
            if (!characterType) return
            self.characterTypes.remove(characterType)
            sessionStorage.setItem(
                'characterTypes',
                JSON.stringify(self.characterTypes)
            )
        },
        deleteCharacter: (character?: ICharacter) => {
            if (!character) return
            self.characters.remove(character)
            sessionStorage.setItem(
                'characters',
                JSON.stringify(self.characters)
            )
            self.modals.closeOpenModal()
        },
        editCharacter: (character: ICharacter) => {
            self.modals.character.update.visible = true
            self.modals.character.update.characterToUpdate = character
        },
        updateCharacter: (updatedCharacter: ICharacter) => {
            const character = self.characters.find(
                (_character) => _character.id === updatedCharacter.id
            )
            if (!character) return
            applySnapshot(character, updatedCharacter)
            sessionStorage.setItem(
                'characters',
                JSON.stringify(self.characters)
            )
            self.modals.closeOpenModal()
        },
        setSelectedCharacter: (characterId: string) => {
            self.selectedCharacterId = characterId
        },
        showCharacterDetails: (characterId?: string) => {
            if (!characterId) return
            if (
                self.characters.some(
                    (character) => character.id === characterId
                )
            ) {
                rootOf(self).setSelectedCharacter(characterId)
                self.modals.closeOpenModal()
                self.modals.character.showDetails.setVisibility(true)
            }
        },
        clearSelectedCharacter: () => {
            self.selectedCharacterId = ''
        },
    }))
    .views((self) => ({
        get selectedCharacter(): ICharacter | undefined {
            const character: ICharacter | undefined = self.characters.find(
                (character) => character.id === self.selectedCharacterId
            )
            return character
        },
    }))

export interface IRootStore extends Instance<typeof RootStore> {}

export interface IRootStoreSnapshotIn extends SnapshotIn<typeof RootStore> {}

export interface IRootStoreSnapshotOut extends SnapshotOut<typeof RootStore> {}

export const rootOf = (self: IAnyStateTreeNode): IRootStore => getRoot(self)
export default RootStore
