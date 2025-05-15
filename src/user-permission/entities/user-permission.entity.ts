import { Permission } from "src/enum/permission.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("user")
export class UserPermission {

    @PrimaryGeneratedColumn()
    id: number;

    // @Column({
    //     default: [Permission.Admin,
    //     Permission.User
    //     ]
    // })
    // @Man
    // permissions: Permission[];

}
