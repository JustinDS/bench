"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

type BoardManufacturer = {
  id: string;
  name: string;
  created_at: string;
};

export default function BoardManufacturersCRUDPage() {
  const [manufacturers, setManufacturers] = useState<BoardManufacturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingManufacturer, setEditingManufacturer] =
    useState<BoardManufacturer | null>(null);
  const [formData, setFormData] = useState({ name: "" });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    loadManufacturers();
  }, []);

  async function loadManufacturers() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("board_manufacturers")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      setManufacturers(data || []);
    } catch (error) {
      console.error("Error loading board manufacturers:", error);
      alert("Failed to load board manufacturers");
    } finally {
      setLoading(false);
    }
  }

  function handleAdd() {
    setEditingManufacturer(null);
    setFormData({ name: "" });
    setShowModal(true);
  }

  function handleEdit(manufacturer: BoardManufacturer) {
    setEditingManufacturer(manufacturer);
    setFormData({ name: manufacturer.name });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Name is required");
      return;
    }

    try {
      setSaving(true);

      if (editingManufacturer) {
        // Update existing
        const { error } = await supabase
          .from("board_manufacturers")
          .update({
            name: formData.name.trim(),
          })
          .eq("id", editingManufacturer.id);

        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase.from("board_manufacturers").insert({
          name: formData.name.trim(),
        });

        if (error) throw error;
      }

      setShowModal(false);
      loadManufacturers();
    } catch (error: any) {
      console.error("Error saving board manufacturer:", error);
      if (error.code === "23505") {
        alert("A board manufacturer with this name already exists");
      } else {
        alert("Failed to save board manufacturer");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      return;
    }

    try {
      const { error } = await supabase
        .from("board_manufacturers")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setDeleteConfirm(null);
      loadManufacturers();
    } catch (error) {
      console.error("Error deleting board manufacturer:", error);
      alert(
        "Failed to delete board manufacturer. It may be in use by components or series.",
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Board Manufacturers
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage AIB partners and board makers (ASUS, MSI, Gigabyte, etc.)
              </p>
            </div>
            <button
              onClick={handleAdd}
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              + Add Manufacturer
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-purple-600"></div>
              <p className="mt-4 text-sm text-gray-500">
                Loading manufacturers...
              </p>
            </div>
          </div>
        ) : manufacturers.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h3 className="mt-4 text-sm font-medium text-gray-900">
              No manufacturers
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding your first manufacturer.
            </p>
            <button
              onClick={handleAdd}
              className="mt-4 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
            >
              + Add Manufacturer
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {manufacturers.map((manufacturer) => (
                  <tr key={manufacturer.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {manufacturer.name}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(manufacturer.created_at).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(manufacturer)}
                        className="mr-4 text-purple-600 hover:text-purple-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(manufacturer.id)}
                        className={`${
                          deleteConfirm === manufacturer.id
                            ? "text-red-900 font-bold"
                            : "text-red-600 hover:text-red-900"
                        }`}
                      >
                        {deleteConfirm === manufacturer.id
                          ? "Confirm Delete?"
                          : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setShowModal(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="relative w-full max-w-md rounded-lg bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingManufacturer
                    ? "Edit Board Manufacturer"
                    : "Add Board Manufacturer"}
                </h2>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      placeholder="e.g., ASUS"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      The company that manufactures the boards/cards (AIB
                      partner)
                    </p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
                  >
                    {saving
                      ? "Saving..."
                      : editingManufacturer
                        ? "Update"
                        : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
