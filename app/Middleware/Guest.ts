import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Guest {
  public async handle ({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    auth.isLoggedIn ? response.redirect('/'): await next()
    // if (auth.isLoggedIn) {
    //   return response.redirect('/')
    // }

    // await next()
  }
}
