// functions.js

// import momentjs from "moment";    // npm i moment --save 
const momentjs = require("moment");    // npm i moment --save 

const f_date_to_nicetime_str = (date) => {
  return momentjs(date).format('YYYY-MMM-DD HH:mm:ss');
};

const f_return_new_array_remove_all_occurences_in_array_of_element = function(old_array, element) {
  // Usage: const {f_return_new_array_remove_all_occurences_in_array_of_element} = require('./lib/functions');
  let my_set = new Set(old_array);
  my_set.delete(element);
  // my_set = my_set.delete(element);
  const new_array = [...my_set];
  return new_array.sort();
};

const f_return_new_array_deduped_sorted = function(old_array) {
  // Usage: const {f_return_new_array_deduped_sorted} = require('./lib/functions');
  let my_set = new Set(old_array);
  const new_array = [...my_set];
  return new_array.sort();
};

const f_get_date_now = function() {
  const date_now = new Date();
  return date_now;
};

const f_get_epoch_now = function() {
  const date_now = f_get_date_now();
  const epoch_now = Math.round( date_now / 1000);
  return epoch_now;
};

const f_get_key_from_object_by_value = function(object, value) {
  return Object.keys(object).find(key => object[key] === value);
};

module.exports = {
  f_return_new_array_remove_all_occurences_in_array_of_element: f_return_new_array_remove_all_occurences_in_array_of_element,
  f_return_new_array_deduped_sorted: f_return_new_array_deduped_sorted,
  f_get_date_now: f_get_date_now,
  f_get_epoch_now: f_get_epoch_now,
  f_get_key_from_object_by_value: f_get_key_from_object_by_value,
  f_date_to_nicetime_str: f_date_to_nicetime_str,
}; 

//-EOF