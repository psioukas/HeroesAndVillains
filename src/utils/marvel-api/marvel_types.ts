import { z } from 'zod'

const UrlSchema = z.object({
    type: z.string(),
    url: z.string(),
})

const ThumbnailSchema = z.object({
    path: z.string(),
    extension: z.string(),
})

const ItemSchema = z.object({
    resourceURI: z.string(),
    name: z.string(),
})

const ComicsSchema = z.object({
    available: z.number(),
    returned: z.number(),
    collectionURI: z.string(),
    items: z.array(ItemSchema),
})

const StoriesSchema = z.object({
    available: z.number(),
    returned: z.number(),
    collectionURI: z.string(),
    items: z.array(ItemSchema),
})

const EventsSchema = z.object({
    available: z.number(),
    returned: z.number(),
    collectionURI: z.string(),
    items: z.array(ItemSchema),
})

const SeriesSchema = z.object({
    available: z.number(),
    returned: z.number(),
    collectionURI: z.string(),
    items: z.array(ItemSchema),
})

const ResultSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    modified: z.date(),
    resourceURI: z.string(),
    urls: z.array(UrlSchema),
    thumbnail: ThumbnailSchema,
    comics: ComicsSchema,
    stories: StoriesSchema,
    events: EventsSchema,
    series: SeriesSchema,
})

const DataSchema = z.object({
    offset: z.number(),
    limit: z.number(),
    total: z.number(),
    count: z.number(),
    results: z.array(ResultSchema),
})

const CharacterResponseSchema = z.object({
    code: z.number(),
    status: z.string(),
    copyright: z.string(),
    attributionText: z.string(),
    attributionHTML: z.string(),
    data: DataSchema,
    etag: z.string(),
})

type CharacterResponse = z.infer<typeof CharacterResponseSchema>

export {
    type CharacterResponse,
    CharacterResponseSchema,
    DataSchema,
    ResultSchema,
    UrlSchema,
    ThumbnailSchema,
    ItemSchema,
    ComicsSchema,
    StoriesSchema,
    EventsSchema,
    SeriesSchema,
}
