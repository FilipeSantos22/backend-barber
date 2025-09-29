import type { Request, Response, NextFunction } from 'express';
import { UsuariosService } from '../services/usuarios.service';

function mapUserToAdapterUser(user: any) {
    return {
        id: String(user.id), // sempre como string!
        email: user.email,
        emailVerified: user.emailverified ?? null,
        name: user.name ?? "",
        image: user.image ?? "",
        tipo: user.tipo ?? "cliente",
        idBarbearia: user.idBarbearia ?? null,
        telefone: user.telefone ?? null,
        // outros campos se quiser
    };
}

export const UsuariosController = {
    async listar(req: Request, res: Response) {
        const { email } = req.query;
        if (email) {
            // Buscar por email
            const usuario = await UsuariosService.buscarPorEmail(email as string);
            if (!usuario) {
                return res.status(200).json(usuario ?? []);
            }
            return res.json(mapUserToAdapterUser(usuario));
        }
        // Listar todos
        const usuarios = await UsuariosService.listarTodos();
        return res.json(usuarios);
    },

    async criar(req: Request, res: Response, next: NextFunction) {
        try {
            const emailExists = await UsuariosController.checarEmailExiste(req.body.email);
            if (emailExists) {
                const usuario = await UsuariosService.buscarPorEmail(req.body.email);
                return res.status(200).json(mapUserToAdapterUser(usuario));
            }

            // Gera uma senha aleatória caso não exista (para usuários OAuth)
            if (!req.body.password) {
                req.body.password = Math.random().toString(36).slice(-10);
            }
            const created = await UsuariosService.criar(req.body);
            if (!created) {
                return res.status(500).json({ error: 'Erro ao criar usuário.' });
            }
            const { password, ...publicUser } = created;
            res.status(201)
            .location(`/api/usuarios/${publicUser.id}`)
            .json(mapUserToAdapterUser(publicUser));
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
            res.json(mapUserToAdapterUser(user));
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

    async recuperarSenha(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, novaSenha } = req.body;
            if (!email || !novaSenha) {
                return res.status(400).json({ error: "E-mail e nova senha são obrigatórios." });
            }

            const user = await UsuariosService.buscarPorEmail(email);
            if (!user) {
                return res.status(404).json({ error: "Usuário não encontrado." });
            }

            await UsuariosService.atualizarSenha(user.id, novaSenha);
            res.status(200).json({ message: "Senha atualizada com sucesso." });
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
                return res.status(200).json(user ?? []);
            }

            res.json(user);
        } catch (err) {
            next(err);
        }
    },

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ error: "E-mail e senha são obrigatórios." });
            }

            const user = await UsuariosService.buscarPorEmail(email);
            if (!user) {
                return res.status(401).json({ error: "Usuário não encontrado." });
            }

            const passwordCorrect = await UsuariosService.compararSenhas(password, user.password);
            if (!passwordCorrect) {
                return res.status(401).json({ error: "Senha inválida." });
            }

            // Remova a senha antes de retornar o usuário
            const { password: _password, ...publicUser } = user;
            return res.json(publicUser);
        } catch (err) {
            next(err);
        }
    }
};