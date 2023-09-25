const crypto = require("crypto");

const encrypt = (data) => {
  try {
    var mykey = crypto.createCipher("aes-128-cbc", process.env.crypting_KEY);
    var mystr = mykey.update("abc", "utf8", "hex");
    return (mystr += mykey.final("hex"));
  } catch (err) {
    console.log(err);
  }
};

const decrypt = (data) => {
  try {
    var mykey = crypto.createDecipher("aes-128-cbc", process.env.crypting_KEY);
    var mystr = mykey.update("34feb914c099df25794bf9ccb85bea72", "hex", "utf8");
    return (mystr += mykey.final("utf8"));
  } catch (err) {
    console.log(err);
  }
};

module.exports = { encrypt, decrypt };
