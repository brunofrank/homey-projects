module Controllers
  module Backable
    extend ActiveSupport::Concern

    included do
      helper_method :show_back?, :back_controller
    end

    def show_back?
      self.class.show_back_actions.include?(:all) ||
        self.class.show_back_actions&.include?(action_name.to_sym)
    end

    def back_controller
      if self.class.get_super_model_klass.present? && action_name == 'index'
        self.class.get_super_model_klass.to_s.tableize
      else
        controller_name
      end
    end

    class_methods do
      def show_back_actions
        @show_back || []
      end

      def show_back(arg=nil, only: nil)
        @show_back = [only || arg].flatten.compact
      end

      def hide_back!
        @show_back = false
      end
    end
  end
end
