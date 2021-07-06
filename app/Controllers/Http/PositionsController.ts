import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

import Database from '@ioc:Adonis/Lucid/Database'

import Position from 'App/Models/Position';

export default class PositionsController {
  public async index ({ view, request }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 10
    const positions = await Database.from('positions').paginate(page, limit)

    positions.baseUrl('/users/positions')

    return view.render('pages/position/position', {
      title: 'Должности',
      positions
    })
  }

  public async create ({ view }: HttpContextContract) {
    return view.render('pages/position/create', {title: 'Добавить должность'})
  }

  public async store ({ request, response, session }: HttpContextContract) {
    const validSchema = schema.create({
      name: schema.string({
        trim: true,
        escape: true
      }, [
        rules.minLength(2),
        rules.maxLength(80)
      ]),
      vip: schema.boolean.optional()
    })

    const messages = {
      'name.required': 'Поле "Название" является обязательным.',
      'name.minLength': 'Минимальная длинна поля 3 символа.',
      'name.maxLength': 'Максимальная длинна поля 80 символов.'
    }

    const validateData = await request.validate({
      schema: validSchema,
      messages: messages
    })

    const position = request.only(['vip'])

    position.vip == 1 ? position.vip = 1 : position.vip = 0
    validateData.vip = position.vip

    await Position.create({
      name: validateData.name,
      vip: validateData.vip
    })

    session.flash('successmessage', `Тип "${validateData.name}" успешно добавлен.`)
    response.redirect('/users/positions')
  }

  public async edit ({ view, params }: HttpContextContract) {
    const position = await Position.findOrFail(params.id)

    return view.render('pages/position/edit', {
      title: 'Редактирование',
      position
    })
  }

  public async update ({ params, request, response, session }: HttpContextContract) {
    const validSchema = schema.create({
      name: schema.string({
        trim: true,
        escape: true
      }, [
        rules.minLength(2),
        rules.maxLength(80)
      ]),
      vip: schema.boolean.optional()
    })

    const messages = {
      'name.required': 'Поле "Название" является обязательным.',
      'name.minLength': 'Минимальная длинна поля 3 символа.',
      'name.maxLength': 'Максимальная длинна поля 80 символов.'
    }

    const validateData = await request.validate({
      schema: validSchema,
      messages: messages
    })

    const position = await Position.findOrFail(params.id)
    const positionVip = request.only(['vip'])
    positionVip.vip == 1 ? positionVip.vip = 1 : positionVip.vip = 0
    validateData.vip = positionVip.vip

    if (position) {
      position.name = validateData.name
      position.vip = validateData.vip

      await position?.save()
    }

    session.flash('successmessage', `Должность "${position?.name}" успешно обновлена.`)
    return response.redirect('/users/positions');
  }

  public async destroy ({ params, response, session }: HttpContextContract) {
    const position = await Position.findOrFail(params.id)

    await position?.delete()

    session.flash({ 'successmessage': `Должность "${position?.name}" была удалена.` });
    response.redirect('/users/positions')
  }
}
