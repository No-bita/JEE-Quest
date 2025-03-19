import mongoose from 'mongoose';

const paperSchema = new mongoose.Schema({
  paperId: { type: String, required: true },
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
      text: { type: String },
      options: [
        {
          id: { type: Number },
          text: { type: String },
        }
      ],
      correctOption: { type: Number, required: true },
      imageUrl: { type: String },
      subject: { type: String, required: true },
    }
  ]
});

const getQuestionModel = (collectionName) => {
  return mongoose.model('Paper', paperSchema, collectionName);
};

export default getQuestionModel;
