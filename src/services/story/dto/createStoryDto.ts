interface CreateStoryDto {
    description: string,
    images: { url: string, isVideo: boolean }[]
}
export default CreateStoryDto