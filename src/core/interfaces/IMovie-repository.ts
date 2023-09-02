import { Movie } from '../models/movie';
import { IGenericRepository } from './generic-repository';

export interface IMovieRepository extends IGenericRepository<Movie> {
  findOne(id: string): Promise<Movie>;

  createOne(entity: Movie): Promise<Movie>;

  updateOne(id: string, entity: Movie): void;

  find(): Promise<Movie[]>;

  deleteOne(id: string): void;
  
}
export const IMovieRepository = Symbol("IMovieRepository");
