"use strict";

// Password Encyrption
// pbkdf2 -> password-based key derivation function 2. verilen hash fonksiyonunu arka arkaya (mesela bin kere) uygulama konusunda bir standart tanımlar. bu da bir hash'i kırma süresini normal bir hash'e göre uygulanan tekrar sayısı kadar (mesela bin kat) yükseltir. Guncel projelerde argon2 gibi kdf'lerin kullanilmasi tavsiye edilmektedir.
// https://nodejs.org/docs/latest/api/crypto.html#cryptorandombytessize-callback
const cyrpto = require("node:crypto");
const keyCode =
  process.env?.SECRET_KEY ||
  require("node:crypto").randomBytes(64).toString("hex");
const loopCount = 10_000; // 10000
const charCount = 32; // write 32 for 64 chars
// hexadecimal (hex) formatında, her byte iki karaktere dönüşür. Bu, hexadecimal sistemin 16 tabanlı olması ve bir byte'ın (8 bit) değer aralığının hexadecimalde iki karakter ile ifade edilebilmesiyle alakalıdır.
const encType = "sha512"; // hashing algorithm

module.exports = function (password) {
  // https://nodejs.org/docs/latest/api/crypto.html#cryptopbkdf2syncpassword-salt-iterations-keylen-digest
  // crypto.pbkdf2Sync(password, salt, iterations, keylen, digest)
  // If an error occurs an Error will be thrown, otherwise the derived key will be returned as a Buffer.
  // Buffer'i string'e cevirmek icin toString('hex') kullanilir.
  return cyrpto
    .pbkdf2Sync(password, keyCode, loopCount, charCount, encType)
    .toString("hex");

  // console.log(encrypted); // c4cd81e0ad804ef22d3cfad54bc8486af66ec6531440157498a49584195ca66d
};
