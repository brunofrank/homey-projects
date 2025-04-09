module Models
  module Codify
    extend ActiveSupport::Concern

    class Codify
      def initialize(field, kind: :serial)
        @field_name = field
        @kind = kind
      end

      def apply_next_value(record)
        model_klass = record.class
        loop do
          code = next_val(model_klass.table_name)

          next unless kind == :serial || model_klass.where(field_name => code).count.zero?

          record.send("#{field_name}=", code)

          break
        end
      end

      private

      def field_name
        @field_name || :code
      end

      def kind
        @kind || :serial
      end

      def next_val(table_name = nil)
        case kind
        when :alpha_dashed
          SecureRandom.alphanumeric(6).upcase.scan(/.../).join('-')
        when :hex
          SecureRandom.hex
        when :uuid
          SecureRandom.uuid
        when :serial
          Sequence.next_val(table_name)
        end
      end
    end

    included do
      before_create :set_codify_next_code
    end

    class_methods do
      def codify_instance
        @codify_instance
      end

      def codify_field(field, kind: :serial)
        @codify_instance = Codify.new(field, kind: kind)
      end
    end

    def set_codify_next_code
      self.class.codify_instance.apply_next_value(self)
    end
  end
end
