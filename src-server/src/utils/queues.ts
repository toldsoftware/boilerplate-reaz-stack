import { createQueueService, QueueService } from "azure-storage";
import { asyncIt } from "./async-it";

export async function initQueue(queueName: string) {
    const service = createQueueService();
    return await asyncIt<QueueService.QueueMessageResult>(cb => service.createQueueIfNotExists(queueName, cb));
}

export async function writeQueueMessage(queueName: string, data: any) {
    const service = createQueueService();
    return await asyncIt<QueueService.QueueMessageResult>(cb => service.createMessage(queueName, JSON.stringify(data), cb));
}

export interface QueueMessageBase {
    id: string;
    data: any;
    delete: () => Promise<any>;
}

export interface QueueMessage<T> extends QueueMessageBase {
    data: T;
}

export async function readQueueMessages<T>(queueName: string, limit: number = 32): Promise<QueueMessage<T>[]> {
    const service = createQueueService();

    // Save Data
    const result = await asyncIt<QueueService.QueueMessageResult[]>(cb => service.getMessages(queueName, { numOfMessages: limit }, cb));
    const id = '';

    return result.map(x => ({
        id: x.messageId,
        data: JSON.parse(x.messageText) as T,
        delete: async () => await asyncIt<{}>(cb => service.deleteMessage(queueName, x.messageId, x.popReceipt, cb))
    }));
}
