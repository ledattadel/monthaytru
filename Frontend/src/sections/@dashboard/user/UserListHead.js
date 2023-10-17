import PropTypes from 'prop-types';
// material
import { Box, Checkbox, TableRow, TableCell, TableHead, TableSortLabel } from '@mui/material';

// ----------------------------------------------------------------------

const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
};

UserListHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']),
  orderBy: PropTypes.string,
  rowCount: PropTypes.number,
  headLabel: PropTypes.array,
  numSelected: PropTypes.number,
  onRequestSort: PropTypes.func,
  onSelectAllClick: PropTypes.func,
};

export default function UserListHead({ order, orderBy, headLabel }) {
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" />
        {headLabel.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.alignRight ? 'center' : 'center'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.label}
            {orderBy === headCell.id ? (
              <Box sx={{ ...visuallyHidden }}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</Box>
            ) : null}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
