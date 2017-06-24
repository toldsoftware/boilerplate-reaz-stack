import * as XP from 'reactxp';
import { StorageType } from './storageType';

class StorageClass implements StorageType {

    constructor() {
        console.log('Using StorageClass (native)');
    }

    getItem(key: string): Promise<string> {
        return XP.Storage.getItem(key);
    }
    getItem_noMemCache(key: string): Promise<string> {
        return XP.Storage.getItem(key);
    }
    setItem(key: string, value: string): Promise<void> {
        return XP.Storage.setItem(key, value);
    }
    setItem_noMemCache(key: string, value: string): Promise<void> {
        return XP.Storage.setItem(key, value);
    }
    hasItem = async (key: string): Promise<boolean> => {
        return (await XP.Storage.getItem(key)) != null;
    }

}

export const Storage = new StorageClass() as StorageType;
