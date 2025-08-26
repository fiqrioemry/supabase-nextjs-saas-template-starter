import { getUser } from "@/lib/actions/user";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  changePassword as changePasswordAuth,
  createPassword as createPasswordAuth,
} from "@/lib/actions/auth";

export const useAuthQuery = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });
};

export const useChangePassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      newPassword,
      currentPassword,
    }: {
      newPassword: string;
      currentPassword: string;
    }) => changePasswordAuth(newPassword, currentPassword),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: any) => {
      console.error("Change password error:", error);
    },
  });
};

export const useCreatePassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newPassword: string) => createPasswordAuth(newPassword),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: any) => {
      console.error("Create password error:", error);
    },
  });
};

export const useUser = () => {
  const query = useAuthQuery();

  return {
    ...query,
    user: query.data?.user,
    isAuthenticated: !!query.data?.user,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
