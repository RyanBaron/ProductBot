// useTokenCheck.ts
import { useState, useEffect } from 'react';
import { useWallet } from '@meshsdk/react';

const POLICY_ID_NAMES: { [key: string]: string } = {
  "xxxxx": "NFT",
};

export const useTokenCheck = () => {
  const { connected, wallet } = useWallet();
  const [hasMinRequiredTokens, setHasMinRequiredTokens] = useState(false);
  const [tokenAssetSummary, settokenAssetSummary] = useState<Record<string, number>>({});

  useEffect(() => {
    if (connected && wallet) {
      (async function fetchBalanceAndCheckAssets() {
        try {
          const fetchedBalance = await wallet.getBalance();
          if (!fetchedBalance) {
            console.error("No balance data received.");
            return;
          }

          const relevantAssets = fetchedBalance.filter(asset =>
            Object.keys(POLICY_ID_NAMES).some(policyId => asset.unit.startsWith(policyId))
          );

          const assetSums = Object.keys(POLICY_ID_NAMES).reduce((acc, policyId) => {
            const totalQuantityForPolicy = relevantAssets
              .filter(asset => asset.unit.startsWith(policyId))
              .reduce((sum, asset) => sum + Number(asset.quantity), 0);
            const friendlyName = POLICY_ID_NAMES[policyId]; // Get the friendly name
            acc[friendlyName] = totalQuantityForPolicy; // Use friendly name as the key
            return acc;
          }, {} as Record<string, number>);

          // Call the checkTokens function with the asset sums
          // checkTokens(assetSums); // This line should be removed if checkTokens is not used elsewhere

          // Instead of calling checkTokens, directly set the states here
          const policiesMet = Object.values(assetSums).filter(quantity => {
            if (quantity >= 1000000000) return true; // Criteria for Token 1
            if (quantity >= 1) return true; // Criteria for NFT 1
            if (quantity >= 4) return true; // Criteria for NFT 2
            return false;
          }).length;

          setHasMinRequiredTokens(policiesMet >= 2); // Require two or more policies to be met

          settokenAssetSummary(assetSums); // Update the summary based on the fetched assets

        } catch (error: any) {
          console.error("Detailed error:", error);
        }
      })();
    }
  }, [connected, wallet]);

  return { hasMinRequiredTokens, tokenAssetSummary, POLICY_ID_NAMES };
}
