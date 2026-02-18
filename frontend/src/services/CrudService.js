/**
 * ============================================================
 *  CrudService — OOP API Service Class (Reference)
 * ============================================================
 *
 *  A reusable base class that encapsulates all CRUD operations.
 *  Extend it per resource (GuestService, MemberService, etc.)
 *
 *  Pattern:
 *    const guestService = new CrudService("SampleCrud");
 *    await guestService.getAll();
 *    await guestService.getById(5);
 *    await guestService.create({ first_name: "John", ... });
 *    await guestService.update(5, { first_name: "Jane", ... });
 *    await guestService.destroy(5);
 *
 *  To customize for a specific resource, extend the class:
 *
 *    class MemberService extends CrudService {
 *      constructor() { super("Members"); }
 *      async register(data) { return this.create(data, "register"); }
 *    }
 *
 *  How it maps to the PHP backend:
 *    controller = "SampleCrud"
 *    getAll()        → GET    /api/SampleCrud/index
 *    getById(5)      → GET    /api/SampleCrud/show/5
 *    create(data)    → POST   /api/SampleCrud/create
 *    update(5, data) → PUT    /api/SampleCrud/update/5
 *    destroy(5)      → DELETE /api/SampleCrud/destroy/5
 * ============================================================
 */

import { api } from "../api";

export class CrudService {
  /**
   * @param {string} controller — PHP controller name (e.g. "SampleCrud", "Members")
   */
  constructor(controller) {
    this.controller = controller;
  }

  /**
   * GET all items.
   * Calls: GET /api/{controller}/index
   * @returns {Promise<Array>} — array of items from `res.data`
   */
  async getAll() {
    const res = await api.get(`${this.controller}/index`);
    return res.data;
  }

  /**
   * GET a single item by ID.
   * Calls: GET /api/{controller}/show/{id}
   * @param {number|string} id
   * @returns {Promise<Object>} — single item from `res.data`
   */
  async getById(id) {
    const res = await api.get(`${this.controller}/show/${id}`);
    return res.data;
  }

  /**
   * POST create a new item.
   * Calls: POST /api/{controller}/{method}
   * @param {Object} data — field values
   * @param {string} [method="create"] — override the method name if needed (e.g. "register")
   * @returns {Promise<Object>} — full response { success, message }
   */
  async create(data, method = "create") {
    return api.post(`${this.controller}/${method}`, data);
  }

  /**
   * PUT update an existing item.
   * Calls: PUT /api/{controller}/update/{id}
   * @param {number|string} id
   * @param {Object} data — field values
   * @returns {Promise<Object>} — full response { success, message }
   */
  async update(id, data) {
    return api.put(`${this.controller}/update/${id}`, data);
  }

  /**
   * DELETE an item.
   * Calls: DELETE /api/{controller}/destroy/{id}
   * @param {number|string} id
   * @returns {Promise<Object>} — full response { success, message }
   */
  async destroy(id) {
    return api.delete(`${this.controller}/destroy/${id}`);
  }
}

// ── Pre-built instance for the sample "guest" resource ──────
export const sampleService = new CrudService("SampleCrud");
