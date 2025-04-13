'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  SimpleGrid,
  Heading,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Box,
  Button,
  Grid,
  Image,
  AspectRatio,
  Center,
  Spinner,
  Input,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

const DEFAULT_AVATARS = [1, 2, 3, 4, 5, 6].map(id => ({
  id,
  src: `/default_avatars/default_${id}.jpg`
}));

interface ProfileImageSectionProps {
  formData: {
    imageType: 'default' | 'custom';
    selectedImageId?: number;
    customImage?: File;
    errors: {
      [key: string]: string;
    };
  };
  handleImageTypeChange: (value: 'default' | 'custom') => void;
  handleDefaultImageSelect: (imageId: number) => void;
  handleCustomImageUpload: (file: File) => void;
  isProcessingImage: boolean;
}

const ProfileImageSection: React.FC<ProfileImageSectionProps> = ({
  formData,
  handleImageTypeChange,
  handleDefaultImageSelect,
  handleCustomImageUpload,
  isProcessingImage
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    formData.selectedImageId
      ? `/default_avatars/default_${formData.selectedImageId}.jpg`
      : null
  );

  useEffect(() => {
    if (formData.selectedImageId) {
      setPreviewUrl(`/default_avatars/default_${formData.selectedImageId}.jpg`);
    } else if (formData.customImage) {
      setPreviewUrl(URL.createObjectURL(formData.customImage));
    }else {
      setPreviewUrl(null);
    }
  }, [formData.selectedImageId, formData.customImage]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleCustomImageUpload(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <Heading as="h2" size="md" mt={4} color="text.primary">Profile Image</Heading>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <VStack spacing={4} align="stretch">
          <FormControl isInvalid={!!formData.errors.imageType}>
            <FormLabel fontWeight="medium" color="text.primary">Choose Image Source</FormLabel>
            <RadioGroup
              onChange={(value) => handleImageTypeChange(value as 'default' | 'custom')}
              value={formData.imageType}
            >
              <HStack spacing={6}>
                <Radio value="default" colorScheme="brand" borderColor="primary" background="background.primary">
                  <Text fontWeight="medium" color="text.primary">Use Default Avatar</Text>
                </Radio>
                <Radio value="custom" colorScheme="brand" borderColor="primary" background="background.primary">
                  <Text fontWeight="medium" color="text.primary">Upload Your Photo</Text>
                </Radio>
              </HStack>
            </RadioGroup>
            {formData.errors.imageType && (
              <FormErrorMessage color="error">{formData.errors.imageType}</FormErrorMessage>
            )}
          </FormControl>

          <Box>
            <FormLabel fontWeight="medium" color="text.primary">Preview</FormLabel>
            <Center
              border="2px dashed"
              borderColor={formData.errors.selectedImageId ? "error" : "gray.200"}
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
                <Spinner color="primary" size="md" />
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
            {formData.errors.selectedImageId && (
              <FormErrorMessage color="error" textAlign="center" mt={1}>
                {formData.errors.selectedImageId}
              </FormErrorMessage>
            )}
          </Box>
        </VStack>

        <Box>
          {formData.imageType === 'default' ? (
            <Box>
              <FormLabel fontWeight="medium" color="text.primary">Select Default Avatar</FormLabel>
              <Grid
                templateColumns="repeat(3, 1fr)"
                gap={3}
                mt={2}
              >
                {DEFAULT_AVATARS.map((avatar) => (
                  <AspectRatio ratio={1} key={avatar.id}>
                    <Box
                      as="button"
                      type="button"
                      onClick={() => handleDefaultImageSelect(avatar.id)}
                      border="2px solid"
                      borderColor={formData.selectedImageId === avatar.id ? "primary" : "transparent"}
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
          ) : (
            <Box>
              <FormLabel fontWeight="medium" color="text.primary">Upload Custom Image</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                display="none"
              />
              <Button
                leftIcon={<AddIcon />}
                onClick={handleUploadClick}
                size="lg"
                height="56px"
                width="100%"
                borderRadius="xl"
                bg="background.secondary"
                color="text.primary"
                _hover={{
                  bg: "gray.200",
                }}
                mt={2}
                isLoading={isProcessingImage}
                loadingText="Processing"
                spinnerPlacement="start"
              >
                Choose Image
              </Button>
              <Text fontSize="sm" color="text.tertiary" mt={1}>
                Recommended: Square image, max 5MB
              </Text>
            </Box>
          )}
        </Box>
      </SimpleGrid>
    </>
  );
};

export default ProfileImageSection;
