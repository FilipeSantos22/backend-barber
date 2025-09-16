import type { Request, Response, NextFunction } from 'express';
import { UsuariosService } from '../services/usuarios.service';

export const UsuariosController = {
    async listar(req: Request, res: Response) {
        const { email } = req.query;
        if (email) {
            // Buscar por email
            const usuario = await UsuariosService.buscarPorEmail(email as string);
            if (!usuario) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }
            return res.json(usuario);
        }
        // Listar todos
        const usuarios = await UsuariosService.listarTodos();
        return res.json(usuarios);
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
            .location(`/api/usuarios/${publicUser.id}`)
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
            const id = Number(req.params.id);
            const user = await UsuariosService.buscarPorId(id);
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
            const id = Number(req.params.id);
            const { senhaAntiga, senha } = req.body;

            const user = await UsuariosService.buscarPorId(id);
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }

            const isMatch = await UsuariosService.compararSenhas(senhaAntiga, user.senha);
            if (!isMatch) {
                return res.status(401).json({ error: 'Senha antiga não confere.' });
            }

            await UsuariosService.atualizarSenha(id, senha);
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
            const id = Number(raw);

            const tipoUsuario = await UsuariosService.verTipoUsuario(id);
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
                ? await UsuariosService.listarAgendamentosBarbeiro(id)
                : await UsuariosService.listarAgendamentosCliente(id);

            if (Array.isArray(agendamentos) && agendamentos.length > 0) {
                return res.json(agendamentos);
            }

            return res.status(404).json({ message: 'Nenhum agendamento encontrado para este usuário.' });
        } catch (err) {
            next(err);
        }
    },

    async buscarPorEmail(req: Request, res: Response, next: NextFunction) {
        try {
            const email = String(req.query.email ?? '').trim();
            if (!email) {
                return res.status(400).json({ error: 'Email é obrigatório.' });
            }

            const user = await UsuariosService.buscarPorEmail(email);
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }

            res.json(user);
        } catch (err) {
            next(err);
        }
    },
}