import { SystemError } from 'src/data/schemas/system-error.schema';
import { IGenericRepository } from './generic-repository';

export interface ISystemErrorRepository extends IGenericRepository<SystemError> {
  findOne(id: string): Promise<SystemError>;

  createOne(entity: SystemError): Promise<SystemError>;

  updateOne(id: string, entity: SystemError): void;

  find(): Promise<SystemError[]>;

  deleteOne(id: string): void;
  
}
export const ISystemErrorRepository = Symbol("ISystemErrorRepository");
