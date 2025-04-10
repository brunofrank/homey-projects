module Controllers::Crudify
  extend ActiveSupport::Concern

  included do
    before_action :set_super_resource
    before_action :set_resource, only: %i[show edit update]

    show_search only: :index
    show_back only: %i[new edit]

    helper_method :form_resources
  end

  class_methods do
    def super_model_klass(klass, association = nil)
      @super_model_klass = klass
      @super_model_association = association
    end

    def get_super_model_klass
      @super_model_klass
    end

    def get_super_model_association
      @super_model_association
    end

    def model_klass(klass)
      @model_klass = klass
    end

    def get_model_klass
      @model_klass
    end
  end

  def index
    @resources = if params[:q].blank?
                   resource_context.all.paginate(page: params[:page])
                 else
                   resource_context.search(params[:q], page: params[:page] || 1)
                 end

    instance_variable_set("@#{model_klass.to_s.tableize.gsub('/', '_')}", @resources)
  end

  def show; end

  def new
    @resource = model_klass.new
    instance_variable_set("@#{model_klass.to_s.tableize.singularize.gsub('/', '_')}", @resource)
  end

  def edit; end

  def create
    @resource = resource_context.new(resource_params)
    @resource.send("#{super_resouce_relation_field}=", @super_resource) if super_model_klass.present?

    instance_variable_set("@#{model_klass.to_s.tableize.singularize.gsub('/', '_')}", @resource)

    respond_to do |format|
      if @resource.save
        format.html { redirect_to after_create_url, notice: 'Criado com sucesso!' }
        format.json { render :show, status: :created, location: @resource }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @resource.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @resource.update(resource_params)
        format.html { redirect_to after_update_url, notice: 'Alterações salvas!' }
        format.json { render :show, status: :ok, location: @resource }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @resource.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    ids_to_destroy = params[:id].split(',')
    resource_context.where(id: ids_to_destroy).destroy_all

    respond_to do |format|
      format.html { redirect_to after_destroy_url, notice: 'Registros excluídos com sucesso!' }
      format.json { render json: { status: :ok, msg: 'Registros excluídos com sucesso!' } }
    end
  end

  def form_resources
    return @resource if super_model_klass.blank? || super_resource_id.blank?

    [@super_resource, @resource]
  end

  protected

  def super_model_klass
    self.class.get_super_model_klass
  end

  def association_name
    self.class.get_super_model_association
  end

  def model_klass
    self.class.get_model_klass
  end

  def resource_params
    # will override
  end

  def after_create_url
    url_for(action: :index)
  end

  def after_update_url
    url_for(action: :index)
  end

  def after_destroy_url
    url_for(action: :index)
  end

  private

  def resource_context
    return model_klass if super_model_klass.blank? || super_resource_id.blank?

    @super_resource.send(association_name || model_klass.to_s.tableize)
  end

  def super_resource_id
    params["#{super_model_klass.to_s.underscore}_id"]
  end

  def super_resouce_relation_field
    super_model_klass.to_s.tableize.singularize.gsub('/', '_')
  end

  def set_super_resource
    return unless super_model_klass
    return if super_resource_id.blank?

    @super_resource = super_model_klass.find(super_resource_id)
    instance_variable_set("@#{super_model_klass.to_s.underscore.gsub('/', '_')}", @super_resource)
  end

  def set_resource
    @resource = resource_context.find(params[:id])
    instance_variable_set("@#{model_klass.to_s.underscore.gsub('/', '_')}", @resource)
  end
end
