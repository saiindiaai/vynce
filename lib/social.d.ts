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

export declare function createComment(postId: string | number, content: string): Promise<any>;

export declare function fetchCommentsByPost(postId: string | number): Promise<any[]>;
