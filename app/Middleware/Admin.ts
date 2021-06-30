import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from 'App/Models/Role'

export default class Admin {
  public async handle({ response, auth, session }: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const user = auth.user
    const roleUser = await Role.findOrFail(user?.roleId)

    if (roleUser.name.toLocaleLowerCase() !== 'administrator') {
      session.flash({ 'dangermessage': 'У вас нету доступа.' });
      return response.redirect('/');
    }

    await next()
  }
}
