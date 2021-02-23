import { Model, Document } from "mongoose";


export class BaseRepository {
  private model: Model<any> = null;

  constructor(model) {
    this.model = model;
  }

  getById(id: string) {
    return this.model.findById(id);
  }
}
