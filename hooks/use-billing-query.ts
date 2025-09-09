import {
  getUserBalance,
  getUserPayments,
  getUserTransactions,
} from "@/lib/api/billing";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/providers/auth-providers";
import type { PaymentQuery, TransactionQuery } from "@/lib/types/billing";

// get user payments
export const usePayments = (params: PaymentQuery) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["user-payments", params],
    queryFn: () => getUserPayments({ params, userId: user?.id || "" }),
    enabled: !!user?.id,
    refetchOnMount: true,
  });
};

export const useTransactions = (params: TransactionQuery) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["user-transactions", params],
    queryFn: () => getUserTransactions({ params, userId: user?.id || "" }),
    enabled: !!user?.id,
    refetchOnMount: true,
  });
};

// get user balance
export const useBalanceQuery = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["user-balance", user?.id],
    queryFn: () =>
      user?.id ? getUserBalance(user.id) : Promise.resolve(undefined),
    enabled: !!user?.id,
    refetchOnMount: true,
  });
};
