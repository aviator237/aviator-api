import { UserRoleEnum } from "src/enum/user-role.enum";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("setting")
export class SettingEntity {
    

    @PrimaryGeneratedColumn()
    id: number;


    @Column({
        unique: true,
    })
    settingName: string;


    @Column()
    settingValue: string;


    @Column()
    type: string;

}
