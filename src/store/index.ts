import RootStore from './HeroesStore';
import {v4} from "uuid";

const valuesFromSessionStorage = {
    heroTypes: () => {
        try {
            const sessionStorageHeroTypes = sessionStorage.getItem('heroTypes');
            if (sessionStorageHeroTypes !== null)
                return JSON.parse(sessionStorageHeroTypes);
        } catch (e) {
            console.error('Error getting hero types from local storage', e);
        }
        return undefined;
    },
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
        addHero: {visible: false, title: 'Add Hero'},
        heroDetails: {visible: false, title: ''},
    },
    heroes: valuesFromSessionStorage.heroes(),
    heroTypes: valuesFromSessionStorage.heroTypes() ?? [{id: v4(), name: 'Hero'}, {id: v4(), name: 'Villain'}],
    loading: true,
    notification: {
        isVisible: false,
        msg: '',
        type: 'success',
    },
};
const Store = RootStore.create(initialStoreValues);
export default Store;
