
export default class StoreBase {
    async wrapExecutionAsync(actionAsync: () => Promise<any>, beforExecting: () => void, afterExecting: () => void) {
        beforExecting();
        try {
            await actionAsync();
        } finally {
            afterExecting();
        }
    }
}