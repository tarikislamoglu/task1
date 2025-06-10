"use client";
import { useState } from "react";

const avatars = [
  { id: 1, name: "John", src: "profile1.png" },
  { id: 2, name: "Bob", src: "profile2.png" },
  { id: 3, name: "Charlie", src: "profile3.png" },
  { id: 4, name: "Alice", src: "profile4.png" },
  { id: 5, name: "David", src: "profile5.png" },
  { id: 6, name: "Saiss", src: "profile6.png" },
  { id: 7, name: "Diana", src: "profile7.png" },
  { id: 8, name: "Smith", src: "profile8.png" },
  { id: 9, name: "Katarina", src: "profile9.png" },
  { id: 10, name: "Lana", src: "profile10.png" },
  { id: 11, name: "Natali", src: "profile11.png" },
];

export default function SelectAvatar({ selected, setSelected }) {
  const [open, setOpen] = useState(false);

  const toggleAvatar = (avatar) => {
    setSelected((prev) =>
      prev?.some((item) => item.id === avatar.id)
        ? prev.filter((item) => item.id !== avatar.id)
        : [...prev, avatar]
    );
  };

  return (
    <div className="relative">
      {/* Seçilen avatarlar */}
      <div
        className="flex flex-wrap gap-1 cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        {selected.map(({ id, name, src }) => (
          <img
            key={id}
            src={src}
            alt={name}
            className="w-6 h-6 rounded-full border"
            title={name}
          />
        ))}
        <span className="text-sm text-blue-600 underline ml-2">
          {open ? "Kapat" : "Kişi Seç"}
        </span>
      </div>

      {/* Açılır seçim menüsü */}
      {open && (
        <ul className="absolute z-10 bg-white border mt-2 p-2 rounded shadow max-h-64 overflow-y-auto w-56">
          {avatars.map((avatar) => (
            <li
              key={avatar.id}
              className="flex items-center gap-2 cursor-pointer mb-1"
              onClick={() => toggleAvatar(avatar)}
            >
              <input
                type="checkbox"
                checked={selected.some((item) => item.id === avatar.id)}
                readOnly
              />
              <img
                src={avatar.src}
                alt={avatar.name}
                className="w-6 h-6 rounded-full"
              />
              <span>{avatar.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
