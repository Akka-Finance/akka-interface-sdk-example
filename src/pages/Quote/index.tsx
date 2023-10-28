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

const Swap = () => {
  const [routeData, setRouteData] = useState<QuoteResponse | null>(null);
  const [tokens, setTokens] = useState<TokensJsonResponse | null>(null);
  const [fromTokenAddress, setFromTokenAddress] = useState(
    "0x0000000000000000000000000000000000000000"
  );
  const [toTokenAddress, setToTokenAddress] = useState(
    "0x6E35fF7aC8eEB825DdB155515eF612ADcD66BCbC"
  );

  useEffect(() => {
    if (!fromTokenAddress || !toTokenAddress) return;

    setRouteData(null);

    const akka = new AKKA({});

    akka
      .getQuote({
        chainId: ChainId.CORE,
        src: fromTokenAddress,
        dst: toTokenAddress,
        amount: "10000000000000000",
        includeProtocols: true,
        includeTokensInfo: true,
      })
      .then((res) => {
        setRouteData(res);
      });
  }, [fromTokenAddress, toTokenAddress]);

  useEffect(() => {
    const akka = new AKKA({});

    akka.getTokens({ chainId: ChainId.CORE }).then((res) => {
      setTokens(res.tokens);
    });
  }, []);

  return (
    <div
      style={{
        height: "calc(100vh - 128px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="h4"
        sx={{ textAlign: "center", wordBreak: "break-word" }}
      >
        The code for getting quote using AKKA SDK can be found at:
        src/pages/Swap/index.tsx
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
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            gap: 8,
            marginBottom: 4,
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
        </div>
        <div
          style={{
            width: "100%",
            height: "100%",
            border: "1px solid black",
            position: "relative",
          }}
        >
          {routeData && tokens ? (
            <SwapGraph data={routeData} tokens={tokens} />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress color="secondary" />
            </div>
          )}
        </div>
      </MyBox>
    </div>
  );
};

export default Swap;
