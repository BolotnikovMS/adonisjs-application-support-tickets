import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TypeTicket from 'App/Models/TypeTicket'

export default class TicketsController {
  public async index ({}: HttpContextContract) {
    return await TypeTicket.all()
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

  // Type tickets route
  public async indexType ({}: HttpContextContract) {
    return await TypeTicket.all()
  }

  public async storeType ({ request, session }: HttpContextContract) {
    const data = request.only(['name'])
    const type = {...data}

    await TypeTicket.create(type)
    session.flash('success', 'Type has been created')
  }

  public async showType ({ params, response }: HttpContextContract) {
    try {
      const type = await TypeTicket.find(params.id)

      return type ? type : response.send('No content')
      // if (type) {
      //   return type
      // } else {
      //   return response.send('No content')
      // }
    } catch (error) {
      console.log('----ERROR----')
      console.log(error)
    }
  }

  public async updateType ({ params, request }: HttpContextContract) {
    const type = await TypeTicket.find(params.id)
    const { name } = request.only(['name'])

    if (type) {
      type.name = name

      await type.save()
    } else {
      return
    }

    return type
  }

  public async destroyType ({ params, response }: HttpContextContract) {
    const type = await TypeTicket.find(params.id)

    await type.delete()
    return response.send('Type deleted!')
  }
}
