import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IMovieUrlRepository } from 'src/core/interfaces/IMovieUrl-repository';
import { MovieUrl } from 'src/data/schemas/movie-url.schema';

@Injectable()
export class MovieUrlRepository implements IMovieUrlRepository {
  constructor(
    @InjectModel(MovieUrl.name) private movieUrlModel: Model<MovieUrl>,
  ) {}
  async createOne(entity: MovieUrl) {
    const createdEntity = new this.movieUrlModel(entity);
    return createdEntity.save();
  }

  async find() {
    return await this.movieUrlModel
      .find({ $or: [{ is_visited: false }, { is_visited: null }] })
      .lean();
  }

  async findOne(url: string) {
    return await this.movieUrlModel.findOne({
      url,
    });
  }

  async updateOne(id: string, movieUrl: MovieUrl) {
    return await this.movieUrlModel.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          ...movieUrl,
        },
      },
    );
  }

  async deleteOne(id: string) {
    return await this.movieUrlModel.deleteOne({
      _id: id,
    });
  }
}
