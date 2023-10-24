import React, { useEffect, useState } from "react";
import { AKKA, ChainId, Token } from "@akkafinance/sdk";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useAccount, useDisconnect } from "wagmi";
import ConnectWalletButtons from "../ConnectWalletButtons";
import { isAddress } from "ethers/lib/utils";

const GetAllowance = () => {
  const [loading, setLoading] = useState(false);
  const [loadingAllowance, setLoadingAllowance] = useState(false);
  const [tokens, setTokens] = useState<Array<Token>>([]);
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [allowance, setAllowance] = useState<string>("");

  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (address) {
      setWalletAddress(address);
    }
  }, [address, setWalletAddress]);

  useEffect(() => {
    if (!isAddress(tokenAddress) || !isAddress(walletAddress)) return;

    setLoadingAllowance(true);
    const akka = new AKKA({});
    akka
      .getAllowance({ chainId: ChainId.CORE, tokenAddress, walletAddress })
      .then((res) => {
        setAllowance(res.allowance?.toString() || "");
      })
      .finally(() => {
        setLoadingAllowance(false);
      });
  }, [tokenAddress, walletAddress]);

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
        Get allowance (code is in src/components/GetAllowance/index.tsx):
      </Typography>
      <Autocomplete
        disablePortal
        options={tokens}
        getOptionLabel={(token) => token.name}
        renderOption={(props, item) => (
          <li {...props} key={item.address}>
            {item.name}
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

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <TextField
          value={walletAddress}
          label="Wallet Address"
          onChange={(e) => {
            setWalletAddress(e.target.value);
          }}
          sx={{ flexGrow: 1 }}
        />
        <h3>OR</h3>
        <ConnectWalletButtons />

        {isConnected && (
          <Button
            onClick={() => {
              setWalletAddress("");
              disconnect();
            }}
            color="warning"
          >
            Disconnect
          </Button>
        )}
      </Box>

      {/* <Box>
        <Button
          color="success"
          variant="contained"
          onClick={handleGetAllowance}
          disabled={loadingAllowance}
        >
          get allowance
        </Button>
      </Box> */}

      <Box sx={{ wordBreak: "break-word" }}>
        {loadingAllowance ? (
          <CircularProgress color="secondary" />
        ) : isAddress(tokenAddress) && isAddress(walletAddress) ? (
          `Your allowance for the selected token is: ${allowance}`
        ) : (
          "Please select a token and fill your wallet address"
        )}
      </Box>
    </Box>
  );
};

export default GetAllowance;
