module Scalars
  class DatePreset < GraphQL::Schema::Scalar
    description "Date range shortcut (i.e. this_month) or integer timestamp"

    # NOTE: if this is used as a list (types[DatePreset]), then it will return a nested array
    # which you will need to flatten before using, i.e. [[<Time>, <Time>]]
    # I couldn't find an easy way around this for now (TODO)

    # usable value
    def self.coerce_input(value, _ctx)
      return if value.blank?
      return ::Time.at(value.to_i) if value.is_a?(::Integer) || (value.is_a?(String) && value =~ /^\d*$/)

      now = 1.minute.ago # Using ::Time.now before did not inherit Time.zone setting from GraphqlController
      case value
      when 'yesterday'      then [1.day.ago.beginning_of_day, 1.day.ago.end_of_day]
      when 'this_week'      then [now.beginning_of_week, now.end_of_week]
      when 'last_week'      then [1.week.ago.beginning_of_week, 1.week.ago.end_of_week]
      when 'this_month'     then [now.beginning_of_month, now.end_of_month]
      when 'last_month'     then [1.month.ago.beginning_of_month, 1.month.ago.end_of_month]
      when 'this_quarter'   then [now.beginning_of_quarter, now.end_of_quarter]
      when 'last_quarter'   then [3.months.ago.beginning_of_quarter, 3.months.ago.end_of_quarter]
      when 'this_year'      then [now.beginning_of_year, now.end_of_year]
      when 'last_year'      then [1.year.ago.beginning_of_year, 1.year.ago.end_of_year]
      when 'last_7_days'    then [7.days.ago.beginning_of_day, now.end_of_day]
      when 'last_14_days'   then [14.days.ago.beginning_of_day, now.end_of_day]
      when 'last_30_days'   then [30.days.ago.beginning_of_day, now.end_of_day]
      when 'last_60_days'   then [60.days.ago.beginning_of_day, now.end_of_day]
      when 'last_90_days'   then [90.days.ago.beginning_of_day, now.end_of_day]
      when 'last_120_days'  then [120.days.ago.beginning_of_day, now.end_of_day]
      when 'last_12_months' then [12.months.ago.beginning_of_day, now.end_of_day]
      when 'ever'           then %i[any any] # Should be interpreted as "IS NOT NULL"
      when 'never'          then [nil, nil]
      end

      # Will raise GraphQL validation error if input was not nil
    end

    def self.coerce_result(value, _ctx)
      value.to_i
    end

    def self.options
      [
        { label: "Yesterday", value: "yesterday" },
        { label: "This Week", value: "this_week" },
        { label: "Last Week", value: "last_week" },
        { label: "This Month", value: "this_month" },
        { label: "Last Month", value: "last_month" },
        { label: "This Quarter", value: "this_quarter" },
        { label: "Last Quarter", value: "last_quarter" },
        { label: "This Year", value: "this_year" },
        { label: "Last Year", value: "last_year" },
        { label: "Last 7 Days", value: "last_7_days" },
        { label: "Last 14 Days", value: "last_14_days" },
        { label: "Last 30 Days", value: "last_30_days" },
        { label: "Last 60 Days", value: "last_60_days" },
        { label: "Last 90 Days", value: "last_90_days" },
        { label: "Last 120 Days", value: "last_120_days" },
        { label: "Last 12 Months", value: "last_12_months" },
        { label: "Ever", value: "ever" },
        { label: "Never", value: "never" }
      ]
    end
  end
end
