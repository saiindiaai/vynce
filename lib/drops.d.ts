export interface DropFeedResponse {
  drops: any[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface DropFetchOptions {
  cursor?: string | null;
  limit?: number;
}

export declare function fetchDropFeed(options?: DropFetchOptions): Promise<DropFeedResponse>;

export declare function createDropComment(dropId: string | number, content: string, parentCommentId?: string): Promise<any>;

export declare function fetchDropCommentsByDrop(dropId: string | number): Promise<any[]>;

export declare function likeDropComment(commentId: string): Promise<any>;

export declare function dislikeDropComment(commentId: string): Promise<any>;

export declare function toggleDropLike(dropId: string | number): Promise<{ dropId: string; liked: boolean; aura: number }>;

export declare function toggleDropDislike(dropId: string | number): Promise<{ dropId: string; disliked: boolean; aura: number }>;

export declare function shareDrop(dropId: string | number): Promise<{ dropId: string; shares: number }>;

export declare function deleteDrop(dropId: string | number): Promise<any>;

export declare function toggleBookmark(dropId: string | number): Promise<{ dropId: string; bookmarked: boolean; savedCount: number }>;

export declare function fetchSavedDrops(page?: number, limit?: number): Promise<{ drops: any[]; savedCount: number; currentPage: number; totalPages: number; hasMore: boolean }>;