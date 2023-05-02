import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateSiteDto } from 'src/core/dto/create-site.dto';
import { ISiteRepository } from 'src/core/interfaces/ISite-repository';
import { Site } from 'src/data/schemas/site.schema';

@Injectable()
export class SiteRepository   implements ISiteRepository {
  constructor(@InjectModel(Site.name) private siteModel: Model<Site>) {}
  async createOne(entity: CreateSiteDto) {
    const createdEntity = new this.siteModel(entity);
    return createdEntity.save();
  }

  async find() {
    return await this.siteModel.find().lean();
  }

  async findOne(url: string) {
    return await this.siteModel.findOne({
        url,
    });
  }
  async updateOne(id: string, updatedEntityDto: Site) {
    return await this.siteModel.updateOne(
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
    return await this.siteModel.deleteOne({
      _id: id,
    });
  }
}
