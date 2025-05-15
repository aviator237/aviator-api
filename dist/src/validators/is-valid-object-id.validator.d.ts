import { ValidationOptions, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { EntityTarget, ObjectLiteral } from 'typeorm';
export declare class IsValidObjectIdConstraint implements ValidatorConstraintInterface {
    validate(id: any, args: ValidationArguments): Promise<boolean>;
    defaultMessage?(validationArguments?: ValidationArguments): string;
}
export declare function IsValidObjectId(target: EntityTarget<ObjectLiteral>, validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
