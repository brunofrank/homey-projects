module Loaders
  # See https://github.com/Shopify/graphql-batch/blob/6eabbf8f914510e1c6965cbb6b19c14df250433f/examples/record_loader.rb
  class RecordLoader < GraphQL::Batch::Loader
    def initialize(model, column: model.primary_key, where: nil)
      @model = model
      @column = column.to_s
      @column_type = model.type_for_attribute(@column)
      @where = where

      super()
    end

    def perform(keys)
      query(keys).each { |record| fulfill(record.public_send(@column), record) }
      keys.each { |key| fulfill(key, nil) unless fulfilled?(key) }
    end

    private

    def query(keys)
      scope = @model
      scope = scope.where(@where) if @where
      scope.where(@column => keys)
    end
  end
end
