import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const QuickActions = ({ actions, onActionClick }) => {
  const defaultActions = [
    { icon: <EventIcon />, name: 'Create Event', key: 'create-event' },
    { icon: <PersonAddIcon />, name: 'Add Guest', key: 'add-guest' },
    { icon: <StorefrontIcon />, name: 'Find Vendor', key: 'find-vendor' },
    { icon: <AttachMoneyIcon />, name: 'Add Expense', key: 'add-expense' }
  ];

  const actionList = actions || defaultActions;

  return (
    <SpeedDial
      ariaLabel="Quick actions"
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        '& .MuiFab-primary': {
          width: 64,
          height: 64
        }
      }}
      icon={<SpeedDialIcon openIcon={<AddIcon />} />}
    >
      {actionList.map((action) => (
        <SpeedDialAction
          key={action.key}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={() => onActionClick && onActionClick(action.key)}
          sx={{
            '& .MuiSpeedDialAction-fab': {
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark'
              }
            }
          }}
        />
      ))}
    </SpeedDial>
  );
};

export default QuickActions;
