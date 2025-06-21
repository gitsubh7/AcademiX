import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    url:  { type: String, required: true, trim: true },

    /* strongly recommended */
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  "Student",
      required: true,             // each doc belongs to exactly one student
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
);

/* expose plain “id” so the client never deals with _id */
documentSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

export const Document = mongoose.model("Document", documentSchema);
