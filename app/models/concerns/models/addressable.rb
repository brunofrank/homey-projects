module Models::Addressable
  extend ActiveSupport::Concern

  included do
    has_one :address, as: :addressable
    has_many :addresses, as: :addressable
    accepts_nested_attributes_for :address, reject_if: :all_blank
  end
end
