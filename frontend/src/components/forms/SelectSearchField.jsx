import Select from "react-select";
import { Loader2 } from "lucide-react";

export default function SelectSearchField({
  label,
  value,
  onChange,
  options,
  isLoading,
  required,
}) {
  return (
    <div className="flex flex-col mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      
      <Select
        value={options.find((opt) => opt.value === value) || null}
        onChange={(selected) => onChange({ target: { value: selected?.value || "" } })}
        options={options}
        isLoading={isLoading}
        required={required}
        isClearable
        isSearchable
        placeholder={isLoading ? "Carregando..." : "Selecione uma opção"}
        classNamePrefix="react-select"
        styles={{
          control: (base) => ({
            ...base,
            borderColor: "#d1d5db",
            boxShadow: "none",
            "&:hover": { borderColor: "#93c5fd" },
          }),
          placeholder: (base) => ({
            ...base,
            color: isLoading ? "#9ca3af" : base.color,
          }),
        }}
        components={{
          LoadingIndicator: () => (
            <Loader2 className="animate-spin text-gray-400" size={18} />
          ),
        }}
      />
    </div>
  );
}
