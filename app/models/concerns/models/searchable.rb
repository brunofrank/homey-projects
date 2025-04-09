module Models::Searchable
  extend ActiveSupport::Concern

  class EasySearch
    def self.build_query(query, options)
      conditions = []
      values = []

      options.each do |opt|
        if opt.instance_of?(Hash)
          if opt[opt.keys.last] == :equals
            conditions << "#{opt.keys.first} = ?"
            values << query
          else
            conditions << "#{opt.keys.first} ILIKE ?"
            values << "%#{query}%"
          end
        else
          conditions << "#{opt} ILIKE ?"
          values << "%#{query}%"
        end
      end

      [conditions.join(' OR ')] + values
    end
  end

  class_methods do
    def search(query, **options)
      scope = options[:scope].present? ? send(options[:scope]) : self

      scope = scope.where(EasySearch.build_query(query, search_options)) if query.present? && query != '*'
      scope = scope.limit(options[:limit]) if options[:limit].present?
      scope = scope.paginate(page: options[:page]) if options[:page].present?

      scope
    end

    def search_by(*fields)
      @fields = fields
    end

    def search_options
      @fields.size.positive? ? @fields : [{ id: :equals }]
    end
  end
end
