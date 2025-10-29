// src/components/CreateElemt.tsx
import React from "react";

interface CreateElemtProps {
  prompt: string;
}

const CreateElemt: React.FC<CreateElemtProps> = ({ prompt }) => {
  return React.createElement(
    "p",
    {
      key: prompt,
      className: "break-words",
    },
    prompt
  );
};

export default CreateElemt;