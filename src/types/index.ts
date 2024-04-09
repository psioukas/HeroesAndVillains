import { z } from "zod";

export const CharacterTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type ICharacterType = z.infer<typeof CharacterTypeSchema>;

export const CharacterSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  avatarUrl: z.string(),
  description: z.string(),
  type: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

export type ICharacter = z.infer<typeof CharacterSchema>;

export type CreateCharacterType = Omit<ICharacter, "type" | "id"> & {
  typeId: string;
};

export interface ICharacterListResponse {
  data: ICharacter[];
  totalCount: number;
}
