module Models::HasUser
  extend ActiveSupport::Concern

  included do
    before_create :set_user
    default_scope { where(user_id: Current.user_id) }
  end

  private

  def set_user
    self.user_id ||= Current.user_id
  end
end
