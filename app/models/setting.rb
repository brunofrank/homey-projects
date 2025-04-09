class Setting < ApplicationRecord
  include Models::Tenantfy

  validates_presence_of :name, :value, :data_type

  class Boolean
    def self.to_s
      'Boolean'
    end
  end

  class Text
    def self.to_s
      'Text'
    end
  end

  # ORDERS_PRIORITY = 'orders.priority'.freeze

  SETTINGS = [
    # {
    #   name: ORDERS_PRIORITY,
    #   data_type: String,
    #   default: 'time',
    #   list: [
    #     ['Por previsão de entrega', 'time'],
    #     ['Priorizar mesas', 'table'],
    #     ['Priorizar delivery', 'delivery']
    #   ],
    #   scope: :tenant
    # }
  ].freeze

  def self.get(name)
    Setting.find_or_create_by(name:)
  end

  def self.[](name)
    get(name).value_or_default
  end

  def self.set(name, value)
    setting = Setting.find_or_create_by(name:)
    setting.data_type = setting.meta[:data_type].to_s
    setting.value = value.to_s
    setting.save!
  end

  def self.available_settings(scope: :tenant)
    SETTINGS.select { |setting| setting[:scope] == scope }
  end

  def self.get_options_for_list(param)
    return unless param[:list]

    model_to_list = param[:list]
    if model_to_list.instance_of?(Array)
      param[:list]
    elsif !param[:scope] == :company && model_to_list.new.respond_to?(:company_id)
      model_to_list.where(company: Current.company).map { |item| [item.name, item.id] }
    else
      model_to_list.all.map { |item| [item.name, item.id] }
    end
  end

  def tenant_scope?
    meta[:scope] == :tenant
  end

  def company_scope?
    meta[:scope] == :company
  end

  def value_or_default
    cast_value || meta[:default]
  end

  def meta
    @meta ||= begin
      meta = SETTINGS.select { |item| item[:name] == name.to_s }.first

      raise NameError, 'Invalid setting name' unless meta

      meta
    end
  end

  private

  def cast_value
    case data_type
    when Float.to_s
      value.real
    when Integer.to_s
      value.to_i
    when Boolean.to_s
      (value =~ /(true|t|yes|y|1)$/i) >= 0
    else
      value
    end
  end
end
