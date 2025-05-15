import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { EntityTarget, ObjectLiteral } from 'typeorm';
export declare class IsValidObjectIdPipe implements PipeTransform {
    private readonly target;
    constructor(target: EntityTarget<ObjectLiteral>);
    transform(entry: any, metadata: ArgumentMetadata): Promise<any>;
}
