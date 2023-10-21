import { format, formatDistanceToNow } from 'date-fns';
import moment from 'moment';

// ----------------------------------------------------------------------

export function fDate(date) {
  return format(new Date(date), 'dd MMMM yyyy');
}

export function fDateTime(date) {
  return format(new Date(date), 'dd MMM yyyy HH:mm');
}

export function fDateTimeSuffix(date) {
  return format(new Date(date), 'dd/MM/yyyy hh:mm p');
}

export function fToNow(date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });
}

export const formatCreate = (date) => {
  // console.log('pon console date', date);
  return moment(date).format('dd/MM/yyyy hh:mm');
};
