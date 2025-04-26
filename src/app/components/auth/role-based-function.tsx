'use client';

import { useAuth } from '@/contexts/auth-context';
import { ROLES } from '@/constants';

interface RoleBasedFunctionProps<T> {
  execute: (args?: T) => void;
  adminExecute?: (args?: T) => void;
  customerExecute?: (args?: T) => void;
  staffExecute?: (args?: T) => void;
  unauthorizedExecute?: (args?: T) => void;
  args?: T;
}

export const useRoleBasedFunction = () => {
  const { user } = useAuth();

  /**
   * Executes a function based on the user's role.
   * @param config Configuration object with role-specific functions
   */
  const executeByRole = <T,>({
    execute,
    adminExecute,
    customerExecute,
    staffExecute,
    unauthorizedExecute,
    args
  }: RoleBasedFunctionProps<T>) => {
    if (!user) {
      if (unauthorizedExecute) unauthorizedExecute(args);
      else execute(args);
      return;
    }

    switch (user.role) {
      case ROLES.ADMIN:
        if (adminExecute) adminExecute(args);
        else execute(args);
        break;
      case ROLES.CUSTOMER:
        if (customerExecute) customerExecute(args) 
        else execute(args);
        break;
      case ROLES.STAFF:
        if (staffExecute) staffExecute(args) 
        else execute(args);
        break;
      default:
        execute(args);
    }
  };

  /**
   * Simple version that just checks if a user has a specific role
   * @param callback Function to execute if role matches
   * @param allowedRoles Array of allowed roles
   * @param fallback Optional fallback function if role doesn't match
   * @param args Optional arguments to pass to the functions
   */
  const executeIfRole = <T,>(
    callback: (args?: T) => void,
    allowedRoles: string[],
    fallback?: (args?: T) => void,
    args?: T
  ) => {
    if (user && allowedRoles.includes(user.role)) {
      callback(args);
    } else if (fallback) {
      fallback(args);
    }
  };

  return {
    executeByRole,
    executeIfRole
  };
};

export default useRoleBasedFunction;
