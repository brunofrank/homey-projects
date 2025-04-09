# frozen_string_literal: true

class GraphqlController < ActionController::Base
  include Controllers::Tenantfy
  include JwtAuthenticator
  include SetCurrentRequestDetails

  before_action :authenticate_token!, unless: :instrospection?

  def execute
    # if Rails.env.development?
    # sleep 0.1 # Simulate load time in development
    # puts '-' * 100, GraphQLFormatter.new(params[:query].to_s).to_s, '-' * 100
    # end

    variables = prepare_variables(params[:variables])
    query = params[:query]
    operation_name = params[:operationName]
    context = { current_user: }
    result = HomeySchema.execute(query, variables:, context:, operation_name:)

    render json: result
  rescue StandardError => e
    raise e unless Rails.env.development?

    handle_error_in_development(e)
  end

  private

  # Handle variables in form data, JSON body, or a blank value
  def prepare_variables(variables_param)
    case variables_param
    when String
      if variables_param.present?
        JSON.parse(variables_param) || {}
      else
        {}
      end
    when Hash
      variables_param
    when ActionController::Parameters
      variables_param.to_unsafe_hash # GraphQL-Ruby will validate name and type of incoming variables.
    when nil
      {}
    else
      raise ArgumentError, "Unexpected parameter: #{variables_param}"
    end
  end

  def handle_error_in_development(error)
    logger.error do
      { message: error.message, backtrace: error.backtrace.join("\n") }
    end

    render json: {
      errors: [{ message: error.message, backtrace: error.backtrace }], data: {}
    }, status: 500
  end

  def instrospection?
    Rails.env.development? && params[:operationName] == 'IntrospectionQuery'
  end
end
