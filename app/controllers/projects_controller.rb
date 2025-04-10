class ProjectsController < ApplicationController
  include Controllers::Crudify
  model_klass Project

  before_action -> { @page_title = @project.name }, only: :show

  private
  # Only allow a trusted parameter "white list" through.
  def resource_params
    params.require(:project).permit(:name, :status)
  end
end
