"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

type ChipBrand = {
  id: string | null;
  name: string;
  logo_url: string | null;
  created_at: string | null;
};

export default function ChipBrandsCRUDPage() {
  const [chipBrands, setChipBrands] = useState<ChipBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<ChipBrand | null>(null);
  const [formData, setFormData] = useState({ name: "", logo_url: "" });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    loadChipBrands();
  }, []);

  async function loadChipBrands() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("chip_brands")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      setChipBrands(data || []);
    } catch (error) {
      console.error("Error loading chip brands:", error);
      alert("Failed to load chip brands");
    } finally {
      setLoading(false);
    }
  }

  function handleAdd() {
    setEditingBrand(null);
    setFormData({ name: "", logo_url: "" });
    setShowModal(true);
  }

  function handleEdit(brand: ChipBrand) {
    setEditingBrand(brand);
    setFormData({ name: brand.name, logo_url: brand.logo_url || "" });
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

      if (editingBrand) {
        // Update existing
        const { error } = await supabase
          .from("chip_brands")
          .update({
            name: formData.name.trim(),
            logo_url: formData.logo_url.trim() || null,
          })
          .eq("id", editingBrand.id as string);

        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase.from("chip_brands").insert({
          name: formData.name.trim(),
          logo_url: formData.logo_url.trim() || null,
        });

        if (error) throw error;
      }

      setShowModal(false);
      loadChipBrands();
    } catch (error: any) {
      console.error("Error saving chip brand:", error);
      if (error.code === "23505") {
        alert("A chip brand with this name already exists");
      } else {
        alert("Failed to save chip brand");
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
        .from("chip_brands")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setDeleteConfirm(null);
      loadChipBrands();
    } catch (error) {
      console.error("Error deleting chip brand:", error);
      alert("Failed to delete chip brand. It may be in use by components.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Chip Brands</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage chip designers and brands (NVIDIA, AMD, Corsair, etc.)
              </p>
            </div>
            <button
              onClick={handleAdd}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              + Add Chip Brand
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
              <p className="mt-4 text-sm text-gray-500">
                Loading chip brands...
              </p>
            </div>
          </div>
        ) : chipBrands.length === 0 ? (
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
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <h3 className="mt-4 text-sm font-medium text-gray-900">
              No chip brands
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding your first chip brand.
            </p>
            <button
              onClick={handleAdd}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              + Add Chip Brand
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
                    Logo URL
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
                {chipBrands.map((brand) => (
                  <tr key={brand.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {brand.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {brand.logo_url ? (
                        <a
                          href={brand.logo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          View logo
                        </a>
                      ) : (
                        <span className="text-sm text-gray-400">No logo</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(
                        brand.created_at as string,
                      ).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(brand)}
                        className="mr-4 text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(brand.id as string)}
                        className={`${
                          deleteConfirm === brand.id
                            ? "text-red-900 font-bold"
                            : "text-red-600 hover:text-red-900"
                        }`}
                      >
                        {deleteConfirm === brand.id
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
                  {editingBrand ? "Edit Chip Brand" : "Add Chip Brand"}
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
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g., NVIDIA"
                      required
                    />
                  </div>

                  {/* Logo URL */}
                  <div>
                    <label
                      htmlFor="logo_url"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Logo URL (optional)
                    </label>
                    <input
                      type="url"
                      id="logo_url"
                      value={formData.logo_url}
                      onChange={(e) =>
                        setFormData({ ...formData, logo_url: e.target.value })
                      }
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="https://example.com/logo.png"
                    />
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
                    className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? "Saving..." : editingBrand ? "Update" : "Create"}
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
