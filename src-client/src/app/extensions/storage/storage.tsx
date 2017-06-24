import * as XP from 'reactxp';
import { StorageType } from './storageType';
import { Storage as StorageNative } from './storage.native';

class StorageClass implements StorageType {

    constructor() {
        console.log('Using StorageClass (web-memStorage/localStorage)');
    }

    private _supportsLocalStorage: boolean = undefined;
    get supportsLocalStorage() {
        return this._supportsLocalStorage !== undefined ? this._supportsLocalStorage
            : this._supportsLocalStorage = testLocalStorage();
    }

    private _memCache: { [key: string]: string } = {};

    async getItem(key: string): Promise<string> {
        if (this._memCache[key] === undefined) {
            this._memCache[key] = await this.getItem_noMemCache(key);
        }

        return this._memCache[key];
    }

    async getItem_noMemCache(key: string): Promise<string> {
        // console.log('getItem_noMemCache', { key });

        if (this.supportsLocalStorage) {
            return localStorage.getItem(key);
        } else {
            return null;
        }
    }

    async setItem(key: string, value: string) {
        this._memCache[key] = value;
        this.setItem_noMemCache(key, value);
    }

    async setItem_noMemCache(key: string, value: string) {
        // console.log('setItem_noMemCache', { key, value });
        if (this.supportsLocalStorage) {
            return localStorage.setItem(key, value);
        }
    }

    async hasItem(key: string) {
        return this.getItem(key) !== undefined;
    }
}

function testLocalStorage() {
    try {
        if (typeof localStorage === undefined) { return false; }
        const key = '___test' + Math.random();
        const value = 'Test Value';
        localStorage[key] = value;
        const isOk = localStorage[key] === value;
        localStorage.removeItem(key);
        return isOk;
    } catch (err) {
        return false;
    }
}

export const Storage =
    XP.Platform.getType() === 'web' ? new StorageClass() as StorageType
        : StorageNative;

