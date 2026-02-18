/**
 * ============================================================
 *  SampleDetailPage — View a Single Item (detail route)
 * ============================================================
 *
 *  Route:  /sample/:id
 *
 *  Demonstrates:
 *    - useParams()  to read the :id from the URL
 *    - useNavigate() to go back programmatically
 *    - CrudService.getById() for fetching a single record
 *
 *  This is a read-only detail view. Shows how React Router
 *  dynamic segments map to a PHP backend call.
 * ============================================================
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { sampleService } from "../../services/CrudService";

export default function SampleDetailPage() {
  const { id } = useParams();       // reads :id from URL, e.g. /sample/5 → id = "5"
  const navigate = useNavigate();    // programmatic navigation

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchItem() {
      try {
        // CrudService.getById() → GET /api/SampleCrud/show/{id}
        const data = await sampleService.getById(id);
        setItem(data);
      } catch (err) {
        setError(err.message || "Item not found");
      } finally {
        setLoading(false);
      }
    }

    fetchItem();
  }, [id]);

  if (loading) {
    return <p className="text-gray-400 text-center mt-12">Loading…</p>;
  }

  if (error) {
    return (
      <div className="text-center mt-12">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={() => navigate("/sample")}
          className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white transition-colors"
        >
          ← Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-gray-800/40 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
      <h2 className="text-xl font-bold text-white mb-4">
        Item #{item.id}
      </h2>

      <dl className="space-y-3">
        <div>
          <dt className="text-xs text-gray-500 uppercase">Name</dt>
          <dd className="text-white">
            {item.first_name} {item.last_name}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-gray-500 uppercase">Email</dt>
          <dd className="text-gray-300">{item.email}</dd>
        </div>
        <div>
          <dt className="text-xs text-gray-500 uppercase">Phone</dt>
          <dd className="text-gray-300">{item.phone}</dd>
        </div>
        <div>
          <dt className="text-xs text-gray-500 uppercase">Created</dt>
          <dd className="text-gray-400 text-sm">{item.created_at}</dd>
        </div>
      </dl>

      {/* Navigation back — uses React Router <Link> */}
      <div className="mt-6">
        <Link
          to="/sample"
          className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white text-sm transition-colors"
        >
          ← Back to List
        </Link>
      </div>
    </div>
  );
}
