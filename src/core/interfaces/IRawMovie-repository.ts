import { RawMovie } from 'src/data/schemas/raw-movie.schema';
import { IGenericRepository } from './generic-repository';

export interface IRawMovieRepository extends IGenericRepository<RawMovie> {
  findOne(id: string): Promise<RawMovie>;

  createOne(entity: RawMovie): Promise<RawMovie>;

  updateOne(id: string, entity: RawMovie): void;

  find(): Promise<RawMovie[]>;

  deleteOne(id: string): void;
}
export const IRawMovieRepository = Symbol("IRawMovieRepository");
