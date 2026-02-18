/**
 * ============================================================
 *  SampleListPage — List + Create/Edit (index route)
 * ============================================================
 *
 *  Route:  /sample
 *
 *  This page uses:
 *    - CrudService (OOP)  for all API calls
 *    - SampleForm         for create/edit
 *    - SampleTable        for display
 *    - MessageBanner      for feedback
 *
 *  All business logic lives here; child components are stateless.
 * ============================================================
 */

import { useState, useEffect } from "react";
import { sampleService } from "../../services/CrudService";
import SampleForm from "../../components/sample/SampleForm";
import SampleTable from "../../components/sample/SampleTable";
import MessageBanner from "../../components/sample/MessageBanner";

const EMPTY_FORM = { first_name: "", last_name: "", email: "", phone: "" };

export default function SampleListPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  // ── Fetch on mount ───────────────────────────────────────
  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    setLoading(true);
    try {
      // CrudService.getAll() → GET /api/SampleCrud/index
      const data = await sampleService.getAll();
      setItems(data);
    } catch (err) {
      showMessage("Failed to load items", "error");
    } finally {
      setLoading(false);
    }
  }

  // ── Create ───────────────────────────────────────────────
  async function handleCreate(e) {
    e.preventDefault();
    setErrors({});
    try {
      // CrudService.create() → POST /api/SampleCrud/create
      const res = await sampleService.create(form);
      showMessage(res.message);
      setForm(EMPTY_FORM);
      fetchItems();
    } catch (err) {
      if (err.data?.errors) {
        setErrors(err.data.errors);
      } else {
        showMessage(err.message || "Create failed", "error");
      }
    }
  }

  // ── Update ───────────────────────────────────────────────
  async function handleUpdate(e) {
    e.preventDefault();
    setErrors({});
    try {
      // CrudService.update() → PUT /api/SampleCrud/update/{id}
      const res = await sampleService.update(editId, form);
      showMessage(res.message);
      cancelEdit();
      fetchItems();
    } catch (err) {
      if (err.data?.errors) {
        setErrors(err.data.errors);
      } else {
        showMessage(err.message || "Update failed", "error");
      }
    }
  }

  // ── Delete ───────────────────────────────────────────────
  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      // CrudService.destroy() → DELETE /api/SampleCrud/destroy/{id}
      const res = await sampleService.destroy(id);
      showMessage(res.message);
      fetchItems();
    } catch (err) {
      showMessage(err.message || "Delete failed", "error");
    }
  }

  // ── Editing helpers ──────────────────────────────────────
  function startEdit(item) {
    setEditId(item.id);
    setForm({
      first_name: item.first_name,
      last_name: item.last_name,
      email: item.email,
      phone: item.phone,
    });
    setErrors({});
  }

  function cancelEdit() {
    setEditId(null);
    setForm(EMPTY_FORM);
    setErrors({});
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function showMessage(msg, type = "success") {
    setMessage("");                       // reset so useEffect in banner re-triggers
    setTimeout(() => {
      setMessage(msg);
      setMessageType(type);
    }, 0);
  }

  // ── Render ───────────────────────────────────────────────
  return (
    <>
      <MessageBanner message={message} type={messageType} />

      <SampleForm
        form={form}
        errors={errors}
        editId={editId}
        onChange={handleChange}
        onSubmit={editId ? handleUpdate : handleCreate}
        onCancel={cancelEdit}
      />

      <SampleTable
        items={items}
        loading={loading}
        onEdit={startEdit}
        onDelete={handleDelete}
      />
    </>
  );
}
