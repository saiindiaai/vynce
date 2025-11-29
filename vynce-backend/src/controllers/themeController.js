const User = require("../models/User");

exports.setTheme = async (req, res) => {
  try {
    const { theme } = req.body;
    const userId = req.user.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { theme },
      { new: true }
    );

    res.json({ message: "Theme updated", theme: user.theme });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
