// Topic mapping utility
// Maps tags to predefined topic buckets

const tagToTopicMap = {
  // Tech
  'javascript': 'Tech',
  'python': 'Tech',
  'react': 'Tech',
  'node': 'Tech',
  'webdev': 'Tech',
  'programming': 'Tech',
  'coding': 'Tech',
  'software': 'Tech',
  'developer': 'Tech',
  'code': 'Tech',
  'tech': 'Tech',

  // AI
  'ai': 'AI',
  'artificialintelligence': 'AI',
  'machinelearning': 'AI',
  'ml': 'AI',
  'deeplearning': 'AI',
  'neuralnetwork': 'AI',
  'chatgpt': 'AI',
  'openai': 'AI',
  'gpt': 'AI',

  // Business
  'business': 'Business',
  'startup': 'Business',
  'entrepreneur': 'Business',
  'marketing': 'Business',
  'sales': 'Business',
  'corporate': 'Business',

  // Design
  'design': 'Design',
  'ui': 'Design',
  'ux': 'Design',
  'graphicdesign': 'Design',
  'photography': 'Design',
  'art': 'Design',
  'creative': 'Design',
  'illustration': 'Design',

  // Fitness
  'fitness': 'Fitness',
  'health': 'Fitness',
  'workout': 'Fitness',
  'gym': 'Fitness',
  'running': 'Fitness',
  'yoga': 'Fitness',
  'nutrition': 'Fitness',
  'wellness': 'Fitness',

  // Gaming
  'gaming': 'Gaming',
  'games': 'Gaming',
  'gamer': 'Gaming',
  'esports': 'Gaming',
  'twitch': 'Gaming',
  'stream': 'Gaming',
  'pcgaming': 'Gaming',

  // Finance
  'crypto': 'Finance',
  'bitcoin': 'Finance',
  'ethereum': 'Finance',
  'blockchain': 'Finance',
  'trading': 'Finance',
  'stocks': 'Finance',
  'investing': 'Finance',
  'finance': 'Finance',

  // Lifestyle
  'lifestyle': 'Lifestyle',
  'travel': 'Lifestyle',
  'food': 'Lifestyle',
  'fashion': 'Lifestyle',
  'beauty': 'Lifestyle',
  'home': 'Lifestyle',
  'family': 'Lifestyle',

  // Memes
  'meme': 'Memes',
  'memes': 'Memes',
  'funny': 'Memes',
  'humor': 'Memes',
  'lol': 'Memes',
  'joke': 'Memes',
};

/**
 * Maps an array of tags to topic buckets
 * @param {string[]} tags - Array of tag strings
 * @returns {string[]} - Array of unique topic names (max 3)
 */
function mapTagsToTopics(tags) {
  if (!tags || !Array.isArray(tags)) return [];

  const topics = new Set();

  tags.forEach(tag => {
    const normalizedTag = tag.toLowerCase().replace(/[^a-z0-9]/g, '');
    const topic = tagToTopicMap[normalizedTag];
    if (topic) {
      topics.add(topic);
    }
  });

  // Convert to array and limit to 3 topics max
  return Array.from(topics).slice(0, 3);
}

module.exports = {
  mapTagsToTopics,
  tagToTopicMap,
};