interface Provider {
  ID: string;
  Addrs: string[];
}

interface ProviderResult {
  ContextID: string;
  Metadata: string;
  Provider: Provider;
}

interface MultihashResult {
  Multihash: string;
  ProviderResults: ProviderResult[];
}

interface InputData {
  MultihashResults: MultihashResult[];
}

interface ModifiedProvider {
  peerID: string;
  Multiaddress: string[];
}

interface OutputData {
  modifiedProviders: ModifiedProvider[];
}
