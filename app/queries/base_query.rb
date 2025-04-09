class BaseQuery
  def initialize(scope = nil, filters: {})
    @executed = false
    @filters = filters || {}
    @scope = scope || default_scope
    preload_related_objects
    apply_filters
  end

  def execute
    return @scope if executed?

    @executed = true

    order
  end

  def executed?
    @executed
  end

  protected

  def preload_related_objects; end

  def apply_filters
    raise NotImplementedError, 'This method must be implemented in a subclass'
  end

  def default_scope
    raise NotImplementedError, 'This method must be implemented in a subclass'
  end

  def order
    @scope
  end
end
