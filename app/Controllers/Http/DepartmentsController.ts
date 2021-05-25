import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, validator, rules } from '@ioc:Adonis/Core/Validator'

import Department from 'App/Models/Department';

export default class DepartmentsController {
  public async index ({ view }: HttpContextContract) {
    const departments = await Department.all()

    return view.render('pages/department/department', {
      title: 'Отделы',
      departments
    })
  }

  public async create ({ view }: HttpContextContract) {
    return view.render('pages/department/create', {title: 'Добавить отдел'})
  }

  public async store ({ request, response, session }: HttpContextContract) {
    const department = {...request.only(['name', 'number', 'housing'])}

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
        number: schema.string({
          escape: true,
          trim: true
        },
        [
          rules.maxLength(10)
        ]),
        housing: schema.string.optional({
          escape: true,
          trim: true
        },
        [
          rules.minLength(3),
          rules.maxLength(180)
        ])
      }),
      data: department,
      messages: {
        'name.required': 'Поле "Название" является обязательным.',
        'name.minLength': 'Минимальная длинна поля 3 символа.',
        'name.maxLength': 'Максимальная длинна поля 80 символов.',
        'number.required': 'Поле "Кабинет" является обязательным.',
        'number.maxLength': 'Максимальная длинна поля 10 символов.',
        'housing.minLength': 'Минимальная длинна поля 3 символа.',
        'housing.maxLength': 'Максимальная длинна поля 180 символов.'
      }
    })

    await Department.create(department)

    session.flash('successmessage', `Отдел "${department.name}" успешно добавлен.`)
    response.redirect('/users/departments')
  }

  // public async show ({}: HttpContextContract) {
  // }

  public async edit ({ view, params }: HttpContextContract) {
    const department = await Department.findOrFail(params.id)

    return view.render('pages/department/edit', {
      title: 'Редактирование',
      department
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
        number: schema.string({
          escape: true,
          trim: true
        },
        [
          rules.maxLength(10)
        ]),
        housing: schema.string.optional({
          escape: true,
          trim: true
        },
        [
          rules.minLength(1),
          rules.maxLength(180)
        ])
      }),
      messages: {
        'name.required': 'Поле "Название" является обязательным.',
        'name.minLength': 'Минимальная длинна поля 3 символа.',
        'name.maxLength': 'Максимальная длинна поля 80 символов.',
        'number.required': 'Поле "Кабинет" является обязательным.',
        'number.maxLength': 'Максимальная длинна поля 10 символов.',
        'housing.minLength': 'Минимальная длинна поля 1 символа.',
        'housing.maxLength': 'Максимальная длинна поля 180 символов.'
      }
    })

    const department = await Department.findOrFail(params.id)
    const { name, number, housing } = request.only(['name', 'number', 'housing'])

    if (department) {
      department.name = name.trim()
      department.number = number.trim()
      department.housing = housing.trim()
      await department?.save()
    }

    session.flash('successmessage', `Данные об отделе "${department?.name}" успешно обновлены.`)
    return response.redirect('/users/departments');
  }

  public async destroy ({ params, response, session }: HttpContextContract) {
    const department = await Department.findOrFail(params.id)

    await department?.delete()

    session.flash({ 'successmessage': `Отдел "${department?.name}" был удален.` });
    response.redirect('/users/departments')
  }
}
