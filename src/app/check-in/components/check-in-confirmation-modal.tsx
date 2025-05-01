import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Text,
  Center
} from '@chakra-ui/react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  count: number;
  onConfirm: () => void;
}

export default function CheckInConfirmationModal({ isOpen, onClose, count, onConfirm }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
      <ModalOverlay />
      <ModalContent bg="background.primary" borderRadius="lg">
        <ModalHeader color="text.primary">Confirm Bulk Check-In</ModalHeader>
        <ModalCloseButton color="text.primary" />
        <ModalBody>
          <Center>
            <Text color="text.primary">
              Are you sure you want to check in <b>{count}</b> selected booking{count > 1 ? 's' : ''}?
            </Text>
          </Center>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose} mx={2}>Cancel</Button>
          <Button colorScheme="success" onClick={onConfirm} mx={2}>Confirm</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
