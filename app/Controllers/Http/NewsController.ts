import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

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
