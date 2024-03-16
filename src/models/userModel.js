"use strict";

const mongoose = require("mongoose");
const { Schema, model, models } = mongoose;
const passwordEncrypt = require("../helpers/passwordEncrypt");
const CustomError = require("../errors/customError");

const userSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      required: [true, "Email field is required"], // custom error message
      unique: true,
      validate: [
        (email) => {
          if (
            // Number(null) = 0 -> null < 2 true -> 0 < 2 , null > 2 false -> 0 > 2
            email.match(/@/g)?.length != 1 || // match ile null donebilecegi icin optional chaining
            !/^[_.a-z0-9]{4,}@[a-z0-9.]{4,}$/.test(email)
          )
            throw new CustomError("Invalid email pattern", 400);

          let [username, domainSubdomainTLD] = email.split("@");
          let errors = [];

          // Username kontrolleri
          if (/^[_.]/.test(username))
            errors.push("Username can't start with an underscore or a dot.");
          if (/[_.]$/.test(username))
            errors.push("Username can't end with an underscore or a dot.");
          if (/[_.]{2,}/.test(username))
            errors.push(
              "Username can't contain consecutive underscores or dots."
            );
          if (!username.match(/[a-z]/g))
            errors.push("Username must contain at least 1 lowercase letter.");
          if (!/[a-z0-9_.]{4,}/.test(username))
            errors.push(
              "Username must contain at least 4 characters. Only lowercase letters, digits, dots and underscores are allowed."
            );

          // Domain ve TLD kontrolleri
          if (domainSubdomainTLD.match(/\./g)?.length > 2)
            errors.push("Subdomain-Domain-TLD is not valid.");
          if (!/^[a-z0-9]+\./.test(domainSubdomainTLD))
            errors.push("Domain/Subdomain is not valid.");
          if (
            domainSubdomainTLD.match(/\./g)?.length === 2 &&
            !/\.[a-z0-9]+\./.test(domainSubdomainTLD)
          )
            errors.push("Domain is not valid.");
          if (
            domainSubdomainTLD.match(/\./g)?.length < 1 ||
            domainSubdomainTLD.endsWith(".") ||
            !/\.[a-z]{1,3}$/.test(domainSubdomainTLD)
          )
            errors.push("TLD is not valid.");

          if (errors.length) {
            throw new CustomError(errors.join(" "), 400);
          }
          return true;
        },
        // "Email must be valid.", // hata durumunda CustomError firlatildigi icin default hata mesajina gerek kalmaz
      ],
    },
    pass: {
      type: String,
      trim: true,
      required: true,
      // Mongoose'da setter validate'ten once calistigi icin her ikisi de olacaksa setter'da toplanmalidir. Ancak setter'da firlatilan error'lar express instance'i tarafindan yakalanmaz, bunun icin de pre save kullanilmalidir.
    },

    firstName: String,

    lastName: String,
  },
  { collection: "user", timestamps: true }
);

// Password belirlenen pattern'e uygunsa save yapilsin
// https://mongoosejs.com/docs/middleware.html#pre
userSchema.pre("save", function (next) {
  const user = this;
  if (user.isModified("pass")) {
    // Şifreleme işlemi
    if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,16}/.test(user.pass)) {
      // Bu hata doğrudan route handler tarafından yakalanabilir
      throw new CustomError(
        "Password must contain at least 1 uppercase & lowercase letter, 1 digit, 1 special character and must be between 8 and 16 characters in total.",
        400
      );
    }
    user.pass = passwordEncrypt(user.pass);
  }
  next();
});

const User = models.User || model("User", userSchema);

module.exports = User;
