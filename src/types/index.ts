export interface IHeroType {
    id: string;
    name: string;
}

export interface IHero {
    id: string;
    fullName: string;
    avatarUrl: string;
    description: string;
    type: IHeroType;
}

export type CreateHeroType = Omit<IHero, 'type' | 'id'> & {
    typeId: string;
};

export interface IHeroesListResponse {
    data: IHero[];
    totalCount: number;
}
