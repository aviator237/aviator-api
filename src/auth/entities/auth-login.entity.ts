import { TimestampEntities } from "generics/timestamp.entities";
import { UserEntity } from "src/user/entites/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("auth-login")
export class AuthLoginEntity extends TimestampEntities {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false
    })
    loginCount: number;


    @OneToOne(
        () => UserEntity,
        (user) => user.authLogin
    )
    @JoinColumn()
    user: UserEntity;


}
