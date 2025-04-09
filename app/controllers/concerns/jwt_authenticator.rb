# frozen_string_literal: true

module JwtAuthenticator
  extend ActiveSupport::Concern

  included do
    skip_before_action :verify_authenticity_token
  end

  def authenticate_token!
    token = request.headers['authorization']&.split(' ')&.last

    if token.present? && (user = User.from_token(token))
      sign_in(user, store: false)
    else
      render json: {
        error: [{ message: 'Auth token invalid or expired' }]
      }, status: 401
    end
  end
end
