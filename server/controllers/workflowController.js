import {
  getWorkflowTasks,
  updateWorkflowTaskStatus
} from '../services/supabaseService.js';

export async function listWorkflowTasks(req, res) {
  try {
    const { status } = req.query;
    const tasks = await getWorkflowTasks(status);
    return res.json({ success: true, data: tasks });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function getPendingApprovalTasks(req, res) {
  try {
    const pendingTasks = await getWorkflowTasks('PENDING_APPROVAL');
    return res.json({ success: true, data: pendingTasks });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function approveOrRejectTask(req, res) {
  try {
    const { taskId } = req.params;
    const { action, notes, overridePayload, agronomistId } = req.body;

    const newStatus = action === 'APPROVE' ? 'IN_PROGRESS' : action === 'EXECUTE' ? 'COMPLETED' : 'REJECTED';

    const updatedTask = await updateWorkflowTaskStatus(taskId, {
      status: newStatus,
      approvedBy: agronomistId || req.user?.id || '22222222-2222-2222-2222-222222222222',
      notes,
      overridePayload
    });

    if (!updatedTask) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    // Mock hardware dispatch trigger log
    const isHardwareDispatched = newStatus === 'IN_PROGRESS' || newStatus === 'COMPLETED';

    return res.json({
      success: true,
      message: `Task ${action === 'APPROVE' ? 'approved and dispatched to hardware' : 'rejected'} successfully`,
      data: {
        task: updatedTask,
        hardwareDispatch: isHardwareDispatched ? {
          dispatched: true,
          timestamp: new Date().toISOString(),
          protocol: 'MQTT/LoRaWAN',
          status: 'COMMAND_ACKNOWLEDGED'
        } : null
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function updateTaskStatus(req, res) {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const updated = await updateWorkflowTaskStatus(taskId, { status });
    if (!updated) return res.status(404).json({ success: false, error: 'Task not found' });
    return res.json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
