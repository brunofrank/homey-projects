# frozen_string_literal: true

module SetCurrentRequestDetails
  extend ActiveSupport::Concern

  included do
    before_action do
      Current.request_id = request.uuid
      Current.user_agent = request.user_agent
      Current.ip_address = request.ip
      Current.user_id = current_user.id if current_user.present?
    end
  end
end
