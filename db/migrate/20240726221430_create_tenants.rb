class CreateTenants < ActiveRecord::Migration[7.1]
  def change
    create_table :tenants do |t|
      t.string :subdomain

      t.timestamps
    end
  end
end
