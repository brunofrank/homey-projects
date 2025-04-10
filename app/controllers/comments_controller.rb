class CommentsController < ApplicationController
  include Controllers::Crudify
  super_model_klass Project, :comments
  model_klass Comment

  before_action -> { @page_title = "Comments for #{@project.name}" }, only: :index

  show_back :all

  def create
    @comment = @project.comments.new(resource_params)

    respond_to do |format|
      if @comment.save
        format.html { redirect_to project_comments_path(@project) }
        format.json { render :show, status: :created, location: @comment }
        format.turbo_stream
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @comment.errors, status: :unprocessable_entity }
      end
    end
  end

  private

  # Only allow a trusted parameter "white list" through.
  def resource_params
    params.require(:comment).permit(:content)
  end
end
