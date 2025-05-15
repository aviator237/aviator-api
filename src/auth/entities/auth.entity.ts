import { TimestampEntities } from "generics/timestamp.entities";
import { UserEntity } from "src/user/entites/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("auth")
export class AuthEntity  extends TimestampEntities {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 50,
        unique: true,
    })
    emailToken: string;

    @ManyToOne(
        () => UserEntity,
        {onDelete: "SET NULL"}
    )
    @JoinColumn()
    user: UserEntity;




}
