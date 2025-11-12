import { X } from "lucide-react";
import { useState } from "react";

export default function TagInputField({
  label,
  values = [],
  onChange,
  placeholder = "Digite e pressione Enter",
  required = false,
  testid = ""
}) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if (["Enter", "Tab", ","].includes(e.key)) {
      e.preventDefault();
      const value = inputValue.trim();
      if (value && !values.includes(value)) {
        onChange([...values, value]);
      }
      setInputValue("");
    }
  };

  const removeTag = (tag) => {
    onChange(values.filter((t) => t !== tag));
  };

  return (
    <div className="flex flex-col">
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      {/* Container */}
      <div
        className="flex flex-wrap gap-2 w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 transition focus-within:ring-2 focus-within:ring-blue-300 focus-within:border-blue-100"
      >
        {/* Chips */}
        {values.map((tag, i) => (
          <span
            key={i}
            className="flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
          >
            {tag}
            
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-blue-500 hover:text-blue-700"
              >
                <X className="w-3 h-3" />
              </button>
            
          </span>
        ))}

        {/* Input */}
        
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-grow min-w-[100px] border-none focus:ring-0 focus:outline-none text-sm placeholder-gray-400"
            testid={testid}
          />
       
      </div>
    </div>
  );
}
