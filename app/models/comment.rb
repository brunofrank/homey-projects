class Comment < ApplicationRecord
  include Models::Tenantfy

  default_scope -> { order(created_at: :desc) }

  belongs_to :tenant
  belongs_to :project

  validates :content, presence: true
end
