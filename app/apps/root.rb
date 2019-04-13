class RootApp < BaseApp

  get '/' do
   send_file File.join(settings.public_folder, 'index.html')
  end

  get "/training" do
    training_id = params[:training_id].to_i
    @training_statuses = UserTrainingStatus.where(training_id: training_id)
    if @training_statuses
      json response: {
        status: :ok,
        errors: [],
        data: @training_statuses,
        request: params,
        redirect: nil
      }
    else
      json response: {
        status: :fail,
        errors: [
          "Training ID #{params[:training_id]} does not exist"
        ],
        data: [],
        request: params,
        redirect: nil
      }
    end
  end

  #currently sends invite to users 1-10 for the given training id
  post '/sendinvite' do
    user_ids = 1...10
    @training_statuses = user_ids.map do |user_id|
      status = UserTrainingStatus.find_or_initialize_by user_id: user_id, training_id: @body[:training_id].to_i, status: 0
      status.save
      status
    end
    json response: {
      status: :ok,
      errors: [],
      data: @training_statuses,
      request: @body,
      redirect: nil,
    }
  end

  post '/training' do
    @user_training = UserTrainingStatus.find_or_initialize_by user_id: @body[:user_id],
                        training_id: @body[:training_id],
                        status: @body[:status]
    if @user_training.valid?
      @user_training.save
      json response: {
        status: :ok,
        errors: [],
        data: @user_training,
        request: @body,
        redirect: nil,
      }
    else
      json response: {
        status: :fail,
        errors: @user_training.errors,
        data: [],
        request: @body,
        redirect: "/"
      }
    end
  end
end
