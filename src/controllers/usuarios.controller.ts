import type { Request, Response, NextFunction } from 'express';
import { UsuariosService } from '../services/usuarios.service';

export const UsuariosController = {
    async listar(_req: Request, res: Response, next: NextFunction) {
        try {
            const data = await UsuariosService.listarTodos();
            res.json(data);
        } catch (err) {
            next(err);
        }
    },

    async criar(req: Request, res: Response, next: NextFunction) {
        try {

            const emailExists = await UsuariosController.checarEmailExiste(req.body.email);
            if (emailExists) {
                return res.status(400).json({ error: 'Email ' + req.body.email + ' já cadastrado.' });
            }

            const created = await UsuariosService.criar(req.body);
            res.status(201).json(created);
        } catch (err) {
            next(err);
        }
    },

    async buscarPorId(req: Request, res: Response, next: NextFunction) {
        try {
            const raw = String(req.params.id);
            if (!/^\d+$/.test(raw)) {
                return res.status(400).json({ error: 'id inválido. Deve conter apenas números.' });
            }
            const idUsuario = Number(req.params.id);
            const user = await UsuariosService.buscarPorId(idUsuario);
            res.json(user);
        } catch (err) {
            next(err);
        }
    },

    async atualizar(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const user = await UsuariosService.atualizar(id, req.body);
            res.json(user);
        } catch (err) {
            next(err);
        }
    },

    async remover(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            await UsuariosService.deletarPorId(id);
            res.sendStatus(204);
        } catch (err) {
            next(err);
        }
    },

    async checarEmailExiste(email: string): Promise<boolean> {
        const user = await UsuariosService.buscarPorEmail(email);
        return !!user;
    },

    async mudarSenha(req: Request, res: Response, next: NextFunction) {
        try {
            const idUsuario = Number(req.params.id);
            const { senhaAntiga, senha } = req.body;

            const user = await UsuariosService.buscarPorId(idUsuario);
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }

            const isMatch = await UsuariosService.compararSenhas(senhaAntiga, user.senha);
            if (!isMatch) {
                return res.status(401).json({ error: 'Senha antiga não confere.' });
            }

            await UsuariosService.atualizarSenha(idUsuario, senha);
            res.sendStatus(204);
        } catch (err) {
            next(err);
        }
    }
};