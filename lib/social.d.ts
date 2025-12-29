export interface FeedResponse {
  posts: any[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface FetchOptions {
  cursor?: string | null;
  limit?: number;
}

export declare function fetchSocialFeed(options?: FetchOptions): Promise<FeedResponse>;
