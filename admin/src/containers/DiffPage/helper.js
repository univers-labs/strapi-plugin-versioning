const { isEmpty } = require('lodash');
const sortKeys = require('sort-keys');

const getComparisonString = (entry) => {
  const normalizedEntry = sortKeys(entry, { deep: true });
  const internalFields = [
    'created_at',
    'created_by',
    'updated_at',
    'updated_by',
    'published_at',
  ];
  for (const field of internalFields) {
    delete normalizedEntry[field];
  }
  return JSON.stringify(normalizedEntry, null, 2);
};

const normalizeObject = (entry, attributes) => {
  const obj = {};
  const attrList = (Object.keys(attributes ?? entry)).sort();
  for (const attr of attrList) {
    obj[attr] = entry[attr] ?? null;
  }
  return removeInternalFields(obj);
};

const removeInternalFields = (obj) => {
  const keysToRemove = new Set(['_id', '__v', 'id']);
  if (Array.isArray(obj)) {
    obj = obj.map(removeInternalFields);
  } else if (typeof obj === 'object' && !isEmpty(obj)) {
    for (const key in obj) {
      if (keysToRemove.has(key)) {
        delete obj[key];
      } else {
        obj[key] = removeInternalFields(obj[key]);
      }
    }
  }
  return obj;
};

module.exports = {
  getComparisonString,
  normalizeObject,
};
