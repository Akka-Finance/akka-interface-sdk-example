import React, { useEffect, useState } from "react";
import SwapGraph from "../../components/SwapGraph";
import {
  AKKA,
  ChainId,
  QuoteResponse,
  TokensJsonResponse,
} from "@akkafinance/sdk";
import { CircularProgress, Typography } from "@mui/material";

const Swap = () => {
  const [routeData, setRouteData] = useState<QuoteResponse | null>(null);
  const [tokens, setTokens] = useState<TokensJsonResponse | null>(null);

  useEffect(() => {
    const akka = new AKKA({});
    akka
      .getQuote({
        chainId: ChainId.CORE,
        src: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        dst: "0x6E35fF7aC8eEB825DdB155515eF612ADcD66BCbC",
        amount: "10000000000000000",
        includeProtocols: true,
        includeTokensInfo: true,
      })
      .then((res) => {
        setRouteData(res);
      });

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
    </div>
  );
};

export default Swap;
