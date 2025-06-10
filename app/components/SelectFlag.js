"use client";
import { useState } from "react";

const flags = [
  { id: 1, name: "Important", src: "VectorRed.png" },
  { id: 2, name: "Urgent", src: "VectorBlue.png" },
  { id: 3, name: "Optional", src: "VectorGreen.png" },
];

export default function SelectFlag({ selected, setSelected }) {
  const [open, setOpen] = useState(false);

  const handleSelect = (flag) => {
    setSelected(flag);
    setOpen(false);
  };

  return (
    <div className="relative">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {selected ? (
          <>
            <img src={selected.src} alt={selected.name} className="w-5 h-5" />
            <span className="text-sm">{selected.name}</span>
          </>
        ) : (
          <span className="text-sm text-blue-600 underline">Flag Seç</span>
        )}
      </div>

      {open && (
        <ul className="absolute z-10 bg-white border mt-2 p-2 rounded shadow w-40">
          {flags.map((flag) => (
            <li
              key={flag.id}
              className="flex items-center gap-2 cursor-pointer mb-2"
              onClick={() => handleSelect(flag)}
            >
              <img src={flag.src} alt={flag.name} className="w-5 h-5" />
              <span>{flag.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
