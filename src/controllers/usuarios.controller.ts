import type { Request, Response, NextFunction } from 'express';
import { UsuariosService } from '../services/usuarios.service';

export const UserController = {
  async listar(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await UsuariosService.listar();
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  async criar(req: Request, res: Response, next: NextFunction) {
    try {
      const created = await UsuariosService.criar(req.body);
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  },

  // opcional: buscar por id
  async buscarPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const user = await UsuariosService.listar(); // ajuste se houver método específico
      res.json(user);
    } catch (err) {
      next(err);
    }
  }
};