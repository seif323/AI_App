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


//post to start session
exports.startsession = async (req, res)=>{
  const requestingId = req.user
  let session = new Session(
    {
      userId: requestingId._id,
      sessionStart: Date.now(),
      status:"active",
      feedback: req.body.feedback,
      focusLevel: req.body.focusLevel
    }
  );    
  try {
      let newSession = await session.save();
      res.status(201).json({message: "Session created successfully", newSession});
  }catch (error) {
      res.status(400).json({ message: "Error creating Session", error: error.message });
  }
}


//patch session
// PATCH /sessions/:id/end
exports.endSession = async (req, res) => {
  try {
    const { id } = req.params;

    //sreach for session from database
    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // update time and date and status
    session.sessionEnd = Date.now();
    session.status = "completed";
    await session.save();
    //clac duration
    const duration = (session.sessionEnd - session.sessionStart) / (1000 * 60)
    res.status(200).json({
      message: "Session ended successfully",
      session: {
        id: session._id,
        userId: session.userId,
        sessionStart: session.sessionStart,
        sessionEnd: session.sessionEnd,
        duration,
        status: session.status,
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error ending session", error: error.message });
  }
};


// DELETE /sessions/:id
exports.deleteSession = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the session by ID
    const deletedSession = await Session.findByIdAndDelete(id);

    if (!deletedSession) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.status(200).json({ message: "Session deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting session", error: error.message });
  }
};

