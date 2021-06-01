import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class InfoUser extends BaseModel {
  @column({})
  public userId: number

  @column({})
  public roleId: number

  @column({})
  public departmentId: number

  @column({})
  public positionId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
