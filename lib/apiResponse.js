// ─────────────────────────────────────────────
//  lib/apiResponse.js
//  Consistent JSON response helpers
// ─────────────────────────────────────────────

import { NextResponse } from 'next/server'

export const ok = (data, status = 200) =>
  NextResponse.json({ success: true, ...data }, { status })

export const err = (message, status = 400) =>
  NextResponse.json({ success: false, message }, { status })
