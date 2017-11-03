/* global localStorage */
export default {
  uuid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
  },

  pluralize(count, word) {
    return count === 1 ? word : `${word}s`;
  },

  store(namespace, data) {
    if (typeof window !== 'undefined') {
      if (data) {
        return localStorage.setItem(namespace, JSON.stringify(data));
      }

      const store = localStorage.getItem(namespace);
      return (store && JSON.parse(store)) || [];
    }
    return [];
  },
};
