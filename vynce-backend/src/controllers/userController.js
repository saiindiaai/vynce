// Central exports for backward compatibility
// All user-related operations are now split across specialized controllers

module.exports = {
  // Auth operations (register, login, guest, logout)
  ...require("./authController"),

  // Profile operations (getMe, profile updates, account info)
  ...require("./profileController"),

  // Aura & stats operations (user stats, aura calculations)
  ...require("./auraController"),

  // Resource operations (energy, celestium, showcase, apps, notifications)
  ...require("./resourceController"),

  // Social operations (follow, unfollow, search, notifications)
  ...require("./socialController"),
};
