import RootStore from "./CharactersStore";
import { v4 } from "uuid";

const valuesFromSessionStorage = {
  characterTypes: () => {
    try {
      const sessionStorageCharactersTypes =
        sessionStorage.getItem("characterTypes");
      if (sessionStorageCharactersTypes !== null)
        return JSON.parse(sessionStorageCharactersTypes);
    } catch (e) {
      console.error("Error getting character types from local storage", e);
    }
    return undefined;
  },
  characters: () => {
    try {
      const sessionStorageCharacters = sessionStorage.getItem("characters");
      if (sessionStorageCharacters !== null)
        return JSON.parse(sessionStorageCharacters);
    } catch (e) {
      console.error("Error getting character from local storage", e);
    }
    return undefined;
  },
} as const;
export const initialStoreValues = {
  isMobile: false,
  selectedCharacterId: "",
  modals: {
    addCharacter: { visible: false, title: "Add Character" },
    characterDetails: { visible: false, title: "" },
  },
  character: valuesFromSessionStorage.characters(),
  characterTypes: valuesFromSessionStorage.characterTypes() ?? [
    { id: v4(), name: "Character" },
    {
      id: v4(),
      name: "Villain",
    },
  ],
  loading: true,
  notification: {
    isVisible: false,
    msg: "",
    type: "success",
  },
  fatalError: undefined,
};
const Store = RootStore.create(initialStoreValues);
export default Store;
