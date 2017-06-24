import { createTableService, TableService, TableUtilities, TableQuery } from "azure-storage";
import { asyncIt } from "./async-it";

const entGen = TableUtilities.entityGenerator;

export type EntityValueTypes = string | boolean | number | Date;
export type EntityValues = { [key: string]: EntityValueTypes };

export async function saveRow(tableName: string, partitionKey: string, rowKey: string, values: EntityValues, ...aliases: string[]) {
    const tableService = createTableService();

    partitionKey = partitionKey.toLowerCase();
    rowKey = rowKey.toLowerCase();
    aliases = aliases.map(x => x.toLowerCase());

    // Save Data
    const entity = convertToEntity(tableService, partitionKey, rowKey, values);
    const result = await asyncIt<TableService.EntityMetadata>(cb => tableService.insertOrMergeEntity(tableName, entity, {}, cb));

    // Save Aliases
    for (let a of aliases) {
        const aliasEntity = convertToEntity(tableService, partitionKey, a, { _ref: '' + rowKey });
        await asyncIt<TableService.EntityMetadata>(cb => tableService.insertOrMergeEntity(tableName, aliasEntity, {}, cb));
    }

    return result;
}

export async function loadRow(tableName: string, partitionKey: string, rowKeyOrAlias: string) {
    const tableService = createTableService();

    partitionKey = partitionKey.toLowerCase();
    rowKeyOrAlias = rowKeyOrAlias.toLowerCase();

    try {

        // Get Entity
        let entity = await asyncIt<EntityValues>(cb => tableService.retrieveEntity(tableName, partitionKey, rowKeyOrAlias, { entityResolver }, cb));

        // Dereference Alias
        if (entity._ref) {
            entity = await asyncIt<EntityValues>(cb => tableService.retrieveEntity(tableName, partitionKey, entity._ref as string, { entityResolver }, cb));
        }

        const timestamp = Date.parse(entity.Timestamp as string);
        const metadata = {
            _timestamp: timestamp,
            _ageMs: Date.now() - timestamp,
        };

        return { ...entity, ...metadata } as typeof entity & typeof metadata;
    } catch (err) {
        console.warn(err);

        if (err && err.code === 'ResourceNotFound') {
            return null;
        }

        throw err;
    }
}

export async function loadRows(tableName: string, partitionKey: string, count: number) {
    const tableService = createTableService();

    partitionKey = partitionKey.toLowerCase();

    try {

        // Get Entity
        const query = new TableQuery()
            .top(count)
            .where('PartitionKey eq ?', partitionKey);

        const result = await asyncIt<TableService.QueryEntitiesResult<EntityValues>>(cb => tableService.queryEntities(tableName, query, null, { entityResolver }, cb));
        return result.entries;
    } catch (err) {
        console.warn(err);

        // if (err && err.code === 'ResourceNotFound') {
        //     return null;
        // }

        throw err;
    }
}

function entityResolver(en: any) {
    const r = {} as any;
    for (let k in en) {
        r[k] = en[k]._;
    }
    return r;
}

function convertToEntity(tableService: TableService, partitionKey: string, rowKey: string, values: { [key: string]: any }) {

    const entity = Object.getOwnPropertyNames(values).reduce((o, k) => {
        o[k] = convertToEntityValue(values[k]);
        return o;
    }, {} as { [key: string]: any });

    entity.PartitionKey = entGen.String(partitionKey);
    entity.RowKey = entGen.String(rowKey);

    return entity;
}

function convertToEntityValue(value: EntityValueTypes): any {

    if (typeof value === 'undefined') {
        return undefined;
    } else if (value === undefined) {
        return undefined;
    } else if (value === null) {
        return undefined;
    } else if (typeof value === 'string') {
        return entGen.String(value);
    } else if (typeof value === 'boolean') {
        return entGen.Boolean(value);
    } else if (typeof value === 'number') {
        if (Math.floor(value) === value) {
            return entGen.Int64(value);
        } else {
            return entGen.Double(value);
        }
    } else if (value instanceof Date) {
        return entGen.DateTime(value);
    } else { // if (typeof value === 'object') {
        return entGen.String(JSON.stringify(value));
    }
}