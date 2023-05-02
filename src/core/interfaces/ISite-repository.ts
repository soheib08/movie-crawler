import { Site } from '../models/site';
import { IGenericRepository } from './generic-repository';

export interface ISiteRepository extends IGenericRepository<Site> {
  findOne(id: string): Promise<Site>;

  createOne(entity: Site): Promise<Site>;

  updateOne(id: string, entity: Site): void;

  find(): Promise<Site[]>;

  deleteOne(id: string): void;
}
export const ISiteRepository = Symbol("ISiteRepository");
