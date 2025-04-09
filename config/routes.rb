class SubdomainPresent
  def self.matches?(request)
    request.subdomain.present?
  end
end

class SubdomainBlank
  def self.matches?(request)
    request.subdomain.blank? || request.subdomain == 'www'
  end
end

Rails.application.routes.draw do
  constraints(SubdomainPresent) do
    draw(:app)
  end

  draw(:services)
end
