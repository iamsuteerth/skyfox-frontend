import React from 'react';
import { Flex, Text, Button, Box, Icon } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useAuth } from '@/contexts/auth-context';
import { ROLES } from '@/constants';
import { RoleBasedElement } from '@/app/components/auth/role-based-element';
import { DatePicker } from '@/app/components/date-picker';

interface ShowsHeaderProps {
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
  onScheduleShow?: () => void;
}

const ShowsHeader: React.FC<ShowsHeaderProps> = ({
  selectedDate,
  onDateChange,
  onScheduleShow
}) => {
  const { user } = useAuth();

  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    })
    : 'Today';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 6);

  return (
    <Box borderBottomWidth="1px" borderBottomColor="surface.light" pb={2}>
      <Flex
        align="center"
        justify="space-between"
      >
        <Text
          fontSize="xl"
          fontWeight="semibold"
          color="text.primary"
        >
          {formattedDate}
        </Text>

        <Flex align="center">
          <DatePicker
            value={selectedDate}
            onChange={onDateChange}
            minDate={user?.role === 'customer' ? today : undefined}
            maxDate={user?.role === 'customer' ? maxDate : undefined}
            updateSearchParams={true}
            searchParamName="date"
            iconColor="brand.600"
          />
          <RoleBasedElement allowedRoles={[ROLES.ADMIN]}>
            <Button
              leftIcon={<Icon as={AddIcon} />}
              colorScheme="brand"
              size="sm"
              ml={3}
              onClick={onScheduleShow}
            >
              Schedule Show
            </Button>
          </RoleBasedElement>
        </Flex>
      </Flex>
    </Box>
  );
};

export default ShowsHeader;
