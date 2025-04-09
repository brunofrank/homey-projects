class TenantsController < ConfigurationsController
  include Controllers::Crudify
  model_klass Tenant

  load_and_authorize_resource

  private
  # Only allow a trusted parameter "white list" through.
  def resource_params
    params.require(:tenant).permit(:subdomain, :latitude, :longitude)
  end
end
