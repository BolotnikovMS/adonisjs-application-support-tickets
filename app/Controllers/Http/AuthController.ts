import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, validator, rules } from '@ioc:Adonis/Core/Validator'
import Application from '@ioc:Adonis/Core/Application'

import User from 'App/Models/User'
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

  public async store ({ request, response, session }: HttpContextContract) {
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
      email: schema.string({trim: true}, [
        rules.email(),
        rules.maxLength(100),
        rules.unique({table: 'users', column: 'email'})
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
      password: schema.string({trim: true}, [
        rules.confirmed()
      ]),
      vip: schema.boolean.optional()
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
      'email.required': 'Поле "Email" является обязательным.',
      'email.maxLength': 'Максимальная длинна поля 100 символов.',
      'email.unique': 'Пользователь с таким "Email" уже существует.',
      'avatar.size': 'Загружаемый файл больше 15 мб.',
      'avatar.file.extname': 'Загружаемый файл должен иметь одно из следующих расширений: {{ options.extnames }}',
      'workPhone.minLength': 'Минимальная длинна поля 3 символа.',
      'workPhone.maxLength': 'Максимальная длинна поля 15 символов.',
      'mobilePhone.minLength': 'Минимальная длинна поля 3 символа.',
      'mobilePhone.maxLength': 'Максимальная длинна поля 15 символов.',
      'department.required': 'Поле "Отдел" является обязательным.',
      'position.required': 'Поле "Должность" является обязательным.',
      'role.required': 'Поле "Роль" является обязательным.',
      'password.required': 'Поле "Пароль" является обязательным.',
      'password_confirmation.confirmed': 'Введенные пароли должны совпадать.'
    }

    const validateData = await request.validate({
      schema: validSchema,
      messages
    })

    if (validateData.avatar) {
      await validateData.avatar.move(Application.publicPath('uploads/avatar'), {
        name: `${new Date().getTime()}.${validateData.avatar.extname}`
      })
    }

    await User.create({
      surname: validateData.surname,
      name: validateData.name,
      lastname: validateData.lastname,
      email: validateData.email,
      avatar: validateData.avatar?.fileName,
      work_phone: validateData?.workPhone,
      mobile_phone: validateData?.mobilePhone,
      id_department: validateData.department,
      id_position: validateData.position,
      id_role: validateData.role,
      password: validateData.password,
      vip: validateData.vip
    })

    session.flash({ 'successmessage': `Пользователь: "${ validateData.surname } ${ validateData.name } ${ validateData.lastname }" был добавлен.` })
    return response.redirect('/users/')
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.logout()

    return response.redirect('/')
  }

  public async showLogin({ view }: HttpContextContract) {
    return view.render('pages/auth/login', {
      title: 'Авторизация'
    })
  }

  public async login({ request, response, auth, session }: HttpContextContract) {
    const {email, password} = request.only(['email', 'password'])

    await request.validate({
      schema: schema.create({
        email: schema.string({}, [
          rules.email()
        ]),
        password: schema.string({})
      }),
      messages: {
        'email.required': 'Поле "Email" является обязательным.',
        'password.required': 'Поле "Пароль" является обязательным.'
      }
    })

    try {
      await auth.attempt(email, password)

      return response.redirect('/')
    } catch (error) {
      session.flash('successmessage', 'Проверьте email или пароль.')

      return response.redirect('back')
    }
  }
}
