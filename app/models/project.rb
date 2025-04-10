class Project < ApplicationRecord
  include Models::Tenantfy
  include Models::Searchable

  search_by :name

  enum status: { todo: 0, ready_to_dev: 1, in_progress: 2, in_review: 3, done: 4 }

  has_many :comments

  validates :name, presence: true

  after_commit :status_change_track

  private

  def status_change_track
    if status_previously_changed?
      prev_status = I18n.t("simple_form.labels.project.statuses_enum.#{status_previously_was}")
      new_status = I18n.t("simple_form.labels.project.statuses_enum.#{status}")

      comments.create(
        content: "Status changed from `#{prev_status}` to `#{new_status}`"
      )
    end
  end
end
