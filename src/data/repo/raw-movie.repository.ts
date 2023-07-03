import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IMovieRepository } from 'src/core/interfaces/IMovie-repository';
import { RawMovie } from '../schemas/raw-movie.schema';

@Injectable()
export class RawMovieRepository implements IMovieRepository {
  constructor(@InjectModel(RawMovie.name) private rawMovieModel: Model<RawMovie>) {}
  
  async createOne(entity: RawMovie) {
    const createdEntity = new this.rawMovieModel(entity);
    return createdEntity.save();
  }

  async find() {
    return await this.rawMovieModel.find().lean();
  }

  async findOne(name: string) {
    return await this.rawMovieModel.findOne({
      name: name,
    });
  }

  async updateOne(id: string, updatedEntityDto: Partial<RawMovie>) {
    return await this.rawMovieModel.updateOne(
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
    return await this.rawMovieModel.deleteOne({
      _id: id,
    });
  }
}
