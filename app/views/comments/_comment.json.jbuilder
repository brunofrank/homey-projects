json.extract! comment, :id, :content, :tenant_id, :project_id, :created_at, :updated_at
json.url comment_url(comment, format: :json)
