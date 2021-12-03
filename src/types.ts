export type MappingData = {
  world: string;
  patterns: string[];
}
export type Mapping = {
  [account: string]: MappingData;
}
export type MatchingAccount = {
  account: string;
  world: string;
}

