import React, { useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import {
  AKKA,
  ApproveTransactionResponse,
  ChainId,
  Token,
} from "@akkafinance/sdk";
import { useAccount, useSendTransaction } from "wagmi";
import ConnectWalletButtons from "../ConnectWalletButtons";
import { toast } from "react-toastify";

const GetApproveTransaction = () => {
  const [loading, setLoading] = useState(false);
  const [loadingApproveTransactionData, setLoadingApproveTransactionData] =
    useState(false);
  const [tokens, setTokens] = useState<Array<Token>>([]);
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [data, setData] = useState<ApproveTransactionResponse | null>(null);

  const { isConnected } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();

  const handleGetApproveTransaction = () => {
    if (!tokenAddress || !amount) return;

    setData(null);
    setLoadingApproveTransactionData(true);
    const akka = new AKKA({});
    akka
      .getApproveTransaction({ chainId: ChainId.CORE, tokenAddress, amount })
      .then((res) => {
        setData(res);
      })
      .finally(() => {
        setLoadingApproveTransactionData(false);
      });
  };

  const approveTransaction = async () => {
    if (isConnected && data) {
      try {
        await sendTransactionAsync({
          to: data.to,
          data: data.data as `0x${string}`,
          value: BigInt(data.value),
          gasPrice: BigInt(data.gasPrice),
        });
      } catch (error: any) {
        if (error.shortMessage) {
          console.log("toastttt sm: ", error.shortMessage);
          toast(error.shortMessage);
        } else {
          console.log("toastttt m: ", error.message);
          toast(error.message);
        }
      }
    }
  };

  return (
    <Box
      sx={{
        mt: 2,
        border: "1px solid black",
        borderRadius: 4,
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography
        variant="h1"
        sx={{ textAlign: "center", wordBreak: "break-word" }}
      >
        Get approve transaction (code is in
        src/components/GetApproveTransaction/index.tsx):
      </Typography>
      <Autocomplete
        disablePortal
        options={tokens}
        getOptionLabel={(token) => token.symbol}
        renderOption={(props, item) => (
          <li {...props} key={item.address}>
            {item.symbol}
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Token"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        onOpen={() => {
          if (!tokens.length) {
            setLoading(true);
            const akka = new AKKA({});
            akka
              .getTokens({ chainId: ChainId.CORE })
              .then((res) => {
                setTokens(Object.values(res.tokens));
              })
              .finally(() => {
                setLoading(false);
              });
          }
        }}
        onChange={(_, value) => {
          setTokenAddress(value?.address || "");
        }}
        loading={loading}
      />

      <Box sx={{ display: "flex", alignItems: "stretch", gap: 2 }}>
        <TextField
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
          }}
          sx={{ flexGrow: 1 }}
        />

        <Button
          color="success"
          variant="contained"
          disabled={!tokenAddress}
          onClick={handleGetApproveTransaction}
        >
          Get approve transaction
        </Button>
      </Box>

      <Box sx={{ wordBreak: "break-word", width: "100%", textAlign: "center" }}>
        {loadingApproveTransactionData ? (
          <CircularProgress color="secondary" />
        ) : data ? (
          <>
            <div>data: {data?.data}</div>
            <div>gasPrice: {data?.gasPrice}</div>
            <div>to: {data?.to}</div>
            <div>value: {data?.value}</div>
            {isConnected ? (
              <Button
                variant="contained"
                color="success"
                onClick={approveTransaction}
              >
                approve this transaction
              </Button>
            ) : (
              <Box
                sx={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  justifyContent: "center",
                }}
              >
                <div>Connect wallet first to approve this transaction!</div>
                <ConnectWalletButtons />
              </Box>
            )}
          </>
        ) : (
          ""
        )}
      </Box>
    </Box>
  );
};

export default GetApproveTransaction;
