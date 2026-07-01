export const logger = {
  info(message) {
    console.log(`ℹ️  ${message}`);
  },

  success(message) {
    console.log(`✅ ${message}`);
  },

  warn(message) {
    console.warn(`⚠️  ${message}`);
  },

  error(message, error = null) {
    console.error(`❌ ${message}`);

    if (error) {
      console.error(error);
    }
  },
};