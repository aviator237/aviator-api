import { UserPermissionService } from './user-permission.service';
import { CreateUserPermissionDto } from './dto/create-user-permission.dto';
import { UpdateUserPermissionDto } from './dto/update-user-permission.dto';
export declare class UserPermissionController {
    private readonly userPermissionService;
    constructor(userPermissionService: UserPermissionService);
    create(createUserPermissionDto: CreateUserPermissionDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateUserPermissionDto: UpdateUserPermissionDto): string;
    remove(id: string): string;
}
