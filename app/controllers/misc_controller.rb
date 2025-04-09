class MiscController < ConfigurationsController
  def settings
    authorize! :manage, Setting

    @settings = Setting.all
  end

  def save_setting
    authorize! :manage, Setting
    Setting.set(save_params[:name], save_params[:value])

    render json: :ok
  end

  private

  def save_params
    params.permit(:name, :value)
  end
end
