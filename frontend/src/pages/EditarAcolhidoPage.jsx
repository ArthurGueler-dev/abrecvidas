import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../services/api';
import FormAcolhido from '../components/FormAcolhido';
import ToastContainer from '../components/Toast';
import { useToast } from '../hooks/useToast';

export default function EditarAcolhidoPage() {
  const { id }            = useParams();
  const [acolhido, setAcolhido] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [buscando, setBuscando] = useState(true);
  const [erros, setErros]       = useState({});
  const navigate                = useNavigate();
  const { toasts, toast }       = useToast();

  const toDate = (v) => v ? v.toString().slice(0, 10) : '';

  useEffect(() => {
    api.get(`/acolhidos/${id}`)
      .then(({ data }) => {
        const d = data.dados;
        setAcolhido({
          ...d,
          data_nascimento: toDate(d.data_nascimento),
          data_admissao:   toDate(d.data_admissao),
          data_alta:       toDate(d.data_alta),
        });
      })
      .catch(() => { toast('Acolhido não encontrado', 'error'); navigate('/acolhidos'); })
      .finally(() => setBuscando(false));
  }, [id]);

  const handleSubmit = async (dados) => {
    setLoading(true);
    setErros({});
    try {
      await api.put(`/acolhidos/${id}`, dados);
      navigate('/acolhidos', { state: { sucesso: 'Acolhido atualizado com sucesso!' } });
    } catch (err) {
      if (err.response?.data?.erros) {
        setErros(err.response.data.erros);
        toast('Corrija os erros no formulário', 'error');
      } else {
        toast(err.response?.data?.erro || 'Erro ao atualizar', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  if (buscando) {
    return (
      <div className="py-20 text-center text-gray-400">
        <div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full mx-auto mb-3" />
        Carregando...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <ToastContainer toasts={toasts} />

      <div className="flex items-center gap-3">
        <button className="btn btn-ghost p-2" onClick={() => navigate('/acolhidos')}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editar Acolhido</h1>
          <p className="text-gray-500 text-sm">{acolhido?.nome}</p>
        </div>
      </div>

      {acolhido && (
        <FormAcolhido acolhido={acolhido} onSubmit={handleSubmit} loading={loading} erros={erros} />
      )}
    </div>
  );
}
