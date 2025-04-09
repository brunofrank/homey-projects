
require 'sidekiq/middleware/client'
require 'sidekiq/middleware/server'

Sidekiq.configure_server do |config|
  config.client_middleware do |chain|
    chain.add ::Sidekiq::Middleware::Client
  end

  config.server_middleware do |chain|
    if defined?(::Sidekiq::Batch::Server)
      chain.insert_before ::Sidekiq::Batch::Server, ::Sidekiq::Middleware::Server
    else
      chain.add ::Sidekiq::Middleware::Server
    end
  end
  config.redis = { url: ENV['REDIS_URL'] }
end

Sidekiq.configure_client do |config|
  config.client_middleware do |chain|
    chain.add ::Sidekiq::Middleware::Client
  end

  config.redis = { url: ENV['REDIS_URL'] }
end
