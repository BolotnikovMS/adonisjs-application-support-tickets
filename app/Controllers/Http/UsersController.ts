import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'
import Department from 'App/Models/Department'
import Position from 'App/Models/Position'
import Role from 'App/Models/Role'

import fs from 'fs'

export default class UsersController {
  public async index ({ view }: HttpContextContract) {
    const users = await User
      .query()
      .preload('position')
      .preload('role')
      .preload('department')

    return view.render('pages/admin_users/users', {
      title: 'Все пользователи',
      users
    })
  }

  // public async create ({}: HttpContextContract) {
  // }

  // public async store ({}: HttpContextContract) {
  // }

  // public async show ({}: HttpContextContract) {
  // }

  public async edit ({ view, params }: HttpContextContract) {
    const user = await User.findOrFail(params.id)
    const departments = await Department.all();
    const positions = await Position.all();
    const roles = await Role.all();

    return view.render('pages/admin_users/edit', {
      title: 'Редактирование',
      user,
      departments,
      positions,
      roles
    })
  }

  public async update ({}: HttpContextContract) {
  }

  public async destroy ({ params, response, session }: HttpContextContract) {
    const user = await User.findOrFail(params.id)

    fs.unlink(`public/uploads/avatar/${user.avatar}`, (err) => {
      if (err) {
        console.log(err)
      }

      user?.delete()
    })

    session.flash({ 'successmessage': `Пользователь: "${user?.surname} ${user?.name} ${user?.lastname}" был удален.` });
    response.redirect('/users/')
  }
}
