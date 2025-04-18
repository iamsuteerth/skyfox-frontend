export type ProfileFormState = {
  name: string;
  email: string;
  phone_number: string;
  security_answer: string;
  errors: {
    name: string;
    email: string;
    phone_number: string;
    security_answer: string;
  };
  touched: {
    name: boolean;
    email: boolean;
    phone_number: boolean;
  };
};

export type ProfileFormAction =
  | { type: 'SET_FIELD'; payload: { field: string; value: string; error?: string } }
  | { type: 'SET_ERROR'; payload: { field: keyof ProfileFormState['errors']; message: string } }
  | { type: 'RESET_FORM'; payload: ProfileFormState }
  | { type: 'VALIDATE_ALL'; payload?: { name: string; email: string; phone: string } };

export function createInitialState(customerData: any): ProfileFormState {
  return {
    name: customerData?.name || '',
    email: customerData?.email || '',
    phone_number: customerData?.phone_number || '',
    security_answer: '',
    errors: {
      name: '',
      email: '',
      phone_number: '',
      security_answer: '',
    },
    touched: {
      name: false,
      email: false,
      phone_number: false,
    },
  };
}

export function profileFormReducer(state: ProfileFormState, action: ProfileFormAction): ProfileFormState {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.payload.field]: action.payload.value,
        errors: {
          ...state.errors,
          [action.payload.field]: action.payload.error || '',
        },
        touched: {
          ...state.touched,
          [action.payload.field]: true,
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
      return action.payload;
    default:
      return state;
  }
}
