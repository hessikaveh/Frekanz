"use client";

import { useState } from "react";

export function ProfileForm({ user }: any) {
  // Define state for the boolean input
  const [isChecked, setIsChecked] = useState<boolean>(user?.public_profile); // Default value set to true

  // Function to handle changes in the checkbox
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };
  const updateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const body = {
      name: formData.get("name"),
      bio: formData.get("bio"),
      public_profile: isChecked,
    };

    const res = await fetch("/api/user", {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    await res.json();
  };

  return (
    <div>
      <h2 className="prose my-3">Edit Your Profile:</h2>
      <form onSubmit={updateUser} className="flex flex-col">
        <label
          htmlFor="name"
          className="prose input input-bordered flex items-center gap-2"
        >
          Name
          <input
            type="text"
            className="grow"
            name="name"
            defaultValue={user?.name ?? ""}
          />
        </label>
        <label htmlFor="bio" className="form-control">
          <div className="label">
            <span className="label-text">Your bio</span>
          </div>
          <textarea
            className="textarea textarea-bordered"
            name="bio"
            cols={30}
            rows={3}
            maxLength={100}
            defaultValue={user?.bio ?? ""}
          ></textarea>
        </label>
        <label htmlFor="public_profile" className="label cursor-pointer">
          <span className="label-text">Let others find me</span>
          <input
            name="public_profile"
            type="checkbox"
            className="toggle"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
        </label>
        <button className="btn m-4 btn-outline" type="submit">
          Save
        </button>
      </form>
    </div>
  );
}
