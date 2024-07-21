import React, { useState } from "react";
import { changeProfile } from "../services/authService";
import Cookies from "js-cookie";

interface Props {
  currentName: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
}

const NameChangeForm: React.FC<Props> = ({ currentName, setName }) => {
  const [newName, setNewName] = useState(currentName);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await changeProfile(Cookies.get("email"), newName);
      setName(newName);
      alert("Name updated successfully");
    } catch (err) {
      console.error("Error updating name", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 bg-white p-4 rounded shadow">
      <div>
        <label className="block text-sm font-bold mb-2">New Name</label>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="border rounded w-full py-2 px-3"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded mt-2"
      >
        Change Name
      </button>
    </form>
  );
};

export default NameChangeForm;
