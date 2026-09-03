export interface Episode {
  id: number;
  seasonNumber: number; // 1 to 8 (Season = Month)
  episodeNumber: number;
  title: string;
  description: string;
  durationMinutes: number;
  thumbnailUrl: string;
  videoUrl?: string;
  dateStr?: string;
  location?: string;
  loveNote?: string;
  isFavorite?: boolean;
}

export interface SeasonInfo {
  seasonNumber: number; // 1 to 8
  monthTitle: string;
  theme: string;
  description: string;
  coverImage: string;
  releaseYear: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatarColor: string; // Tailwind color or hex
  avatarIcon: string;
  isGirlfriend?: boolean;
  isOwner?: boolean;
}

export interface WatchProgress {
  episodeId: number;
  progressPercent: number; // 0 to 100
  lastWatchedAt: number;
}

/**
 * Extracts Google Drive file ID from any Google Drive link or returns null.
 */
export function getGoogleDriveFileId(url?: string): string | null {
  if (!url) return null;
  const cleanUrl = url.trim();
  if (cleanUrl.includes("drive.google.com") || cleanUrl.includes("googleusercontent.com")) {
    const match =
      cleanUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
      cleanUrl.match(/id=([a-zA-Z0-9_-]+)/) ||
      cleanUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

/**
 * Resolves video URLs and automatically converts Google Drive share links
 * (e.g. https://drive.google.com/file/d/FILE_ID/view) to direct streaming URLs.
 */
export function resolveVideoUrl(url?: string): string {
  if (!url || !url.trim()) {
    return "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
  }
  const cleanUrl = url.trim();

  // If it's a Google Drive link, extract file ID and convert to direct stream link
  const gId = getGoogleDriveFileId(cleanUrl);
  if (gId) {
    return `https://drive.google.com/uc?export=download&id=${gId}`;
  }

  return cleanUrl;
}

/**
 * Resolves image / thumbnail URLs and automatically converts Google Drive links
 * to direct high-res CDN image URLs (https://lh3.googleusercontent.com/d/FILE_ID).
 */
export function resolveImageUrl(url?: string): string {
  if (!url || !url.trim()) return "";
  const cleanUrl = url.trim();
  if (cleanUrl.includes("drive.google.com")) {
    const match =
      cleanUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
      cleanUrl.match(/id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://lh3.googleusercontent.com/d/${match[1]}`;
    }
  }
  return cleanUrl;
}

const STORAGE_KEY_EPISODES = "our_story_netflix_episodes_v2";
const STORAGE_KEY_SEASONS = "our_story_netflix_seasons_v2";
const STORAGE_KEY_ACTIVE_PROFILE = "our_story_active_profile_v2";
const STORAGE_KEY_PROFILES = "our_story_profiles_v2";
const STORAGE_KEY_MY_LIST = "our_story_my_list_v2";
const STORAGE_KEY_WATCH_HISTORY = "our_story_watch_history_v2";

export const DEFAULT_PROFILES: UserProfile[] = [
  {
    id: "profile-us",
    name: "Us",
    avatarColor: "from-[#E50914] to-red-950",
    avatarIcon: "US",
    isOwner: true,
  },
];

export const DEFAULT_SEASONS: SeasonInfo[] = [
  {
    seasonNumber: 1,
    monthTitle: "Month 1 · The Beginning",
    theme: "Where It All Started",
    description: "The very first sparks, nervous smiles, coffee dates that turned into hours, and the magical moment we decided to choose each other.",
    coverImage: "https://lh3.googleusercontent.com/d/1V6SxPOi2MEzNNqAIGHhxfaZRU6PS-LQF",
    releaseYear: "Month 1",
  },
  {
    seasonNumber: 2,
    monthTitle: "Month 2 · Butterflies & First Adventures",
    theme: "First Adventures",
    description: "Long drives with our favorite playlist, singing at the top of our lungs, holding hands everywhere, and realizing how easy loving you is.",
    coverImage: "https://lh3.googleusercontent.com/d/1bDFEpa-JdTMPFt5ijKzUmP-4h5E0Fk5C",
    releaseYear: "Month 2",
  },
  {
    seasonNumber: 3,
    monthTitle: "Month 3 · Late Nights & Inside Jokes",
    theme: "Getting Closer",
    description: "3 AM voice notes, laughing until our stomachs hurt, creating our own silly language, and discovering all the tiny things that make you special.",
    coverImage: "https://lh3.googleusercontent.com/d/1rXAzqy62IjfnXIpwB3mfgiLewIINB2K8",
    releaseYear: "Month 3",
  },
  {
    seasonNumber: 4,
    monthTitle: "Month 4 · City Walks & Sunsets",
    theme: "Chasing Golden Hours",
    description: "Walking around the city with no destination, discovering cozy café corners, watching golden hour reflections in your eyes, and endless warm hugs.",
    coverImage: "https://lh3.googleusercontent.com/d/1LZFhILzbrXvWpARI72uUcZp49krdQoe1",
    releaseYear: "Month 4",
  },
  {
    seasonNumber: 5,
    monthTitle: "Month 5 · Cozy Days & Sweet Surprises",
    theme: "Comfort & Peace",
    description: "Rainy Sunday afternoons wrapped under warm blankets, watching our favorite shows, cooking together, and finding pure home in each other.",
    coverImage: "https://lh3.googleusercontent.com/d/1tahYJTXNXcCJPwClbxj-VqfF6T9BFXKd",
    releaseYear: "Month 5",
  },
  {
    seasonNumber: 6,
    monthTitle: "Month 6 · Celebrating Us & Half-Year Mark",
    theme: "Six Months of Magic",
    description: "Half a year of choosing you every single day. Special dinners, unexpected little gifts, looking back at our first photos, and falling even deeper in love.",
    coverImage: "https://lh3.googleusercontent.com/d/1AnNZOjVY2gF0ozzNKRymCjmJfxg2gmFB",
    releaseYear: "Month 6",
  },
  {
    seasonNumber: 7,
    monthTitle: "Month 7 · Growing Stronger Together",
    theme: "Through Everything",
    description: "Cheering for each other's dreams, comforting each other on tough days, quiet peaceful moments, and knowing we have each other's back forever.",
    coverImage: "https://lh3.googleusercontent.com/d/1toBQ_xZZt-I3xoVVQh55syXubxdVjbDu",
    releaseYear: "Month 7",
  },
  {
    seasonNumber: 8,
    monthTitle: "Month 8 · Our Forever & Beyond",
    theme: "To Be Continued...",
    description: "Eight incredible months of laughter, warmth, growth, and love. Here's to all the memories we've made, and the countless more waiting for us.",
    coverImage: "https://lh3.googleusercontent.com/d/1V6SxPOi2MEzNNqAIGHhxfaZRU6PS-LQF",
    releaseYear: "Month 8",
  },
];

export const DEFAULT_EPISODES: Episode[] = [
  // ==========================================
  // SEASON 1 (Month 1): 1mE0 to 1mE6 (7 episodes)
  // ==========================================
  {
    id: 100,
    seasonNumber: 1,
    episodeNumber: 0,
    title: "Month 1 · Prologue: Day Zero",
    description: "Where our story began. The very first moments of Month 1 that started everything.",
    durationMinutes: 3,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/1V6SxPOi2MEzNNqAIGHhxfaZRU6PS-LQF",
    videoUrl: "https://drive.google.com/file/d/1V6SxPOi2MEzNNqAIGHhxfaZRU6PS-LQF/view",
    dateStr: "Month 1 · Day 0",
    location: "Where It All Began",
    loveNote: "Every love story is beautiful, but ours is my absolute favorite.",
  },
  {
    id: 101,
    seasonNumber: 1,
    episodeNumber: 1,
    title: "Month 1 · The First Sparks",
    description: "The moment everything changed. The initial magic, nervous smiles, and realizing how special you are.",
    durationMinutes: 4,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/1tHp8nLzoq4-URgMAABxgdDEhTJRMsbHr",
    videoUrl: "https://drive.google.com/file/d/1tHp8nLzoq4-URgMAABxgdDEhTJRMsbHr/view",
    dateStr: "Month 1 · Week 1",
    location: "Our First Meeting Spot",
    loveNote: "Your smile was all it took to make my whole world brighter.",
  },
  {
    id: 102,
    seasonNumber: 1,
    episodeNumber: 2,
    title: "Month 1 · Hours Like Minutes",
    description: "Talking for hours and feeling like no time had passed at all. Effortless, comfortable, and magical.",
    durationMinutes: 4,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/1yqiqr0aINqQOnG-CKb2s1od1OJkQGQDZ",
    videoUrl: "https://drive.google.com/file/d/1yqiqr0aINqQOnG-CKb2s1od1OJkQGQDZ/view",
    dateStr: "Month 1 · Week 2",
    location: "Cozy Corner Café",
    loveNote: "Your laugh is my all-time favorite soundtrack.",
  },
  {
    id: 103,
    seasonNumber: 1,
    episodeNumber: 3,
    title: "Month 1 · Unforgettable Smiles",
    description: "Every glance, every small giggle that made my heart race. Discovering how much joy you bring.",
    durationMinutes: 5,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/1hqTI2ReJd8QqEZtDhMLgAvU3qu4oEJ5Y",
    videoUrl: "https://drive.google.com/file/d/1hqTI2ReJd8QqEZtDhMLgAvU3qu4oEJ5Y/view",
    dateStr: "Month 1 · Week 3",
    location: "Late Night Conversations",
    loveNote: "Falling asleep on calls with you will never get old.",
  },
  {
    id: 104,
    seasonNumber: 1,
    episodeNumber: 4,
    title: "Month 1 · A Special Moment",
    description: "A quiet moment that showed me how genuine, warm, and wonderfully caring you are.",
    durationMinutes: 3,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/1NHTrGnoNbDPfI9sXeJkXSFTgJ9mMwuku",
    videoUrl: "https://drive.google.com/file/d/1NHTrGnoNbDPfI9sXeJkXSFTgJ9mMwuku/view",
    dateStr: "Month 1 · Week 3",
    location: "Under the Evening Sky",
    loveNote: "You brought so much peace into my life from the very start.",
  },
  {
    id: 105,
    seasonNumber: 1,
    episodeNumber: 5,
    title: "Month 1 · Sweet Conversations",
    description: "Sharing stories, dreams, and realizing how deeply we connect on every level.",
    durationMinutes: 2,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/1eCGM1Er0jp5en3hY7V9FURfBO11RrFQI",
    videoUrl: "https://drive.google.com/file/d/1eCGM1Er0jp5en3hY7V9FURfBO11RrFQI/view",
    dateStr: "Month 1 · Week 4",
    location: "Our Safe Haven",
    loveNote: "I could listen to your voice forever and never get tired.",
  },
  {
    id: 106,
    seasonNumber: 1,
    episodeNumber: 6,
    title: "Month 1 · Month One Milestone",
    description: "Closing out our first incredible month together and realizing this is just the beginning of forever.",
    durationMinutes: 4,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/16lDgaNhIR-m-HOMyAsZ-4cV-BJXSeGrj",
    videoUrl: "https://drive.google.com/file/d/16lDgaNhIR-m-HOMyAsZ-4cV-BJXSeGrj/view",
    dateStr: "Month 1 · Milestone",
    location: "Sunset Horizon",
    loveNote: "Day 1 to 30, and falling for you more every single day.",
  },

  // ==========================================
  // SEASON 2 (Month 2): 2mE0 to 2mE6 (7 episodes)
  // ==========================================
  {
    id: 200,
    seasonNumber: 2,
    episodeNumber: 0,
    title: "Month 2 · New Chapter Begins",
    description: "Stepping into Month 2 with even bigger smiles, butterflies, and excitement.",
    durationMinutes: 3,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/1bDFEpa-JdTMPFt5ijKzUmP-4h5E0Fk5C",
    videoUrl: "https://drive.google.com/file/d/1bDFEpa-JdTMPFt5ijKzUmP-4h5E0Fk5C/view",
    dateStr: "Month 2 · Start",
    location: "On the Road",
    loveNote: "Every day with you is a brand new adventure.",
  },
  {
    id: 201,
    seasonNumber: 2,
    episodeNumber: 1,
    title: "Month 2 · Road Trip & Playlists",
    description: "Windows rolled down, summer breeze, and singing our favorite songs at the top of our lungs.",
    durationMinutes: 5,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/1s5G-O5B1nLEV3jkNRUd1Ck3Ggzf1vuA6",
    videoUrl: "https://drive.google.com/file/d/1s5G-O5B1nLEV3jkNRUd1Ck3Ggzf1vuA6/view",
    dateStr: "Month 2 · Week 5",
    location: "Scenic Highway",
    loveNote: "Any destination is paradise as long as you are in the passenger seat.",
  },
  {
    id: 202,
    seasonNumber: 2,
    episodeNumber: 2,
    title: "Month 2 · Little Joy & Big Laughs",
    description: "Spontaneous moments that turned into our absolute favorite memories.",
    durationMinutes: 5,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/1NrwNjx8oLbxakPQ7tk9AD9td2LDMZzXe",
    videoUrl: "https://drive.google.com/file/d/1NrwNjx8oLbxakPQ7tk9AD9td2LDMZzXe/view",
    dateStr: "Month 2 · Week 6",
    location: "Kitchen & Cozy Spaces",
    loveNote: "Your happiness is the most contagious thing in the world.",
  },
  {
    id: 203,
    seasonNumber: 2,
    episodeNumber: 3,
    title: "Month 2 · Sweet Surprises",
    description: "Unexpected little moments that made the day unforgettable.",
    durationMinutes: 2,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/1RM5jyn2f84ec8ejj2V6RbVOdsfbraE6B",
    videoUrl: "https://drive.google.com/file/d/1RM5jyn2f84ec8ejj2V6RbVOdsfbraE6B/view",
    dateStr: "Month 2 · Week 6",
    location: "Downtown Corners",
    loveNote: "Thank you for bringing so much sweetness into my life.",
  },
  {
    id: 204,
    seasonNumber: 2,
    episodeNumber: 4,
    title: "Month 2 · Holding Hands",
    description: "Walking side by side without needing to rush anywhere.",
    durationMinutes: 3,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/1sbAaf5iIMPFlQ3FQ335JZIB9XIhnJ1A3",
    videoUrl: "https://drive.google.com/file/d/1sbAaf5iIMPFlQ3FQ335JZIB9XIhnJ1A3/view",
    dateStr: "Month 2 · Week 7",
    location: "Evening Strolls",
    loveNote: "My hand fits most naturally in yours.",
  },
  {
    id: 205,
    seasonNumber: 2,
    episodeNumber: 5,
    title: "Month 2 · Golden Afternoons",
    description: "Enjoying the warm glow of the afternoon and talking about everything under the sun.",
    durationMinutes: 4,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/12SUu9YkIUdR6-zO_hytgyFlp9JjLfnlk",
    videoUrl: "https://drive.google.com/file/d/12SUu9YkIUdR6-zO_hytgyFlp9JjLfnlk/view",
    dateStr: "Month 2 · Week 7",
    location: "Sunny Terraces",
    loveNote: "Sunsets are gorgeous, but looking at you is infinitely better.",
  },
  {
    id: 206,
    seasonNumber: 2,
    episodeNumber: 6,
    title: "Month 2 · Two Months of Magic",
    description: "Celebrating two whole months of choosing each other with all our hearts.",
    durationMinutes: 4,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/1x2Y6SuLQmpP7xo4_4olgeDbFVgqCGCXI",
    videoUrl: "https://drive.google.com/file/d/1x2Y6SuLQmpP7xo4_4olgeDbFVgqCGCXI/view",
    dateStr: "Month 2 · Milestone",
    location: "Our Favorite Spot",
    loveNote: "Two months down, a whole lifetime of memories to go.",
  },

  // ==========================================
  // SEASON 3 (Month 3): 3mE0 to 3mE7 (8 episodes)
  // ==========================================
  {
    id: 300,
    seasonNumber: 3,
    episodeNumber: 0,
    title: "Month 3 · The Inside Jokes Begin",
    description: "The start of all our secret code words and bursting into laughter across the room.",
    durationMinutes: 3,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/1rXAzqy62IjfnXIpwB3mfgiLewIINB2K8",
    videoUrl: "https://drive.google.com/file/d/1rXAzqy62IjfnXIpwB3mfgiLewIINB2K8/view",
    dateStr: "Month 3 · Start",
    location: "Everywhere We Go",
    loveNote: "Nobody makes me laugh as hard or as genuinely as you do.",
  },
  {
    id: 301,
    seasonNumber: 3,
    episodeNumber: 1,
    title: "Month 3 · 3 AM Conversations",
    description: "Staying up late talking about our childhoods, dreams, and our weirdest habits.",
    durationMinutes: 6,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/1s8udYnjr5MHi65Wh_5kYymWoYFLqBQmr",
    videoUrl: "https://drive.google.com/file/d/1s8udYnjr5MHi65Wh_5kYymWoYFLqBQmr/view",
    dateStr: "Month 3 · Week 9",
    location: "Midnight Calls",
    loveNote: "Late night calls with you are my absolute favorite thing.",
  },
  {
    id: 302,
    seasonNumber: 3,
    episodeNumber: 2,
    title: "Month 3 · Laughing Until It Hurts",
    description: "Moments of uncontrollable laughter and unfiltered happiness.",
    durationMinutes: 6,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/164nkIHmhzihqLKbz9qy5rngHsSw-CkdB",
    videoUrl: "https://drive.google.com/file/d/164nkIHmhzihqLKbz9qy5rngHsSw-CkdB/view",
    dateStr: "Month 3 · Week 10",
    location: "Shared Laughter",
    loveNote: "You make life so wonderfully joyful and light.",
  },
  {
    id: 303,
    seasonNumber: 3,
    episodeNumber: 3,
    title: "Month 3 · Sweet Days Together",
    description: "Cherishing the simple, effortless moments spent in each other's presence.",
    durationMinutes: 4,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/1Ke9mlPwTcjbEn-bYGQlh7A9p2gdPuCvO",
    videoUrl: "https://drive.google.com/file/d/1Ke9mlPwTcjbEn-bYGQlh7A9p2gdPuCvO/view",
    dateStr: "Month 3 · Week 10",
    location: "Our Little World",
    loveNote: "My favorite spot on earth is right beside you.",
  },
  {
    id: 304,
    seasonNumber: 3,
    episodeNumber: 4,
    title: "Month 3 · The Fun Adventures",
    description: "Exploring new places and creating unforgettable highlights together.",
    durationMinutes: 8,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/1opam_1Gk56rUL5QQC_sP1XeFG0XftHla",
    videoUrl: "https://drive.google.com/file/d/1opam_1Gk56rUL5QQC_sP1XeFG0XftHla/view",
    dateStr: "Month 3 · Week 11",
    location: "City & Nature",
    loveNote: "With you, anywhere feels like the sweetest home.",
  },
  {
    id: 305,
    seasonNumber: 3,
    episodeNumber: 5,
    title: "Month 3 · Deep Connection",
    description: "Realizing how deeply we understand and care for each other's feelings.",
    durationMinutes: 10,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/17BCLPr2vjiWWdYvCpYAXeXLgOBQOvx58",
    videoUrl: "https://drive.google.com/file/d/17BCLPr2vjiWWdYvCpYAXeXLgOBQOvx58/view",
    dateStr: "Month 3 · Week 11",
    location: "Heart to Heart",
    loveNote: "You understand me better than anyone ever has.",
  },
  {
    id: 306,
    seasonNumber: 3,
    episodeNumber: 6,
    title: "Month 3 · Unfiltered Happiness",
    description: "Just being completely ourselves with zero filters and endless warmth.",
    durationMinutes: 6,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/1MIl6D3vklLOlRgs6M4KAmIPheea8w1iG",
    videoUrl: "https://drive.google.com/file/d/1MIl6D3vklLOlRgs6M4KAmIPheea8w1iG/view",
    dateStr: "Month 3 · Week 12",
    location: "Everyday Magic",
    loveNote: "Thank you for loving me for who I am.",
  },
  {
    id: 307,
    seasonNumber: 3,
    episodeNumber: 7,
    title: "Month 3 · Quarter-Year Mark",
    description: "Three months of growing closer every single day and celebrating our bond.",
    durationMinutes: 2,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/1VGIRbWjq_yPlxgHBMoLZQY6jSCPFPY90",
    videoUrl: "https://drive.google.com/file/d/1VGIRbWjq_yPlxgHBMoLZQY6jSCPFPY90/view",
    dateStr: "Month 3 · Milestone",
    location: "Anniversary Corner",
    loveNote: "Three months of pure magic and butterflies.",
  },

  // ==========================================
  // SEASON 4 (Month 4): 4mE0 to 4mE5 (6 episodes)
  // ==========================================
  {
    id: 400,
    seasonNumber: 4,
    episodeNumber: 0,
    title: "Month 4 · Chasing Golden Hours",
    description: "Starting Month 4 with golden light, long walks, and endless warmth.",
    durationMinutes: 3,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/1LZFhILzbrXvWpARI72uUcZp49krdQoe1",
    videoUrl: "https://drive.google.com/file/d/1LZFhILzbrXvWpARI72uUcZp49krdQoe1/view",
    dateStr: "Month 4 · Start",
    location: "Rooftop & City Vistas",
    loveNote: "You bring warmth into every single day.",
  },
  {
    id: 401,
    seasonNumber: 4,
    episodeNumber: 1,
    title: "Month 4 · Exploring the City",
    description: "Strolling through the city with no destination in mind, just enjoying being together.",
    durationMinutes: 3,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/1MDQy3HQzMnDME-YMkpjU4PxMFX76WgDS",
    videoUrl: "https://drive.google.com/file/d/1MDQy3HQzMnDME-YMkpjU4PxMFX76WgDS/view",
    dateStr: "Month 4 · Week 13",
    location: "City Avenues",
    loveNote: "The best journey is any walk with you.",
  },
  {
    id: 402,
    seasonNumber: 4,
    episodeNumber: 2,
    title: "Month 4 · Cozy Café Moments",
    description: "Sharing snacks, taking cute candid videos, and smiling across the table.",
    durationMinutes: 3,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/14y-l4OZ4en8HtUFJNVclBtx5MVnX9Upf",
    videoUrl: "https://drive.google.com/file/d/14y-l4OZ4en8HtUFJNVclBtx5MVnX9Upf/view",
    dateStr: "Month 4 · Week 14",
    location: "Warm Corner Café",
    loveNote: "Every moment with you is sweet and unforgettable.",
  },
  {
    id: 403,
    seasonNumber: 4,
    episodeNumber: 3,
    title: "Month 4 · Warm Hugs & Comfort",
    description: "Finding pure reassurance, safety, and happiness in each other's presence.",
    durationMinutes: 3,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/1X4uQxjEv8ByJKtVXbGdspxPkXHXxhROG",
    videoUrl: "https://drive.google.com/file/d/1X4uQxjEv8ByJKtVXbGdspxPkXHXxhROG/view",
    dateStr: "Month 4 · Week 15",
    location: "Peaceful Evening",
    loveNote: "Your hugs are my safest comfort zone.",
  },
  {
    id: 404,
    seasonNumber: 4,
    episodeNumber: 4,
    title: "Month 4 · Sunset Silhouettes",
    description: "Watching the sky change colors as golden hour fades into starry night.",
    durationMinutes: 4,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/1UnST1cxd5qyDI4feyVRr4vy34FJ9vEma",
    videoUrl: "https://drive.google.com/file/d/1UnST1cxd5qyDI4feyVRr4vy34FJ9vEma/view",
    dateStr: "Month 4 · Week 15",
    location: "Golden Coast",
    loveNote: "The sky is pretty, but you outshine it all.",
  },
  {
    id: 405,
    seasonNumber: 4,
    episodeNumber: 5,
    title: "Month 4 · Four Months Strong",
    description: "Looking back at 4 incredible months of love and shared milestones.",
    durationMinutes: 3,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/1stmI045JdYcO55-8TVXmxNtvnPnD0dbm",
    videoUrl: "https://drive.google.com/file/d/1stmI045JdYcO55-8TVXmxNtvnPnD0dbm/view",
    dateStr: "Month 4 · Milestone",
    location: "Celebration Night",
    loveNote: "Loving you is the easiest and best thing in my life.",
  },

  // ==========================================
  // SEASON 5 (Month 5): 5mE0 to 5mE4 (5 episodes)
  // ==========================================
  {
    id: 500,
    seasonNumber: 5,
    episodeNumber: 0,
    title: "Month 5 · Pure Comfort & Peace",
    description: "Embracing Month 5 with cozy peace, sweet smiles, and genuine comfort.",
    durationMinutes: 3,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/1tahYJTXNXcCJPwClbxj-VqfF6T9BFXKd",
    videoUrl: "https://drive.google.com/file/d/1tahYJTXNXcCJPwClbxj-VqfF6T9BFXKd/view",
    dateStr: "Month 5 · Start",
    location: "Our Safe Haven",
    loveNote: "You are my peace and my favorite feeling.",
  },
  {
    id: 501,
    seasonNumber: 5,
    episodeNumber: 1,
    title: "Month 5 · Blanket Fort & Movie Night",
    description: "Lazy afternoons wrapped under warm blankets, watching our favorite shows.",
    durationMinutes: 8,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/1FY3SxjsLoTvc3A387uzF5KSRhhIrF96j",
    videoUrl: "https://drive.google.com/file/d/1FY3SxjsLoTvc3A387uzF5KSRhhIrF96j/view",
    dateStr: "Month 5 · Week 17",
    location: "Living Room Fort",
    loveNote: "Cozy days with you are my absolute paradise.",
  },
  {
    id: 502,
    seasonNumber: 5,
    episodeNumber: 2,
    title: "Month 5 · Sweet Memories",
    description: "Revisiting our happiest moments and making new unforgettable ones.",
    durationMinutes: 4,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/13ciubIXWZX_uB8OEmq5rngWym4gEP4OG",
    videoUrl: "https://drive.google.com/file/d/13ciubIXWZX_uB8OEmq5rngWym4gEP4OG/view",
    dateStr: "Month 5 · Week 18",
    location: "Every Corner",
    loveNote: "Every memory with you is a precious treasure.",
  },
  {
    id: 503,
    seasonNumber: 5,
    episodeNumber: 3,
    title: "Month 5 · Caring & Supporting",
    description: "Being each other's calm refuge and biggest cheerleaders through everything.",
    durationMinutes: 5,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/1zVQ33UhCzbevJzjtNROQiq-pIibgd45F",
    videoUrl: "https://drive.google.com/file/d/1zVQ33UhCzbevJzjtNROQiq-pIibgd45F/view",
    dateStr: "Month 5 · Week 19",
    location: "Quiet Moments",
    loveNote: "I believe in you and support you always.",
  },
  {
    id: 504,
    seasonNumber: 5,
    episodeNumber: 4,
    title: "Month 5 · Five Months Together",
    description: "Celebrating five wonderful months of warmth, devotion, and unconditional love.",
    durationMinutes: 5,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/14len8GPwqasJDWuoWoZN6BK2swmtpzGB",
    videoUrl: "https://drive.google.com/file/d/14len8GPwqasJDWuoWoZN6BK2swmtpzGB/view",
    dateStr: "Month 5 · Milestone",
    location: "Our Journey",
    loveNote: "Five months of choosing you every single day.",
  },

  // ==========================================
  // SEASON 6 (Month 6): 6mE0 to 6mE5 (6 episodes)
  // ==========================================
  {
    id: 600,
    seasonNumber: 6,
    episodeNumber: 0,
    title: "Month 6 · The Half-Year Milestone",
    description: "Reaching six whole months of laughter, shared goals, and unconditional love.",
    durationMinutes: 3,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/1AnNZOjVY2gF0ozzNKRymCjmJfxg2gmFB",
    videoUrl: "https://drive.google.com/file/d/1AnNZOjVY2gF0ozzNKRymCjmJfxg2gmFB/view",
    dateStr: "Month 6 · Start",
    location: "Half-Year Mark",
    loveNote: "Half a year of pure happiness with my favorite person.",
  },
  {
    id: 601,
    seasonNumber: 6,
    episodeNumber: 1,
    title: "Month 6 · Candlelight & Celebration",
    description: "A special milestone celebration with deep talks, happy tears, and great food.",
    durationMinutes: 10,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/1KyXv4ljpS7M5A_qRn9KcyU_I3GJqRQHu",
    videoUrl: "https://drive.google.com/file/d/1KyXv4ljpS7M5A_qRn9KcyU_I3GJqRQHu/view",
    dateStr: "Month 6 · Anniversary",
    location: "Candlelight Dinner",
    loveNote: "6 months down, a whole lifetime of love to go.",
  },
  {
    id: 602,
    seasonNumber: 6,
    episodeNumber: 2,
    title: "Month 6 · Reminiscing Day 1",
    description: "Looking back at our first photos and smiling at how much we've built together.",
    durationMinutes: 4,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/1RPgT2O3qoMIJkKhgiQduo0SiJ8ftSRod",
    videoUrl: "https://drive.google.com/file/d/1RPgT2O3qoMIJkKhgiQduo0SiJ8ftSRod/view",
    dateStr: "Month 6 · Week 22",
    location: "Photo Memories",
    loveNote: "I'd choose you all over again in a heartbeat.",
  },
  {
    id: 603,
    seasonNumber: 6,
    episodeNumber: 3,
    title: "Month 6 · Golden Ocean Breeze",
    description: "Barefoot in the sand, listening to the gentle ocean waves together.",
    durationMinutes: 9,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/13UyQUwcVqEtlX9CXx8Tb1LwSyrfGT5t-",
    videoUrl: "https://drive.google.com/file/d/13UyQUwcVqEtlX9CXx8Tb1LwSyrfGT5t-/view",
    dateStr: "Month 6 · Week 23",
    location: "Golden Coast",
    loveNote: "My love for you runs deeper than the vast ocean.",
  },
  {
    id: 604,
    seasonNumber: 6,
    episodeNumber: 4,
    title: "Month 6 · Sweet Reminders",
    description: "The little everyday moments that constantly remind us why we belong together.",
    durationMinutes: 5,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/1ZLNnpRKKIdE-wO_3R-6p15Sc1hBq-C0v",
    videoUrl: "https://drive.google.com/file/d/1ZLNnpRKKIdE-wO_3R-6p15Sc1hBq-C0v/view",
    dateStr: "Month 6 · Week 24",
    location: "Everyday Joy",
    loveNote: "You make every single day brighter.",
  },
  {
    id: 605,
    seasonNumber: 6,
    episodeNumber: 5,
    title: "Month 6 · Looking Forward",
    description: "Excited for everything the upcoming months hold for our journey.",
    durationMinutes: 4,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/1xGMcCpLUgfzHlIS_g-2nss3_p3FxmHgj",
    videoUrl: "https://drive.google.com/file/d/1xGMcCpLUgfzHlIS_g-2nss3_p3FxmHgj/view",
    dateStr: "Month 6 · Finale",
    location: "City Skyline",
    loveNote: "The best is yet to come, and I'm so glad it's with you.",
  },

  // ==========================================
  // SEASON 7 (Month 7): 7mE0 to 7mE4 (5 episodes)
  // ==========================================
  {
    id: 700,
    seasonNumber: 7,
    episodeNumber: 0,
    title: "Month 7 · Through Everything",
    description: "Standing by each other's side through every high and low with unbreakable trust.",
    durationMinutes: 3,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/1toBQ_xZZt-I3xoVVQh55syXubxdVjbDu",
    videoUrl: "https://drive.google.com/file/d/1toBQ_xZZt-I3xoVVQh55syXubxdVjbDu/view",
    dateStr: "Month 7 · Start",
    location: "Our Safe Haven",
    loveNote: "You and me against the world, always.",
  },
  {
    id: 701,
    seasonNumber: 7,
    episodeNumber: 1,
    title: "Month 7 · Quiet Strength",
    description: "Gentle hugs, calm peaceful moments, and knowing we have each other's back forever.",
    durationMinutes: 4,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/1hR1wg0SBdqLWiJnfhx82BNUi0UsKEfsH",
    videoUrl: "https://drive.google.com/file/d/1hR1wg0SBdqLWiJnfhx82BNUi0UsKEfsH/view",
    dateStr: "Month 7 · Week 26",
    location: "Quiet Evening",
    loveNote: "You give me so much strength and peace.",
  },
  {
    id: 702,
    seasonNumber: 7,
    episodeNumber: 2,
    title: "Month 7 · Late Night Treats",
    description: "Spontaneous dessert runs at 11 PM and laughing in the parked car.",
    durationMinutes: 4,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/1F2rq2Ogi06-bR6XWpgsIAsQVdcUF1vhp",
    videoUrl: "https://drive.google.com/file/d/1F2rq2Ogi06-bR6XWpgsIAsQVdcUF1vhp/view",
    dateStr: "Month 7 · Week 27",
    location: "Midnight Parking Lot",
    loveNote: "The simplest moments with you are always the most unforgettable.",
  },
  {
    id: 703,
    seasonNumber: 7,
    episodeNumber: 3,
    title: "Month 7 · Shared Dreams",
    description: "Talking about what the future holds and building our beautiful life together.",
    durationMinutes: 4,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/1afQytTeCjdadOj7tzDldI-0I_BiJ0t_a",
    videoUrl: "https://drive.google.com/file/d/1afQytTeCjdadOj7tzDldI-0I_BiJ0t_a/view",
    dateStr: "Month 7 · Week 28",
    location: "Stargazing View",
    loveNote: "My future is only bright because you're in it.",
  },
  {
    id: 704,
    seasonNumber: 7,
    episodeNumber: 4,
    title: "Month 7 · Seven Months of Us",
    description: "Seven months of laughter, warmth, and growing more in love every single day.",
    durationMinutes: 4,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/1y7LeY5jzM2YmHfxv7SpSONiR5NFhONCW",
    videoUrl: "https://drive.google.com/file/d/1y7LeY5jzM2YmHfxv7SpSONiR5NFhONCW/view",
    dateStr: "Month 7 · Milestone",
    location: "Milestone Night",
    loveNote: "Seven months of falling deeper in love every day.",
  },

  // ==========================================
  // SEASON 8 (Month 8 & Specials): Extra / Bonus videos (4 episodes)
  // ==========================================
  {
    id: 801,
    seasonNumber: 8,
    episodeNumber: 1,
    title: "Season 8 · Special Memory I",
    description: "A cherished memory captured along our journey, preserved forever in our archive.",
    durationMinutes: 4,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/1V6SxPOi2MEzNNqAIGHhxfaZRU6PS-LQF",
    videoUrl: "https://drive.google.com/file/d/1V6SxPOi2MEzNNqAIGHhxfaZRU6PS-LQF/view",
    dateStr: "Special Archive",
    location: "Special Moment",
    loveNote: "Every candid moment of you is a masterpiece.",
  },
  {
    id: 802,
    seasonNumber: 8,
    episodeNumber: 2,
    title: "Season 8 · Special Memory II",
    description: "Looking through our favorite video clips and smiling at all our happy memories.",
    durationMinutes: 4,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/1tHp8nLzoq4-URgMAABxgdDEhTJRMsbHr",
    videoUrl: "https://drive.google.com/file/d/1tHp8nLzoq4-URgMAABxgdDEhTJRMsbHr/view",
    dateStr: "Special Archive",
    location: "Archive Reel",
    loveNote: "You make ordinary days feel extraordinary.",
  },
  {
    id: 803,
    seasonNumber: 8,
    episodeNumber: 3,
    title: "Season 8 · Unforgettable Highlight",
    description: "A snapshot of our story in motion. Looking at how much love we share.",
    durationMinutes: 3,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/1yqiqr0aINqQOnG-CKb2s1od1OJkQGQDZ",
    videoUrl: "https://drive.google.com/file/d/1yqiqr0aINqQOnG-CKb2s1od1OJkQGQDZ/view",
    dateStr: "Special Highlight",
    location: "Living Archive",
    loveNote: "Forever grateful for you and our bond.",
  },
  {
    id: 804,
    seasonNumber: 8,
    episodeNumber: 4,
    title: "Season 8 · Season Finale: To Be Continued",
    description: "Eight incredible months of us. To our next chapter, together forever. I love you so much!",
    durationMinutes: 3,
    thumbnailUrl: "https://lh3.googleusercontent.com/d/1hqTI2ReJd8QqEZtDhMLgAvU3qu4oEJ5Y",
    videoUrl: "https://drive.google.com/file/d/1hqTI2ReJd8QqEZtDhMLgAvU3qu4oEJ5Y/view",
    dateStr: "Season Finale",
    location: "From My Heart To Yours",
    loveNote: "To our next chapter, together forever. I love you so much!",
  },
];

// Helper functions for static content and local playback state
export function loadEpisodes(): Episode[] {
  return DEFAULT_EPISODES;
}

export function saveEpisodes(episodes: Episode[]) {
  // Static content configured in code before deployment
}

export function loadSeasons(): SeasonInfo[] {
  return DEFAULT_SEASONS;
}

export function saveSeasons(seasons: SeasonInfo[]) {
  // Static content configured in code before deployment
}

export function loadProfiles(): UserProfile[] {
  return DEFAULT_PROFILES;
}

export function saveProfiles(profiles: UserProfile[]) {
  // Single profile locked to 'Us'
}

export function getActiveProfile(): UserProfile {
  return DEFAULT_PROFILES[0];
}

export function setActiveProfile(profile: UserProfile) {
  // Default active profile is always 'Us'
}

export function getMyList(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MY_LIST);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [100, 101, 201, 301, 601, 701, 804];
}

export function toggleMyList(episodeId: number): boolean {
  const list = getMyList();
  const exists = list.includes(episodeId);
  const updated = exists ? list.filter(id => id !== episodeId) : [...list, episodeId];
  try {
    localStorage.setItem(STORAGE_KEY_MY_LIST, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to toggle my list", e);
  }
  return !exists;
}

export function getWatchHistory(): Record<number, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_WATCH_HISTORY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { 100: 90, 101: 45, 201: 80 };
}

export function saveWatchProgress(episodeId: number, progressPercent: number) {
  const history = getWatchHistory();
  history[episodeId] = Math.min(100, Math.max(0, progressPercent));
  try {
    localStorage.setItem(STORAGE_KEY_WATCH_HISTORY, JSON.stringify(history));
  } catch (e) {
    console.error("Failed to save progress", e);
  }
}

export function resetAllToDefaults() {
  saveEpisodes(DEFAULT_EPISODES);
  saveSeasons(DEFAULT_SEASONS);
  saveProfiles(DEFAULT_PROFILES);
  localStorage.removeItem(STORAGE_KEY_MY_LIST);
  localStorage.removeItem(STORAGE_KEY_WATCH_HISTORY);
}

