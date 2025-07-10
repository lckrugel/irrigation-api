import env from '#start/env'

const AuthConfig = {
  jwt: {
    secret: env.get('APP_KEY'),
  },
}

export default AuthConfig
