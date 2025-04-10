class CreateProjects < ActiveRecord::Migration[7.1]
  def change
    create_table :projects do |t|
      t.references :tenant, null: false, foreign_key: true
      t.string :name, index: true
      t.integer :status, default: 0

      t.timestamps
    end
  end
end
