import { LiteEntityDto } from "../../dto/liteEntityDto";
import { StoryImageItemDto } from './storyImageDto'
export interface StoryDto {
    description: string;
    creationTime: Date;
    userId: number;
    user: LiteEntityDto;
    storyImages: StoryImageItemDto[];
    id: number
}