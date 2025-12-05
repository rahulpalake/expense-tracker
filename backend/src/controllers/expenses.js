import db from '../models/db.js';

export const getExpenses = async (req, res) => {
  try {
    const { user_id } = req.query;
    const result = await db.query('SELECT * FROM expenses WHERE user_id = $1 ORDER BY created_at DESC', [user_id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addExpense = async (req, res) => {
  try {
    const { user_id, amount, category, description, receipt_url } = req.body;
    const result = await db.query(
      'INSERT INTO expenses (user_id, amount, category, description, receipt_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, amount, category, description, receipt_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, category, description, receipt_url } = req.body;
    const result = await db.query(
      'UPDATE expenses SET amount = $1, category = $2, description = $3, receipt_url = $4 WHERE id = $5 RETURNING *',
      [amount, category, description, receipt_url, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM expenses WHERE id = $1', [id]);
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
