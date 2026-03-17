import React, { useState, useEffect } from 'react';
import { UserPlus, Pencil, Power, X, Save, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ToastContainer from '../components/Toast';
import { useToast } from '../hooks/useToast';
import ModalConfirmacao from '../components/ModalConfirmacao';
import LoadingSpinner from '../components/LoadingSpinner';

const PERFIS  = ['admin', 'profissional', 'visualizador'];
const PERFIL_BADGE = {
  admin:         'badge badge-blue',
  profissional:  'badge badge-green',
  visualizador:  'badge badge-gray',
};

const vazioNovo  = { nome: '', email: '', senha: '', perfil: 'profissional' };
const vazioEditar = { nome: '', email: '', perfil: 'profissional', senha: '' };

export default function UsuariosPage() {
  const [lista, setLista]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState(null);  // 'novo' | 'editar'
  const [form, setForm]           = useState({});
  const [saving, setSaving]       = useState(false);
  const [confirmar, setConfirmar] = useState(null);  // { id, ativo }
  const { usuario, isAdmin }      = useAuth();
  const { toasts, toast }         = useToast();

  const carregar = () => {
    setLoading(true);
    api.get('/users')
      .then(({ data }) => setLista(data.usuarios))
      .catch(() => toast('Erro ao carregar usuários', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { carregar(); }, []);

  if (!isAdmin) {
    return (
      <div className="card-p text-center py-16">
        <ShieldCheck size={40} className="text-gray-300 mx-auto mb-3" />
        <h2 className="font-semibold text-gray-700">Acesso restrito</h2>
        <p className="text-sm text-gray-400 mt-1">Apenas administradores podem gerenciar usuários.</p>
      </div>
    );
  }

  const set = (campo) => (e) => setForm(p => ({ ...p, [campo]: e.target.value }));

  const abrirNovo = () => { setForm({ ...vazioNovo }); setModal('novo'); };
  const abrirEditar = (u) => { setForm({ ...vazioEditar, nome: u.nome, email: u.email, perfil: u.perfil }); setModal({ tipo: 'editar', id: u.id }); };

  const salvarNovo = async () => {
    if (!form.nome || !form.email || !form.senha) {
      toast('Nome, email e senha são obrigatórios', 'error'); return;
    }
    setSaving(true);
    try {
      await api.post('/auth/registrar', form);
      toast('Usuário criado com sucesso', 'success');
      setModal(null);
      carregar();
    } catch (err) {
      toast(err.response?.data?.error || 'Erro ao criar usuário', 'error');
    } finally {
      setSaving(false);
    }
  };

  const salvarEdicao = async () => {
    setSaving(true);
    const payload = { nome: form.nome, email: form.email, perfil: form.perfil };
    if (form.senha) payload.senha = form.senha;
    try {
      await api.put(`/users/${modal.id}`, payload);
      toast('Usuário atualizado', 'success');
      setModal(null);
      carregar();
    } catch (err) {
      toast(err.response?.data?.error || 'Erro ao atualizar usuário', 'error');
    } finally {
      setSaving(false);
    }
  };

  const toggleAtivo = async ({ id, ativo }) => {
    try {
      if (ativo) {
        await api.delete(`/users/${id}`);
        toast('Usuário desativado', 'success');
      } else {
        await api.put(`/users/${id}`, { ativo: true });
        toast('Usuário reativado', 'success');
      }
      carregar();
    } catch (err) {
      toast(err.response?.data?.error || 'Erro ao alterar status', 'error');
    }
    setConfirmar(null);
  };

  return (
    <div className="space-y-5">
      <ToastContainer toasts={toasts} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
          <p className="text-gray-500 text-sm mt-1">Gerencie os acessos ao sistema</p>
        </div>
        <button className="btn btn-primary" onClick={abrirNovo}>
          <UserPlus size={16} /> Novo Usuário
        </button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Usuário</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Perfil</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {lista.map(u => (
                <tr key={u.id} className={`hover:bg-gray-50 transition-colors ${!u.ativo ? 'opacity-50' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#1E3A8A]/10 flex items-center justify-center text-[#1E3A8A] font-bold text-sm shrink-0">
                        {u.nome?.[0]?.toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900">{u.nome}</span>
                      {u.id === usuario?.id && <span className="text-xs text-gray-400">(você)</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={PERFIL_BADGE[u.perfil] || 'badge badge-gray'}>{u.perfil}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={u.ativo ? 'badge badge-green' : 'badge badge-gray'}>
                      {u.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                        title="Editar"
                        onClick={() => abrirEditar(u)}
                      >
                        <Pencil size={15} />
                      </button>
                      {u.id !== usuario?.id && (
                        <button
                          className={`p-1.5 rounded-lg transition-colors ${u.ativo ? 'hover:bg-red-50 text-red-400' : 'hover:bg-green-50 text-green-500'}`}
                          title={u.ativo ? 'Desativar' : 'Reativar'}
                          onClick={() => setConfirmar({ id: u.id, ativo: u.ativo, nome: u.nome })}
                        >
                          <Power size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Novo / Editar */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">{modal === 'novo' ? 'Novo Usuário' : 'Editar Usuário'}</h2>
              <button className="text-gray-400 hover:text-gray-600" onClick={() => setModal(null)}><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="label">Nome *</label>
                <input className="input" value={form.nome} onChange={set('nome')} placeholder="Nome completo" />
              </div>
              <div>
                <label className="label">Email *</label>
                <input className="input" type="email" value={form.email} onChange={set('email')} placeholder="email@exemplo.com" />
              </div>
              <div>
                <label className="label">Perfil</label>
                <select className="input" value={form.perfil} onChange={set('perfil')}>
                  {PERFIS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="label">{modal === 'novo' ? 'Senha *' : 'Nova senha (deixe em branco para manter)'}</label>
                <input className="input" type="password" value={form.senha} onChange={set('senha')} placeholder="Mínimo 8 caracteres" />
              </div>
            </div>
            <div className="flex gap-3 justify-end p-5 border-t border-gray-100">
              <button className="btn btn-secondary" onClick={() => setModal(null)}><X size={16} /> Cancelar</button>
              <button className="btn btn-primary" onClick={modal === 'novo' ? salvarNovo : salvarEdicao} disabled={saving}>
                {saving ? 'Salvando...' : <><Save size={16} /> Salvar</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmar && (
        <ModalConfirmacao
          mensagem={confirmar.ativo
            ? `Desativar o usuário "${confirmar.nome}"? Ele não conseguirá mais fazer login.`
            : `Reativar o usuário "${confirmar.nome}"?`
          }
          onConfirmar={() => toggleAtivo(confirmar)}
          onCancelar={() => setConfirmar(null)}
        />
      )}
    </div>
  );
}
