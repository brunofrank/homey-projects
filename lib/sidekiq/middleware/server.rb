module Sidekiq::Middleware
  class Server
    def call(worker_class, item, queue)
      Tenant.switch_by_id(item['tenant_id']) do
        Rails.logger.info("Running job for tenant: #{Current.tenant_id}")

        yield
      end
    end
  end
end