const axios = require("axios");

exports.generateSESReport = async (req, res) => {
  try {
    const { eventDetails, feedbackSummary } = req.body;

    const prompt = `
Generate a professional SES Report for:
Event: ${eventDetails}
Feedback: ${feedbackSummary}
`;

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
      process.env.GEMINI_API_KEY,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
    );

    const report = response.data.candidates[0].content.parts[0].text;

    res.json({ report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
