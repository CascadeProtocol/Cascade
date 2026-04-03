import type { TokenPair, VenuePrice, VenueId } from "../lib/types.js";

export abstract class BaseVenue {
  abstract readonly id: VenueId;
  abstract getPrice(pair: TokenPair): Promise<VenuePrice>;
  abstract isHealthy(): Promise<boolean>;
}

