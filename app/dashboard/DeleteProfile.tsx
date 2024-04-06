"use client";

import { redirect } from "next/navigation";

export function DeleteProfile({ user }: any) {
  const deleteProfile = async () => {
    const res = await fetch("/api/user", {
      method: "DELETE",
    });
  };

  return (
    <div className="my-20 items-center">
      <p className="prose my-2">⚡Danger Zone:</p>
      <button
        className="btn btn-outline btn-error"
        onClick={() => {
          const modal = document.getElementById(
            "my_modal_1"
          ) as HTMLDialogElement;
          if (modal) {
            modal.showModal();
          }
        }}
      >
        Delete your profile
      </button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            Are you sure you want to delete your profile?
          </h3>

          <div className="modal-action">
            <form method="dialog">
              <div>
                <button className="btn btn-warning m-1" onClick={deleteProfile}>
                  Delete
                </button>
                <button className="btn">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
