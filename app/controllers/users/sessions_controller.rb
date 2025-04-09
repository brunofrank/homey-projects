# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  protect_from_forgery with: :null_session, if: -> { request.format.json? }

  respond_to :json

  private

  def respond_with(resource, _opts = {})
    return super unless request.format.json?

    if request.method == 'POST' && resource.persisted?
      render json: {
        status: { code: 200, message: 'Signed up sucessfully.' },
        data: ::UserSerializer.new(resource).serializable_hash[:data][:attributes],
        token: resource.authentication_token
      }, status: :ok
    elsif request.method == 'DELETE'
      render json: {
        status: { code: 200, message: 'Account deleted successfully.' }
      }, status: :ok
    end
  end
end
