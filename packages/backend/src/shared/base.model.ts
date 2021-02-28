import { SchemaTimestampsConfig } from 'mongoose';

export const SCHEMA_TIMESTAMP_CONFIG = {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  } as SchemaTimestampsConfig,
};

export class BaseModel {
  id?: string;
  created_at: Date;
  updated_at: Date;
}
