// Test script for topic mapping
const { mapTagsToTopics } = require('./topicMapper');

console.log('Testing topic mapping...');

// Test cases
const testCases = [
  { tags: ['javascript', 'react', 'webdev'], expected: ['Tech'] },
  { tags: ['ai', 'machinelearning', 'gpt'], expected: ['AI'] },
  { tags: ['business', 'startup', 'finance'], expected: ['Business', 'Finance'] },
  { tags: ['gaming', 'twitch', 'esports'], expected: ['Gaming'] },
  { tags: ['fitness', 'workout', 'health'], expected: ['Fitness'] },
  { tags: ['design', 'ui', 'ux'], expected: ['Design'] },
  { tags: ['meme', 'funny', 'lol'], expected: ['Memes'] },
  { tags: ['lifestyle', 'travel', 'food'], expected: ['Lifestyle'] },
  { tags: ['crypto', 'bitcoin', 'blockchain'], expected: ['Finance'] },
  { tags: ['unknown', 'random', 'tags'], expected: [] },
];

testCases.forEach((testCase, index) => {
  const result = mapTagsToTopics(testCase.tags);
  const passed = JSON.stringify(result.sort()) === JSON.stringify(testCase.expected.sort());
  console.log(`Test ${index + 1}: ${passed ? '✅' : '❌'} Tags: [${testCase.tags.join(', ')}] → Topics: [${result.join(', ')}]`);
});

console.log('\nTopic mapping test completed!');