import mongoose from 'mongoose';

const paperSchema = new mongoose.Schema({
  paperId: { type: String, required: true, unique: true }, // Unique identifier for each paper
  year: { type: Number, required: true },
  session: { type: String, required: true },
  shift: { type: String, required: true },
  date: { type: String, required: true },
  questionCount: { type: Number, required: true },
  duration: { type: Number, required: true },
  questions: [
    {
      id: { type: Number, required: true },
      type: { type: String, required: true },
      text: { type: String, required: false },
      options: [
        {
          id: { type: Number, required: false },
          text: { type: String, required: false },
        },
      ],
      correctOption: { type: Number, required: true },
      imageUrl: { type: String },
      subject: { type: String, required: true },
    },
  ],
});

const Paper = mongoose.model('Paper', paperSchema);

export default Paper;
