const fs = require("fs");

// with given files and indexes to delete, delete them
module.exports = deleteIndexedImages = (files, indexes) => {
  indexes.map((index) => {
    try {
      fs.unlinkSync(files[index]);
    } catch (error) {
      return error;
    }
  });
};
