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
            if (!created) {
                return res.status(500).json({ error: 'Erro ao criar usuário.' });
            }
            const { senha, ...publicUser } = created;

            res.status(201)
            .location(`/api/usuarios/${publicUser.idUsuario}`)
            .json(publicUser);
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
            const raw = String(req.params.id ?? '');
            if (!/^\d+$/.test(raw)) {
                return res.status(400).json({ error: 'id inválido. Deve conter apenas números.' });
            }
            const id = Number(raw);
            await UsuariosService.remover(id);

            return res.status(200).json({ message: 'Usuário excluído com sucesso.' });
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
            res.status(200).json({ message: 'Senha atualizada com sucesso.' });
        } catch (err) {
            next(err);
        }
    },

    async listarAgendamentos(req: Request, res: Response, next: NextFunction) {
        try {
            const raw = String(req.params.id ?? '');
            if (!/^\d+$/.test(raw)) {
                return res.status(400).json({ error: 'id inválido' });
            }
            const idUsuario = Number(raw);

            const tipoUsuario = await UsuariosService.verTipoUsuario(idUsuario);
            if (tipoUsuario !== 'barbeiro' && tipoUsuario !== 'cliente') {
                return res.status(400).json({ error: 'Tipo de usuário inválido' });
            }

            if (req.path.includes('agendamentos-barbeiro') && tipoUsuario !== 'barbeiro') {
                return res.status(400).json({ error: 'O usuário não é um barbeiro.' });
            }

            if (req.path.includes('agendamentos-cliente') && tipoUsuario !== 'cliente') {
                return res.status(400).json({ error: 'O usuário não é um cliente.' });
            }

            const agendamentos = tipoUsuario === 'barbeiro'
                ? await UsuariosService.listarAgendamentosBarbeiro(idUsuario)
                : await UsuariosService.listarAgendamentosCliente(idUsuario);

            if (Array.isArray(agendamentos) && agendamentos.length > 0) {
                return res.json(agendamentos);
            }

            return res.status(404).json({ message: 'Nenhum agendamento encontrado para este usuário.' });
        } catch (err) {
            next(err);
        }
    },

};