import { getAnalyticsSummary } from '../services/supabaseService.js';

export async function getAnalytics(req, res) {
  try {
    const summary = await getAnalyticsSummary();
    return res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
