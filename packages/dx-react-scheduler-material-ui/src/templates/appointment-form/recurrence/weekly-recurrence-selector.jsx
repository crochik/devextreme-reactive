import React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import * as PropTypes from 'prop-types';
import classNames from 'clsx';
import {
  getRecurrenceOptions, WEEK_DAY_OPTIONS, handleWeekDaysChange, changeRecurrenceOptions,
  getDaysOfWeekArray, getDaysOfWeekDates,
} from '@devexpress/dx-scheduler-core';
import { ensureColor } from '../../utils';

const PREFIX = 'WeeklyRecurrenceSelector';

export const classes = {
  selectedButton: `${PREFIX}-selectedButton`,
  button: `${PREFIX}-button`,
  buttonGroup: `${PREFIX}-buttonGroup`,
};

const StyledButtonGroup = styled(ButtonGroup)(({
  theme: { palette, spacing },
}) => ({
  [`& .${classes.selectedButton}`]: {
    backgroundColor: ensureColor(400, palette.primary),
    '&:hover': {
      backgroundColor: ensureColor(500, palette.primary),
    },
    border: `1px solid ${ensureColor(400, palette.primary)}!important`,
    borderLeft: `1px solid ${ensureColor(50, palette.primary)}!important`,
    '&:first-child': {
      borderLeft: `1px solid ${ensureColor(400, palette.primary)}!important`,
    },
    color: ensureColor(50, palette.primary),
  },

  [`& .${classes.button}`]: {
    minWidth: spacing(3),
  },

  [`&.${classes.buttonGroup}`]: {
    marginBottom: spacing(2),
  },
}));

const isCurrentWeekDay = (
  { byweekday }, currentWeekDay,
) => byweekday && byweekday.findIndex(({ weekday }) => weekday === currentWeekDay) > -1;

const WeeklyRecurrenceSelectorBase = React.memo(({
  formatDate,
  rRule,
  readOnly,
  className,
  onValueChange,
  firstDayOfWeek,
  ...restProps
}) => {
  const recurrenceOptions = getRecurrenceOptions(rRule);
  const daysOfWeekArray = getDaysOfWeekArray(firstDayOfWeek);
  const daysOfWeekDates = getDaysOfWeekDates(firstDayOfWeek);

  return (
    <StyledButtonGroup
      variant="outlined"
      size="small"
      disabled={readOnly}
      className={classNames(classes.buttonGroup, className)}
      fullWidth
      {...restProps}
    >
      {
        daysOfWeekArray.map((dayOfWeek, index) => (
          <Button
            className={classNames({
              [classes.button]: true,
              [classes.selectedButton]: isCurrentWeekDay(recurrenceOptions, dayOfWeek),
            })}
            key={dayOfWeek}
            onClick={() => onValueChange({
              rRule: changeRecurrenceOptions(handleWeekDaysChange(
                recurrenceOptions,
                dayOfWeek,
                onValueChange,
              )),
            })}
          >
            {formatDate(daysOfWeekDates[index], WEEK_DAY_OPTIONS)}
          </Button>
        ))
      }
    </StyledButtonGroup>
  );
});

WeeklyRecurrenceSelectorBase.propTypes = {
  formatDate: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  rRule: PropTypes.string.isRequired,
  onValueChange: PropTypes.func,
  readOnly: PropTypes.bool,
  className: PropTypes.string,
  firstDayOfWeek: PropTypes.number.isRequired,
};

WeeklyRecurrenceSelectorBase.defaultProps = {
  onValueChange: () => undefined,
  readOnly: false,
  className: undefined,
};

export const WeeklyRecurrenceSelector = (WeeklyRecurrenceSelectorBase);
