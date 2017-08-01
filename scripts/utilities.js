var forEach = function (array, callback) {
  for (var i = 0; i < array.length; i++) {
    console.log("Printing for " + i);
    callback(array[i]);
  };
};
