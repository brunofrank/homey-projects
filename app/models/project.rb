class Project < ApplicationRecord
  include Models::Tenantfy
  include Models::Searchable

  search_by :name

  enum status: { todo: 0, ready_to_dev: 1, in_progress: 2, in_review: 3, done: 4 }

  has_many :comments

  validates :name, presence: true
end
