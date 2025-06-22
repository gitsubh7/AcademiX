// utils/getDocId.js
export const getDocId = (doc) => doc._id ?? doc.id;     // fallback
