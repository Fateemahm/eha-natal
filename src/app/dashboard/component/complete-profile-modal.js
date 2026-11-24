
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

const EMPTY_PROFILE = {};

const profileFields = [
  { name: "weight", label: "Weight (kg)", type: "number", min: 0 },
  { name: "height", label: "Height (cm)", type: "number", min: 0 },
  { name: "dateOfBirth", label: "Date of birth", type: "date" },
  { name: "gravida", label: "Gravida", type: "number", min: 0 },
  { name: "estimatedDueDate", label: "Expected due date", type: "date" },
  { name: "address", label: "Street address", wide: true },
  { name: "stateOfOrigin", label: "State of origin" },
  { name: "allergies", label: "Allergies" },
  { name: "conceptionDate", label: "Conception date", type: "date" },
  { name: "partner", label: "Partner's name" },
  { name: "bloodGroup", label: "Blood group" },
  { name: "bio", label: "About you", type: "textarea", wide: true },
  { name: "genoType", label: "Genotype", required: true },
  { name: "phone", label: "Phone number", type: "tel", required: true }
];

export default function CompleteProfileModal({
  isOpen = false,
  onClose,
  onSubmit,
  profile = EMPTY_PROFILE,
  mode = "create"
}) {
  const [formData, setFormData] = useState(profile);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { data: session } = useSession();

  // Update form fields when the selected profile changes.
  useEffect(() => {
    setFormData(profile || {});
    setError("");
  }, [profile, isOpen]);

  // Close the modal when Escape is pressed.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !submitting) {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, submitting]);

  if (!isOpen) return null;

  const updateField = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        ...formData,
        // userId: session?.user?.id
      };

      // Create a new profile or update the existing one.
      const response =
        mode === "edit"
          ? await axios.put("/api/user-profile", payload)
          : await axios.post("/api/user-profile", payload);

      console.log(
        mode === "edit" ? "Profile updated:" : "Profile created:",
        response.data
      );

      onSubmit?.(response.data);

    } catch (error) {
      console.error("Error submitting profile:", error);

      setError(
        error.response?.data?.message ||
        "Unable to save your profile. Please try again."
      );

    } finally {
      setSubmitting(false);
    }
  };

  // Shared input styling.
  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#7461A8] focus:ring-2 focus:ring-purple-100";

  const labelClass =
    "mb-2 block text-sm font-medium text-gray-700";

  const isEditing = mode === "edit";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !submitting
        ) {
          onClose?.();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="complete-profile-title"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5 sm:px-8">
          <div>
            <p className="text-sm font-semibold text-[#7461A8]">
              Your account
            </p>

            <h2
              id="complete-profile-title"
              className="mt-1 text-2xl font-bold text-gray-900"
            >
              {isEditing ? "Edit your profile" : "Complete your profile"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {isEditing
                ? "Update your information whenever something changes."
                : "Add your details so we can personalize your experience."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close modal"
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
          >
            <span aria-hidden="true" className="text-2xl leading-none">
              ×
            </span>
          </button>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 px-6 py-6 sm:grid-cols-2 sm:px-8">
            {profileFields.map((field) => (
              <label
                key={field.name}
                className={`block ${field.wide ? "sm:col-span-2" : ""}`}
              >
                <span className={labelClass}>
                  {field.label}
                  {field.required && (
                    <span className="ml-1 text-rose-500">*</span>
                  )}
                </span>

                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    value={formData[field.name] ?? ""}
                    onChange={updateField}
                    rows={3}
                    required={field.required}
                    className={`${inputClass} resize-y`}
                    placeholder="Tell us a little about yourself"
                  />
                ) : field.type === "select" ? (
                  <select
                    name={field.name}
                    value={formData[field.name] ?? ""}
                    onChange={updateField}
                    required={field.required}
                    className={inputClass}
                  >
                    <option value="">Select an option</option>

                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type || "text"}
                    name={field.name}
                    value={formData[field.name] ?? ""}
                    onChange={updateField}
                    required={field.required}
                    min={field.min}
                    max={field.max}
                    className={inputClass}
                    placeholder={
                      field.type === "email"
                        ? "you@example.com"
                        : ""
                    }
                  />
                )}
              </label>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div
              role="alert"
              className="mx-6 mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 sm:mx-8"
            >
              {error}
            </div>
          )}

          {/* Modal Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 px-6 py-5 sm:flex-row sm:justify-end sm:px-8">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-[#7461A8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#62508F] focus:outline-none focus:ring-2 focus:ring-purple-200 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Save Profile"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
