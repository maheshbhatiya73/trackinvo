
import { Request, Response } from 'express';
import Unit from '../model/Unit';

class UnitController {
  static async createUnit(req: Request, res: Response) {
    try {
      const { name, abbreviation } = req.body;
      const unit = new Unit({ name, abbreviation });
      await unit.save();
      res.status(201).json({ status: 'success', data: unit });
    } catch (error: any) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  static async getAllUnits(req: Request, res: Response) {
    try {
      const units = await Unit.find({ deleted: false });
      res.status(200).json({ status: 'success', data: units });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async getUnitById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const unit = await Unit.findOne({ _id: id, deleted: false });
      if (!unit) return res.status(404).json({ status: 'error', message: 'Unit not found' });
      res.status(200).json({ status: 'success', data: unit });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async updateUnit(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, abbreviation } = req.body;
      const unit = await Unit.findOneAndUpdate(
        { _id: id, deleted: false },
        { name, abbreviation, updated_at: new Date() },
        { new: true }
      );
      if (!unit) return res.status(404).json({ status: 'error', message: 'Unit not found' });
      res.status(200).json({ status: 'success', data: unit });
    } catch (error: any) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  static async deleteUnit(req: Request, res: Response) {
    try {
      const { id } = req.params;
      // Soft Delete
      const unit = await Unit.findOneAndUpdate(
        { _id: id, deleted: false },
        { deleted: true, updated_at: new Date() },
        { new: true }
      );
      // Hard Delete alternative: await Unit.findByIdAndDelete(id);
      if (!unit) return res.status(404).json({ status: 'error', message: 'Unit not found' });
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}

export default UnitController;