import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPaginationUrlRepository } from 'src/core/interfaces/IPaginationUrl-repository';
import { PaginationUrl } from 'src/data/schemas/pagination-url.schema';

@Injectable()
export class PaginationUrlRepository
  implements IPaginationUrlRepository
{
  constructor(
    @InjectModel(PaginationUrl.name)
    private paginationUrlModel: Model<PaginationUrl>,
  ) {}
  async createOne(entity: PaginationUrl):Promise<PaginationUrl> {
    const createdEntity = new this.paginationUrlModel(entity);
    return createdEntity.save();
  }

  async find(): Promise<Array<PaginationUrl>> {
    return await this.paginationUrlModel.find({}).lean();
  }

  async findOne(url: string): Promise<PaginationUrl> {
    return await this.paginationUrlModel.findOne({
      url,
    });
  }

  async isExists(url: string) {
    return await this.paginationUrlModel.exists({
      url: url,
    });
  }

  async updateOne(url: string, updatedEntityDto: Partial<PaginationUrl>) {
    return await this.paginationUrlModel.updateOne(
      {
        url,
      },
      {
        $set: {
          ...updatedEntityDto,
        },
      },
    );
  }

  async deleteOne(id: string) {
    return await this.paginationUrlModel.deleteOne({
      _id: id,
    });
  }
}
