user = User.create(
  name: 'Jhon Doe',
  email: 'jhon@homey.dev',
  password: '123123123',
  password_confirmation: '123123123',
  jti: SecureRandom.uuid
)
user.confirm

Current.user_id = user.id
