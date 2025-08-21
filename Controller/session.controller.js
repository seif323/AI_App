const Session = require("../Models/session.model");

// Get all sessions for a user
exports.getUserSessions = async (req, res) => {
  try {
    const { userId } = req.params;
    const sessions = await Session.find({ userId }).sort({ sessionStart: -1 });

    //clac duration
    const formattedSessions = sessions.map(s => {
      const duration = (s.sessionEnd - s.sessionStart) / (1000 * 60); // minutes
      return {
        id: s._id,
        userId: s.userId,
        sessionStart: s.sessionStart,
        sessionEnd: s.sessionEnd,
        duration,
        focusLevel: s.focusLevel,
        feedback: s.feedback,
        rawData: s.rawData,
      };
    });

    return res.status(200).json(formattedSessions);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Get session statistics for a user
exports.getUserSessionStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const sessions = await Session.find({ userId });

    if (sessions.length === 0) {
      return res.status(200).json({
        totalSessions: 0,
        averageDuration: 0,
        averageFocus: 0,
        lastSessionDate: null,
      });
    }

    //calc values
    const totalSessions = sessions.length;

    const durations = sessions.map(
      s => (s.sessionEnd - s.sessionStart) / (1000 * 60) // minutes
    );
    const totalDuration = durations.reduce((sum, d) => sum + d, 0);
    const averageDuration = totalDuration / totalSessions;

    // if focus exsit clac median
    const allFocus = sessions.flatMap(s => s.focusLevel || []);
    const averageFocus =
      allFocus.length > 0
        ? allFocus.reduce((sum, f) => sum + f, 0) / allFocus.length
        : 0;

    const lastSessionDate = sessions[sessions.length - 1].sessionEnd;

    return res.status(200).json({
      totalSessions,
      averageDuration,
      averageFocus,
      lastSessionDate,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
