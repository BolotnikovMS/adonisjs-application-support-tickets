import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Ticket extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({})
  public topic: string

  @column({})
  public description: string

  @column({})
  public file_name_new: string

  @column({})
  public file_name_old: string

  @column({})
  public file_extname: string

  @column({})
  public id_ticket_type: number

  @column({})
  public id_user: number

  @column({})
  public id_user_closed: number

  @column({})
  public status: string

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
