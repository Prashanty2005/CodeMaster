const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const submissionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  problemId: {
    type: Schema.Types.ObjectId,
    ref: 'problem',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true,
    enum: ['javascript', 'cpp', 'java'] 
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'wrong', 'error'],
    default: 'pending'
  },
  runtime: {
    type: Number,  // milliseconds
    default: 0
  },
  memory: {
    type: Number,  // kB
    default: 0
  },
  errorMessage: {
    type: String,
    default: ''
  },
  testCasesPassed: {
    type: Number,
    default: 0
  },
  testCasesTotal: {  // Recommended addition
    type: Number,
    default: 0
  }
}, { 
  timestamps: true
});

submissionSchema.index({userId:1,problemId:1}) //created a compound index
// 1 here suggests that following field will be stored in accending order
//-1 will arrange in decending order

const Submission = mongoose.model('submission',submissionSchema);

module.exports= Submission