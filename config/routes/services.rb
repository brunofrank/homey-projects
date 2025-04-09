require 'sidekiq/web'

get 'up' => 'rails/health#show', as: :rails_health_check
get '/d/:code' => 'displays#simple_access', as: :simple_display_access

mount ActionCable.server => '/cable'

if Rails.env.production?
  Sidekiq::Web.use Rack::Auth::Basic do |username, password|
    ActiveSupport::SecurityUtils.secure_compare(::Digest::SHA256.hexdigest(username),
                                                ::Digest::SHA256.hexdigest('bfscordeiro')) &
      ActiveSupport::SecurityUtils.secure_compare(::Digest::SHA256.hexdigest(password),
                                                  ::Digest::SHA256.hexdigest('Pirul3&te'))
  end
end

mount Sidekiq::Web => '/sidekiq'
