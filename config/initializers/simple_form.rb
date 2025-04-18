# frozen_string_literal: true

# Use this setup block to configure all options available in SimpleForm.
SimpleForm.setup do |config|
  # Default class for buttons
  config.button_class = 'button'

  # Define the default class of the input wrapper of the boolean input.
  config.boolean_label_class = 'checkbox'

  # How the label text should be generated altogether with the required text.
  config.label_text = ->(label, required, _explicit_label) { "#{label} #{required}" }

  # Define the way to render check boxes / radio buttons with labels.
  config.boolean_style = :inline

  # You can wrap each item in a collection of radio/check boxes with a tag
  config.item_wrapper_tag = :div

  # Defines if the default input wrapper class should be included in radio
  # collection wrappers.
  config.include_default_input_wrapper_class = false

  # CSS class to add for error notification helper.
  config.error_notification_class = 'notification is-danger'

  # Method used to tidy up errors. Specify any Rails Array method.
  # :first lists the first message for each field.
  # :to_sentence to list all errors for each field.
  config.error_method = :to_sentence

  # add validation classes to `input_field`
  config.input_field_error_class = 'is-danger'
  config.input_field_valid_class = 'is-success'

  # vertical forms
  #
  # bulma vertical default_wrapper
  config.wrappers :vertical_form, tag: 'div', class: 'field' do |b|
    b.use :html5
    b.use :placeholder
    b.optional :maxlength
    b.optional :minlength
    b.optional :pattern
    b.optional :min_max
    b.optional :readonly
    b.use :label, class: 'label'
    b.use :input, class: 'input', wrap_with: { tag: 'div', class: 'control' },
                  error_class: 'is-danger', valid_class: 'is-success'
    b.use :full_error, wrap_with: { tag: 'div', class: 'help is-danger' }
  end

  config.wrappers :with_addon, tag: 'div', class: 'field' do |b|
    b.use :html5
    b.use :placeholder
    b.optional :maxlength
    b.optional :minlength
    b.optional :pattern
    b.optional :min_max
    b.optional :readonly
    b.use :label, class: 'label'
    b.wrapper tag: :div, class: 'field has-addons' do |w|
      w.use :input, class: 'input', wrap_with: { tag: 'div', class: 'control input-holder' },
                    error_class: 'is-danger', valid_class: 'is-success'
      w.use :hint, wrap_with: { tag: 'div', class: 'control' }
    end
    b.use :full_error, wrap_with: { tag: 'div', class: 'help is-danger' }
  end

  # bulma vertical select_form
  config.wrappers :select_form, tag: 'div', class: 'control' do |b|
    b.use :html5
    b.use :placeholder
    b.optional :pattern
    b.optional :readonly
    b.use :label, class: 'label'
    b.use :input, wrap_with: { tag: 'div', class: 'select' }
    b.use :full_error, wrap_with: { tag: 'div', class: 'help is-danger' }
    # b.use :hint, wrap_with: { tag: 'small', class: 'form-text text-muted' }
  end

  # bulma extension vertical input for boolean
  config.wrappers :vertical_boolean do |b|
    b.use :html5
    b.optional :readonly
    b.use :input, class: 'is-checkradio is-info'
    b.use :label
  end

  # bulma extension vertical input for boolean
  config.wrappers :horizontal_boolean, class: 'check-boxes horizontal' do |b|
    b.use :html5
    b.optional :readonly
    b.use :input, class: 'is-checkradio is-info'
    b.use :label
  end

  ## vertical input for radio buttons and check boxes
  # config.wrappers :vertical_collection, item_wrapper_class: 'form-check', tag: 'fieldset', class: 'form-group', error_class: 'form-group-invalid', valid_class: 'form-group-valid' do |b|
  #   b.use :html5
  #   b.optional :readonly
  #   b.wrapper :legend_tag, tag: 'legend', class: 'col-form-label pt-0' do |ba|
  #     ba.use :label_text
  #   end
  #   b.use :input, class: 'form-check-input', error_class: 'is-invalid', valid_class: 'is-valid'
  #   b.use :full_error, wrap_with: { tag: 'div', class: 'invalid-feedback d-block' }
  #   b.use :hint, wrap_with: { tag: 'small', class: 'form-text text-muted' }
  # end

  ## vertical input for inline radio buttons and check boxes
  config.wrappers :vertical_collection_inline, item_wrapper_class: 'form-check form-check-inline',
                                               tag: 'fieldset', class: 'form-group', error_class: 'form-group-invalid', valid_class: 'form-group-valid' do |b|
    b.use :html5
    b.optional :readonly
    b.use :input, class: 'form-check-input tgl tgl-light', error_class: 'is-invalid',
                  valid_class: 'is-valid'
    b.use :full_error, wrap_with: { tag: 'div', class: 'invalid-feedback d-block' }
    b.use :hint, wrap_with: { tag: 'small', class: 'form-text text-muted' }
  end

  ## vertical input for inline radio buttons and check boxes
  config.wrappers :switch_check_box, tag: :div, error_class: 'form-group-invalid',
                                     valid_class: 'form-group-valid' do |b|
    b.use :html5
    b.optional :readonly
    b.use :input, class: 'switch switch-light', error_class: 'is-invalid', valid_class: 'is-valid'
    b.use :label, class: 'switch-btn'
    b.use :full_error, wrap_with: { tag: 'div', class: 'invalid-feedback d-block' }
    b.use :hint, wrap_with: { tag: 'small', class: 'form-text text-muted' }
  end

  ## bulma vertical file input
  config.wrappers :vertical_file, tag: 'div', class: 'file has-name is-fullwidth' do |b|
    b.use :html5
    b.optional :readonly
    b.wrapper tag: 'label', class: 'file-label' do |label|
      label.use :input, class: 'file-input'

      label.wrapper tag: 'span', class: 'file-cta' do |file_cta|
        file_cta.wrapper tag: 'span', class: 'file-icon' do |icon|
          icon.wrapper tag: 'i', class: 'fas fa-upload' do
          end
        end
      end

      label.wrapper tag: 'span', class: 'file-name' do |file_name|
        file_name.use :label_text
      end
    end
  end

  config.wrappers :embedded_file do |b|
    b.use :html5
    b.use :placeholder
    b.use :input
  end

  ## bulma vertical multi select
  config.wrappers :vertical_multi_select, tag: 'div', class: 'field' do |b|
    b.use :html5
    b.optional :readonly
    b.use :label, class: 'label'
    b.wrapper tag: 'div', class: 'control' do |ba|
      ba.use :input, class: 'input', error_class: 'is-danger', valid_class: 'is-success'
    end
    b.use :full_error, wrap_with: { tag: 'div', class: 'is-danger' }
    b.use :hint, wrap_with: { tag: 'small', class: 'help' }
  end

  ## vertical range input
  # config.wrappers :vertical_range, tag: 'div', class: 'form-group', error_class: 'form-group-invalid', valid_class: 'form-group-valid' do |b|
  # b.use :html5
  # b.use :placeholder
  # b.optional :readonly
  # b.optional :step
  # b.use :label
  # b.use :input, class: 'form-control-range', error_class: 'is-invalid', valid_class: 'is-valid'
  # b.use :full_error, wrap_with: { tag: 'div', class: 'invalid-feedback d-block' }
  # b.use :hint, wrap_with: { tag: 'small', class: 'form-text text-muted' }
  # end

  ## horizontal forms
  ##
  ## horizontal default_wrapper
  # config.wrappers :horizontal_form, tag: 'div', class: 'form-group row', error_class: 'form-group-invalid', valid_class: 'form-group-valid' do |b|
  # b.use :html5
  # b.use :placeholder
  # b.optional :maxlength
  # b.optional :minlength
  # b.optional :pattern
  # b.optional :min_max
  # b.optional :readonly
  # b.use :label, class: 'col-sm-3 col-form-label'
  # b.wrapper :grid_wrapper, tag: 'div', class: 'col-sm-9' do |ba|
  # ba.use :input, class: 'form-control', error_class: 'is-invalid', valid_class: 'is-valid'
  # ba.use :full_error, wrap_with: { tag: 'div', class: 'invalid-feedback' }
  # ba.use :hint, wrap_with: { tag: 'small', class: 'form-text text-muted' }
  # end
  # end

  ## horizontal input for boolean
  # config.wrappers :horizontal_boolean, tag: 'div', class: 'form-group row', error_class: 'form-group-invalid', valid_class: 'form-group-valid' do |b|
  # b.use :html5
  # b.optional :readonly
  # b.wrapper tag: 'label', class: 'col-sm-3' do |ba|
  # ba.use :label_text
  # end
  # b.wrapper :grid_wrapper, tag: 'div', class: 'col-sm-9' do |wr|
  # wr.wrapper :form_check_wrapper, tag: 'div', class: 'form-check' do |bb|
  # bb.use :input, class: 'form-check-input', error_class: 'is-invalid', valid_class: 'is-valid'
  # bb.use :label, class: 'form-check-label'
  # bb.use :full_error, wrap_with: { tag: 'div', class: 'invalid-feedback d-block' }
  # bb.use :hint, wrap_with: { tag: 'small', class: 'form-text text-muted' }
  # end
  # end
  # end

  ## horizontal input for radio buttons and check boxes
  # config.wrappers :horizontal_collection, item_wrapper_class: 'form-check', tag: 'div', class: 'form-group row', error_class: 'form-group-invalid', valid_class: 'form-group-valid' do |b|
  # b.use :html5
  # b.optional :readonly
  # b.use :label, class: 'col-sm-3 form-control-label'
  # b.wrapper :grid_wrapper, tag: 'div', class: 'col-sm-9' do |ba|
  # ba.use :input, class: 'form-check-input', error_class: 'is-invalid', valid_class: 'is-valid'
  # ba.use :full_error, wrap_with: { tag: 'div', class: 'invalid-feedback d-block' }
  # ba.use :hint, wrap_with: { tag: 'small', class: 'form-text text-muted' }
  # end
  # end

  ## horizontal input for inline radio buttons and check boxes
  # config.wrappers :horizontal_collection_inline, item_wrapper_class: 'form-check form-check-inline', tag: 'div', class: 'form-group row', error_class: 'form-group-invalid', valid_class: 'form-group-valid' do |b|
  # b.use :html5
  # b.optional :readonly
  # b.use :label, class: 'col-sm-3 form-control-label'
  # b.wrapper :grid_wrapper, tag: 'div', class: 'col-sm-9' do |ba|
  # ba.use :input, class: 'form-check-input', error_class: 'is-invalid', valid_class: 'is-valid'
  # ba.use :full_error, wrap_with: { tag: 'div', class: 'invalid-feedback d-block' }
  # ba.use :hint, wrap_with: { tag: 'small', class: 'form-text text-muted' }
  # end
  # end

  ## horizontal file input
  # config.wrappers :horizontal_file, tag: 'div', class: 'form-group row', error_class: 'form-group-invalid', valid_class: 'form-group-valid' do |b|
  # b.use :html5
  # b.use :placeholder
  # b.optional :maxlength
  # b.optional :minlength
  # b.optional :readonly
  # b.use :label, class: 'col-sm-3 form-control-label'
  # b.wrapper :grid_wrapper, tag: 'div', class: 'col-sm-9' do |ba|
  # ba.use :input, error_class: 'is-invalid', valid_class: 'is-valid'
  # ba.use :full_error, wrap_with: { tag: 'div', class: 'invalid-feedback d-block' }
  # ba.use :hint, wrap_with: { tag: 'small', class: 'form-text text-muted' }
  # end
  # end

  ## horizontal multi select
  # config.wrappers :horizontal_multi_select, tag: 'div', class: 'form-group row', error_class: 'form-group-invalid', valid_class: 'form-group-valid' do |b|
  # b.use :html5
  # b.optional :readonly
  # b.use :label, class: 'col-sm-3 control-label'
  # b.wrapper :grid_wrapper, tag: 'div', class: 'col-sm-9' do |ba|
  # ba.wrapper tag: 'div', class: 'd-flex flex-row justify-content-between align-items-center' do |bb|
  # bb.use :input, class: 'form-control mx-1', error_class: 'is-invalid', valid_class: 'is-valid'
  # end
  # ba.use :full_error, wrap_with: { tag: 'div', class: 'invalid-feedback d-block' }
  # ba.use :hint, wrap_with: { tag: 'small', class: 'form-text text-muted' }
  # end
  # end

  ## horizontal range input
  # config.wrappers :horizontal_range, tag: 'div', class: 'form-group row', error_class: 'form-group-invalid', valid_class: 'form-group-valid' do |b|
  # b.use :html5
  # b.use :placeholder
  # b.optional :readonly
  # b.optional :step
  # b.use :label, class: 'col-sm-3 form-control-label'
  # b.wrapper :grid_wrapper, tag: 'div', class: 'col-sm-9' do |ba|
  # ba.use :input, class: 'form-control-range', error_class: 'is-invalid', valid_class: 'is-valid'
  # ba.use :full_error, wrap_with: { tag: 'div', class: 'invalid-feedback d-block' }
  # ba.use :hint, wrap_with: { tag: 'small', class: 'form-text text-muted' }
  # end
  # end

  ## inline forms
  ##
  ## inline default_wrapper
  # config.wrappers :inline_form, tag: 'span', error_class: 'form-group-invalid', valid_class: 'form-group-valid' do |b|
  # b.use :html5
  # b.use :placeholder
  # b.optional :maxlength
  # b.optional :minlength
  # b.optional :pattern
  # b.optional :min_max
  # b.optional :readonly
  # b.use :label, class: 'sr-only'

  # b.use :input, class: 'form-control', error_class: 'is-invalid', valid_class: 'is-valid'
  # b.use :error, wrap_with: { tag: 'div', class: 'invalid-feedback' }
  # b.optional :hint, wrap_with: { tag: 'small', class: 'form-text text-muted' }
  # end

  ## inline input for boolean
  # config.wrappers :inline_boolean, tag: 'span', class: 'form-check flex-wrap justify-content-start mr-sm-2', error_class: 'form-group-invalid', valid_class: 'form-group-valid' do |b|
  # b.use :html5
  # b.optional :readonly
  # b.use :input, class: 'form-check-input', error_class: 'is-invalid', valid_class: 'is-valid'
  # b.use :label, class: 'form-check-label'
  # b.use :error, wrap_with: { tag: 'div', class: 'invalid-feedback' }
  # b.optional :hint, wrap_with: { tag: 'small', class: 'form-text text-muted' }
  # end

  ## bootstrap custom forms
  ##
  ## custom input for boolean
  # config.wrappers :custom_boolean, tag: 'fieldset', class: 'form-group', error_class: 'form-group-invalid', valid_class: 'form-group-valid' do |b|
  # b.use :html5
  # b.optional :readonly
  # b.wrapper :form_check_wrapper, tag: 'div', class: 'custom-control custom-checkbox' do |bb|
  # bb.use :input, class: 'custom-control-input', error_class: 'is-invalid', valid_class: 'is-valid'
  # bb.use :label, class: 'custom-control-label'
  # bb.use :full_error, wrap_with: { tag: 'div', class: 'invalid-feedback' }
  # bb.use :hint, wrap_with: { tag: 'small', class: 'form-text text-muted' }
  # end
  # end

  ## custom input for boolean
  # config.wrappers :custom_boolean_switch, tag: 'fieldset', class: 'form-group', error_class: 'form-group-invalid', valid_class: 'form-group-valid' do |b|
  # b.use :html5
  # b.optional :readonly
  # b.wrapper :form_check_wrapper, tag: 'div', class: 'custom-control custom-checkbox-switch' do |bb|
  # bb.use :input, class: 'custom-control-input', error_class: 'is-invalid', valid_class: 'is-valid'
  # bb.use :label, class: 'custom-control-label'
  # bb.use :full_error, wrap_with: { tag: 'div', class: 'invalid-feedback' }
  # bb.use :hint, wrap_with: { tag: 'small', class: 'form-text text-muted' }
  # end
  # end

  ## custom input for radio buttons and check boxes
  # config.wrappers :custom_collection, item_wrapper_class: 'custom-control', tag: 'fieldset', class: 'form-group', error_class: 'form-group-invalid', valid_class: 'form-group-valid' do |b|
  # b.use :html5
  # b.optional :readonly
  # b.wrapper :legend_tag, tag: 'legend', class: 'col-form-label pt-0' do |ba|
  # ba.use :label_text
  # end
  # b.use :input, class: 'custom-control-input', error_class: 'is-invalid', valid_class: 'is-valid'
  # b.use :full_error, wrap_with: { tag: 'div', class: 'invalid-feedback d-block' }
  # b.use :hint, wrap_with: { tag: 'small', class: 'form-text text-muted' }
  # end

  ## custom input for inline radio buttons and check boxes
  # config.wrappers :custom_collection_inline, item_wrapper_class: 'custom-control custom-control-inline', tag: 'fieldset', class: 'form-group', error_class: 'form-group-invalid', valid_class: 'form-group-valid' do |b|
  # b.use :html5
  # b.optional :readonly
  # b.wrapper :legend_tag, tag: 'legend', class: 'col-form-label pt-0' do |ba|
  # ba.use :label_text
  # end
  # b.use :input, class: 'custom-control-input', error_class: 'is-invalid', valid_class: 'is-valid'
  # b.use :full_error, wrap_with: { tag: 'div', class: 'invalid-feedback d-block' }
  # b.use :hint, wrap_with: { tag: 'small', class: 'form-text text-muted' }
  # end

  ## custom file input
  # config.wrappers :custom_file, tag: 'div', class: 'form-group', error_class: 'form-group-invalid', valid_class: 'form-group-valid' do |b|
  # b.use :html5
  # b.use :placeholder
  # b.optional :maxlength
  # b.optional :minlength
  # b.optional :readonly
  # b.use :label, class: 'form-control-label'
  # b.wrapper :custom_file_wrapper, tag: 'div', class: 'custom-file' do |ba|
  # ba.use :input, class: 'custom-file-input', error_class: 'is-invalid', valid_class: 'is-valid'
  # ba.use :label, class: 'custom-file-label'
  # ba.use :full_error, wrap_with: { tag: 'div', class: 'invalid-feedback' }
  # end
  # b.use :hint, wrap_with: { tag: 'small', class: 'form-text text-muted' }
  # end

  ## custom multi select
  # config.wrappers :custom_multi_select, tag: 'div', class: 'form-group', error_class: 'form-group-invalid', valid_class: 'form-group-valid' do |b|
  # b.use :html5
  # b.optional :readonly
  # b.use :label, class: 'form-control-label'
  # b.wrapper tag: 'div', class: 'd-flex flex-row justify-content-between align-items-center' do |ba|
  # ba.use :input, class: 'custom-select mx-1', error_class: 'is-invalid', valid_class: 'is-valid'
  # end
  # b.use :full_error, wrap_with: { tag: 'div', class: 'invalid-feedback d-block' }
  # b.use :hint, wrap_with: { tag: 'small', class: 'form-text text-muted' }
  # end

  ## custom range input
  # config.wrappers :custom_range, tag: 'div', class: 'form-group', error_class: 'form-group-invalid', valid_class: 'form-group-valid' do |b|
  # b.use :html5
  # b.use :placeholder
  # b.optional :readonly
  # b.optional :step
  # b.use :label, class: 'form-control-label'
  # b.use :input, class: 'custom-range', error_class: 'is-invalid', valid_class: 'is-valid'
  # b.use :full_error, wrap_with: { tag: 'div', class: 'invalid-feedback d-block' }
  # b.use :hint, wrap_with: { tag: 'small', class: 'form-text text-muted' }
  # end

  # Input Group - custom component
  # see example app and config at https://github.com/rafaelfranca/simple_form-bootstrap
  # config.wrappers :input_group, tag: 'div', class: 'form-group', error_class: 'form-group-invalid', valid_class: 'form-group-valid' do |b|
  #   b.use :html5
  #   b.use :placeholder
  #   b.optional :maxlength
  #   b.optional :minlength
  #   b.optional :pattern
  #   b.optional :min_max
  #   b.optional :readonly
  #   b.use :label, class: 'form-control-label'
  #   b.wrapper :input_group_tag, tag: 'div', class: 'input-group' do |ba|
  #     ba.optional :prepend
  #     ba.use :input, class: 'form-control', error_class: 'is-invalid', valid_class: 'is-valid'
  #     ba.optional :append
  #   end
  #   b.use :full_error, wrap_with: { tag: 'div', class: 'invalid-feedback d-block' }
  #   b.use :hint, wrap_with: { tag: 'small', class: 'form-text text-muted' }
  # end

  ## Floating Labels form
  ##
  ## floating labels default_wrapper
  # config.wrappers :floating_labels_form, tag: 'div', class: 'form-label-group', error_class: 'form-group-invalid', valid_class: 'form-group-valid' do |b|
  # b.use :html5
  # b.use :placeholder
  # b.optional :maxlength
  # b.optional :minlength
  # b.optional :pattern
  # b.optional :min_max
  # b.optional :readonly
  # b.use :input, class: 'form-control', error_class: 'is-invalid', valid_class: 'is-valid'
  # b.use :label, class: 'form-control-label'
  # b.use :full_error, wrap_with: { tag: 'div', class: 'invalid-feedback' }
  # b.use :hint, wrap_with: { tag: 'small', class: 'form-text text-muted' }
  # end

  ## custom multi select
  # config.wrappers :floating_labels_select, tag: 'div', class: 'form-label-group', error_class: 'form-group-invalid', valid_class: 'form-group-valid' do |b|
  # b.use :html5
  # b.optional :readonly
  # b.use :input, class: 'custom-select custom-select-lg', error_class: 'is-invalid', valid_class: 'is-valid'
  # b.use :label, class: 'form-control-label'
  # b.use :full_error, wrap_with: { tag: 'div', class: 'invalid-feedback' }
  # b.use :hint, wrap_with: { tag: 'small', class: 'form-text text-muted' }
  # end

  config.browser_validations = false

  # The default wrapper to be used by the FormBuilder.
  config.default_wrapper = :vertical_form

  # Custom wrappers for input types. This should be a hash containing an input
  # type as key and the wrapper that will be used for all inputs with specified type.
  config.wrapper_mappings = {
    boolean: :switch_check_box,
    check_boxes: :vertical_collection_inline,
    date: :vertical_multi_select,
    datetime: :vertical_multi_select,
    file: :vertical_file,
    radio_buttons: :vertical_collection_inline,
    range: :vertical_range,
    time: :vertical_multi_select,
    select: :select_form
  }

  # enable custom form wrappers
  # config.wrapper_mappings = {
  #   boolean:       :custom_boolean,
  #   check_boxes:   :custom_collection,
  #   date:          :custom_multi_select,
  #   datetime:      :custom_multi_select,
  #   file:          :custom_file,
  #   radio_buttons: :custom_collection,
  #   range:         :custom_range,
  #   time:          :custom_multi_select
  # }
end
