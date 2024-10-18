"use client";

import React, { useRef, useEffect } from "react";

const OtpInput = ({ id, handleChange, value }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("text");
    if (pasteData.length === 8) {
      pasteData.split("").forEach((char, index) => {
        const input = document.getElementById(`otp${index + 1}`);
        if (input) {
          input.value = char;
          handleChange({ target: { value: char } }, `otp${index + 1}`);
        }
      });
    }
  };

  return (
    <input
      id={id}
      type="text"
      maxLength="1"
      value={value}
      onChange={(e) => handleChange(e, id)}
      onPaste={handlePaste}
      ref={inputRef}
      className="w-8 h-8 text-center border border-gray-300 rounded-md"
    />
  );
};

export default OtpInput;
