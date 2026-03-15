"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

type ManufacturerSeries = {
  id: string | null;
  board_manufacturer_id: string | null;
  name: string;
  description: string | null;
  created_at: string | null;
};

type BoardManufacturer = {
  id: string;
  name: string;
};

type formDataItems = {
  board_manufacturer_id: string | null;
  name: string;
  description: string;
};

export default function ManufacturerSeriesCRUDPage() {
  const [series, setSeries] = useState<ManufacturerSeries[]>([]);
  const [manufacturers, setManufacturers] = useState<BoardManufacturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingSeries, setEditingSeries] = useState<ManufacturerSeries | null>(
    null,
  );
  const [formData, setFormData] = useState<formDataItems>({
    board_manufacturer_id: "",
    name: "",
    description: "",
  });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [filterManufacturer, setFilterManufacturer] = useState<string>("");

  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [seriesData, manufacturerData] = await Promise.all([
        supabase
          .from("manufacturer_series")
          .select("*")
          .order("name", { ascending: true }),
        supabase
          .from("board_manufacturers")
          .select("*")
          .order("name", { ascending: true }),
      ]);

      if (seriesData.error) throw seriesData.error;
      if (manufacturerData.error) throw manufacturerData.error;

      setSeries(seriesData.data || []);
      setManufacturers(manufacturerData.data || []);
    } catch (error) {
      console.error("Error loading data:", error);
      alert("Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  function handleAdd() {
    setEditingSeries(null);
    setFormData({ board_manufacturer_id: "", name: "", description: "" });
    setShowModal(true);
  }

  function handleEdit(seriesItem: ManufacturerSeries) {
    setEditingSeries(seriesItem);
    setFormData({
      board_manufacturer_id: seriesItem.board_manufacturer_id,
      name: seriesItem.name,
      description: seriesItem.description || "",
    });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Name is required");
      return;
    }

    if (!formData.board_manufacturer_id) {
      alert("Board manufacturer is required");
      return;
    }

    try {
      setSaving(true);

      if (editingSeries) {
        // Update existing
        const { error } = await supabase
          .from("manufacturer_series")
          .update({
            board_manufacturer_id: formData.board_manufacturer_id,
            name: formData.name.trim(),
            description: formData.description.trim() || null,
          })
          .eq("id", editingSeries.id as string);

        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase.from("manufacturer_series").insert({
          board_manufacturer_id: formData.board_manufacturer_id,
          name: formData.name.trim(),
          description: formData.description.trim() || null,
        });

        if (error) throw error;
      }

      setShowModal(false);
      loadData();
    } catch (error: any) {
      console.error("Error saving manufacturer series:", error);
      if (error.code === "23505") {
        alert("A series with this name already exists for this manufacturer");
      } else {
        alert("Failed to save manufacturer series");
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
        .from("manufacturer_series")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setDeleteConfirm(null);
      loadData();
    } catch (error) {
      console.error("Error deleting manufacturer series:", error);
      alert("Failed to delete series. It may be in use by components.");
    }
  }

  const filteredSeries = filterManufacturer
    ? series.filter((s) => s.board_manufacturer_id === filterManufacturer)
    : series;

  const getManufacturerName = (id: string) => {
    return manufacturers?.find((m) => m.id === id)?.name || "Unknown";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Manufacturer Series
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage product lines and series (ROG STRIX, Gaming X Trio, etc.)
              </p>
            </div>
            <button
              onClick={handleAdd}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              + Add Series
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <label
              htmlFor="filter"
              className="text-sm font-medium text-gray-700"
            >
              Filter by manufacturer:
            </label>
            <select
              id="filter"
              value={filterManufacturer}
              onChange={(e) => setFilterManufacturer(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option value="">All Manufacturers</option>
              {manufacturers.map((manufacturer) => (
                <option key={manufacturer.id} value={manufacturer.id}>
                  {manufacturer.name}
                </option>
              ))}
            </select>
            {filterManufacturer && (
              <span className="text-sm text-gray-500">
                Showing {filteredSeries.length} of {series.length} series
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-green-600"></div>
              <p className="mt-4 text-sm text-gray-500">Loading series...</p>
            </div>
          </div>
        ) : filteredSeries.length === 0 ? (
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
            <h3 className="mt-4 text-sm font-medium text-gray-900">
              {filterManufacturer
                ? "No series for this manufacturer"
                : "No series"}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {filterManufacturer
                ? "Try selecting a different manufacturer or add a new series."
                : "Get started by adding your first series."}
            </p>
            <button
              onClick={handleAdd}
              className="mt-4 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              + Add Series
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
                    Manufacturer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Description
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
                {filteredSeries.map((seriesItem) => (
                  <tr key={seriesItem.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {seriesItem.name}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {getManufacturerName(
                          seriesItem.board_manufacturer_id as string,
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs truncate text-sm text-gray-500">
                        {seriesItem.description || "-"}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(
                        seriesItem.created_at as string,
                      ).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(seriesItem)}
                        className="mr-4 text-green-600 hover:text-green-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(seriesItem.id as string)}
                        className={`${
                          deleteConfirm === seriesItem.id
                            ? "text-red-900 font-bold"
                            : "text-red-600 hover:text-red-900"
                        }`}
                      >
                        {deleteConfirm === seriesItem.id
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
                  {editingSeries
                    ? "Edit Manufacturer Series"
                    : "Add Manufacturer Series"}
                </h2>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-4">
                  {/* Manufacturer */}
                  <div>
                    <label
                      htmlFor="manufacturer"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Board Manufacturer <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="manufacturer"
                      value={formData.board_manufacturer_id as string}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          board_manufacturer_id: e.target.value,
                        })
                      }
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                      required
                    >
                      <option value="">Select manufacturer</option>
                      {manufacturers.map((manufacturer) => (
                        <option key={manufacturer.id} value={manufacturer.id}>
                          {manufacturer.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Series Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                      placeholder="e.g., ROG STRIX"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Description (optional)
                    </label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                      placeholder="e.g., Republic of Gamers premium gaming line"
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
                    className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    {saving ? "Saving..." : editingSeries ? "Update" : "Create"}
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
