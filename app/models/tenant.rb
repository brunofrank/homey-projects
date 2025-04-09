class Tenant < ApplicationRecord
  validates :subdomain, uniqueness: true

  after_create :setup_tenant
  has_many :users

  # Método para verificar se as coordenadas do estabelecimento estão configuradas
  def location_configured?
    latitude.present? && longitude.present?
  end

  # Método para obter as coordenadas como um array [latitude, longitude]
  def coordinates
    [latitude, longitude] if location_configured?
  end

  def self.switch!(subdomain)
    Current.tenant_id = Tenant.find_by(subdomain: subdomain).id
  end

  def self.switch_by_id!(tenant_id)
    Current.tenant_id = tenant_id
  end

  def switch!
    Current.tenant_id = self.id
  end

  def switch
    prev_tenant_id = Current.tenant_id
    Current.tenant_id = self.id

    yield
  ensure
    Current.tenant_id = prev_tenant_id
  end

  def self.switch_by_id(tenant_id)
    prev_tenant_id = Current.tenant_id
    Current.tenant_id = tenant_id

    yield
  ensure
    Current.tenant_id = prev_tenant_id
  end

  def self.switch(subdomain)
    prev_tenant_id = Current.tenant_id
    Current.tenant_id = Tenant.find_by(subdomain: subdomain).id

    yield
  ensure
    Current.tenant_id = prev_tenant_id
  end

  def self.current
    Current.tenant
  end

  private

  def create_default_data!
    Dir[File.join(Rails.root, 'db', 'defaults', '*.rb')].sort.each { |default| load default }
  end

  def setup_tenant
    return if Rails.env.test?

    Tenant.switch(subdomain) do
      create_default_data!
    end
  end
end
