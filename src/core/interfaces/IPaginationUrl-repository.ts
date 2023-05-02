import { PaginationUrl } from '../models/pagination-url';
import { IGenericRepository } from './generic-repository';

export interface IPaginationUrlRepository
  extends IGenericRepository<PaginationUrl> {
  findOne(id: string): Promise<PaginationUrl>;

  createOne(entity: PaginationUrl): Promise<PaginationUrl>;

  updateOne(id: string, entity: PaginationUrl): void;

  find(): Promise<PaginationUrl[]>;

  deleteOne(id: string): void;
}

export const IPaginationUrlRepository = Symbol("IPaginationUrlRepository");
