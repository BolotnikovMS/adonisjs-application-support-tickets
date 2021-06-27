import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, validator, rules } from '@ioc:Adonis/Core/Validator'

import News from 'App/Models/News'

export default class NewsController {
  public async index ({ view, request }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 4

    const news = await News
      .query()
      .preload('users')
      .paginate(page, limit)

    news.baseUrl('/')

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
      topic: schema.string({
        trim: true
      },
      [
        rules.minLength(3),
        rules.maxLength(100)
      ]),
      textNews: schema.string({
        trim: true
      },
      [
        rules.minLength(3)
      ])
    })

    const messages = {
      'topic.required': 'Поле "Тема" является обязательным.',
      'topic.minLength': 'Минимальная длинна поля 3 символа.',
      'topic.maxLength': 'Максимальная длинна поля 100 символов.',
      'textNews.required': 'Поле ввода статьи не должно быть пустым.',
      'textNews.minLength': 'Минимальная длинна поля 3 символа.',
    }

    const dataValid = await request.validate({
      schema: validSchema,
      messages
    })

    await News.create({
      topic: dataValid.topic,
      article: dataValid.textNews,
      user_id: auth.user?.id
    })

    session.flash({ 'successmessage': `Новость добавлена.` })
    return response.redirect('/')
  }

  public async show ({ view, params }: HttpContextContract) {
    const news = await News.findOrFail(params.id)

    return view.render('pages/news/detail', {
      title: `${news.topic}`,
      news
    })
  }

  public async edit ({}: HttpContextContract) {
  }

  public async update ({}: HttpContextContract) {
  }

  public async destroy ({}: HttpContextContract) {
  }
}
