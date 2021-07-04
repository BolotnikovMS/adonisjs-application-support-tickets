import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, validator, rules } from '@ioc:Adonis/Core/Validator'
import Application from '@ioc:Adonis/Core/Application'

import User from 'App/Models/User'
import Department from 'App/Models/Department'
import Position from 'App/Models/Position'
import Role from 'App/Models/Role'

import fs from 'fs'

export default class UsersController {
  public async index ({ view, request }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 2
    const users = await User
      .query()
      .preload('position')
      .preload('role')
      .preload('department')
      .paginate(page, limit)

    users.baseUrl('/users/')

    return view.render('pages/admin_users/users', {
      title: 'Все пользователи',
      users
    })
  }

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

  public async update ({ params, request, response, session }: HttpContextContract) {
    const user = await User.findOrFail(params.id)
    const validSchema = schema.create({
      surname: schema.string({trim: true}, [
        rules.minLength(3),
        rules.maxLength(80)
      ]),
      name: schema.string({trim: true}, [
        rules.minLength(3),
        rules.maxLength(80)
      ]),
      lastname: schema.string({trim: true}, [
        rules.minLength(3),
        rules.maxLength(80)
      ]),
      avatar: schema.file.optional({
        size: '15mb',
        extnames: ['jpg', 'png', 'jpeg', 'bmp']
      }),
      workPhone: schema.string.optional({trim: true}, [
        rules.minLength(3),
        rules.maxLength(15)
      ]),
      mobilePhone: schema.string.optional({trim: true}, [
        rules.minLength(3),
        rules.maxLength(15)
      ]),
      department: schema.number(),
      position: schema.number(),
      role: schema.number(),
      vip: schema.boolean.optional(),
      active: schema.boolean.optional()
    })

    const messages = {
      'surname.required': 'Поле "Фамилия" является обязательным.',
      'surname.minLength': 'Минимальная длинна поля 3 символа.',
      'surname.maxLength': 'Максимальная длинна поля 80 символов.',
      'name.required': 'Поле "Имя" является обязательным.',
      'name.minLength': 'Минимальная длинна поля 3 символа.',
      'name.maxLength': 'Максимальная длинна поля 80 символов.',
      'lastname.required': 'Поле "Отчество" является обязательным.',
      'lastname.minLength': 'Минимальная длинна поля 3 символа.',
      'lastname.maxLength': 'Максимальная длинна поля 80 символов.',
      'avatar.size': 'Загружаемый файл больше 15 мб.',
      'avatar.file.extname': 'Загружаемый файл должен иметь одно из следующих расширений: {{ options.extnames }}',
      'workPhone.minLength': 'Минимальная длинна поля 3 символа.',
      'workPhone.maxLength': 'Максимальная длинна поля 15 символов.',
      'mobilePhone.minLength': 'Минимальная длинна поля 3 символа.',
      'mobilePhone.maxLength': 'Максимальная длинна поля 15 символов.',
      'department.required': 'Поле "Отдел" является обязательным.',
      'position.required': 'Поле "Должность" является обязательным.',
      'role.required': 'Поле "Роль" является обязательным.',
    }

    const validateData = await request.validate({
      schema: validSchema,
      messages
    })

    if (validateData.avatar) {
      await validateData.avatar.move(Application.publicPath('uploads/avatar'), {
        name: `${new Date().getTime()}.${validateData.avatar.extname}`
      })

      fs.unlink(`public/uploads/avatar/${user.avatar}`, (err) => {
        if (err) {
          console.log(err)
        }
      })
    }

    const userUpdate = request.only(['email'])

    validateData.vip ? validateData.vip = true : validateData.vip = false
    validateData.active ? validateData.active = false : validateData.active = true

    if (user) {
      user.surname = validateData.surname.trim()
      user.name = validateData.name.trim()
      user.lastname = validateData.lastname.trim()
      user.email = userUpdate.email.trim()
      user.avatar = validateData.avatar?.fileName,
      user.work_phone = validateData.workPhone?.trim()
      user.mobile_phone = validateData.mobilePhone?.trim()
      user.positionId = validateData.position
      user.departmentId = validateData.department
      user.roleId = validateData.role
      user.vip = validateData.vip
      user.active = validateData.active

      await user.save()
    }

    session.flash('successmessage', `Данные пользователя "${user.surname} ${user.name} ${user.lastname}" успешно обновлены.`)
    return response.redirect('/users/');
  }

  public async inactiveUser ({ params, request, response }: HttpContextContract) {
    const user = await User.findOrFail(params.id)
    const activeUpdate = request.only(['active'])

    activeUpdate.active ? activeUpdate.active = 0 : activeUpdate.active = 1

    if (user) {
      user.active = activeUpdate.active

      await user.save()
    }

    return response.redirect('/users/');
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

  public async searchUser ({ request }: HttpContextContract) {
    const search = request.only(['search'])

    
  }
}
