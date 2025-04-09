module Controllers::Tenantfy
  extend ActiveSupport::Concern

  included do
    before_action :set_tenant
  end

  def set_tenant
    tenant = Tenant.find_by(subdomain: request.subdomain)
    Rails.logger.info("[Tenantfy] subdomain: #{request.subdomain} - #{tenant.id}")
    Current.tenant_id = tenant.id
  end
end
