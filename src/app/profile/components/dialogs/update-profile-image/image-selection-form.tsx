'use client';

import React from 'react';
import {
  VStack,
  Box,
  Text,
  Radio,
  RadioGroup,
  SimpleGrid,
  Grid,
  AspectRatio,
  Image,
  Center,
  FormLabel,
  FormControl,
  Button,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

const DEFAULT_AVATARS = [1, 2, 3, 4, 5, 6].map(id => ({
  id,
  src: `/default_avatars/default_${id}.jpg`
}));

interface ImageFormState {
  imageType: 'default' | 'custom';
  selectedImageId?: number;
  customImage?: File;
  imageChanged: boolean;
  previewUrl: string | null;
  errors: {
    imageType: string;
    selectedImageId: string;
  };
}

interface ImageSelectionFormProps {
  formState: ImageFormState;
  isProcessingImage: boolean;
  onImageTypeChange: (value: 'default' | 'custom') => void;
  onDefaultImageSelect: (imageId: number) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageSelectionForm: React.FC<ImageSelectionFormProps> = ({
  formState,
  isProcessingImage,
  onImageTypeChange,
  onDefaultImageSelect,
  onFileChange,
}) => {
  return (
    <VStack spacing={5} align="stretch">
      <FormControl isInvalid={!!formState.errors.imageType}>
        <FormLabel fontWeight="medium" color="text.primary">Choose Image Source</FormLabel>
        <RadioGroup
          onChange={(value) => onImageTypeChange(value as 'default' | 'custom')}
          value={formState.imageType}
        >
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <Radio value="default" colorScheme="brand" borderColor="primary" background="background.primary">
              <Text fontWeight="medium" color="text.primary">Use Default Avatar</Text>
            </Radio>
            <Radio value="custom" colorScheme="brand" borderColor="primary" background="background.primary">
              <Text fontWeight="medium" color="text.primary">Upload Your Photo</Text>
            </Radio>
          </SimpleGrid>
        </RadioGroup>
      </FormControl>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <ImagePreview
          previewUrl={formState.previewUrl}
          isProcessingImage={isProcessingImage}
          error={formState.errors.selectedImageId}
        />

        <Box>
          {formState.imageType === 'default' ? (
            <DefaultAvatarSelection
              selectedImageId={formState.selectedImageId}
              onSelect={onDefaultImageSelect}
            />
          ) : (
            <CustomImageUpload onFileChange={onFileChange} />
          )}
        </Box>
      </SimpleGrid>

      {!formState.imageChanged && (
        <Text color="blue.500" fontSize="sm" mt={2}>
          You need to select a new image to proceed.
        </Text>
      )}
    </VStack>
  );
};

const ImagePreview: React.FC<{
  previewUrl: string | null;
  isProcessingImage: boolean;
  error: string;
}> = ({ previewUrl, isProcessingImage, error }) => (
  <Box>
    <FormLabel fontWeight="medium" color="text.primary">Image Preview</FormLabel>
    <Center
      border="2px dashed"
      borderColor={error ? "error" : "gray.200"}
      borderRadius="xl"
      h="150px"
      w="150px"
      mx="auto"
      bg="background.secondary"
      overflow="hidden"
      flexDirection="column"
      textAlign="center"
      padding={3}
    >
      {isProcessingImage ? (
        <Text color="text.tertiary">Processing...</Text>
      ) : previewUrl ? (
        <Image
          src={previewUrl}
          alt="Profile preview"
          objectFit="cover"
          h="100%"
          w="100%"
        />
      ) : (
        <Text color="text.tertiary">
          No image selected
        </Text>
      )}
    </Center>
    {error && (
      <Text color="error" fontSize="sm" textAlign="center" mt={2}>
        {error}
      </Text>
    )}
  </Box>
);

const DefaultAvatarSelection: React.FC<{
  selectedImageId?: number;
  onSelect: (id: number) => void;
}> = ({ selectedImageId, onSelect }) => (
  <Box>
    <FormLabel fontWeight="medium" color="text.primary">Select Default Avatar</FormLabel>
    <Grid
      templateColumns="repeat(3, 1fr)"
      gap={3}
    >
      {DEFAULT_AVATARS.map((avatar) => (
        <AspectRatio ratio={1} key={avatar.id}>
          <Box
            as="button"
            type="button"
            onClick={() => onSelect(avatar.id)}
            border="2px solid"
            borderColor={selectedImageId === avatar.id ? "primary" : "transparent"}
            borderRadius="md"
            overflow="hidden"
            transition="all 0.2s"
            _hover={{
              transform: "scale(1.05)",
              boxShadow: "md"
            }}
          >
            <Image
              src={avatar.src}
              alt={`Default avatar ${avatar.id}`}
              objectFit="cover"
            />
          </Box>
        </AspectRatio>
      ))}
    </Grid>
  </Box>
);

const CustomImageUpload: React.FC<{
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ onFileChange }) => (
  <Box>
    <FormLabel fontWeight="medium" color="text.primary">Upload Custom Image</FormLabel>
    <input
      type="file"
      accept="image/*"
      onChange={onFileChange}
      style={{ display: 'none' }}
      id="image-upload"
    />
    <label htmlFor="image-upload">
      <Button
        as="span"
        leftIcon={<AddIcon />}
        size="lg"
        height="56px"
        width="100%"
        borderRadius="xl"
        bg="background.secondary"
        color="text.primary"
        _hover={{
          bg: "gray.200",
        }}
        cursor="pointer"
        display="flex"
      >
        Choose Image
      </Button>
    </label>
    <Text fontSize="sm" color="text.tertiary" mt={1}>
      Recommended: Square image, max 5MB
    </Text>
  </Box>
);

export default ImageSelectionForm;
