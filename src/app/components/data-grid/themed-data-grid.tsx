import { useTheme } from '@chakra-ui/react';
import { DataGrid, type DataGridProps } from '@mui/x-data-grid';
import ThemeAdapter from './theme-adapter';

const ThemedDataGrid = ({
  sx = {},
  ...rest
}: DataGridProps & { sx?: object }) => {
  const theme = useTheme();
  const colors = theme.colors;
  const fontFamily = theme.fonts?.body ?? 'Poppins, system-ui, sans-serif';

  const minimalGridSx = {
    border: 0,
    height: '100%',
    fontFamily,
    '& .MuiDataGrid-columnHeaders': {
      backgroundColor: colors.background?.primary,
      color: colors.text?.primary,
      fontWeight: 600,
      fontSize: '1rem',
      minHeight: 48,
    },
    '& .MuiDataGrid-cell': {
      backgroundColor: colors.background?.primary,
      color: colors.text?.secondary,
      fontSize: '0.97rem',
      border: 0,
    },
    '& .MuiDataGrid-row': {
      transition: 'background 0.18s',
    },
    '& .MuiDataGrid-row:hover': {
      backgroundColor: colors.brand?.[50],
    },
    '& .MuiDataGrid-footerContainer': {
      backgroundColor: colors.background?.primary,
      fontSize: '1rem',
      minHeight: 48,
    },
    '& .MuiDataGrid-checkboxInput:not(.Mui-disabled)': {
      color: colors.primary,
    },
    '& .MuiDataGrid-virtualScroller': {
      scrollbarWidth: 'thin',
      scrollbarColor: `${colors.surface?.light} ${colors.background?.primary}`,
      '&::-webkit-scrollbar': {
        height: 8,
        width: 8,
        background: colors.background?.primary,
        borderRadius: '8px',
      },
      '&::-webkit-scrollbar-thumb': {
        background: colors.surface?.light,
        borderRadius: '8px',
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: colors.primary,
      },
    },
    ...sx,
  };

  return (
    <ThemeAdapter>
      <DataGrid
        density="standard"
        sx={minimalGridSx}
        {...rest}
        pageSizeOptions={[5, 10, 15]}
        initialState={{
          pagination: { paginationModel: { pageSize: 5 } },
        }}
      />
    </ThemeAdapter>
  );
};

export default ThemedDataGrid;
