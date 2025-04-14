import React from 'react';
import { FormControl, FormLabel, FormErrorMessage, Select } from '@chakra-ui/react';
import { Movie } from './types';

interface MovieSelectorProps {
  movies: Movie[];
  selectedMovie: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  isLoading: boolean;
}

export const MovieSelector: React.FC<MovieSelectorProps> = ({
  movies,
  selectedMovie,
  onChange,
  error,
  isLoading
}) => {
  return (
    <FormControl isRequired isInvalid={!!error}>
      <FormLabel color="text.primary">Select Movie</FormLabel>
      <Select
        placeholder="Choose a movie"
        value={selectedMovie}
        onChange={onChange}
        isDisabled={isLoading}
        borderColor="surface.light"
        _hover={{ borderColor: "surface.dark" }}
        _focus={{
          borderColor: "primary",
          boxShadow: "0 0 0 1px var(--chakra-colors-primary)"
        }}
        color="text.primary"
      >
        {movies.map(movie => (
          <option key={movie.movieId} value={movie.movieId}>{movie.name}</option>
        ))}
      </Select>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};
