// ─────────────────────────────────────────────
//  models/User.js
//  Mongoose schema for Helixion users
// ─────────────────────────────────────────────

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const UserSchema = new mongoose.Schema(
  {
    username: {
      type:      String,
      required:  [true, 'Username is required'],
      unique:    true,
      trim:      true,
      minlength: [3,  'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      match: [
        /^[a-zA-Z0-9_]+$/,
        'Username can only contain letters, numbers and underscores',
      ],
    },

    email: {
      type:      String,
      required:  [true, 'Email is required'],
      unique:    true,
      lowercase: true,
      trim:      true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },

    password: {
      type:      String,
      required:  [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select:    false, // never returned in queries by default
    },

    role: {
      type:    String,
      enum:    ['admin', 'employee', 'manager'],
      default: 'employee',
    },

    isActive: {
      type:    Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true, // adds createdAt + updatedAt automatically
  }
)

// ── Indexes ────────────────────────────────
UserSchema.index({ email: 1 })
UserSchema.index({ username: 1 })

// ── Hash password before saving ────────────
UserSchema.pre('save', async function (next) {
  // Only hash if password was modified
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// ── Instance method: compare password ──────
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// ── Safe user object (no password) ─────────
UserSchema.methods.toSafeObject = function () {
  return {
    id:        this._id,
    username:  this.username,
    email:     this.email,
    role:      this.role,
    createdAt: this.createdAt,
  }
}

// Prevent model re-compilation in dev (hot reload)
export default mongoose.models.User ||
  mongoose.model('User', UserSchema)
