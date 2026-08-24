import React, { useState } from "react";
import ProblemForm from "../components/ProblemForm";
import AiLocalAssistant from "../components/AiLocalAssistant";
import AreaAlert from "../components/AreaAlert";
function ReportProblem() {
  const [aiData, setAiData] = useState(null);

  return (
    <>
    <AreaAlert/>
      {/* 🤖 AI Assistant - Separate */}
      <AiLocalAssistant
        onAnalysis={(data) => {
          console.log("AI Result:", data);
          setAiData(data);
        }}
      />

      {/* 📝 Normal Complaint Form */}
      <ProblemForm initialData={aiData} />
    </>
  );
}

export default ReportProblem;