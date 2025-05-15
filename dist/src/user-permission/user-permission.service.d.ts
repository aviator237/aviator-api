import { CreateUserPermissionDto } from './dto/create-user-permission.dto';
import { UpdateUserPermissionDto } from './dto/update-user-permission.dto';
export declare class UserPermissionService {
    create(createUserPermissionDto: CreateUserPermissionDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateUserPermissionDto: UpdateUserPermissionDto): string;
    remove(id: number): string;
}
