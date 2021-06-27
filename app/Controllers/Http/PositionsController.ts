import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, validator, rules } from '@ioc:Adonis/Core/Validator'

import Database from '@ioc:Adonis/Lucid/Database'

import Position from 'App/Models/Position';

export default class PositionsController {
  public async index ({ view, request }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 10
    const positions = await Database.from('positions').paginate(page, limit)

    positions.baseUrl('/users/positions')

    // console.log(positions.getMeta());
    // console.log(positions.firstPage);
    // console.log(positions.getPreviousPageUrl());
    // console.log(positions.hasPages);
    return view.render('pages/position/position', {
      title: 'Должности',
      positions
    })
  }

  public async create ({ view }: HttpContextContract) {
    return view.render('pages/position/create', {title: 'Добавить должность'})
  }

  public async store ({ request, response, session }: HttpContextContract) {
    const position = {...request.only(['name', 'vip'])}

    position.vip == 1 ? position.vip = 1 : position.vip = 0

    await validator.validate({
      schema: schema.create({
        name: schema.string({
          escape: true,
          trim: true
        },
        [
          rules.minLength(3),
          rules.maxLength(80)
        ]),
        vip: schema.boolean.optional()
      }),
      data: position,
      messages: {
        'name.required': 'Поле "Название" является обязательным.',
        'name.minLength': 'Минимальная длинна поля 3 символа.',
        'name.maxLength': 'Максимальная длинна поля 80 символов.'
      }
    })

    await Position.create(position)

    session.flash('successmessage', `Тип "${position.name}" успешно добавлен.`)
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
    await request.validate({
      schema: schema.create({
        name: schema.string({
          escape: true,
          trim: true
        },
        [
          rules.minLength(3),
          rules.maxLength(80)
        ]),
        vip: schema.boolean.optional()
      }),
      messages: {
        'name.required': 'Поле "Название" является обязательным.',
        'name.minLength': 'Минимальная длинна поля 3 символа.',
        'name.maxLength': 'Максимальная длинна поля 80 символов.'
      }
    })

    const position = await Position.findOrFail(params.id)
    let { name, vip } = request.only(['name', 'vip'])

    vip == 1 ? vip = 1 : vip = 0

    if (position) {
      position.name = name.trim()
      position.vip = vip

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
