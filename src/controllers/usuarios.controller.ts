import type { Request, Response, NextFunction } from 'express';
import { UsuariosService } from '../services/usuarios.service';

export const UserController = {
    async findAll(_req: Request, res: Response, next: NextFunction) {
        try {
            const data = await UsuariosService.findAll();
            res.json(data);
        } catch (err) {
            next(err);
        }
    },

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const created = await UsuariosService.create(req.body);
            res.status(201).json(created);
        } catch (err) {
            next(err);
        }
    },


    async findById(req: Request, res: Response, next: NextFunction) {
        try {
            const raw = String(req.params.id);
            if (!/^\d+$/.test(raw)) {
                return res.status(400).json({ error: 'id inválido. Deve conter apenas números.' });
            }
            const idUsuario = Number(req.params.id);
            const user = await UsuariosService.findById(idUsuario);
            res.json(user);
        } catch (err) {
            next(err);
        }
    },


    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const user = await UsuariosService.update(id, req.body);
            res.json(user);
        } catch (err) {
            next(err);
        }
    }
};