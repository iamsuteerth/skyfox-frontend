export type ImageFormState = {
    imageType: 'default' | 'custom';
    selectedImageId?: number;
    customImage?: File;
    imageChanged: boolean;
    previewUrl: string | null;
    errors: {
      imageType: string;
      selectedImageId: string;
    };
  };
  
  export type ImageFormAction =
    | { type: 'SET_IMAGE_TYPE'; payload: 'default' | 'custom' }
    | { type: 'SELECT_DEFAULT_IMAGE'; payload: number }
    | { type: 'SET_CUSTOM_IMAGE'; payload: { file: File, previewUrl: string } }
    | { type: 'SET_ERROR'; payload: { field: keyof ImageFormState['errors']; message: string } }
    | { type: 'RESET_FORM' };
  
  export const initialImageFormState: ImageFormState = {
    imageType: 'default',
    selectedImageId: undefined,
    customImage: undefined,
    imageChanged: false,
    previewUrl: null,
    errors: {
      imageType: '',
      selectedImageId: '',
    },
  };
  
  export function imageFormReducer(state: ImageFormState, action: ImageFormAction): ImageFormState {
    switch (action.type) {
      case 'SET_IMAGE_TYPE':
        return {
          ...state,
          imageType: action.payload,
          errors: {
            ...state.errors,
            imageType: '',
          },
        };
      case 'SELECT_DEFAULT_IMAGE':
        return {
          ...state,
          selectedImageId: action.payload,
          customImage: undefined,
          imageChanged: true,
          previewUrl: `/default_avatars/default_${action.payload}.jpg`,
          errors: {
            ...state.errors,
            selectedImageId: '',
          },
        };
      case 'SET_CUSTOM_IMAGE':
        return {
          ...state,
          customImage: action.payload.file,
          selectedImageId: undefined,
          imageChanged: true,
          previewUrl: action.payload.previewUrl,
          errors: {
            ...state.errors,
            selectedImageId: '',
          },
        };
      case 'SET_ERROR':
        return {
          ...state,
          errors: {
            ...state.errors,
            [action.payload.field]: action.payload.message,
          },
        };
      case 'RESET_FORM':
        return initialImageFormState;
      default:
        return state;
    }
  }
  