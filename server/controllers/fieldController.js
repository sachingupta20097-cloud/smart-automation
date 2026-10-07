import { getFields, getFieldById, createField } from '../services/supabaseService.js';

export async function listFields(req, res) {
  try {
    const fields = await getFields();
    return res.json({ success: true, data: fields });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function getField(req, res) {
  try {
    const { id } = req.params;
    const field = await getFieldById(id);
    if (!field) return res.status(404).json({ success: false, error: 'Field not found' });
    return res.json({ success: true, data: field });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function addField(req, res) {
  try {
    const field = await createField(req.body);
    return res.status(201).json({ success: true, data: field });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
