// Simple in-memory cache for posts
let postsCache: any[] | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 60000 // 60 seconds

export const getPostsCache = () => {
  const now = Date.now()
  if (postsCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return postsCache
  }
  return null
}

export const setPostsCache = (posts: any[]) => {
  postsCache = posts
  cacheTimestamp = Date.now()
}

export const updatePostInCache = (postId: string, updates: Partial<any>) => {
  if (postsCache) {
    postsCache = postsCache.map(post => 
      post.id === postId ? { ...post, ...updates } : post
    )
  }
}

export const invalidatePostsCache = () => {
  postsCache = null
  cacheTimestamp = 0
}
