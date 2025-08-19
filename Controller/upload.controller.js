const storageService = require("../Services/upload.service");

exports.uploadData = (req, res) => {
  try {
    const image = req.file;
    const feedback = req.body.feedback;

    if (!image || !feedback) {
      return res.status(400).json({
        success: false,
        message: "Image and feedback are required",
      });
    }

    storageService.saveData(image, feedback);

    return res.status(200).json({
      success: true,
      message: "Data saved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
