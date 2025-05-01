'use client';

import { useEffect, useState, useMemo } from 'react';

import {
  Container,
  Flex,
  Heading,
  Input,
  Button,
  useDisclosure,
  HStack,
  Spacer,
  useBreakpointValue,
  Box
} from '@chakra-ui/react';
import type { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid'

import { useCustomToast } from '@/app/components/ui/custom-toast';

import { getCheckInBookings, bulkCheckIn, CheckInBooking } from '@/services/check-in-service';

import ThemedDataGrid from '@/app/components/data-grid/themed-data-grid';
import CheckInConfirmationModal from './check-in-confirmation-modal';

export default function ManualCheckInTab() {
  const [bookings, setBookings] = useState<CheckInBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<GridRowSelectionModel>([]);
  const [pendingCheckIn, setPendingCheckIn] = useState<number[]>([]);
  const modal = useDisclosure();
  const { showToast } = useCustomToast();

  const maxW = useBreakpointValue({ base: "100vw", md: "100%" });

  useEffect(() => {
    setLoading(true);
    getCheckInBookings(showToast)
      .then((data: CheckInBooking[]) => setBookings(data))
      .finally(() => setLoading(false));
  }, [showToast]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return bookings;
    const terms = q.split(/\s+/).filter(Boolean);

    if (terms.length === 1 && /^\d{3,}$/.test(terms[0])) {
      return bookings.filter(b =>
        String(b.id ?? '').includes(terms[0]) ||
        String(b.show_id ?? '').includes(terms[0])
      );
    }

    return bookings.filter(b =>
      terms.every(term =>
        (b.customer_username ?? '').toLowerCase().includes(term) ||
        String(b.id ?? '').includes(term) ||
        String(b.show_id ?? '').includes(term) ||
        String(b.amount_paid ?? '').includes(term) ||
        String(b.no_of_seats ?? '').includes(term) ||
        ((b.payment_type ?? '').toLowerCase().includes(term))
      )
    );
  }, [bookings, search]);


  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Booking ID', width: 110, headerAlign: 'center', align: 'center', type: 'number' },
    { field: 'date', headerName: 'Date', flex: 1, headerAlign: 'center', align: 'center', valueFormatter: (value) => value ? new Date(String(value)).toLocaleDateString() : '-' },
    { field: 'customer_username', headerName: 'Customer', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'no_of_seats', headerName: 'Seats', width: 70, headerAlign: 'center', align: 'center', type: 'number' },
    { field: 'amount_paid', headerName: 'Amount', flex: 1, headerAlign: 'center', align: 'center', type: 'number' },
    { field: 'payment_type', headerName: 'Payment', width: 100, headerAlign: 'center', align: 'center' },
    { field: 'booking_time', headerName: 'Booked At', flex: 1, headerAlign: 'center', align: 'center', valueFormatter: (value) => value ? new Date(String(value)).toLocaleString() : '-' },
  ];

  const handleSelect = (model: GridRowSelectionModel) => setSelected(model);

  const handleCheckIn = () => {
    setPendingCheckIn(selected.map(id => Number(id)));
    modal.onOpen();
  };

  const confirmBulkCheckIn = async () => {
    const res = await bulkCheckIn(pendingCheckIn, showToast);
    if (res) {
      showToast({
        type: 'success',
        title: 'Check-in Complete',
        description: `Checked in: ${res.checked_in.length}, Already done: ${res.already_done.length}, Invalid: ${res.invalid.length}`,
      });
      setLoading(true);
      setSelected([]);
      setPendingCheckIn([]);
      getCheckInBookings(showToast)
        .then((data: CheckInBooking[]) => setBookings(data))
        .finally(() => setLoading(false));
    }
    modal.onClose();
  };

  return (
    <Container maxW={maxW} py={0} px={0}>
      <Flex direction="column" gap={4} w="100%">
        <Heading as="h2" size="md" color="text.primary" fontWeight={600}>
          Manual Check-In
        </Heading>
        <HStack spacing={3} mb={2}>
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by booking ID or username"
            size="md"
            maxW="340px"
            variant="outline"
            bg="background.primary"
            borderColor="surface.light"
            fontSize="sm"
            color="text.primary"
            _placeholder={{ color: "text.tertiary" }}
            focusBorderColor="primary"
          />

          <Spacer />
          <Button
            variant="solid"
            colorScheme="primary"
            isDisabled={selected.length === 0}
            onClick={handleCheckIn}
            size="md"
            _hover={{
              bg: "primary",
              color: "white",
              opacity: 0.92,
            }}
            _active={{
              bg: "primary",
              color: "white",
              opacity: 0.85,
            }}
            _focus={{
              boxShadow: "0 0 0 2px var(--chakra-colors-primary)"
            }}
          >
            Check In
          </Button>
        </HStack>
        <Box w="100%" overflowX="auto" height="480px">
          <ThemedDataGrid
            rows={filtered}
            columns={columns}
            loading={loading}
            checkboxSelection
            onRowSelectionModelChange={handleSelect}
            rowSelectionModel={selected}
            pageSizeOptions={[10, 25, 50]}
            getRowId={row => row.id}
            hideFooterSelectedRowCount={false}
            sx={{
              minHeight: 460,
              border: 0,
              background: "background.primary",
              '& .MuiDataGrid-columnHeaders': {
                background: "background.primary",
                color: "text.primary",
              },
              '& .MuiDataGrid-footerContainer': {
                background: "background.primary",
              },
              '& .MuiDataGrid-cell': {
                background: "background.primary",
              },
              '& .MuiDataGrid-row:hover': {
                background: "brand.50",
              },
            }}
          />
        </Box>
      </Flex>
      <CheckInConfirmationModal
        isOpen={modal.isOpen}
        onClose={modal.onClose}
        count={pendingCheckIn.length}
        onConfirm={confirmBulkCheckIn}
      />
    </Container>
  );
}
