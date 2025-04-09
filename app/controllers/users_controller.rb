class UsersController < ConfigurationsController
  include JwtAuthenticator
  include Controllers::Crudify

  skip_before_action :authenticate_user!, only: :me
  before_action :authenticate_token!, only: :me

  model_klass User

  def me
    render json: {
      status: { code: 200 },
      data: ::UserSerializer.new(current_user).serializable_hash[:data][:attributes],
      token: current_user.authentication_token
    }, status: :ok
  end

  private

  # Only allow a trusted parameter "white list" through.
  def resource_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation, :role)
  end
end
