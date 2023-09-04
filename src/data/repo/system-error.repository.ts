import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ISystemErrorRepository } from 'src/core/interfaces/ISystem-error-repository';
import { SystemError } from '../schemas/system-error.schema';

@Injectable()
export class SystemErrorRepository implements ISystemErrorRepository {
  constructor(@InjectModel(SystemError.name) private movieModel: Model<SystemError>) {}
  
  async createOne(entity: SystemError) {
    const createdEntity = new this.movieModel(entity);
    return createdEntity.save();
  }

  async find() {
    return await this.movieModel.find().lean();
  }

  async findOne(name: string) {
    return await this.movieModel.findOne({
      name: name,
    });
  }

  async updateOne(id: string, updatedEntityDto: SystemError) {
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
