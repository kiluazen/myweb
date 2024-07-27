import Commerce from '@chec/commerce.js';

const commerceConfig = {
  axiosConfig: {
    headers: {
      'X-Chec-Agent': 'commerce.js/v2',
      'Chec-Version': '2021-09-29',
    },
  },
};

export const commerce = new Commerce(
  'pk_test_57878be583f94b0cdc35ee4f1f7d5e731836e4b0d7a1f',
  true,
  commerceConfig
);

console.log('Commerce instance:', commerce);