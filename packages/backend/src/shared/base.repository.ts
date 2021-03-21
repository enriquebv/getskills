import { Model, Document, MongooseQueryOptions, UpdateQuery } from 'mongoose';

export class BaseRepository {
  private model: Model<any> = null;

  constructor(model) {
    this.model = model;
  }

  getById<T = any>(id: string): Promise<T> {
    return (this.model.findById(id) as unknown) as any;
  }

  updateById(id, update) {
    return this.model.findByIdAndUpdate(id, update);
  }
}
