import express from 'express';
import auth from '../middleware/authmiddleware.js';
import Result from '../models/Result.js';

const router = express.Router();

// POST endpoint to save results
router.post('/', auth, async (req, res) => {
  try {
    const { paperId, userId, date, timeSpent, answers, score, maxPossibleScore } = req.body;
    
    // Validate required fields
    if (!paperId || !userId || !timeSpent || !answers || score === undefined || maxPossibleScore === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    // Check if userId matches the authenticated user (or allow admin override)
    if (req.user.id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to save results for this user'
      });
    }
    
    // Create a new result record
    const result = new Result({
      paperId,
      userId,
      date: date || Date.now(),
      timeSpent,
      answers,
      score,
      maxPossibleScore
    });
    
    // Save to database
    await result.save();
    
    return res.status(201).json({
      success: true,
      message: 'Results saved successfully',
      data: result
    });
  } catch (error) {
    console.error('Error saving results:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while saving results',
      error: error.message
    });
  }
});

// GET endpoint to fetch results for a user
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check authorization
    if (req.user.id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view results for this user'
      });
    }
    
    // Fetch results
    const results = await Result.find({ userId }).sort({ date: -1 });
    
    return res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Error fetching results:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching results',
      error: error.message
    });
  }
});

// GET endpoint to fetch a specific result
router.get('/:resultId', auth, async (req, res) => {
  try {
    const { resultId } = req.params;
    
    // Fetch the result
    const result = await Result.findById(resultId);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found'
      });
    }
    
    // Check authorization
    if (req.user.id !== result.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this result'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching result:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching result',
      error: error.message
    });
  }
});

// GET endpoint to fetch results for a specific paper
router.get('/paper/:paperId', auth, async (req, res) => {
  try {
    const { paperId } = req.params;
    
    // Fetch results
    const results = await Result.find({ paperId }).sort({ date: -1 });
    
    return res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Error fetching paper results:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching paper results',
      error: error.message
    });
  }
});

// DELETE endpoint to remove a result
router.delete('/:resultId', auth, async (req, res) => {
  try {
    const { resultId } = req.params;
    
    // Fetch the result
    const result = await Result.findById(resultId);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found'
      });
    }
    
    // Check authorization
    if (req.user.id !== result.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this result'
      });
    }
    
    // Delete the result
    await Result.findByIdAndDelete(resultId);
    
    return res.status(200).json({
      success: true,
      message: 'Result deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting result:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting result',
      error: error.message
    });
  }
});

export default router;