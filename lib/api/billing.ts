"use client";

import { createClient } from "@/lib/supabase/client";
import type { PaymentQuery, TransactionQuery } from "@/lib/types/billing";
import { useAuth } from "@/providers/auth-providers";
import { date } from "zod";

export const topUpBalance = async (amount: number) => {
  const supabase = createClient();
  try {
    if (amount < 5000 || amount > 1000000000) {
      return {
        success: false,
        error: "Invalid amount cannot under 5.000 or exceed 1.000.000.000",
      };
    }

    const { data, error } = await supabase.functions.invoke("topup_balance", {
      body: { amount },
    });

    if (error) {
      throw new Error(error.message || "Unknown error");
    }

    return { success: true, data, message: "Payment created successfully" };
  } catch (err: any) {
    console.log(err);
    return {
      success: false,
      error: err.message || err.error || "Unexpected error",
    };
  }
};

// get user balance
export const getUserBalance = async (userId: string) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("balance")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getUserTransactions = async ({
  userId,
  params,
}: {
  userId: string;
  params: TransactionQuery;
}) => {
  const supabase = createClient();
  const { page = 1, limit = 10, q = "", transactionType = "" } = params;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("transactions")
    .select("*", { count: "exact" })
    .eq("user_id", userId);

  if (q) {
    query = query.or(`description.ilike.%${q}%`);
  }

  if (transactionType && transactionType !== "ALL") {
    query = query.eq("transaction_type", transactionType);
  }

  query = query.range(from, to).order("created_at", { ascending: false });

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }
  return {
    data,
    total: count,
    page,
    totalPages: count ? Math.ceil(count / limit) : 0,
  };
};

export const getUserPayments = async ({
  userId,
  params,
}: {
  userId: string;
  params: PaymentQuery;
}) => {
  const startTime = Date.now(); // in ms

  const supabase = createClient();
  const { q = "", page = 1, limit = 10, paymentStatus } = params;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("payments")
    .select("*", { count: "exact" })
    .eq("user_id", userId);

  if (q) {
    query = query.or(`invoiceNo.ilike.%${q}%`);
  }

  if (paymentStatus && paymentStatus !== "ALL") {
    query = query.eq("paymentStatus", paymentStatus);
  }

  query = query.range(from, to).order("created_at", { ascending: false });

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const endTime = Date.now();
  const durationMs = endTime - startTime;

  console.log(`getUserPayments took ${durationMs} ms`);
  return {
    data,
    total: count,
    page,
    totalPages: count ? Math.ceil(count / limit) : 0,
  };
};
