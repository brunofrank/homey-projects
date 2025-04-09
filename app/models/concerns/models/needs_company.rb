module Models::NeedsCompany
  extend ActiveSupport::Concern

  included do
    before_create :set_company
  end

  private

  def set_company
    self.company_id ||= Current.company_id
  end
end
