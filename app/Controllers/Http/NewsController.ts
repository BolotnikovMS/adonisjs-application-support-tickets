import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, validator, rules } from '@ioc:Adonis/Core/Validator'

import News from 'App/Models/News'

export default class NewsController {
  public async index ({ view }: HttpContextContract) {
    const news = await News.query()
      .preload('users')

    return view.render('pages/news/news', {
      title: 'Главная страница',
      news
    })
  }

  public async create ({ view }: HttpContextContract) {
    return view.render('pages/news/create', {
      title: 'Добавить новость'
    })
  }

  public async store ({ request, response, session, auth }: HttpContextContract) {
    const validSchema = schema.create({
      textNews: schema.string({
        trim: true
      },
      [
        rules.minLength(3)
      ])
    })

    const messages = {
      'textNews.required': 'Поле ввода статьи не должно быть пустым.',
      'textNews.minLength': 'Минимальная длинна поля 3 символа.',
    }

    const dataValid = await request.validate({
      schema: validSchema,
      messages
    })

    await News.create({
      article: dataValid.textNews,
      user_id: auth.user?.id
    })

    session.flash({ 'successmessage': `Новость добавлена.` })
    return response.redirect('back')
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
