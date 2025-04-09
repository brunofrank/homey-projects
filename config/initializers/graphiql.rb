return unless Rails.env.development?

GraphiQL::Rails.config.headers['Authorization'] = lambda { |context|
  Tenant.switch(context.request.subdomain) do
    return "bearer #{User.first.authentication_token}"
  end
}
