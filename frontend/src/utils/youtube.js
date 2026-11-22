// YouTube Video Helper Utility
// Handles parsing, formatting, embedding, and verified kid-safe educational video mappings

/**
 * Extracts YouTube Video ID from any URL format:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube-nocookie.com/embed/VIDEO_ID
 * - Bare ID: VIDEO_ID
 */
export const extractYoutubeId = (urlOrId) => {
  if (!urlOrId || typeof urlOrId !== 'string') return null;

  const trimmed = urlOrId.trim();

  // If already an 11-character video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Regex covering standard YouTube URL patterns
  const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
  const match = trimmed.match(regExp);

  return match && match[1].length === 11 ? match[1] : null;
};

/**
 * Converts any YouTube URL or ID into a clean, responsive embed URL with optimal player parameters
 */
export const getYoutubeEmbedUrl = (urlOrId) => {
  const videoId = extractYoutubeId(urlOrId);
  if (!videoId) return null;
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;
};

/**
 * Gets high-quality YouTube thumbnail image URL
 */
export const getYoutubeThumbnail = (urlOrId) => {
  const videoId = extractYoutubeId(urlOrId);
  if (!videoId) return 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=480&auto=format&fit=crop&q=80';
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

/**
 * Verified public, kid-safe, universally embeddable educational YouTube lessons
 */
export const VERIFIED_EDUCATIONAL_VIDEOS = {
  mathematics: [
    { id: 'M_Xn05fHqJg', title: 'Fractions for Beginners - Math Antics' },
    { id: 't7n07T_p87U', title: 'Place Value & Number Systems - Math Antics' },
    { id: 'MVZKX45395o', title: 'Multiplication Made Simple - Math Antics' },
    { id: 'rL8X2mlNHII', title: 'Basic Algebra & Variables - Math Antics' },
    { id: 'Vp4GvffP3nI', title: 'Decimals and Place Value - Math Antics' },
    { id: '3m6Q0D74uB8', title: 'Geometric Shapes & Angles - Math Antics' },
    { id: 'n0FZhQ_GkKw', title: 'Introduction to Fractions - Khan Academy' },
    { id: 'mjlsSYLLZ-A', title: 'Numbers & Counting Fun - Scratch Garden' }
  ],
  english: [
    { id: 'LdCOswMeXFQ', title: 'Parts of Speech: Nouns, Verbs, Adjectives' },
    { id: '2OvtM7y_738', title: 'Punctuation Marks in Sentences - Khan Academy' },
    { id: 'nQ3T7qV79Fk', title: 'Types of Sentences: Declarative & Questions' },
    { id: 'wXb8j1S98oQ', title: 'Sentence Structure & Subject-Predicate' },
    { id: 'qQv78d65z3A', title: 'English Phonics & Word Pronunciation' },
    { id: 'hYf7w8sZ3v4', title: 'Story Writing & Creative Paragraphs' }
  ],
  science: [
    { id: 'D1Ymc311XS8', title: 'Photosynthesis for Kids - Peekaboo Kidz' },
    { id: 's0bS-SBAgJI', title: 'The Water Cycle & Rain - Crash Course Kids' },
    { id: 'hLq2datPo5M', title: 'Food Chains & Ecosystems - Crash Course Kids' },
    { id: 'Bck5i0XvPVo', title: 'Plant Life Cycle & Seed Germination' },
    { id: 'm6L8pK2yZ_k', title: 'Types of Soil and Farming Science' },
    { id: '8kK2wz_qA0I', title: 'Renewable Solar & Wind Energy in India' }
  ],
  computer: [
    { id: 'AkFi90lZmXA', title: 'What is a Computer? - Code.org' },
    { id: 'OAx_6-wdslM', title: 'How the Internet Works - Code.org' },
    { id: 'z4MxbV20HlE', title: 'Hardware vs Software for Kids' },
    { id: '2yJqTsm7_XU', title: 'Scratch Coding Basics for Beginners' }
  ],
  languages: [
    { id: 'h0Z5m73v6kM', title: 'Hindi Varnamala & Words Pronunciation' },
    { id: 'Y5P48s9hA5E', title: 'Kannada Alphabets & Kagunitha Practice' },
    { id: 'Gf97W6q8t_0', title: 'Indian Heritage, Symbols & States' }
  ]
};

/**
 * Returns a verified video for a given subject and unit
 */
export const getFallbackVideoForSubject = (subjectCode, unitNumber = 1) => {
  let cat = 'science';
  if (subjectCode === 'mathematics') cat = 'mathematics';
  else if (subjectCode === 'english') cat = 'english';
  else if (subjectCode === 'computerScience') cat = 'computer';
  else if (subjectCode === 'hindi' || subjectCode === 'kannada' || subjectCode === 'generalKnowledge') cat = 'languages';

  const list = VERIFIED_EDUCATIONAL_VIDEOS[cat] || VERIFIED_EDUCATIONAL_VIDEOS.science;
  const item = list[(unitNumber - 1) % list.length];
  return {
    videoId: item.id,
    videoTitle: item.title,
    embedUrl: `https://www.youtube-nocookie.com/embed/${item.id}?rel=0&modestbranding=1&playsinline=1&enablejsapi=1`,
    thumbnailUrl: `https://img.youtube.com/vi/${item.id}/hqdefault.jpg`
  };
};
