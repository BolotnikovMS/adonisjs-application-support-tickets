import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

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

  public async update ({}: HttpContextContract) {
  }
}
