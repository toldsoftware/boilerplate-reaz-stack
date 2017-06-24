import { Storage } from './storage';

const version = 'v0_1';

export function autoDeviceStorage(defaultValue: any = null, classStorageKey = ''): any {
    return function (targetPrototype: any, propertyKey: string) {

        const propKey = version + classStorageKey + propertyKey + '__value';

        const descriptor: PropertyDescriptor = {};
        descriptor.get = function () {
            const self = this;
            // const key = propKey + (self['_store_instance_name'] || '');
            const key = propKey;
            let value = self[key];
            // console.log('get from self', { key, propKey, self, value: self[key] });

            if (value === undefined) {
                self[key] = null;
                value = defaultValue;

                // Get value from storage
                if (self.startLoading) { self.startLoading(); }
                const prom = Storage.getItem_noMemCache(key);
                prom.then(x => {
                    if (self.endLoading) { self.endLoading(); }
                    if (x == null) {
                        return;
                    }
                    self[key] = JSON.parse(x);

                    // console.log('get from storage', { key, self, value: self[key] });
                    self.trigger();
                });
            }
            return value;
        };

        descriptor.set = function (v: any) {
            const self = this;
            //const key = propKey + (self['_store_instance_name'] || '');
            const key = propKey;
            self[key] = v;
            Storage.setItem_noMemCache(key, JSON.stringify(v));
        }

        return descriptor;
    };
}