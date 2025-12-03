import express from 'express';

const router = express.Router();

router.post('/profileChanges', async (req, res) => {
  try {
    // Після успішного збереження
    res.status(200).json({
      success: true,
      message: 'Дані успішно оновлено',
    });
  } catch (error) {
    console.error('Помилка збереження:', error);
    res.status(500).json({
      success: false,
      message: 'Помилка сервера при збереженні даних',
    });
  }
});

export default router;
