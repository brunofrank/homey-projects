module Models::FulltextSearchable
  extend ActiveSupport::Concern

  included do
    include PgSearch::Model
  end

  class_methods do
    def search(query, page: 1)
      if query.present?
        full_search(query).paginate(page: page)
      else
        all.paginate(page: page)
      end
    end

    def search_by(*search_fields)
      pg_search_scope :full_search, against: search_fields
    end
  end
end
