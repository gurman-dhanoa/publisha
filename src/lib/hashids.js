// @/lib/hashids.js
import Hashids from 'hashids';

// Use an environment variable for the salt in production
// The '8' ensures the generated hash is at least 8 characters long
const hashids = new Hashids(process.env.NEXT_PUBLIC_HASH_SALT || 'publisha-editorial-salt', 8);

export const encodeId = (id) => {
  if (!id) return null;
  return hashids.encode(id);
};

export const decodeId = (hash) => {
  if (!hash) return null;
  // decode returns an array, we just need the first number
  const decoded = hashids.decode(hash);
  return decoded.length > 0 ? decoded[0] : null;
};