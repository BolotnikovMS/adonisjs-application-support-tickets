import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Role from 'App/Models/Role'
import User from 'App/Models/User'
import Position from 'App/Models/Position'
import Department from 'App/Models/Department'

export default class UsersController {
  public async index ({ view }: HttpContextContract) {
    const users = await User.all()
    const roles = await Role.all()
    const positions = await Position.all()
    const departments = await Department.all()
    const arrUsers = []

    users.forEach((userItem) => {
      let user = {
        id: userItem.id,
        surname: userItem.surname,
        name: userItem.name,
        lastname: userItem.lastname,
        email: userItem.email,
        workPhone: userItem.work_phone,
        mobilePhone: userItem.mobile_phone,
        vip: userItem.vip,
        active: userItem.active
      }

      roles.forEach((roleItem) => {
        if (roleItem.id === userItem.role_id) {
          user.role = roleItem.name
        }
      })

      positions.forEach((positionItem) => {
        if (positionItem.id === userItem.position_id) {
          user.position = positionItem.name
        }
      })

      departments.forEach((departmentItem) => {
        if (departmentItem.id === userItem.department_id) {
          user.department = departmentItem.name
        }
      })

      arrUsers.push(user)
    })

    return view.render('pages/users/users', {
      title: 'Все пользователи',
      users: arrUsers
    })
  }

  public async create ({}: HttpContextContract) {
  }

  public async store ({}: HttpContextContract) {
  }

  public async show ({}: HttpContextContract) {
  }

  public async edit ({}: HttpContextContract) {
  }

  public async update ({}: HttpContextContract) {
  }

  public async destroy ({}: HttpContextContract) {
  }
}
