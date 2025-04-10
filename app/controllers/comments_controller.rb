class CommentsController < ApplicationController
  include Controllers::Crudify
  super_model_klass Project, :comments
  model_klass Comment

  before_action -> { @page_title = "Comments for #{@project.name}" }, only: :index

  show_back :all

  private

  # Only allow a trusted parameter "white list" through.
  def resource_params
    params.require(:comment).permit(:content)
  end
end
