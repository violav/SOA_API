'use strict';

module.exports = {
  env: 'development',
    db: 'mongodb+srv://AdminViola:asaAOvIzUmBCzHd3@cluster0.msu04.mongodb.net/Unimi_DB', //'mongodb://localhost/node-api-jwt',  //
  port: process.env.PORT || 4000,
  jwtIssuer: 'www.yourdomainname.com',
    jwtExpires: 86400 // Numeric seconds expiry (86400 = '1d'). If string supplied, you provide units (e.g., "8h") // 
};
