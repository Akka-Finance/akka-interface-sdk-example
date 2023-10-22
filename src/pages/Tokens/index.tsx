import React, { useEffect, useState } from "react";
import { AKKA, ChainId, Token } from "@akkafinance/sdk";
import TokenList from "../../components/TokenList";
import { Box, CircularProgress, Typography } from "@mui/material";

const Tokens = () => {
  const [tokens, setTokens] = useState<Array<Token>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const akka = new AKKA({});

    akka
      .getTokens({ chainId: ChainId.CORE })
      .then((res) => {
        setTokens(Object.values(res.tokens));
      })
      .catch((err) => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Typography
        variant="h4"
        sx={{ mb: 4, textAlign: "center", wordBreak: "break-word" }}
      >
        The code for getting tokens using AKKA SDK can be found at:
        src/pages/Tokens/index.tsx
      </Typography>

      <Box sx={{ width: "100%", textAlign: "center" }}>
        {loading ? (
          <CircularProgress color="secondary" />
        ) : error ? (
          <Typography color="error" variant="h1">
            Something went wrong! :(((
          </Typography>
        ) : (
          <TokenList tokens={tokens} />
        )}
      </Box>
    </>
  );
};

export default Tokens;
