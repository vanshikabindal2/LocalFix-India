const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeImage = async (req, res) => {
  try {
    console.log("AI Image Request Received");

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    console.log("File Name:", req.file.originalname);
    console.log("Mimetype:", req.file.mimetype);
    console.log("File Size:", req.file.size);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const base64Image = req.file.buffer.toString("base64");

    const prompt = `
Analyze this image for a local civic problem.

Identify:
1. Category
2. Description
3. Severity
4. Priority

Allowed categories:
Pothole,
Street Light,
Water Leakage,
Garbage,
Drainage/Sewer,
Traffic Signal,
Fallen Tree,
Electrical Issue,
Stray Animal,
Dangerous Building,
Waterlogging,
Other.

Severity must be:
Low, Medium, High, or Critical.

Priority must be:
Low, Medium, High, or Critical.

Return ONLY valid JSON:

{
  "category": "",
  "description": "",
  "severity": "",
  "priority": ""
}

Do not invent information that cannot reasonably be seen in the image.
`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: req.file.mimetype,
          data: base64Image,
        },
      },
    ]);

    const responseText = result.response.text();

    console.log("Gemini Response:", responseText);

    const cleanedResponse = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const aiResult = JSON.parse(cleanedResponse);

    res.status(200).json({
      success: true,
      data: aiResult,
    });

  } catch (error) {
    console.error("AI Error:", error);

    res.status(500).json({
      success: false,
      message: "AI analysis failed",
      error: error.message,
    });
  }
};

module.exports = {
  analyzeImage,
};