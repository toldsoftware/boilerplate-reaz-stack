export interface StorageType {
    getItem(key: string): Promise<string>;
    getItem_noMemCache(key: string): Promise<string>;
    setItem(key: string, value: string): Promise<void>;
    setItem_noMemCache(key: string, value: string): Promise<void>;
    hasItem(key: string): Promise<boolean>;
}