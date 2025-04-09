module ConsoleHelpers
  def demo!
    t_switch!('demo')
  end

  def back!
    t_switch!('backoffice')
  end

  def t_switch!(tenant_name)
    Tenant.switch!(tenant_name)

    "Just switched to: #{Tenant.current.subdomain.upcase}"
  end
end
