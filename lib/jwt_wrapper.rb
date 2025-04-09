class JwtWrapper
  JWT_EXPIRATION = ENV.fetch('JWT_EXPIRATION_HOURS', 24).to_i
  JWT_SECRET_KEY = ENV['JWT_SECRET_KEY']

  def self.encode(user_id, jti)
    exp = JWT_EXPIRATION.hours.from_now.to_i

    payload = { user_id:, exp:, jti: }

    JWT.encode(payload, JWT_SECRET_KEY, 'HS256')
  end

  def self.decode(token)
    JWT.decode(token, JWT_SECRET_KEY, true, algorithm: 'HS256').first
  rescue StandardError
    {}
  end
end
