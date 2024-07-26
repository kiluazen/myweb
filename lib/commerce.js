import Commerce from '@chec/commerce.js';

const commercePublicKey = process.env.PUBLIC_KEY;
console.log('Public Key:', process.env.PUBLIC_KEY)
if (!commercePublicKey) {
  throw new Error('Commerce.js public key is missing. Please add PUBLIC_KEY to your environment variables.');
}

export const commerce = new Commerce(commercePublicKey);