import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { RawMovie } from '../schemas/raw-movie.schema';
import { IRawMovieRepository } from 'src/core/interfaces/IRawMovie-repository';

@Injectable()
export class RawMovieRepository implements IRawMovieRepository {
  constructor(
    @InjectModel(RawMovie.name) private rawMovieModel: mongoose.Model<RawMovie>,
  ) {}

  async createOne(entity: RawMovie) {
    const createdEntity = new this.rawMovieModel(entity);
    return createdEntity.save();
  }

  async find() {
    return (await this.rawMovieModel.find().lean()).map((element) => {
      return { ...element, id: element._id.toString() };
    });
  }

  async findOne(name: string) {
    return await this.rawMovieModel.findOne({
      name: name,
    });
  }

  async updateOne(id: string, updatedEntityDto: Partial<RawMovie>) {
     await this.rawMovieModel.updateOne({
      name: id,
    },updatedEntityDto);    
  }

  async deleteOne(id: string) {
    return await this.rawMovieModel.deleteOne({
      _id: id,
    });
  }
}
