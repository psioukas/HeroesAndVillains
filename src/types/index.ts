import {z} from "zod";

export const HeroTypeSchema = z.object({
    id: z.string(),
    name: z.string(),
});

export type IHeroType = z.infer<typeof HeroTypeSchema>;

    export const HeroSchema = z.object({
    id: z.string(),
    fullName: z.string(),
    avatarUrl: z.string(),
    description: z.string(),
    type: z.object({
        id: z.string(),
        name: z.string(),
    }),
})

export type IHero = z.infer<typeof HeroSchema>;

export type CreateHeroType = Omit<IHero, 'type' | 'id'> & {
    typeId: string;
};

export interface IHeroesListResponse {
    data: IHero[];
    totalCount: number;
}
