"use client";

import { getCrudapp2Program, getCrudapp2ProgramId } from "@project/anchor";
import { useConnection } from "@solana/wallet-adapter-react";
import { Cluster, Keypair, PublicKey } from "@solana/web3.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import toast from "react-hot-toast";
import { useCluster } from "../cluster/cluster-data-access";
import { useAnchorProvider } from "../solana/solana-provider";
import { useTransactionToast } from "../ui/ui-layout";

interface CreateEntryArgs {
  title: string;
  message: string;
  owner: PublicKey;
}

export function useCrudapp2Program() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getCrudapp2ProgramId(cluster.network as Cluster),
    [cluster],
  );
  const program = getCrudapp2Program(provider);

  const accounts = useQuery({
    queryKey: ["crudapp2", "all", { cluster }],
    queryFn: () => program.account.journalEntryState.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ["get-program-account", { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const createEntry = useMutation<string, Error, CreateEntryArgs>({
    mutationKey: ["journalEntryState", "create", { cluster }],
    mutationFn: async ({ title, message, owner }) => {

      return program.methods.createJournalEntry(title, message).rpc();
    },
    onSuccess: (tx) => {
      transactionToast(tx);
      accounts.refetch();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    createEntry,
  };
}

export function useCrudapp2ProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts } = useCrudapp2Program();

  const programId = new PublicKey(
    "8sddtWW1q7fwzspAfZj4zNpeQjpvmD3EeCCEfnc3JnuP",
  );

  const accountQuery = useQuery({
    queryKey: ["crudapp2", "fetch", { cluster, account }],
    queryFn: () => program.account.journalEntryState.fetch(account),
  });


  const updateEntry = useMutation<string, Error, CreateEntryArgs>({
    mutationKey: ["journalEntryState", "create", { cluster }],
    mutationFn: async ({ title, message, owner }) => {

      return program.methods.updateJournalEntry(title, message).rpc();
    },
    onSuccess: (tx) => {
      transactionToast(tx);
      accounts.refetch();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const deleteEntry = useMutation({
    mutationKey: [`journalEntry`, `delete`, { cluster }],
    mutationFn: (title: string) => {
      return program.methods.deleteJournalEntry(title).rpc();
    },
    onSuccess: (tx) => {
      transactionToast(tx);
      accounts.refetch();
    },
  });

  return {
    accountQuery,
    updateEntry,
    deleteEntry,
  };
}
