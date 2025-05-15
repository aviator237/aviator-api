import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { DataSource, EntityTarget, ObjectLiteral } from 'typeorm';
import * as dotenv from "dotenv";
dotenv.config();

const MYSQL_ADDON_HOST = process.env.MYSQL_ADDON_HOST
const MYSQL_ADDON_PORT = parseInt(process.env.MYSQL_ADDON_PORT)
const MYSQL_ADDON_USER = process.env.MYSQL_ADDON_USER
const MYSQL_ADDON_PASSWORD = process.env.MYSQL_ADDON_PASSWORD
const MYSQL_ADDON_DB = process.env.MYSQL_ADDON_DB

const MYSQL_ADDON_URI = `mysql://${MYSQL_ADDON_USER}:${MYSQL_ADDON_PASSWORD}@${MYSQL_ADDON_HOST}:${MYSQL_ADDON_PORT}/${MYSQL_ADDON_DB}`

@Injectable()
export class IsValidObjectIdPipe implements PipeTransform {
  constructor(
    private readonly target: EntityTarget<ObjectLiteral>
  ) { }
  async transform(entry: any, metadata: ArgumentMetadata) {
    const myDataSource = new DataSource({
      type: "mysql",
      url: MYSQL_ADDON_URI,
      entities: ["dist/**/*.entity{.ts,.js}"],
    });
    await myDataSource.initialize();
    const repository = myDataSource.getRepository(this.target)
    const myObjectExist = await repository.findOneBy({ id: entry }).then(object => {
      if (object) return true;
      return false;
    });
    myDataSource.destroy();
    if (!myObjectExist) {
      throw new NotFoundException(`Validation failed : Cant Not Found Object With Id: ${entry}`);
    }
    return entry;
  }

}
