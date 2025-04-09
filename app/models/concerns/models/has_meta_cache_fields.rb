module Models::HasMetaCacheFields
  extend ActiveSupport::Concern

  def method_missing(meth, *args, &block)
    if respond_to?(:meta)
      cached_value = meta[meth.to_s]

      return cached_value if cached_value.present?
    end

    super
  end
end
