# frozen_string_literal: true

class Ability
  include CanCan::Ability

  def initialize(user)
    return unless user.present?

    can :read, :all
    can :manage, :all if user.admin?

    cannot :update, Tenant if !user.admin? || user.tenant_id != Current.tenant_id
    cannot [:create, :read, :destroy], Tenant unless user.root?
  end
end
