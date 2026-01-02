const DropComment = require("../models/DropComment");
const Drop = require("../models/Drop");

/* CREATE DROP COMMENT */
exports.createDropComment = async (req, res) => {
  try {
    const { dropId } = req.params;
    const { content } = req.body;
    const userId = req.userId;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Comment content required" });
    }

    const drop = await Drop.findById(dropId);
    if (!drop) {
      return res.status(404).json({ message: "Drop not found" });
    }

    const comment = await DropComment.create({
      drop: dropId,
      author: userId,
      content,
    });

    drop.commentsCount += 1;
    await drop.save();

    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create comment" });
  }
};

/* GET DROP COMMENTS */
exports.getDropCommentsByDrop = async (req, res) => {
  try {
    const { dropId } = req.params;

    const comments = await DropComment.find({ drop: dropId })
      .populate("author", "username displayName uid")
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};

/* DELETE DROP COMMENT */
exports.deleteDropComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const comment = await DropComment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.author.toString() !== userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await DropComment.deleteOne({ _id: id });

    await Drop.findByIdAndUpdate(comment.drop, {
      $inc: { commentsCount: -1 },
    });

    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete comment" });
  }
};