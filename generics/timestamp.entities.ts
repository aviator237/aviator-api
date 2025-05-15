import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm"


export class TimestampEntities {
    @CreateDateColumn({
        update: false
    })
    createAt: Date;

    @UpdateDateColumn()
    updateAt: Date;

    @DeleteDateColumn()
    deleteAt: Date;
}
