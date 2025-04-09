module ApplicationHelper
  def will_paginate(collection = nil, options = {})
    options = options.merge(renderer: WillPaginateBulma)

    super(collection, options)
  end

  def show_header?
    defined?(@hide_header) ? !@hide_header : true
  end

  def page_title
    if defined?(@page_title)
      @page_title
    else
      I18n.t("resources.controllers.#{controller_name}.title")
    end
  end

  def bool(value)
    if value
      '<i class="fas fa-check-circle"></i>'.html_safe
    else
      '<i class="fas fa-times-circle"></i>'.html_safe
    end
  end

  def active_class(record)
    return unless record.respond_to?(:active) && !record.active?

    'inactive'
  end

  def number_to_float(number, precision: 2)
    number_to_currency(number, separator: ',', unit: '', precision:, delimiter: '.')
  end

  def tenanted_id(id)
    [Current.tenant_id, id].join('_')
  end

  def configuration_menu_item(name, url)
    is_active = [request.url, request.path].filter { |item| item.include?(url) }.present?

    resource = Rails.application.routes.recognize_path(url)
    is_open = true # current_user.profile.can?(resource[:controller], resource[:action])

    tag.li do
      if is_open
        link_to name, url, class: is_active ? 'is-active' : ''
      else
        tag.a class: 'is-locked' do
          tag.span(name) +
            tag.i(class: 'fas fa-lock')
        end
      end
    end
  end

  def main_menu_item(name, url)
    resource = Rails.application.routes.recognize_path(url)
    is_open = true # current_user.profile.can?(resource[:controller], resource[:action])

    if is_open
      link_to name, url, class: 'navbar-item'
    else
      tag.a class: 'navbar-item is-locked' do
        tag.span(name) +
          tag.i(class: 'fas fa-lock')
      end
    end
  end

  def can?(action: nil)
    true
    # if !Rails.env.production? && !Profile.permission_exists?(controller_name, action || action_name)
    #   raise Profile::ResourceNotRestricted,
    #         'You have to create the permission at Profile model first!'
    # end

    # current_user.profile.can?(controller_name, action || action_name)
  end
end
