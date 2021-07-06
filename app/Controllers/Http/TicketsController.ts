import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, validator, rules } from '@ioc:Adonis/Core/Validator'
import Application from '@ioc:Adonis/Core/Application'

import TypeTicket from 'App/Models/TypeTicket'
import Ticket from 'App/Models/Ticket'

export default class TicketsController {
  public async index ({ view }: HttpContextContract) {
    const arrOpenTickets = []
    const arrClosedTickets = []
    const tickets = await Ticket
        .query()
        .preload('type')
        .preload('user')

      tickets.forEach((itemTicket) => {
      if (itemTicket.status.toLowerCase() === 'open') {
        arrOpenTickets.push(itemTicket)
      } else {
        arrClosedTickets.push(itemTicket)
      }
    })

    return view.render('pages/ticket/ticket', {
      title: 'Заявки',
      openTickets: arrOpenTickets,
      closedTickets: arrClosedTickets
    })
  }

  public async create ({ view }: HttpContextContract) {
    const types = await TypeTicket.all()

    return view.render('pages/users/ticket/create', {
      title: 'Новая заявка',
      types
    })
  }

  public async store ({ auth, request, response, session }: HttpContextContract) {
    const validSchema = schema.create({
      topic: schema.string({trim: true}, [
        rules.minLength(3),
        rules.maxLength(80)
      ]),
      description: schema.string({trim: true}, [
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

    const validateData = await request.validate({
      schema: validSchema,
      messages
    })

    const fileNameOld = validateData.fileIn?.clientName

    if (validateData.fileIn) {
      await validateData.fileIn.move(Application.publicPath('uploads/tickets'), {
        name: `${new Date().getTime()}.${validateData.fileIn.extname}`
      })
    }

    await Ticket.create({
      topic: validateData.topic,
      description: validateData.description,
      file_name_new: validateData.fileIn?.fileName,
      file_name_old: fileNameOld,
      file_extname: validateData.fileIn?.extname,
      id_ticket_type: validateData.typeReq,
      id_user: auth.user?.id,
      status: 'Open'
    })

    session.flash({ 'successmessage': `Заявка с темой: "${ validateData.topic }" была отправлена.` })
    if (auth.user.roleId === 1) {
      return response.redirect('/ticket')
    } else {
      return response.redirect('/ticket/user')
    }
  }

  public async show ({ view, params }: HttpContextContract) {
    const ticket = await Ticket.findOrFail(params.id)

    return view.render('pages/ticket/detail', {
      title: `Подробный просмотр обращения: №${ticket.id}, тема: "${ticket.topic}"`,
      ticket
    })
  }

  public async close ({ params, session, request, response, auth }: HttpContextContract) {
    const ticket = await Ticket.findOrFail(params.id)
    const validSchema = schema.create({
      time: schema.string({trim: true})
    })
    const messages = {
      'time.required': 'Поле "Время " является обязательным.',
    }

    const validateData = await request.validate({
      schema: validSchema,
      messages
    })

    if (ticket) {
      ticket.status = request.input('status')
      ticket.working_hours = +validateData.time
      ticket.id_user_closed = auth.user?.id

      await ticket.save()
    }

    session.flash({ 'successmessage': `Заявка с темой: "${ ticket.topic }" была закрыта.` })
    return response.redirect('/ticket')
  }

  public async indexUser ({ view, auth }: HttpContextContract) {
    const arrOpenTickets = []
    const arrClosedTickets = []
    const user = auth.user
    await user?.preload('ticketUser')
    const tickets = user?.ticketUser

    tickets?.forEach((itemTicket) => {
      if (itemTicket.status.toLowerCase() === 'open') {
        arrOpenTickets.push(itemTicket)
      } else {
        arrClosedTickets.push(itemTicket)
      }
    })

    return view.render('pages/users/ticket/user_ticket', {
      title: 'Заявки',
      openTickets: arrOpenTickets,
      closedTickets: arrClosedTickets
    })
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
    const validSchema = schema.create({
      name: schema.string({
        trim: true,
        escape: true
      }, [
        rules.minLength(2),
        rules.maxLength(80)
      ])
    })

    const messages = {
      'name.required': 'Поле "Название" является обязательным.',
      'name.minLength': 'Минимальная длинна поля 2 символа.',
      'name.maxLength': 'Максимальная длинна поля 80 символов.'
    }

    const validateData = await request.validate({
      schema: validSchema,
      messages: messages
    })

    await TypeTicket.create(validateData)

    session.flash('successmessage', `Тип "${validateData.name}" успешно добавлен.`)
    response.redirect('/ticket/type')
  }

  public async editType ({ view, params }: HttpContextContract) {
    const type = await TypeTicket.findOrFail(params.id)

    return view.render('pages/ticket/type/edit', {
      title: 'Редактирование',
      type
    })
  }

  public async updateType ({ params, request, response, session }: HttpContextContract) {
    const validSchema = schema.create({
      name: schema.string({
        trim: true,
        escape: true
      }, [
        rules.minLength(2),
        rules.maxLength(80)
      ])
    })

    const messages = {
      'name.required': 'Поле "Название" является обязательным.',
      'name.minLength': 'Минимальная длинна поля 2 символа.',
      'name.maxLength': 'Максимальная длинна поля 80 символов.'
    }

    const validateData = await request.validate({
      schema: validSchema,
      messages: messages
    })

    const type = await TypeTicket.findOrFail(params.id)

    if (type) {
      type.name = validateData.name
      await type?.save()
    }

    session.flash('successmessage', `Тип "${validateData?.name}" успешно обновлен.`)
    return response.redirect('/ticket/type');
  }

  public async destroyType ({ params, response, session }: HttpContextContract) {
    const type = await TypeTicket.findOrFail(params.id)

    await type?.delete()

    session.flash({ 'successmessage': `Тип заявки "${type?.name}" был удален.` });
    return response.redirect('/ticket/type')
  }
}
