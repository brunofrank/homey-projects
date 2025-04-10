class Comment < ApplicationRecord
  include Models::Tenantfy

  belongs_to :tenant
  belongs_to :project

  validates :content, presence: true
end
