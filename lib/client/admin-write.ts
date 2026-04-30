type Action =
  | { op: 'create'; doc: Record<string, unknown> }
  | { op: 'patch'; id: string; set?: Record<string, unknown>; unset?: string[]; inc?: Record<string, number> }
  | { op: 'delete'; id: string }
  | { op: 'createOrReplace'; doc: Record<string, unknown> & { _id: string } }

async function send(actions: Action[]) {
  const res = await fetch('/api/admin/sanity', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ actions }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data?.error || `Admin write failed (${res.status})`)
  }
  return data.results as unknown[]
}

class PatchBuilder {
  private id: string
  private _set?: Record<string, unknown>
  private _unset?: string[]
  private _inc?: Record<string, number>

  constructor(id: string) {
    this.id = id
  }

  set(values: Record<string, unknown>) {
    this._set = { ...(this._set || {}), ...values }
    return this
  }

  unset(paths: string[]) {
    this._unset = [...(this._unset || []), ...paths]
    return this
  }

  inc(values: Record<string, number>) {
    this._inc = { ...(this._inc || {}), ...values }
    return this
  }

  async commit() {
    const [result] = await send([
      { op: 'patch', id: this.id, set: this._set, unset: this._unset, inc: this._inc },
    ])
    return result
  }
}

export const adminWriteClient = {
  patch(id: string) {
    return new PatchBuilder(id)
  },
  async create(doc: Record<string, unknown>) {
    const [result] = await send([{ op: 'create', doc }])
    return result
  },
  async createOrReplace(doc: Record<string, unknown> & { _id: string }) {
    const [result] = await send([{ op: 'createOrReplace', doc }])
    return result
  },
  async delete(id: string) {
    const [result] = await send([{ op: 'delete', id }])
    return result
  },
  async batch(actions: Action[]) {
    return send(actions)
  },
}
