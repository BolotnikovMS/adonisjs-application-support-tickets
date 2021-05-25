import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'

import Document from 'App/Models/Document';

export default class TypeDocument extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({})
  public name: string

  // Связь с таблицей Documents
  @hasMany(() => Document, {
    foreignKey: 'id_type'
  })
  public documents: HasMany<typeof Document>

  @column.dateTime({
    autoCreate: true,
    serialize: (value?: DataTime) => {
      return value ? value.toFormat('HH:mm dd.MM.yyyy') : value
    }
  })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize: (value?: DataTime) => {
      return value ? value.toFormat('HH:mm dd.MM.yyyy') : value
    }
  })
  public updatedAt: DateTime
}
