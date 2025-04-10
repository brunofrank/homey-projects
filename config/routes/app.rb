root 'projects#index'

devise_for :users, path: 'auth', path_names: {
                                   sign_in: 'login',
                                   sign_out: 'logout',
                                   registration: 'signup'
                                 },
                   controllers: {
                     sessions: 'users/sessions'
                   }

resources :tenants
resources :users
resources :projects do
  resources :comments
end

get '/settings' => 'misc#settings', as: :settings
post '/settings/save' => 'misc#save_setting', as: :save_setting

mount GraphiQL::Rails::Engine, at: '/graphiql', graphql_path: '/graphql' if Rails.env.development?

post '/graphql', to: 'graphql#execute'
