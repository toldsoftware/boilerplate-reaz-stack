import { createBlobService, BlobService } from "azure-storage";
import { asyncIt } from "./async-it";
import { gzip, gunzip } from 'zlib';

export async function createOrUpdateBlob_json(containerName: string, blobName: string, data: Object, cacheControlMaxAge = 300) {

    containerName = containerName.toLowerCase();
    blobName = blobName.toLowerCase();

    const blobOptions = {
        contentSettings: {
            contentType: 'application/json',
            contentEncoding: 'gzip',
            cacheControl: `public, max-age=${cacheControlMaxAge}`,
        },
        leaseId: undefined as string
    };

    const dataJson = JSON.stringify(data);
    const blobService = createBlobService();
    return await writeBlob(blobService, containerName, blobName, dataJson, blobOptions, (oldJson) => {
        const hasChange = oldJson !== dataJson;
        return { hasChange, dataJson };
    });
}

export async function replaceBlobJsonValue(containerName: string, blobName: string, key: string, value: Object, cacheControlMaxAge = 300) {
    containerName = containerName.toLowerCase();
    blobName = blobName.toLowerCase();

    const blobOptions = {
        contentSettings: {
            // These are just placeholders
            contentType: 'application/json',
            contentEncoding: 'gzip',
            cacheControl: `public, max-age=${cacheControlMaxAge}`,
        },
        leaseId: undefined as string
    };

    const blobService = createBlobService();
    return await writeBlob(blobService, containerName, blobName, JSON.stringify({ [key]: value }), blobOptions, (oldJson) => {
        const data = (oldJson && JSON.parse(oldJson)) || {};
        data[key] = value;

        const dataJson = JSON.stringify(data)
        const hasChange = oldJson !== dataJson;
        return { dataJson, hasChange };
    });
}

async function writeBlob(blobService: BlobService, containerName: string, blobNameRaw: string, dataJson: string,
    blobOptions: { leaseId: string, contentSettings: { contentEncoding: string, contentType: string, cacheControl: string } },
    modifyExistingData?: (oldJson: string) => { dataJson: string, hasChange: boolean }
) {

    containerName = containerName.toLowerCase();
    blobNameRaw = blobNameRaw.toLowerCase();

    const nameUid = `${new Date().toISOString()}_${Math.floor(Math.random() * 9999)}_`;
    const leaseBlobName = blobNameRaw + '.lease';
    const lookupBlobName = blobNameRaw + '.lookup.txt';
    const normalBlobName = nameUid + blobNameRaw;
    const compressedBlobName = normalBlobName + '.gzip';

    // const cacheControl_orig = blobOptions.contentSettings.cacheControl;

    let d: string | Buffer;
    let b: string;

    // Acquire Lease

    let leaseId: string = undefined;
    try {
        const lease = await asyncIt<BlobService.LeaseResult>(cb => blobService.acquireLease(containerName, leaseBlobName, { leaseDuration: 15 }, cb));
        leaseId = lease.id;
    } catch (err) {
        // Ensure err was caused because blob does not exist
        const bRes = await asyncIt<BlobService.BlobResult>(cb => blobService.doesBlobExist(containerName, leaseBlobName, cb));
        if (bRes.exists) {
            throw err;
        }

        // Ensure blob exists to create a lease
        await asyncIt(cb => blobService.createBlockBlobFromText(containerName, leaseBlobName, '', blobOptions, cb));
        const lease = await asyncIt<BlobService.LeaseResult>(cb => blobService.acquireLease(containerName, leaseBlobName, { leaseDuration: 15 }, cb));
        leaseId = lease.id;
    }

    if (modifyExistingData) {
        try {
            const actualBlobName = await asyncIt<string>(cb => blobService.getBlobToText(containerName, lookupBlobName, cb));
            const blobText = await asyncIt<string>(cb => blobService.getBlobToText(containerName, actualBlobName, cb));
            const modResult = modifyExistingData(blobText);
            dataJson = modResult.dataJson;

            // Skip creating new blobs if data has not changed
            if (!modResult.hasChange) {
                await asyncIt(cb => blobService.releaseLease(containerName, leaseBlobName, leaseId, cb));
                return { wasChanged: false };
            }

        } catch (err) {
            const isNotFoundError = err.code === 'BlobNotFound';
            if (!isNotFoundError) { throw err; }
        }
    }

    // It is possible to use the ".changed.txt" file to instead point to a permanently cached version
    // Pros: 
    // - Hashable Filename makes it harder to steal content
    // - Works with CDN
    // - Allows device caching to not rely on 5-min expiry
    // - Does not require cache busting params that break CDN (if query string passthrough is enabled)
    // Cons:
    // - Lookup is required to read or change data
    // - Cleanup is required (put date first for east filtering for cleanup tasks)

    // Normal
    d = dataJson;
    b = normalBlobName;
    blobOptions.contentSettings.contentType = 'application/json';
    blobOptions.contentSettings.contentEncoding = '';
    blobOptions.contentSettings.cacheControl = 'public, max-age=31536000';
    blobOptions.leaseId = undefined;
    await asyncIt(cb => blobService.createBlockBlobFromText(containerName, b, d, blobOptions, cb));

    // Compressed
    d = await gzipText(dataJson);
    b = compressedBlobName;
    blobOptions.contentSettings.contentType = 'application/json';
    blobOptions.contentSettings.contentEncoding = 'gzip';
    blobOptions.contentSettings.cacheControl = 'public, max-age=31536000';
    blobOptions.leaseId = undefined;
    await asyncIt(cb => blobService.createBlockBlobFromText(containerName, b, d, blobOptions, cb));

    // // Change Time
    // d = '' + Date.now();
    // b = blobName + '.changed.txt';
    // blobOptions.contentSettings.contentType = 'text/plain';
    // blobOptions.contentSettings.contentEncoding = '';
    // blobOptions.contentSettings.cacheControl = `no-cache`,
    // blobOptions.leaseId = undefined;
    // await asyncIt(cb => blobService.createBlockBlobFromText(containerName, b, d, blobOptions, cb));

    // Lookup
    d = normalBlobName;
    b = lookupBlobName;
    blobOptions.contentSettings.contentType = 'text/plain';
    blobOptions.contentSettings.contentEncoding = '';
    blobOptions.contentSettings.cacheControl = `no-cache`;
    blobOptions.leaseId = undefined;
    await asyncIt(cb => blobService.createBlockBlobFromText(containerName, b, d, blobOptions, cb));

    // Release Lease
    await asyncIt(cb => blobService.releaseLease(containerName, leaseBlobName, leaseId, cb));
    return { wasChanged: true };
}

async function gzipText(dataJson: string) {
    return new Promise<Buffer>((resolve, reject) => {
        gzip(dataJson as any, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
    });
}

// async function gzipJson(data: any) {
//     return new Promise<Buffer>((resolve, reject) => {
//         gzip(JSON.stringify(data) as any, (err, res) => {
//             if (err) {
//                 reject(err);
//             }
//             resolve(res);
//         });
//     });
// }

// async function gunzipJson<T>(data: any) {
//     return new Promise<T>((resolve, reject) => {
//         gunzip(data, (err, res) => {
//             if (err) {
//                 reject(err);
//             }
//             const text = res.toString('utf8');
//             const obj = JSON.parse(text);
//             resolve(obj);
//         });
//     });
// }