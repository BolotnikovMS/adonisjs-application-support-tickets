import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, validator, rules } from '@ioc:Adonis/Core/Validator'

import News from 'App/Models/News'

export default class NewsController {
  public async index ({ view, request, auth }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 4

    const news = await News
      .query()
      .orderBy('created_at', 'desc')
      .preload('users')
      .paginate(page, limit)

    news.baseUrl('/')

    return view.render('pages/news/news', {
      title: 'Новостная лента',
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
      topic: schema.string({trim: true}, [
        rules.minLength(3),
        rules.maxLength(100)
      ]),
      textNews: schema.string({
        trim: true
      }, [
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

    await auth.user?.related('news').create({
      topic: dataValid.topic,
      article: dataValid.textNews,
    })

    session.flash({ 'successmessage': 'Новость добавлена.' })
    return response.redirect('/')
  }

  public async show ({ view, params }: HttpContextContract) {
    const news = await News.findOrFail(params.id)

    return view.render('pages/news/detail', {
      title: `${news.topic}`,
      news
    })
  }

  public async edit ({ view, params }: HttpContextContract) {
    const news = await News.findOrFail(params.id)

    return view.render('pages/news/edit', {
      title: 'Редактирование',
      news
    })
  }

  public async update ({ request, response, params, session }: HttpContextContract) {
    const validSchema = schema.create({
      topic: schema.string({trim: true}, [
        rules.minLength(3),
        rules.maxLength(100)
      ]),
      textNews: schema.string({
        trim: true
      }, [
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

    const news = await News.findOrFail(params.id)

    if (news) {
      news.topic = dataValid.topic,
      news.article = dataValid.textNews

      await news.save()
    }

    session.flash('successmessage', 'Новость успешно обновлена.')
    return response.redirect('/');
  }

  public async destroy ({ params, response, session }: HttpContextContract) {
    const news = await News.findOrFail(params.id)

    await news.delete()
    session.flash({ 'successmessage': `Новость "${news.topic}" была удалена.` });
    response.redirect('back')
  }
}
