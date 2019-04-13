class RootApp < BaseApp
  get "/" do
    json response: {
      status: :ok
    }
  end

  get "/training" do
    training_id = params[:training_id]
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

  post '/training' do
    @user_training = UserTrainingStatus.create user_id: @body[:user_id],
                        training_id: @body[:training_id],
                        status: @body[:status]
    if @user_training.valid?
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
