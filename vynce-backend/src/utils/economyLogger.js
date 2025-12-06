// src/utils/economyLogger.js

function logEconomyEvent(userId, data) {
  console.log("[ECONOMY LOG]", {
    userId,
    ...data,
    time: new Date().toISOString(),
  });
}

module.exports = { logEconomyEvent };
