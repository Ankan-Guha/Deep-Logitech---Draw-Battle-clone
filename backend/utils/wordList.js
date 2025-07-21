const words = [
  "apple", "banana", "cherry", "date", "elderberry",
  "fig", "grape", "honeydew", "kiwi", "lemon",
  "car", "bicycle", "airplane", "boat", "train",
  "house", "bridge", "castle", "igloo", "tent",
  "sun", "moon", "star", "cloud", "rain",
  "cat", "dog", "fish", "bird", "lion"
];

export const getRandomWord = () => {
  return words[Math.floor(Math.random() * words.length)];
}; 