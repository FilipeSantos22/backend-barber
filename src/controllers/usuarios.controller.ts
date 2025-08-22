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

            const emailExists = await UserController.checkEmailExists(req.body.email);
            if (emailExists) {
                return res.status(400).json({ error: 'Email ' + req.body.email + ' já cadastrado.' });
            }

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
    },

    async deleteById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            await UsuariosService.deleteById(id);
            res.sendStatus(204);
        } catch (err) {
            next(err);
        }
    },

    async checkEmailExists(email: string): Promise<boolean> {
        const user = await UsuariosService.findByEmail(email);
        return !!user;
    },

    async changePassword(req: Request, res: Response, next: NextFunction) {
        try {
            const idUsuario = Number(req.params.id);
            const { senhaAntiga, senha } = req.body;
            console.log({ idUsuario, senhaAntiga, senha });
            const user = await UsuariosService.findById(idUsuario);
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }

            const isMatch = await UsuariosService.comparePasswords(senhaAntiga, user.senha);
            if (!isMatch) {
                return res.status(401).json({ error: 'Senha antiga não confere.' });
            }

            await UsuariosService.updatePassword(idUsuario, senha);
            res.sendStatus(204);
        } catch (err) {
            next(err);
        }
    }
};