class ProjectsController < ApplicationController
  include Controllers::Crudify
  model_klass Project

  before_action -> { @page_title = @project.name }, only: :show

  def update
    respond_to do |format|
      if @project.update(resource_params)
        format.html { redirect_to projects_url }
        format.json { render :show, status: :ok, location: @project }
        format.turbo_stream
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @project.errors, status: :unprocessable_entity }
      end
    end
  end

  private
  # Only allow a trusted parameter "white list" through.
  def resource_params
    params.require(:project).permit(:name, :status)
  end
end
