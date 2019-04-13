class CreateUserTrainingStatus < ActiveRecord::Migration[4.2]
  gem "rake"
  def up
    create_table :user_training_statuses do |t|
      t.integer :user_id
      t.integer :status
      t.integer :training_id
    end
  end

  def down
    drop_table :user_training_statuses
  end
end
