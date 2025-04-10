require 'rails_helper'

RSpec.describe "projects/new", type: :view do
  before(:each) do
    assign(:project, Project.new(
      name: "MyString",
      status: 1
    ))
  end

  it "renders new project form" do
    render

    assert_select "form[action=?][method=?]", projects_path, "post" do

      assert_select "input[name=?]", "project[name]"

      assert_select "input[name=?]", "project[status]"
    end
  end
end
