module Sidekiq::Middleware
  class Client
    def call(worker_class, item, queue, redis_pool=nil)
      Rails.logger.info("Queueing job for tenant: #{Current.tenant_id}")
      item["tenant_id"] ||= Current.tenant_id

      yield
    end
  end
end