const axios = require("axios");

// Stable URL for Gemini - Using verified model gemini-2.5-flash
const getGeminiUrl = () => {
    return `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
};

exports.generateIQACReport = async (req, res) => {
  try {
    const { 
        title, description, date, time, venue, duration, department,
        rpName, rpDesignation, rpExperience, rpQualification
    } = req.body;

    if (!title || !description) {
        return res.status(400).json({ message: "Event Title and Description are required." });
    }

    // console.log(`[IQAC] Generating Masterpiece Report for: ${title}`);

    const prompt = `
Generate a professional, high-standard IQAC (Internal Quality Assurance Cell) report for an academic event.
Use a formal, authoritative, and academic tone.

PROJECT DETAILS:
- Institution: Sacred Heart College (Autonomous), Tirupattur
- Department: ${department || 'N/A'}
- Event Type: Skill Empowerment Session
- Event Title: ${title}
- Date: ${date || 'TBD'}
- Time: ${time || 'TBD'}
- Venue: ${venue || 'TBD'}
- Duration: ${duration || 'TBD'}

RESOURCE PERSON:
- Name: ${rpName || 'N/A'}
- Designation: ${rpDesignation || 'N/A'}
- Experience: ${rpExperience || 'N/A'}
- Qualification: ${rpQualification || 'N/A'}

EVENT CONTEXT:
${description}

STRICT REPORT STRUCTURE TO GENERATE:
1. INTRODUCTION: Contextualize the event's importance in the academic setting.
2. OBJECTIVES: Clear pedagogical goals for this session.
3. EVENT DESCRIPTION / FLOW: A detailed narrative of the session's proceedings.
4. DAY-WISE BREAKDOWN: (If duration is more than 1 day, provide separate summaries; otherwise, provide a chronological session flow).
5. PARTICIPATION & LEARNING OUTCOME: Quantitative and qualitative impact on participants.
6. AGENDA SUMMARY: A structured list of topic sequences.
7. CONCLUSION: Final impact assessment and Future scope.

FORMATTING INSTRUCTIONS:
- Use clean headers (e.g., "1. INTRODUCTION").
- Do NOT use markdown stars (**).
- Ensure the language is suitable for university-level record keeping.
- Provide the full text for the report body only.
`;

    const response = await axios.post(getGeminiUrl(), {
      contents: [{ parts: [{ text: prompt }] }],
    }, { timeout: 45000 });

    if (!response.data || !response.data.candidates || response.data.candidates.length === 0) {
      throw new Error("No content received from Gemini AI.");
    }

    const report = response.data.candidates[0].content.parts[0].text;
    res.json({ report });

  } catch (error) {
    if (error.response) {
        console.error(`[Gemini Error] Status: ${error.response.status}`, JSON.stringify(error.response.data));
        res.status(error.response.status).json({ 
            message: "AI Generation Error", 
            error: error.response.data?.error?.message || "Internal AI Error" 
        });
    } else {
        console.error(`[IQAC Sync Error] ${error.message}`);
        res.status(500).json({ message: "System failed to process report request", error: error.message });
    }
  }
};

exports.modifyIQACReport = async (req, res) => {
  try {
    const { currentReport, instruction } = req.body;

    const prompt = `
I have a formal academic IQAC report draft. Please modify/refine it based on this instruction: "${instruction}"
---
${currentReport}
---
Keep the strict academic structure. Return ONLY the full updated report text.
`;

    const response = await axios.post(getGeminiUrl(), {
      contents: [{ parts: [{ text: prompt }] }],
    });

    const modifiedReport = response.data.candidates[0].content.parts[0].text;
    res.json({ report: modifiedReport });

  } catch (error) {
    console.error("[IQAC Refine Error]", error.message);
    res.status(500).json({ message: "AI Refinement failed", error: error.message });
  }
};
