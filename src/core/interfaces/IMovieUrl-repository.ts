import { MovieUrl } from '../models/movie-url';
import { IGenericRepository } from './generic-repository';

export interface IMovieUrlRepository extends IGenericRepository<MovieUrl> {
  findOne(id: string): Promise<MovieUrl>;

  createOne(entity: MovieUrl): Promise<MovieUrl>;

  updateOne(id: string, entity: MovieUrl): Promise<void>;

  find(): Promise<MovieUrl[]>;

  deleteOne(id: string): void;
}
export const IMovieUrlRepository = Symbol("IMovieUrlRepository");
