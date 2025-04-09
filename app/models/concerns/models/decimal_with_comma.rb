module Models::DecimalWithComma
  extend ActiveSupport::Concern

  included do
    include ActionView::Helpers::NumberHelper
    extend ClassMethods
  end

  module ClassMethods
    def expect_comma_for(*args)
      unless args.size.zero?
        args.each do |name|
          name = name.to_s
          module_eval <<-METHOD

          def #{name}=(value)
            if value.nil?
              write_attribute('#{name}', nil)
            elsif value.to_s.include?(',')
              write_attribute('#{name}', BigDecimal(value.to_s.gsub(/[R$ ?]+/, '').gsub('.', '').gsub(',', '.')))
            elsif value.to_s.present?
              write_attribute('#{name}', BigDecimal(value.to_s))
            end
          end

          def #{name}_c
            number_to_currency(send('#{name}'), unit: '', separator: ',')
          end

          def #{name}_m
            number_to_currency(send('#{name}'), unit: 'R$', separator: ',')
          end
          METHOD
        end
      end
    end
  end
end
