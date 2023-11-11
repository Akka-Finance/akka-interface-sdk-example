import React, { useEffect, useState } from "react";
import {
  AKKA,
  ChainId,
  OnChainSwapResponse,
  TokensJsonResponse,
} from "@akkafinance/sdk";
import { Autocomplete, TextField, Typography, Button } from "@mui/material";
import { MyBox } from "../../components/MyBox";
import ConnectWalletButtons from "../../components/ConnectWalletButtons";
import { useAccount, useDisconnect, useSendTransaction } from "wagmi";
import { toast } from "react-toastify";

const Swap = () => {
  const [loading, setLoading] = useState(false);
  const [swapData, setSwapData] = useState<OnChainSwapResponse | null>(null);
  const [tokens, setTokens] = useState<TokensJsonResponse | null>(null);
  const [src, setSrc] = useState("0x0000000000000000000000000000000000000000");
  const [dst, setDst] = useState("0x6E35fF7aC8eEB825DdB155515eF612ADcD66BCbC");
  const [amount, setAmount] = useState("10000000000000000");
  const [from, setFrom] = useState("");

  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { sendTransactionAsync } = useSendTransaction();

  const handleGetSwap = () => {
    setLoading(true);
    const akka = new AKKA({});

    akka
      .getSwap({
        chainId: ChainId.CORE,
        src,
        dst,
        amount,
        from,
        slippage: 0.05,
      })
      .then((res) => {
        setSwapData(res);
      })
      .catch(async (err) => {
        const message = (await err.response.json()).description;
        toast(message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleActualSwap = () => {
    if (!swapData) return;

    setLoading(true);
    const tx = swapData.tx;
    sendTransactionAsync({
      to: tx.to,
      data: tx.data as `0x${string}`,
      value: BigInt(tx.value),
      gasPrice: BigInt(tx.gasPrice),
      gas: BigInt(tx.gas),
    })
      .then(() => {
        toast("swap done!");
      })
      .catch((error) => {
        toast(error.shortMessage || error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (address) setFrom(address);
  }, [address]);

  useEffect(() => {
    const akka = new AKKA({});

    akka.getTokens({ chainId: ChainId.CORE }).then((res) => {
      setTokens(res.tokens);
    });
  }, []);

  return (
    <>
      <Typography
        variant="h4"
        sx={{ textAlign: "center", wordBreak: "break-word" }}
      >
        The code for getting swap using AKKA SDK can be found at:
        src/pages/Swap/index.tsx
      </Typography>

      <MyBox
        sx={{
          display: "flex",
          width: "100%",
          gap: { xs: 1, md: 4 },
          marginBottom: 4,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Autocomplete
          disablePortal
          size="small"
          value={tokens ? tokens[src] : null}
          options={tokens ? Object.values(tokens) : []}
          getOptionLabel={(token) => token.symbol}
          renderOption={(props, item) => (
            <li {...props} key={item.address}>
              {item.symbol}
            </li>
          )}
          renderInput={(params) => <TextField {...params} label="From Token" />}
          onChange={(_, value) => {
            setSrc(value?.address || "");
          }}
          sx={{ flexGrow: 1 }}
        />
        <Autocomplete
          disablePortal
          size="small"
          value={tokens ? tokens[dst] : null}
          options={tokens ? Object.values(tokens) : []}
          getOptionLabel={(token) => token.symbol}
          renderOption={(props, item) => (
            <li {...props} key={item.address}>
              {item.symbol}
            </li>
          )}
          renderInput={(params) => <TextField {...params} label="To Token" />}
          onChange={(_, value) => {
            setDst(value?.address || "");
          }}
          sx={{ flexGrow: 1 }}
        />
        <TextField
          size="small"
          type="number"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
          }}
        />
      </MyBox>
      <MyBox
        sx={{
          display: "flex",
          alignItems: "stretch",
          gap: { xs: 0, md: 2 },
          textAlign: "center",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <TextField
          size="small"
          value={from}
          label="Wallet Address"
          onChange={(e) => {
            setFrom(e.target.value);
          }}
          sx={{ flexGrow: 1 }}
        />
        <h3>OR</h3>
        <ConnectWalletButtons />

        {isConnected && (
          <Button
            onClick={() => {
              setFrom("");
              disconnect();
            }}
            color="warning"
          >
            Disconnect
          </Button>
        )}
      </MyBox>

      <MyBox sx={{ textAlign: "center" }}>
        <Button
          size="small"
          variant="contained"
          color="success"
          onClick={handleGetSwap}
          disabled={loading}
        >
          Get Swap Data
        </Button>
      </MyBox>

      {swapData && (
        <>
          <MyBox sx={{ mt: 1, textAlign: "center", wordBreak: "break-all" }}>
            <>
              <Typography variant="h5">
                to amount: {swapData.toAmount}
              </Typography>
              <MyBox>data: {swapData.tx.data}</MyBox>
              <MyBox>from: {swapData.tx.from}</MyBox>
              <MyBox>gas: {swapData.tx.gas}</MyBox>
              <MyBox>gasPrice: {swapData.tx.gasPrice}</MyBox>
              <MyBox>to: {swapData.tx.to}</MyBox>
              <MyBox>value: {swapData.tx.value}</MyBox>
            </>
          </MyBox>

          <MyBox sx={{ textAlign: "center" }}>
            {isConnected ? (
              <Button
                size="small"
                variant="contained"
                color="success"
                onClick={handleActualSwap}
                disabled={loading}
              >
                swap
              </Button>
            ) : (
              <Typography variant="h6">
                connect with <ConnectWalletButtons /> to make the actual swap
              </Typography>
            )}
          </MyBox>
        </>
      )}
    </>
  );
};

export default Swap;
