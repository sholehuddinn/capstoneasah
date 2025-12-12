import express from 'express';
const router = express.Router();

import { testConnection } from '../controller/tes.js';
import { createAssessment } from '../controller/assessmentController.js';
import { handleFeedback } from '../controller/feedbackController.js';
import { getTutorialId, getTutorials } from '../controller/tutorialController.js';
import { registerUser, loginUser, getProfile } from '../controller/userController.js';
import { authMiddleware } from '../middleware/auth.js';
import { editPreferenceController } from '../controller/preferenceController.js';
import { resetProgressController } from "../controller/progressController.js"
import { getQuestionsByUser } from "../controller/questionController.js"
import { submitBulkAnswer } from '../controller/answerController.js';
import { ListModel } from '../controller/tes.js';

router.get('/', (_req, res) => {
  return res.redirect('https://documenter.getpostman.com/view/45729880/2sB3WmS28v');
});
router.get('/test', testConnection);
router.get('list-models', ListModel);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', authMiddleware, getProfile);
router.patch('/users/preference', authMiddleware, editPreferenceController)
router.get('/tutorials/:id', authMiddleware, getTutorialId);
// router.get('/tutorials', authMiddleware, getTutorials);
router.get('/assessment/tutorial/:tutorial_id', authMiddleware, createAssessment);
router.post("/submit/tutorial/:tutorial_id/assessment/:assessment_id", authMiddleware, handleFeedback);
router.get('/progress-reset', authMiddleware, resetProgressController);
router.get('/questions-final', authMiddleware, getQuestionsByUser);
router.post("/submit-answers", authMiddleware,  submitBulkAnswer);

export default router;