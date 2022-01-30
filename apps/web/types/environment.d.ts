declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_CONTRACT_ADDRESS?: string;
      NEXT_PUBLIC_COLLECTION_NAME?: string;
      NEXT_PUBLIC_MINT_GAS_LIMIT?: string;
      NEXT_PUBLIC_ALCHEMY_API_KEY?: string;
      NEXT_PUBLIC_STAGE?: "test" | "production";
    }
  }
}
// module hack
export {};
