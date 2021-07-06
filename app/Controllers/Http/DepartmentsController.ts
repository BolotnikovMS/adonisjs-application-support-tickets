import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

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
    const validSchema = schema.create({
      name: schema.string({
        trim: true,
        escape: true
      }, [
        rules.minLength(2),
        rules.maxLength(80)
      ]),
      number: schema.string.optional({
        trim: true,
        escape: true
      }, [
        rules.maxLength(10)
      ]),
      housing: schema.string.optional({
        trim: true,
        escape: true
      }, [
        rules.minLength(1),
        rules.maxLength(180)
      ])
    })

    const messages = {
      'name.required': 'Поле "Название" является обязательным.',
      'name.minLength': 'Минимальная длинна поля 2 символа.',
      'name.maxLength': 'Максимальная длинна поля 80 символов.',
      'number.maxLength': 'Максимальная длинна поля 10 символов.',
      'housing.minLength': 'Минимальная длинна поля 1 символа.',
      'housing.maxLength': 'Максимальная длинна поля 180 символов.'
    }

    const validateData = await request.validate({
      schema: validSchema,
      messages: messages
    })

    await Department.create(validateData)

    session.flash('successmessage', `Отдел "${validateData.name}" успешно добавлен.`)
    response.redirect('/users/departments')
  }

  public async edit ({ view, params }: HttpContextContract) {
    const department = await Department.findOrFail(params.id)

    return view.render('pages/department/edit', {
      title: 'Редактирование',
      department
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
      number: schema.string.optional({
        trim: true,
        escape: true
      }, [
        rules.maxLength(10)
      ]),
      housing: schema.string.optional({
        trim: true,
        escape: true
      }, [
        rules.minLength(1),
        rules.maxLength(180)
      ])
    })

    const messages = {
      'name.required': 'Поле "Название" является обязательным.',
      'name.minLength': 'Минимальная длинна поля 2 символа.',
      'name.maxLength': 'Максимальная длинна поля 80 символов.',
      'number.maxLength': 'Максимальная длинна поля 10 символов.',
      'housing.minLength': 'Минимальная длинна поля 1 символа.',
      'housing.maxLength': 'Максимальная длинна поля 180 символов.'
    }

    const validateData = await request.validate({
      schema: validSchema,
      messages: messages
    })

    await request.validate({
      schema: schema.create({
        name: schema.string({trim: true},
        [
          rules.minLength(2),
          rules.maxLength(80)
        ]),
        number: schema.string.optional({trim: true},
        [
          rules.maxLength(10)
        ]),
        housing: schema.string.optional({trim: true},
        [
          rules.minLength(1),
          rules.maxLength(180)
        ])
      }),
      messages: {
        'name.required': 'Поле "Название" является обязательным.',
        'name.minLength': 'Минимальная длинна поля 2 символа.',
        'name.maxLength': 'Максимальная длинна поля 80 символов.',
        'number.maxLength': 'Максимальная длинна поля 10 символов.',
        'housing.minLength': 'Минимальная длинна поля 1 символа.',
        'housing.maxLength': 'Максимальная длинна поля 180 символов.'
      }
    })

    const department = await Department.findOrFail(params.id)

    if (department) {
      department.name = validateData.name
      department.number = validateData.number
      department.housing = validateData.housing
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
