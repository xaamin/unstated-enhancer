interface PersistConfig {
    key: string,
    version: number,
    storage: any,
    prefix?: string,
}

export default PersistConfig