import {applySnapshot, getRoot, IAnyStateTreeNode, Instance, SnapshotIn, SnapshotOut, types,} from 'mobx-state-tree';
import {baseApiUrl} from '../utils/HeroApiRequests';
import {IHero, IHeroType} from '../types';
import {v4} from "uuid";

const Modal = types
    .model('Modal', {
        title: types.optional(types.string, ''),
        visible: types.optional(types.boolean, false),
    })
    .actions(self => ({
        setVisibility: (value: boolean) => {
            self.visible = value;
        },
    }));
const Notification = types
    .model('Notification', {
        isVisible: types.boolean,
        msg: types.optional(types.string, ''),
        type: types.optional(types.string, ''),
    })
    .actions(self => ({
        show: (msg: string, type: string = 'primary') => {
            self.msg = msg;
            self.type = type;
            self.isVisible = true;
        },
        close: () => {
            self.isVisible = false;
        },
    }));
const Modals = types
    .model('Modals', {
        addHero: types.optional(Modal, {visible: false, title: ''}),
        addHeroType: types.optional(Modal, {visible: false, title: ''}),
        heroDetails: types.optional(Modal, {visible: false, title: ''}),
    })
    .views(self => ({
        get activeModalTitle() {
            type ModalsType = typeof self;
            const keys: string[] = Object.keys(self).filter(
                (key: string) => self[key as keyof ModalsType].visible,
            );
            if (keys.length > 0) {
                return self[keys[0] as keyof ModalsType].title;
            }
            return '';
        },
        get isAnyModalOpen(): boolean {
            type ModalsType = typeof self;
            return Object.keys(self).some((key: string) => self[key as keyof ModalsType].visible);
        },
    }))
    .actions(self => ({
        closeOpenModal: () => {
            if (self.isAnyModalOpen) {
                type ModalsType = typeof self;
                const root = rootOf(self);

                Object.keys(self)
                    .filter((key: string) => self[key as keyof ModalsType].visible)
                    .forEach(key => {
                        const isVisible = self[key as keyof ModalsType].visible;
                        if (isVisible) {
                            if (key === 'heroDetails' && root.selectedHeroId.trim()) {
                                root.clearSelectedHero();
                            }
                            self[key as keyof ModalsType].visible = false;
                        }
                    });
            }
        },
    }));

const HeroType = types.model('HeroType', {
    id: types.string,
    name: types.string,
});

const Hero = types.model('Hero', {
    id: types.string,
    avatarUrl: types.string,
    description: types.string,
    fullName: types.string,
    type: HeroType,
});

const RootStore = types
    .model('Store', {
        isMobile: types.optional(types.boolean, false),
        loading: types.optional(types.boolean, true),
        modals: Modals,
        heroes: types.optional(types.array(Hero), []),
        heroTypes: types.optional(types.array(HeroType), [{id: v4(), name: 'Hero'}, {id: v4(), name: 'Villain'}]),
        selectedHeroId: types.optional(types.string, ''),
        notification: Notification,
    })
    .actions(self => ({
        setIsMobile: (isMobile: boolean) => {
            self.isMobile = isMobile;
        },
        setLoading: (isLoading?: boolean) => {
            if (isLoading === undefined) {
                self.loading = !self.loading;
            } else {
                self.loading = isLoading;
            }
        },
        setHeroTypes: (heroTypes: IHeroType[]) => {
            self.heroTypes.replace(heroTypes);
        },
        addHeroes: (heroes: IHero[]) => {
            heroes
                .filter(hero => !self.heroes.some(_hero => _hero.id === hero.id))
                .forEach(hero => {
                    if (hero.avatarUrl.startsWith('/static')) {
                        hero.avatarUrl = baseApiUrl + hero.avatarUrl;
                    }
                    self.heroes.push(hero);
                });
        },
        addHero: (hero: IHero) => {
            self.heroes.push(hero);
            sessionStorage.setItem('heroes', JSON.stringify(self.heroes));
            self.modals.closeOpenModal();
        },
        createHeroType: (heroType: IHeroType) => {
            self.heroTypes.push(heroType);
            sessionStorage.setItem('heroTypes', JSON.stringify(self.heroTypes));
        },
        deleteHeroType: (heroType?: IHeroType) => {
            if (!heroType) return;
            self.heroTypes.remove(heroType);
            sessionStorage.setItem('heroTypes', JSON.stringify(self.heroTypes));
        },
        deleteHero: (hero?: IHero) => {
            if (!hero) return;
            self.heroes.remove(hero);
            sessionStorage.setItem('heroes', JSON.stringify(self.heroes));
            self.modals.closeOpenModal();
        },
        updateHero: (updatedHero: IHero) => {
            const hero = self.heroes.find(_hero => _hero.id === updatedHero.id);
            if (!hero) return;
            applySnapshot(hero, updatedHero);
            sessionStorage.setItem('heroes', JSON.stringify(self.heroes));
            self.modals.closeOpenModal();
        },
        setSelectedHero: (heroId: string) => {
            self.selectedHeroId = heroId;
        },
        showHeroDetails: (heroId?: string) => {
            if (!heroId) return;
            if (self.heroes.some(hero => hero.id === heroId)) {
                rootOf(self).setSelectedHero(heroId);
                self.modals.closeOpenModal();
                self.modals.heroDetails.setVisibility(true);
            }
        },
        clearSelectedHero: () => {
            self.selectedHeroId = '';
        },
    }))
    .views(self => ({
        get selectedHero(): IHero | undefined {
            const hero: IHero | undefined = self.heroes.find(
                hero => hero.id === self.selectedHeroId,
            );
            return hero;
        },
    }));

export interface IRootStore extends Instance<typeof RootStore> {
}

export interface IRootStoreSnapshotIn extends SnapshotIn<typeof RootStore> {
}

export interface IRootStoreSnapshotOut extends SnapshotOut<typeof RootStore> {
}

export const rootOf = (self: IAnyStateTreeNode): IRootStore => getRoot(self);
export default RootStore;
