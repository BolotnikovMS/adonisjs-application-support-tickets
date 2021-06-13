import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, validator, rules } from '@ioc:Adonis/Core/Validator'

import User from 'App/Models/User'

export default class ProfilesController {
  public async index ({ params, response, view }: HttpContextContract) {
    const user = await User.query()
      .where('id', '=', params.id)
      .preload('department')
      .preload('position')
      .preload('role')

    return view.render('pages/users/profile/profile', {
      title: 'Профиль',
      user
    })
  }

  public async edit ({ view, params }: HttpContextContract) {
    const user = await User.findOrFail(params.id)

    return view.render('pages/users/profile/edit', {
      title: 'Редактирование профиля',
      user
    })
  }

  public async update ({ params, request, response, session }: HttpContextContract) {
    const user = await User.findOrFail(params.id)
    const validSchema = schema.create({
      workPhone: schema.string.optional({trim: true}, [
        rules.minLength(3),
        rules.maxLength(15)
      ]),
      mobilePhone: schema.string.optional({trim: true}, [
        rules.minLength(3),
        rules.maxLength(15)
      ]),
      password: schema.string({trim: true}, [
        rules.confirmed()
      ])
    })

    const messages = {
      'workPhone.minLength': 'Минимальная длинна поля 3 символа.',
      'workPhone.maxLength': 'Максимальная длинна поля 15 символов.',
      'mobilePhone.minLength': 'Минимальная длинна поля 3 символа.',
      'mobilePhone.maxLength': 'Максимальная длинна поля 15 символов.',
      'password.required': 'Поле "Пароль" является обязательным.',
      'password_confirmation.confirmed': 'Введенные пароли должны совпадать.'
    }

    const validateData = await request.validate({
      schema: validSchema,
      messages
    })

    console.log(validateData);

    if (user) {
      user.work_phone = validateData.workPhone?.trim()
      user.mobile_phone = validateData.mobilePhone?.trim()
      user.password = validateData.password

      // await user.save()
    }

    session.flash('successmessage', `Данные профиля "${user.surname} ${user.name} ${user.lastname}" успешно обновлены.`)
    return response.redirect('back');
  }
}
