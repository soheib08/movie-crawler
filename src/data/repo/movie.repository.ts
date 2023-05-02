import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IMovieRepository } from 'src/core/interfaces/IMovie-repository';
import { Movie } from 'src/data/schemas/movie.schema';

@Injectable()
export class MovieRepository implements IMovieRepository {
  constructor(@InjectModel(Movie.name) private movieModel: Model<Movie>) {}
  
  async createOne(entity: Movie) {
    const createdEntity = new this.movieModel(entity);
    return createdEntity.save();
  }

  async find() {
    return await this.movieModel.find().lean();
  }

  async findOne(id: string) {
    return await this.movieModel.findOne({
      _id: id,
    });
  }

  async updateOne(id: string, updatedEntityDto: Movie) {
    return await this.movieModel.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          ...updatedEntityDto,
        },
      },
    );
  }

  async deleteOne(id: string) {
    return await this.movieModel.deleteOne({
      _id: id,
    });
  }
}
