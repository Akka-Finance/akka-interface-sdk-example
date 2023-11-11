import React, { useEffect, useState } from "react";
import SwapGraph from "../../components/SwapGraph";
import {
  AKKA,
  ChainId,
  QuoteResponse,
  TokensJsonResponse,
} from "@akkafinance/sdk";
import {
  Autocomplete,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { MyBox } from "../../components/MyBox";
import { toast } from "react-toastify";

const Swap = () => {
  const [routeData, setRouteData] = useState<QuoteResponse | null>(null);
  const [tokens, setTokens] = useState<TokensJsonResponse | null>(null);
  const [fromTokenAddress, setFromTokenAddress] = useState(
    "0x0000000000000000000000000000000000000000"
  );
  const [toTokenAddress, setToTokenAddress] = useState(
    "0x6E35fF7aC8eEB825DdB155515eF612ADcD66BCbC"
  );
  const [amount, setAmount] = useState<string>("10000000000000000");

  useEffect(() => {
    if (!fromTokenAddress || !toTokenAddress || !amount) return;

    setRouteData(null);

    const akka = new AKKA({});

    akka
      .getQuote({
        chainId: ChainId.CORE,
        src: fromTokenAddress,
        dst: toTokenAddress,
        amount: amount,
        includeProtocols: true,
        includeTokensInfo: true,
      })
      .then((res) => {
        setRouteData(res);
      })
      .catch((err) => {
        toast(err.message);
      });
  }, [fromTokenAddress, toTokenAddress, amount]);

  useEffect(() => {
    const akka = new AKKA({});

    akka.getTokens({ chainId: ChainId.CORE }).then((res) => {
      setTokens(res.tokens);
    });
  }, []);

  return (
    <MyBox
      sx={{
        minHeight: "calc(100vh - 128px)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="h4"
        sx={{ textAlign: "center", wordBreak: "break-word" }}
      >
        The code for getting quote using AKKA SDK can be found at:
        src/pages/Quote/index.tsx
      </Typography>

      <hr style={{ width: "100%" }} />

      <Typography
        variant="h6"
        sx={{ textAlign: "center", wordBreak: "break-word" }}
      >
        Click on arrows to see more details about the swap
      </Typography>

      <MyBox
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          flexGrow: 1,
        }}
      >
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
            value={tokens ? tokens[fromTokenAddress] : null}
            options={tokens ? Object.values(tokens) : []}
            getOptionLabel={(token) => token.symbol}
            renderOption={(props, item) => (
              <li {...props} key={item.address}>
                {item.symbol}
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} label="From Token" />
            )}
            onChange={(_, value) => {
              setFromTokenAddress(value?.address || "");
            }}
            sx={{ flexGrow: 1 }}
          />
          <Autocomplete
            disablePortal
            size="small"
            value={tokens ? tokens[toTokenAddress] : null}
            options={tokens ? Object.values(tokens) : []}
            getOptionLabel={(token) => token.symbol}
            renderOption={(props, item) => (
              <li {...props} key={item.address}>
                {item.symbol}
              </li>
            )}
            renderInput={(params) => <TextField {...params} label="To Token" />}
            onChange={(_, value) => {
              setToTokenAddress(value?.address || "");
            }}
            sx={{ flexGrow: 1 }}
          />
          <TextField
            size="small"
            type="number"
            label="Amount"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
            }}
          />
        </MyBox>
        <MyBox
          sx={{
            width: "100%",
            height: "100%",
            minHeight: "300px",
            border: "1px solid black",
            position: "relative",
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {routeData && tokens ? (
            <SwapGraph data={routeData} tokens={tokens} />
          ) : (
            <MyBox
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexGrow: 1,
              }}
            >
              <CircularProgress color="secondary" />
            </MyBox>
          )}
        </MyBox>
      </MyBox>
    </MyBox>
  );
};

export default Swap;
