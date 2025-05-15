

import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("update")
export class UpdateEntity {
    

    @PrimaryGeneratedColumn({name: "id"})
    id: number;


    @Column({
        unique: true,
    })
    name: string;

}
