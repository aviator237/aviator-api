import { EntitySubscriberInterface, EventSubscriber, InsertEvent, RecoverEvent, RemoveEvent, SoftRemoveEvent, TransactionCommitEvent, TransactionRollbackEvent, TransactionStartEvent, UpdateEvent } from "typeorm"
import { UserEntity } from "../entites/user.entity";

@EventSubscriber()
export class UaserSubscriber implements EntitySubscriberInterface<UserEntity> {
    constructor(
    ) {
    }
    listenTo() {
        return UserEntity;
    }

    /**
     * Called after entity is loaded.
     */
    async afterLoad(entity: UserEntity) {
        // console.log(`AFTER ENTITY LOADED: `, entity)
        // try {
        //     if (entity.profilImage) {
        //         entity.profilImage = this.filesManagerService.getImageUrl(entity.profilImage);
        //     }
        // } catch (error) {
        //     console.log(error)
        // }
    }

    /**
     * Called before query execution.
     */
    // beforeQuery(event: BeforeQueryEvent<CompanyEntity>) {
    //     console.log(`BEFORE QUERY: `, event.query)
    // }

    /**
     * Called after query execution.
     */
    // afterQuery(event: AfterQueryEvent<CompanyEntity>) {
    //     console.log(`AFTER QUERY: `, event.query)
    // }

    /**
     * Called before entity insertion.
     */
    // beforeInsert(event: InsertEvent<CompanyEntity>) {
    //     console.log(`BEFORE ENTITY INSERTED: `, event.entity)
    // }

    /**
     * Called after entity insertion.
     */
    afterInsert(event: InsertEvent<UserEntity>) {
        // console.log(`AFTER ENTITY INSERTED: `, event.entity)
        //     if (event.entity?.profilImage) {
        //         event.entity.profilImage = this.filesManagerService.getImageUrl(event.entity.profilImage);
        //     }
    }

    /**
     * Called before entity update.
     */
    // beforeUpdate(event: UpdateEvent<CompanyEntity>) {
    //     console.log(`BEFORE ENTITY UPDATED: `, event.entity)
    // }

    /**
     * Called after entity update.
     */
    afterUpdate(event: UpdateEvent<UserEntity>) {
        // console.log(`AFTER ENTITY UPDATED: `, event.entity)
        // if (event.entity?.profilImage) {
        //     event.entity.profilImage = this.filesManagerService.getImageUrl(event.entity.profilImage);
        // }
    }

    /**
     * Called before entity removal.
     */
    // beforeRemove(event: RemoveEvent<CompanyEntity>) {
    //     console.log(
    //         `BEFORE ENTITY WITH ID ${event.entityId} REMOVED: `,
    //         event.entity,
    //     )
    // }

    /**
     * Called after entity removal.
     */
    // afterRemove(event: RemoveEvent<CompanyEntity>) {
    //     console.log(
    //         `AFTER ENTITY WITH ID ${event.entityId} REMOVED: `,
    //         event.entity,
    //     )
    // }

    /**
     * Called before entity removal.
     */
    // beforeSoftRemove(event: SoftRemoveEvent<CompanyEntity>) {
    //     console.log(
    //         `BEFORE ENTITY WITH ID ${event.entityId} SOFT REMOVED: `,
    //         event.entity,
    //     )
    // }

    /**
     * Called after entity removal.
     */
    // afterSoftRemove(event: SoftRemoveEvent<CompanyEntity>) {
    //     console.log(
    //         `AFTER ENTITY WITH ID ${event.entityId} SOFT REMOVED: `,
    //         event.entity,
    //     )
    // }

    /**
     * Called before entity recovery.
     */
    // beforeRecover(event: RecoverEvent<CompanyEntity>) {
    //     console.log(
    //         `BEFORE ENTITY WITH ID ${event.entityId} RECOVERED: `,
    //         event.entity,
    //     )
    // }

    /**
     * Called after entity recovery.
     */
    // afterRecover(event: RecoverEvent<CompanyEntity>) {
    //     console.log(
    //         `AFTER ENTITY WITH ID ${event.entityId} RECOVERED: `,
    //         event.entity,
    //     )
    // }

    /**
     * Called before transaction start.
     */
    // beforeTransactionStart(event: TransactionStartEvent) {
    //     console.log(`BEFORE TRANSACTION STARTED: `, event)
    // }

    /**
     * Called after transaction start.
     */
    // afterTransactionStart(event: TransactionStartEvent) {
    //     console.log(`AFTER TRANSACTION STARTED: `, event)
    // }

    /**
     * Called before transaction commit.
     */
    // beforeTransactionCommit(event: TransactionCommitEvent) {
    //     console.log(`BEFORE TRANSACTION COMMITTED: `, event)
    // }

    /**
     * Called after transaction commit.
     */
    // afterTransactionCommit(event: TransactionCommitEvent) {
    //     console.log(`AFTER TRANSACTION COMMITTED: `, event)
    // }

    /**
     * Called before transaction rollback.
     */
    // beforeTransactionRollback(event: TransactionRollbackEvent) {
    //     console.log(`BEFORE TRANSACTION ROLLBACK: `, event)
    // }

    /**
     * Called after transaction rollback.
     */
    // afterTransactionRollback(event: TransactionRollbackEvent) {
    //     console.log(`AFTER TRANSACTION ROLLBACK: `, event)
    // }
}