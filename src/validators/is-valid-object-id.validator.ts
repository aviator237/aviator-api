import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, } from 'class-validator';
import { DataSource, EntityTarget, ObjectLiteral } from 'typeorm';
import * as dotenv from "dotenv";
dotenv.config();

const MYSQL_ADDON_HOST = process.env.MYSQL_ADDON_HOST
const MYSQL_ADDON_PORT = parseInt(process.env.MYSQL_ADDON_PORT)
const MYSQL_ADDON_USER = process.env.MYSQL_ADDON_USER
const MYSQL_ADDON_PASSWORD = process.env.MYSQL_ADDON_PASSWORD
const MYSQL_ADDON_DB = process.env.MYSQL_ADDON_DB

const MYSQL_ADDON_URI = `mysql://${MYSQL_ADDON_USER}:${MYSQL_ADDON_PASSWORD}@${MYSQL_ADDON_HOST}:${MYSQL_ADDON_PORT}/${MYSQL_ADDON_DB}`

@ValidatorConstraint({ async: true })
export class IsValidObjectIdConstraint implements ValidatorConstraintInterface {
    public async validate(id: any, args: ValidationArguments) {
        const myDataSource = new DataSource({
            type: "mysql",
            url: MYSQL_ADDON_URI,
            entities: ["dist/**/*.entity{.ts,.js}"],
        });
        await myDataSource.initialize();
        const repository = myDataSource.getRepository(args.constraints[0]);
        const result: boolean = await repository.findOneBy({ id: id }).then(user => {
            if (user) return true;
            return false;
        });
        myDataSource.destroy();
        return result;
    }

    public defaultMessage?(validationArguments?: ValidationArguments): string {
        return `Cant Not Found ${validationArguments.property} in Database : ${validationArguments.value}`;
    };
}


export function IsValidObjectId(target: EntityTarget<ObjectLiteral>, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [target],
            validator: IsValidObjectIdConstraint,
        });
    };

}