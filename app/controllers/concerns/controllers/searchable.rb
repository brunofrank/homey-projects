module Controllers
  module Searchable
    extend ActiveSupport::Concern

    included do
      helper_method :show_search?
    end

    def show_search?
      self.class.show_search_actions&.include?(action_name.to_sym)
    end

    class_methods do
      def show_search_actions
        @show_search || []
      end

      def show_search(only:)
        @show_search = [only].flatten
      end

      def hide_search!
        @show_search = false
      end
    end
  end
end
