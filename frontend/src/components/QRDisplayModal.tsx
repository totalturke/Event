import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { QRCodeSVG } from 'qrcode.react';

interface QRDisplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrData: string;
  conferenceName: string;
}

export default function QRDisplayModal({
  isOpen,
  onClose,
  qrData,
  conferenceName,
}: QRDisplayModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Your Conference QR Code</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} pb={6}>
            <Text fontWeight="bold">{conferenceName}</Text>
            <QRCodeSVG
              value={qrData}
              size={256}
              level="H"
              includeMargin
              imageSettings={{
                src: "/windsurf-logo.png",
                x: undefined,
                y: undefined,
                height: 24,
                width: 24,
                excavate: true,
              }}
            />
            <Text fontSize="sm" color="gray.600">
              Present this QR code at the conference entrance
            </Text>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
