import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const AuthController = () => import('#controllers/auth_controller')
const PivotsController = () => import('#controllers/pivots_controller')
const IrrigationsController = () => import('#controllers/irrigations_controller')

router.get('/', async () => 'It works!')

router
  .group(() => {
    router.post('register', [AuthController, 'register'])
    router.post('login', [AuthController, 'login'])
  })
  .prefix('auth')

// Rotas protegidas por autenticação
router
  .group(() => {
    router.resource('pivots', PivotsController).apiOnly()
    router.resource('irrigations', IrrigationsController).apiOnly().except(['update'])
  })
  .use(middleware.auth())
