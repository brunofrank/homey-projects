class User < ApplicationRecord
  include Models::Tenantfy
  include Models::Searchable

  search_by :name, :email

  enum role: { admin: 0, operator: 1, delivery_man: 2, root: 3 }

  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :validatable,
         :confirmable, :lockable, :trackable

  belongs_to :tenant
  has_many :user_locations, dependent: :destroy
  has_many :deliveryman_check_ins, dependent: :destroy

  delegate :can?, :cannot?, to: :ability

  def name_with_id
    "#{name} (#{id})"
  end

  def initials
    (name || email).split(' ')[0, 2].map { |item| item.first.upcase }.join('')
  end

  def ability
    @ability ||= Ability.new(self)
  end

  def authentication_token
    JwtWrapper.encode(id, jti)
  end

  def self.from_token(token)
    payload = JwtWrapper.decode(token)

    user = User.find_by(id: payload['user_id'])
    user if user && user.jti == payload['jti']
  end

  def invalidate_tokens!
    update!(jti: SecureRandom.uuid)
  end

  # Retorna a localização atual do usuário (a mais recente)
  def current_location
    user_locations.ordered_by_created_at.first
  end

  # Adiciona uma nova localização para o usuário
  def add_location(latitude:, longitude:, accuracy: nil, provider: nil, metadata: {})
    user_locations.create!(
      latitude: latitude,
      longitude: longitude,
      accuracy: accuracy,
      provider: provider,
      metadata: metadata
    )
  end

  def checked_in?
    DeliverymanCheckIn.currently_checked_in?(id)
  end

  def current_check_in
    DeliverymanCheckIn.current_for(id)
  end

  # Faz o check-in do entregador
  def check_in!(latitude: nil, longitude: nil, accuracy: nil, is_inside_establishment: false, metadata: {})
    raise "Only delivery men can check in" unless delivery_man?

    deliveryman_check_ins.create!(
      latitude: latitude,
      longitude: longitude,
      accuracy: accuracy,
      is_inside_establishment: is_inside_establishment,
      metadata: metadata
    )
  end

  # Faz o check-out do entregador
  def check_out!
    current_check_in&.check_out!
  end
end
