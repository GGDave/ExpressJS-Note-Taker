// this section of code will generate a random 4 digit hexadecimal string to be used to identify a new post.
module.exports = () =>
  Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);