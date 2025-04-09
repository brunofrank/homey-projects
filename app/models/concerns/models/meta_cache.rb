module Models::MetaCache
  extend ActiveSupport::Concern

  included do
    after_commit :upset_meta_cache
  end

  def method_missing(meth, *args, &block)
    if respond_to?(:meta)
      cached_value = meta[meth.to_s]

      return cached_value if cached_value.present?
    end

    super
  end

  class MetaCache
    def initialize(fields, record)
      @fields = fields
      @record = record
    end

    def upset_meta_cache!(force: false)
      upset_meta = {}

      @fields.each do |association, fields|
        fields.filter { |k, _| k != :_type }.each do |meta_field, field_name|
          upset_meta[association] ||= {}
          upset_meta[association][:_type] = fields[:_type] if fields[:_type]
          if changed?(field_name) || force
            upset_meta[association][meta_field] = @record.instance_eval(field_name)
          end
        end
      end

      upset_meta.each do |association, meta|
        return if meta[:_type].present? && @record.send("#{association}_type") != meta[:_type]

        meta_to_merge = meta.filter { |k, _| k != :_type }
        @record.send(association).meta = @record.send(association).meta.merge(meta_to_merge)
        @record.send(association).save
      end
    end

    private

    def changed?(field_name)
      if field_name.split('.').size > 1
        @record.send("#{@record.association(field_name.split('.').first).reflection.foreign_key}_previously_changed?")
      else
        @record.send("#{field_name}_previously_changed?")
      end
    end
  end

  class_methods do
    def meta_cache(**fields)
      @@meta_cache_fields = fields
    end
  end

  def upset_meta_cache
    MetaCache.new(@@meta_cache_fields, self).upset_meta_cache!
  end

  def refresh_meta_cache!
    MetaCache.new(@@meta_cache_fields, self).upset_meta_cache!(force: true)
  end
end
