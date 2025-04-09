module Models::Paranoid
  extend ActiveSupport::Concern

  included do
    default_scope { where(deleted_at: nil) } # rubocop:disable Airbnb/DefaultScope
  end

  class_methods do
    def with_deleted
      unscope(where: :deleted_at)
    end
  end

  def destroy
    update_columns(deleted_at: Time.current)
  end

  def destroy!
    update_columns(deleted_at: Time.current)
  end

  def restore!
    update_columns(deleted_at: nil)
  end
end
