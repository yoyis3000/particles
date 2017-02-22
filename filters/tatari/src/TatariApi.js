import axios from 'axios';

const token = window.document.querySelector('meta[name="csrf-token"]')
          && window.document.querySelector('meta[name="csrf-token"]').content;
const CSRFHEADER = { headers: { 'X-CSRF-TOKEN': token } };

export const get = (url, params) =>
  axios.get(url, {...CSRFHEADER, params});

export const patch = (url, params, config) =>
  axios.patch(url, params, {...CSRFHEADER, ...config });
