import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Save } from 'lucide-react';
import api from '../services/api';
import ToastContainer from '../components/Toast';
import { useToast } from '../hooks/useToast';

export default function ConfiguracoesPage() {
  const [form, setForm]       = useState({ senha_atual: '', nova_senha: '', confirmar: '' });
  const [mostrar, setMostrar] = useState({ atual: false, nova: false, confirmar: false });
  const [loading, setLoading] = useState(false);
  const { toasts, toast }     = useToast();

  const set = (campo) => (e) => setForm(p => ({ ...p, [campo]: e.target.value }));
  const toggle = (campo) => () => setMostrar(p => ({ ...p, [campo]: !p[campo] }));

  const salvar = async (e) => {
    e.preventDefault();

    if (form.nova_senha !== form.confirmar) {
      toast('A nova senha e a confirmação não coincidem', 'error'); return;
    }
    if (form.nova_senha.length < 8) {
      toast('A nova senha deve ter no mínimo 8 caracteres', 'error'); return;
    }

    setLoading(true);
    try {
      await api.put('/auth/alterar-senha', {
        senha_atual: form.senha_atual,
        nova_senha: form.nova_senha,
      });
      toast('Senha alterada com sucesso!', 'success');
      setForm({ senha_atual: '', nova_senha: '', confirmar: '' });
    } catch (err) {
      toast(err.response?.data?.error || 'Erro ao alterar senha', 'error');
    } finally {
      setLoading(false);
    }
  };

  function CampoSenha({ label, campo, mostrarCampo }) {
    return (
      <div>
        <label className="label">{label}</label>
        <div className="relative">
          <input
            className="input pr-10"
            type={mostrar[mostrarCampo] ? 'text' : 'password'}
            value={form[campo]}
            onChange={set(campo)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={toggle(mostrarCampo)}
          >
            {mostrar[mostrarCampo] ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-lg">
      <ToastContainer toasts={toasts} />

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-500 text-sm mt-1">Gerencie as configurações da sua conta</p>
      </div>

      <div className="card-p">
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-100">
          <Lock size={16} className="text-teal-600" />
          <h2 className="font-semibold text-gray-900 text-sm">Alterar Senha</h2>
        </div>

        <form onSubmit={salvar} className="space-y-4">
          <CampoSenha label="Senha atual" campo="senha_atual" mostrarCampo="atual" />
          <CampoSenha label="Nova senha" campo="nova_senha" mostrarCampo="nova" />
          <CampoSenha label="Confirmar nova senha" campo="confirmar" mostrarCampo="confirmar" />

          <div className="pt-2">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Salvando...' : <><Save size={16} /> Salvar nova senha</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
