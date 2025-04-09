module Models::BroadcastDelegator
  extend ActiveSupport::Concern

  included do
    after_initialize do |subject|
      @broadcast_delegated_klass_instance = self.class.broadcast_delegated_klass.new(self)
    end

    after_create_commit ->(record) {
      @broadcast_delegated_klass_instance.after_create_commit unless record.skip_broadcast?
    }
    after_update_commit ->(record) {
      @broadcast_delegated_klass_instance.after_update_commit unless record.skip_broadcast?
    }
    after_destroy_commit ->(record) {
      @broadcast_delegated_klass_instance.after_destroy_commit unless record.skip_broadcast?
    }
  end

  def skip_broadcast!
    @skip_broadcast = true
  end

  def skip_broadcast?
    defined?(@skip_broadcast) && @skip_broadcast
  end

  class_methods do
    def delegate_broadcast_to(klass)
      @broadcast_delegated_klass = klass
    end

    def broadcast_delegated_klass
      @broadcast_delegated_klass
    end
  end
end
