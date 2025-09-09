import type { BaseQuery } from "./global";

export interface Transaction {
  id: string;
  userId: string;
  description: string;
  amount: number;
  created_at: string;
}

export interface Payment {
  id: string;
  invoiceNo: string;
  userId: string;
  tax: string;
  amount: number;
  paymentUrl: string;
  paymentMethod: string;
  paymentStatus: string;
  created_at: string;
}

export type PaymentStatus = "PENDING" | "FAILED" | "SUCCESS" | string;

export type TransactionType = "TOPUP" | "GRANTED" | "USAGE";

export type PaymentMethod = "BANK_TRANSFER" | "CREDIT_CARD" | "DEBIT_CARD";

export interface TransactionQuery extends BaseQuery {
  transactionType?: string;
}

export interface PaymentQuery extends BaseQuery {
  paymentStatus?: PaymentStatus;
}
