const fs = require("fs");
const path = require("path");

exports.saveData = (image, feedback) => {
  const timestamp = Date.now();

  // Save image
  const imageExt = path.extname(image.originalname);
  const imageName = `image_${timestamp}${imageExt}`;
  const imagePath = path.join(__dirname, "../assets/images/", imageName);

  fs.renameSync(image.path, imagePath);

  // Save feedback
  const feedbackName = `feedback_${timestamp}.json`;
  const feedbackPath = path.join(__dirname, "../assets/feedback/", feedbackName);

  fs.writeFileSync(
    feedbackPath,
    JSON.stringify({ feedback }, null, 2),
    "utf-8"
  );
};
