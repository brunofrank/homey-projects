# frozen_string_literal: true

class Current < ActiveSupport::CurrentAttributes
  attribute :request_id, :user_agent, :ip_address
  attribute :tenant_id
  attribute :user_id

  def company
    @company ||= Company.first
  end

  def user
    User.find(user_id)
  end

  def tenant
    Tenant.find_by(id: tenant_id)
  end
end
