import React, { useEffect, useState } from "react";
import { AKKA, ChainId } from "@akkafinance/sdk";
import { Box, CircularProgress, Typography } from "@mui/material";

const Spender = () => {
  const [spenderAddress, setSpenderAddress] = useState<string | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [allowance, setAllowance] = useState(0);

  useEffect(() => {
    const akka = new AKKA({});
    akka
      .getSpender({ chainId: ChainId.CORE })
      .then((res) => {
        setSpenderAddress(res.address);
      })
      .catch(() => {
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
        src/pages/Spender/index.tsx
      </Typography>

      <Box sx={{ width: "100%", textAlign: "center" }}>
        {loading ? (
          <CircularProgress color="secondary" />
        ) : error ? (
          <Typography color="error" variant="h1">
            Something went wrong! :(((
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <div>akka contract address for CORE chain: {spenderAddress}</div>
          </Box>
        )}
      </Box>
    </>
  );
};

export default Spender;
