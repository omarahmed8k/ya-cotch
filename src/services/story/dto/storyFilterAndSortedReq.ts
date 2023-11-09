import StoryType from "../../types/storyType";

export interface StoryFilterAndSortedReq {
    maxResultCount?: number;
    skipCount?: number;
    isActive?: boolean;
    keyword?: string;
    type?: StoryType;
}
