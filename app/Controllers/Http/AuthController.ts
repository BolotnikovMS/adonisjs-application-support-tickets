import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, validator, rules } from '@ioc:Adonis/Core/Validator'
import Application from '@ioc:Adonis/Core/Application'

import Department from 'App/Models/Department'
import Position from 'App/Models/Position'
import Role from 'App/Models/Role'

export default class AuthController {
  public async index ({ view }: HttpContextContract) {
    const departments = await Department.all()
    const positions = await Position.all()
    const roles = await Role.all()

    return view.render('pages/auth/register', {
      title: 'Регистрация нового пользователя',
      departments,
      positions,
      roles
    })
  }

  public async store ({  }: HttpContextContract) {

  }
}
