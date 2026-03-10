import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../services/api';
import FormAcolhido from '../components/FormAcolhido';
import ToastContainer from '../components/Toast';
import { useToast } from '../hooks/useToast';

export default function NovoAcolhidoPage() {
  const [loading, setLoading] = useState(false);
  const [erros, setErros]     = useState({});
  const navigate              = useNavigate();
  const { toasts, toast }     = useToast();

  const handleSubmit = async (dados) => {
    setLoading(true);
    setErros({});
    try {
      await api.post('/acolhidos', dados);
      navigate('/acolhidos', { state: { sucesso: 'Acolhido cadastrado com sucesso!' } });
    } catch (err) {
      if (err.response?.data?.erros) {
        setErros(err.response.data.erros);
        toast('Corrija os erros no formulário', 'error');
      } else {
        toast(err.response?.data?.erro || 'Erro ao cadastrar acolhido', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <ToastContainer toasts={toasts} />

      <div className="flex items-center gap-3">
        <button className="btn btn-ghost p-2" onClick={() => navigate('/acolhidos')}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Novo Acolhido</h1>
          <p className="text-gray-500 text-sm">Preencha os dados para cadastrar</p>
        </div>
      </div>

      <FormAcolhido onSubmit={handleSubmit} loading={loading} erros={erros} />
    </div>
  );
}
