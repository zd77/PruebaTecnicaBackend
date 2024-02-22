var bcrypt = require('bcrypt');
var CryptoJS = require('crypto-js');

const saltRounds = process.env.BCRYPT_SALT_ROUNDS || 12;

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(Number(saltRounds));
  return await bcrypt.hash(password, salt);
};

export const compareHashedPassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

export function decrypt(data: string) {
  try {
    var bytes = CryptoJS.AES.decrypt(data, process.env.SecretKeyCrypto);
    var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedData;
  } catch (error) {
    return null;
  }
}

export async function encrypt(data: string) {
  var ciphertext = CryptoJS.AES.encrypt(
    data,
    process.env.SecretKeyCrypto
  ).toString();
  return ciphertext;
}
