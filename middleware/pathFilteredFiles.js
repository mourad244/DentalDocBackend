const _ = require("lodash");

const pathFilteredFiles = (files, fieldname) => {
  for (let item in files) {
    console.log(fieldname);
    return _.filter(files[item], { fieldname: fieldname }).map((file) => {
      file.path;
    });
  }
};

module.exports = pathFilteredFiles;
