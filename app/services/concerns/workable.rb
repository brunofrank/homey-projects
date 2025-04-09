module Workable
  extend ActiveSupport::Concern

  included do
    service_class = self

    worker_klass = Class.new do
      include Sidekiq::Worker
      sidekiq_options queue: @queue_name || 'default'
    end

    worker_klass.define_method :queue_name do |queue_name|
      @queue_name = queue_name
    end

    worker_klass.define_method :perform do |args = nil|
      arguments = args.is_a?(Hash) ? args.symbolize_keys : args

      if arguments.present?
        service_class.call(arguments)
      else
        service_class.call
      end
    end

    const_set 'Worker', worker_klass
  end
end
