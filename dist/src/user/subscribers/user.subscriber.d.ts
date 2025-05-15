import { EntitySubscriberInterface, InsertEvent, UpdateEvent } from "typeorm";
import { UserEntity } from "../entites/user.entity";
export declare class UaserSubscriber implements EntitySubscriberInterface<UserEntity> {
    constructor();
    listenTo(): typeof UserEntity;
    afterLoad(entity: UserEntity): Promise<void>;
    afterInsert(event: InsertEvent<UserEntity>): void;
    afterUpdate(event: UpdateEvent<UserEntity>): void;
}
