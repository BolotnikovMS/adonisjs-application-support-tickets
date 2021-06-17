import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, validator, rules } from '@ioc:Adonis/Core/Validator'
import Application from '@ioc:Adonis/Core/Application'

import TypeDocument from 'App/Models/TypeDocument';
import Document from 'App/Models/Document';

const fs = require('fs');

export default class DocumentsController {
  public async index ({ view }: HttpContextContract) {
    const types = await TypeDocument.query().preload('documents')

    // types.forEach((types) => console.log(types.documents))
    return view.render('pages/documents/document', {
      title: 'Документы',
      types
    })
  }

  public async create ({ view }: HttpContextContract) {
    const types = await TypeDocument.all()
    return view.render('pages/documents/create', {title: 'Добавить документ', types})
  }

  public async store ({ request, response, session }: HttpContextContract) {
    const validSchema = schema.create({
      name: schema.string({
        escape: true,
        trim: true
      },
      [
        rules.minLength(3),
        rules.maxLength(80)
      ]),
      typeDoc: schema.number(),
      fileIn: schema.file({
        size: '15mb',
        extnames: ['jpg', 'png', 'jpeg', 'bmp', 'pdf', 'docx', 'doc', 'docm', 'docx', 'xlsx', 'xls', 'xlsm', 'xlsb', 'xml']
      })
    })

    const messages = {
      'name.required': 'Поле "Название" является обязательным.',
      'name.minLength': 'Минимальная длинна поля 3 символа.',
      'name.maxLength': 'Максимальная длинна поля 80 символов.',
      'typeDoc.required': 'Поле "Тип документа" является обязательным.',
      'fileIn.required': 'Файл не прикреплен.',
      'fileIn.size': 'Загружаемый файл больше 15мб.',
      'fileIn.file.extname': 'Загружаемый файл должен иметь одно из следующих расширений: {{ options.extnames }}'
    }

    const file = await request.validate({
      schema: validSchema,
      messages
    })

    await file.fileIn.move(Application.publicPath('uploads/documents'), {
      name: `${new Date().getTime()}.${file.fileIn.extname}`
    })

    await Document.create({
      name: file.name,
      file_name: file.fileIn.fileName,
      file_extname: file.fileIn.extname,
      id_type: file.typeDoc
    })

    session.flash({ 'successmessage': `Документ с названием: "${file.name}" был добавлен.` });
    return response.redirect('/documents/');
  }

  public async show ({}: HttpContextContract) {
  }

  public async edit ({}: HttpContextContract) {
  }

  public async update ({}: HttpContextContract) {
  }

  public async destroy ({ params, response, session }: HttpContextContract) {
    const document = await Document.findOrFail(params.id)

    fs.unlink(`public/uploads/documents/${document.file_name}`, (err) => {
      if (err) {
        console.log(err)
      }

      document.delete()
    })

    session.flash({ 'successmessage': `Документ: "${document.toJSON().name }" был удален.` });
    return response.redirect('/documents/');
  }

  public async indexType ({ view }: HttpContextContract) {
    const typesDocuments = await TypeDocument.query().preload('documents')

    return view.render('pages/documents/type/type', {
      title: 'Типы документов',
      typesDocuments
    })
  }

  public async createType ({ view }: HttpContextContract) {
    return view.render('pages/documents/type/create', {title: 'Добавить тип документа'})
  }

  public async storeType ({ request, response, session }: HttpContextContract) {
    const typeDocuments = {...request.only(['name'])}

    await validator.validate({
      schema: schema.create({
        name: schema.string({
          escape: true,
          trim: true
        },
        [
          rules.minLength(3),
          rules.maxLength(80)
        ])
      }),
      data: typeDocuments,
      messages: {
        'name.required': 'Поле "Название" является обязательным.',
        'name.minLength': 'Минимальная длинна поля 3 символа.',
        'name.maxLength': 'Максимальная длинна поля 80 символов.',
      }
    })

    await TypeDocument.create(typeDocuments)

    session.flash('successmessage', `Тип документа "${typeDocuments.name}" успешно добавлен.`)
    response.redirect('/documents/type')
  }

  public async editType ({ view, params }: HttpContextContract) {
    const typeDocuments = await TypeDocument.findOrFail(params.id)

    return view.render('pages/documents/type/edit', {
      title: 'Редактирование',
      typeDocuments
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
          rules.minLength(3),
          rules.maxLength(80)
        ])
      }),
      messages: {
        'name.required': 'Поле "Название" является обязательным.',
        'name.minLength': 'Минимальная длинна поля 3 символа.',
        'name.maxLength': 'Максимальная длинна поля 80 символов.',
      }
    })

    const typeDocuments = await TypeDocument.findOrFail(params.id)
    const { name } = request.only(['name'])

    if (typeDocuments) {
      typeDocuments.name = name.trim()
      await typeDocuments?.save()
    }

    session.flash('successmessage', `Данные об типе документа "${typeDocuments?.name}" успешно обновлены.`)
    return response.redirect('/documents/type');
  }

  public async destroyType ({ params, response, session }: HttpContextContract) {
    const typeDocuments = await TypeDocument.findOrFail(params.id)

    await typeDocuments?.delete()

    session.flash({ 'successmessage': ` Тип документа "${typeDocuments?.name}" был удален.` });
    response.redirect('/documents/type')
  }
}
