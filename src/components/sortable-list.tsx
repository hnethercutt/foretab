"use client";

interface SortableListProps {
  myRef: React.RefObject<HTMLInputElement | null>;
  placeholder?: string;
}

export default function CustomInput({ myRef, placeholder }: SortableListProps) {
  // Destructure and assign directly to the element
  return (
    <input
      ref={myRef}
      type="text"
      placeholder={placeholder}
      className="border p-2"
    />
  );
}