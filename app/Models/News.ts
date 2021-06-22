import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'

import User from './User';

export default class News extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({})
  public article: string

  @column({})
  public user_id: number

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

  @hasMany(() => User, {
    // localKey: 'user_id',
    foreignKey: 'id'
  })
  public users: HasMany<typeof User>
}
