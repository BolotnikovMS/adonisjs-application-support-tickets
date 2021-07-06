import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'

import Role from './Role'
import Position from './Position'
import Department from './Department';
import News from './News'
import Ticket from './Ticket';
export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public surname: string

  @column()
  public name: string

  @column()
  public lastname: string

  @column()
  public email: string

  @column()
  public avatar: string

  @column()
  public work_phone: string

  @column()
  public mobile_phone: string

  @column()
  public departmentId: number

  @column()
  public positionId: number

  @column()
  public roleId: number

  @column({ serializeAs: null })
  public password: string

  @column({})
  public vip: boolean

  @column({})
  public active: boolean

  @column()
  public rememberMeToken?: string

  @column.dateTime({
    autoCreate: true,
    serialize: (value?: DateTime) => {
      return value ? value.toFormat('HH:mm dd.MM.yyyy') : value
    }
  })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize: (value?: DateTime) => {
      return value ? value.toFormat('HH:mm dd.MM.yyyy') : value
    }
  })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @hasMany(() => Role, {
    foreignKey: 'id',
    localKey: 'roleId'
  })
  public role: HasMany<typeof Role>

  @hasMany(() => Department, {
    foreignKey: 'id',
    localKey: 'departmentId'
  })
  public department: HasMany<typeof Department>

  @hasMany(() => Position, {
    foreignKey: 'id',
    localKey: 'positionId'
  })
  public position: HasMany<typeof Position>

  @hasMany(() => News, {
    foreignKey: 'user_id'
  })
  public news: HasMany<typeof News>

  @hasMany(() => Ticket, {
    foreignKey: 'id_user'
  })
  public ticketUser: HasMany<typeof Ticket>
}
