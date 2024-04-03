import RootStore from './HeroesStore';

const valuesFromSessionStorage = {
    heroes: () => {
        try {
            const sessionStorageHeroes = sessionStorage.getItem('heroes');
            if (sessionStorageHeroes !== null)
                return JSON.parse(sessionStorageHeroes);
        } catch (e) {
            console.error('Error getting heroes from local storage', e);
        }
        return undefined;
    }
} as const;
export const initialStoreValues = {
    isMobile: false,
    selectedHeroId: '',
    modals: {
        addHero: { visible: false, title: 'Add Hero' },
        heroDetails: { visible: false, title: '' },
    },
    heroes: valuesFromSessionStorage.heroes(),
    loading: true,
    notification: {
        isVisible: false,
        msg: '',
        type: 'success',
    },
};
const Store = RootStore.create(initialStoreValues);
export default Store;
