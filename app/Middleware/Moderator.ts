import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from 'App/Models/Role'

export default class Moderator {
  public async handle ({ response, auth, session }: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const user = auth.user
    const roleUser = await Role.findOrFail(user?.roleId)

    if (roleUser.name.toLocaleLowerCase() !== 'moderator') {
      session.flash({ 'dangermessage': 'У вас нету доступа.' });
      return response.redirect('/');
    }

    await next()
  }
}
