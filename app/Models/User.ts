import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'

import Role from './Role'
import Position from './Position'
import Department from './Department';
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

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @manyToMany(() => Role, {
    pivotTable: 'info_users'
  })
  public role: ManyToMany<typeof Role>

  @manyToMany(() => Department, {
    pivotTable: 'info_users'
  })
  public department: ManyToMany<typeof Department>

  @manyToMany(() => Position, {
    pivotTable: 'info_users'
  })
  public position: ManyToMany<typeof Position>
}
