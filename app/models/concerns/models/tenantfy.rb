module Models
  module Tenantfy
    extend ActiveSupport::Concern

    included do
      default_scope { where(tenant_id: Current.tenant_id) }

      belongs_to :tenant

      before_create :set_tenant_id
    end

    def set_tenant_id
      current_tenant_id = Current.tenant_id

      self.tenant_id = current_tenant_id if tenant_id.blank? && current_tenant_id.present?
    end
  end
end
