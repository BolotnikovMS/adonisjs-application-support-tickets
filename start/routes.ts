/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.on('/').render('index', {
  title: 'Главная страница'
}).as('home');

Route.group(() => {
  // Type tickets
  Route.get('/type/', 'TicketsController.indexType').as('index.type.all')
  Route.get('/type/new', 'TicketsController.createType').as('type.ticket.create')
  Route.post('/type/new', 'TicketsController.storeType').as('type.ticket.store')
  Route.get('/type/edit/:id', 'TicketsController.editType').as('type.ticket.edit')
  Route.post('/type/edit/:id', 'TicketsController.updateType').as('type.ticket.update')
  Route.get('/type/delete/:id', 'TicketsController.destroyType').as('type.ticket.destroy')

  Route.get('/', 'TicketsController.index').as('ticket.index')
  Route.get('/new', 'TicketsController.create').as('ticket.create')
  Route.post('/new', 'TicketsController.store').as('ticket.store')
  Route.get('/show/:id', 'TicketsController.show').as('ticket.show')
  Route.post('/show/:id', 'TicketsController.close').as('ticket.close')
})
.prefix('ticket')
.namespace('App/Controllers/Http')
.middleware('auth')

Route.group(() => {
  Route.get('/positions', 'PositionsController.index').as('positions.index')
  Route.get('/positions/new', 'PositionsController.create').as('positions.create')
  Route.post('/positions/new', 'PositionsController.store').as('positions.store')
  Route.get('/positions/edit/:id', 'PositionsController.edit').as('positions.edit')
  Route.post('/positions/edit/:id', 'PositionsController.update').as('positions.update')
  Route.get('/positions/:id', 'PositionsController.destroy').as('positions.destroy')

  Route.get('/departments', 'DepartmentsController.index').as('departments.index')
  Route.get('/departments/new', 'DepartmentsController.create').as('departments.create')
  Route.post('/departments/new', 'DepartmentsController.store').as('departments.store')
  Route.get('/departments/edit/:id', 'DepartmentsController.edit').as('departments.edit')
  Route.post('/departments/edit/:id', 'DepartmentsController.update').as('departments.update')
  Route.get('/departments/delete/:id', 'DepartmentsController.destroy').as('departments.destroy')

  Route.post('/logout', 'AuthController.logout').as('users.logout')
  Route.get('/registeruser/new', 'AuthController.index').as('register.index')
  Route.post('/registeruser/new', 'AuthController.store').as('users.store')

  Route.get('/', 'UsersController.index').as('users.index')
  Route.get('/edit/:id', 'UsersController.edit').as('user.edit')
  Route.post('/edit/:id', 'UsersController.update').as('user.update')
  Route.post('/edit/active/:id', 'UsersController.inactiveUser').as('user.active.update')
  Route.get('/delete/:id', 'UsersController.destroy').as('user.destroy')


  Route.get('/profile/:id', 'ProfilesController.index').as('user.profile.index')
  Route.get('/profile/edit/:id', 'ProfilesController.edit').as('user.profile.edit')
  Route.post('/profile/edit/:id', 'ProfilesController.update').as('user.profile.update')
})
.prefix('users')
.namespace('App/Controllers/Http')
.middleware('auth')

Route.group(() => {
  Route.get('/login', 'AuthController.showLogin').as('users.show.login')
  Route.post('/login', 'AuthController.login').as('users.login')
})
.namespace('App/Controllers/Http')
.middleware('guest')

Route.group(() => {
  // Type documents
  Route.get('/type', 'DocumentsController.indexType').as('type.documents.index')
  Route.get('/type/new', 'DocumentsController.createType').as('type.documents.create')
  Route.post('/type/new', 'DocumentsController.storeType').as('type.documents.store')
  Route.get('/type/edit/:id', 'DocumentsController.editType').as('type.documents.edit')
  Route.post('/type/edit/:id', 'DocumentsController.updateType').as('type.documents.update')
  Route.get('/type/delete/:id', 'DocumentsController.destroyType').as('type.documents.destroy')

  // Document
  Route.get('/', 'DocumentsController.index').as('documents.index')
  Route.get('/new', 'DocumentsController.create').as('documents.create')
  Route.post('/new', 'DocumentsController.store').as('documents.store')
  Route.get('/delete/:id', 'DocumentsController.destroy').as('documents.destroy')
})
.prefix('documents')
.namespace('App/Controllers/Http')
.middleware('auth')

// API Route
// Route tickets type
Route.group(() => {
  Route.group(() => {
    Route.get('/type', 'TicketsController.indexType').as('tickets.type.index')
    Route.post('/type', 'TicketsController.storeType').as('tickets.type.store')
    Route.get('/type/:id', 'TicketsController.showType').as('tickets.type.show')
    Route.put('/type/:id', 'TicketsController.updateType').as('tickets.type.update')
    Route.delete('/type/:id', 'TicketsController.destroyType').as('tickets.type.destroy')
  }).prefix('tickets')
})
.prefix('api')
.namespace('App/Controllers/Http/Api')

