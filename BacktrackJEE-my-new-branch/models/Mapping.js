import mongoose from 'mongoose';

const mappingSchema = new mongoose.Schema({
  paperId: { type: String, required: true },
  collectionName: { type: String, required: true },
});

const Mapping = mongoose.model('Mapping', mappingSchema);

export default Mapping;
