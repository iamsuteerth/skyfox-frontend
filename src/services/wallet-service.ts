import { API_ROUTES } from '@/constants';
import { handleApiError } from '@/utils/error-utils';

export type WalletBalanceResponse = {
  status: string;
  message: string;
  request_id: string;
  data: {
    username: string;
    balance: number;
    updated_at: string;
  };
  code?: string;
};

export type WalletTransactionsResponse = {
  status: string;
  message: string;
  request_id: string;
  data: {
    transactions: WalletTransaction[] | null;
  };
  code?: string;
};

export type WalletTransaction = {
  id: number;
  amount: string;
  transaction_type: 'ADD' | 'DEDUCT';
  booking_id?: number;
  transaction_id: string;
  timestamp: string;
};

export type AddFundsRequest = {
  amount: number;
  card_number: string;
  cvv: string;
  expiry_month: string;
  expiry_year: string;
  cardholder_name: string;
};

export const getWalletBalance = async (showToast?: Function): Promise<WalletBalanceResponse | null> => {
  try {
    const response = await fetch(API_ROUTES.GET_WALLET, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch wallet balance');
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error fetching wallet balance:', error);
    if (showToast) {
      showToast({
        type: 'error',
        title: 'Wallet Error',
        description: error.message || 'Unable to get wallet balance',
      });
    }
    throw handleApiError(error);
  }
};

export const addFundsToWallet = async (
  fundData: AddFundsRequest,
  showToast?: Function
): Promise<WalletBalanceResponse | null> => {
  try {
    const response = await fetch(API_ROUTES.ADD_FUNDS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fundData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to add funds to wallet');
    }

    if (showToast) {
      showToast({
        type: 'success',
        title: 'Success',
        description: 'Funds added to wallet successfully',
      });
    }
    
    return data;
  } catch (error: any) {
    console.error('Error adding funds to wallet:', error);
    if (showToast) {
      showToast({
        type: 'error',
        title: 'Payment Failed',
        description: error.message || 'Failed to add funds to wallet',
      });
    }
    throw handleApiError(error);
  }
};
export const getWalletTransactions = async (showToast?: Function): Promise<WalletTransactionsResponse | null> => {
  try {
    const response = await fetch(API_ROUTES.WALLET_TRANSACTIONS, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch wallet transactions');
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error fetching wallet transactions:', error);
    if (showToast) {
      showToast({
        type: 'error',
        title: 'Transactions Error',
        description: error.message || 'Unable to get wallet transactions',
      });
    }
    throw handleApiError(error);
  }
};
