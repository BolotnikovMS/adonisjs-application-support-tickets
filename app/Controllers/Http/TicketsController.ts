import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, validator, rules } from '@ioc:Adonis/Core/Validator'
import Application from '@ioc:Adonis/Core/Application'

import TypeTicket from 'App/Models/TypeTicket'
import Ticket from 'App/Models/Ticket'

export default class TicketsController {
  public async index ({ view }: HttpContextContract) {
    const tickets = await Ticket.all()
    const types = await TypeTicket.all()
    const arrOpenTickets = []
    const arrClosedTickets = []

    const test = await Ticket
        .query()
        .preload('type')

    return test
    // tickets.forEach((itemTicket) => {
    //   let ticket = {
    //     id: itemTicket.id,
    //     topic: itemTicket.topic,
    //     description: itemTicket.description,
    //     status: itemTicket.status,
    //     type: '',
    //     id_user: itemTicket.id_user,
    //     created: itemTicket.createdAt,
    //     updated: itemTicket.updatedAt
    //   }

    //   types.forEach((itemType) => {
    //     if (itemTicket.id_ticket_type == itemType.id) {
    //       ticket.type = itemType.name
    //     }
    //   })

    //   if (ticket.status.toLowerCase() === 'open') {
    //     arrOpenTickets.push(ticket)
    //   } else {
    //     arrClosedTickets.push(ticket)
    //   }
    // })

    return view.render('pages/ticket/ticket', {
      title: 'Заявки',
      openTickets: arrOpenTickets,
      closedTickets: arrClosedTickets
    })
  }

  public async create ({ view }: HttpContextContract) {
    const types = await TypeTicket.all()

    return view.render('pages/ticket/create', {
      title: 'Новая заявка',
      types
    })
  }

  public async store ({ auth, request, response, session }: HttpContextContract) {
    const validSchema = schema.create({
      topic: schema.string({
        escape: true,
        trim: true
      },
      [
        rules.minLength(3),
        rules.maxLength(80)
      ]),
      description: schema.string({
        escape: true,
        trim: true
      },
      [
        rules.minLength(3)
      ]),
      typeReq: schema.number(),
      fileIn: schema.file.optional({
        size: '15mb',
        extnames: ['jpg', 'png', 'jpeg', 'bmp', 'pdf', 'docx', 'doc', 'docm', 'xlsx', 'xls', 'xlsm', 'xlsb', 'xml']
      })
    })

    const messages = {
      'topic.required': 'Поле "Тема" является обязательным.',
      'topic.minLength': 'Минимальная длинна поля 3 символа.',
      'topic.maxLength': 'Максимальная длинна поля 80 символов.',
      'description.required': 'Поле "Описание" является обязательным.',
      'description.minLength': 'Минимальная длинна поля 3 символа.',
      'typeReq.required': 'Поле "Тип заявки" является обязательным.',
      'fileIn.size': 'Загружаемый файл больше 15 мб.',
      'fileIn.file.extname': 'Загружаемый файл должен иметь одно из следующих расширений: {{ options.extnames }}'
    }

    const file = await request.validate({
      schema: validSchema,
      messages
    })

    const fileNameOld = file.fileIn?.clientName

    if (file.fileIn) {
      await file.fileIn.move(Application.publicPath('uploads/tickets'), {
        name: `${new Date().getTime()}.${file.fileIn.extname}`
      })

      // fileName = file.fileIn.fileName
    }

    await Ticket.create({
      topic: file.topic,
      description: file.description,
      file_name_new: file.fileIn?.fileName,
      file_name_old: fileNameOld,
      file_extname: file.fileIn?.extname,
      id_ticket_type: file.typeReq,
      id_user: auth.user?.id,
      status: 'Open'
    })

    session.flash({ 'successmessage': `Заявка с темой: "${ file.topic }" была отправлена.` })
    return response.redirect('/ticket')
  }

  public async show ({ view, params }: HttpContextContract) {
    const ticket = await Ticket.findOrFail(params.id)

    return view.render('pages/ticket/detail', {
      title: 'Подробный просмотр',
      ticket
    })
  }

  public async edit ({}: HttpContextContract) {
  }

  public async update ({}: HttpContextContract) {
  }

  public async destroy ({}: HttpContextContract) {
  }

  // Type tickets route
  public async indexType ({ view }: HttpContextContract) {
    const types = await TypeTicket.all()

    return view.render('pages/ticket/type/type', {
      title: 'Тип заявки',
      types
    })
  }

  public async createType ({ view }: HttpContextContract) {
    return view.render('pages/ticket/type/create', {
      title: 'Новый тип заявки'
    })
  }

  public async storeType ({ request, response, session }: HttpContextContract) {
    const type = {...request.only(['name'])}

    await validator.validate({
      schema: schema.create({
        name: schema.string({
          escape: true,
          trim: true
        },
        [
          rules.minLength(2),
          rules.maxLength(50)
        ])
      }),
      data: type,
      messages: {
        'name.required': 'Поле "Название" является обязательным.',
        'name.minLength': 'Минимальная длинна поля 2 символа.',
        'name.maxLength': 'Максимальная длинна поля 50 символов.'
      }
    })

    await TypeTicket.create(type)

    session.flash('successmessage', `Тип "${type.name}" успешно добавлен.`)
    response.redirect('/ticket/type')
  }

  // public async showType ({ params, response }: HttpContextContract) {
  //   try {
  //     const type = await TypeTicket.find(params.id)

  //     return type ? type : response.send('No content')
  //     // if (type) {
  //     //   return type
  //     // } else {
  //     //   return response.send('No content')
  //     // }
  //   } catch (error) {
  //     console.log('----ERROR----')
  //     console.log(error)
  //   }
  // }

  public async editType ({ view, params }: HttpContextContract) {
    const type = await TypeTicket.findOrFail(params.id)

    return view.render('pages/ticket/type/edit', {
      title: 'Редактирование',
      type
    })
  }

  public async updateType ({ params, request, response, session }: HttpContextContract) {
    await request.validate({
      schema: schema.create({
        name: schema.string({
          escape: true,
          trim: true
        },
        [
          rules.minLength(2),
          rules.maxLength(50)
        ])
      }),
      messages: {
        'name.required': 'Поле "Название" является обязательным.',
        'name.minLength': 'Минимальная длинна поля 2 символа.',
        'name.maxLength': 'Максимальная длинна поля 50 символов.'
      }
    })

    const type = await TypeTicket.findOrFail(params.id)
    const { name } = request.only(['name'])

    if (type) {
      type.name = name.trim()
      await type?.save()
    }

    session.flash('successmessage', `Тип "${type?.name}" успешно обновлен.`)
    return response.redirect('/ticket/type');
  }

  public async destroyType ({ params, response, session }: HttpContextContract) {
    const type = await TypeTicket.findOrFail(params.id)

    await type?.delete()

    session.flash({ 'successmessage': `Тип заявки "${type?.name}" был удален.` });
    return response.redirect('/ticket/type')
  }
}
