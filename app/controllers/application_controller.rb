class ApplicationController < ActionController::Base
  include Controllers::Tenantfy
  include Controllers::Searchable
  include Controllers::Backable
  include SetCurrentRequestDetails

  before_action :authenticate_user!
  # load_and_authorize_resource

  rescue_from CanCan::AccessDenied do |exception|
    respond_to do |format|
      format.json { head :forbidden }
      format.html { redirect_to root_path, alert: exception.message }
    end
  end

  private

  def hide_header
    @hide_header = true
  end
end
