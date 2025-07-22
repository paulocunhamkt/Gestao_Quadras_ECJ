import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, DollarSign, Plus, Edit, Trash2, Save, X, Search, Filter } from 'lucide-react';

const QuadraManagementSystem = () => {
  const { useStoredState } = hatch;
  
  // Estados para dados
  const [quadras, setQuadras] = useStoredState('quadras', [
    { id: 1, nome: 'Campo de Futebol 1', modalidade: 'Campo de Futebol', valorHora: 100, ativa: true },
    { id: 2, nome: 'Quadra de Futsal 1', modalidade: 'Quadra de Futsal', valorHora: 80, ativa: true }
  ]);
  
  const [clientes, setClientes] = useStoredState('clientes', [
    { id: 1, nome: 'João Silva', telefone: '(11) 99999-9999', email: 'joao@email.com' },
    { id: 2, nome: 'Maria Santos', telefone: '(11) 88888-8888', email: 'maria@email.com' }
  ]);
  
  const [reservas, setReservas] = useStoredState('reservas', []);
  
  // Estados da interface
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroData, setFiltroData] = useState('');
  const [mesImpressao, setMesImpressao] = useState(new Date().toISOString().slice(0, 7));

  // Formulários
  const [formQuadra, setFormQuadra] = useState({ nome: '', modalidade: '', valorHora: '', ativa: true });
  const [formCliente, setFormCliente] = useState({ nome: '', telefone: '', email: '' });
  const [formReserva, setFormReserva] = useState({
    quadraId: '',
    clienteId: '',
    data: '',
    horaInicio: '',
    horaFim: '',
    valor: '',
    status: 'Confirmada',
    observacoes: ''
  });

  // Funções para Quadras
  const adicionarQuadra = () => {
    if (editingItem) {
      setQuadras(quadras.map(q => q.id === editingItem.id ? 
        { ...formQuadra, id: editingItem.id, valorHora: parseFloat(formQuadra.valorHora) } : q
      ));
    } else {
      const novaQuadra = {
        id: Date.now(),
        ...formQuadra,
        valorHora: parseFloat(formQuadra.valorHora)
      };
      setQuadras([...quadras, novaQuadra]);
    }
    fecharModal();
  };

  const editarQuadra = (quadra) => {
    setEditingItem(quadra);
    setFormQuadra({
      nome: quadra.nome,
      modalidade: quadra.modalidade,
      valorHora: quadra.valorHora.toString(),
      ativa: quadra.ativa
    });
    setModalType('quadra');
    setShowModal(true);
  };

  const excluirQuadra = (id) => {
    if (confirm('Tem certeza que deseja excluir esta quadra?')) {
      setQuadras(quadras.filter(q => q.id !== id));
    }
  };

  // Funções para Clientes
  const adicionarCliente = () => {
    if (editingItem) {
      setClientes(clientes.map(c => c.id === editingItem.id ? 
        { ...formCliente, id: editingItem.id } : c
      ));
    } else {
      const novoCliente = {
        id: Date.now(),
        ...formCliente
      };
      setClientes([...clientes, novoCliente]);
    }
    fecharModal();
  };

  const editarCliente = (cliente) => {
    setEditingItem(cliente);
    setFormCliente({
      nome: cliente.nome,
      telefone: cliente.telefone,
      email: cliente.email
    });
    setModalType('cliente');
    setShowModal(true);
  };

  const excluirCliente = (id) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      setClientes(clientes.filter(c => c.id !== id));
    }
  };

  // Funções para Reservas
  const adicionarReserva = () => {
    const quadra = quadras.find(q => q.id === parseInt(formReserva.quadraId));
    const horaInicio = new Date(`${formReserva.data}T${formReserva.horaInicio}`);
    const horaFim = new Date(`${formReserva.data}T${formReserva.horaFim}`);
    const horas = (horaFim - horaInicio) / (1000 * 60 * 60);
    const valorCalculado = horas * quadra.valorHora;

    if (editingItem) {
      setReservas(reservas.map(r => r.id === editingItem.id ? 
        { 
          ...formReserva, 
          id: editingItem.id,
          quadraId: parseInt(formReserva.quadraId),
          clienteId: parseInt(formReserva.clienteId),
          valor: parseFloat(formReserva.valor) || valorCalculado
        } : r
      ));
    } else {
      const novaReserva = {
        id: Date.now(),
        ...formReserva,
        quadraId: parseInt(formReserva.quadraId),
        clienteId: parseInt(formReserva.clienteId),
        valor: parseFloat(formReserva.valor) || valorCalculado
      };
      setReservas([...reservas, novaReserva]);
    }
    fecharModal();
  };

  const editarReserva = (reserva) => {
    setEditingItem(reserva);
    setFormReserva({
      quadraId: reserva.quadraId.toString(),
      clienteId: reserva.clienteId.toString(),
      data: reserva.data,
      horaInicio: reserva.horaInicio,
      horaFim: reserva.horaFim,
      valor: reserva.valor.toString(),
      status: reserva.status,
      observacoes: reserva.observacoes || ''
    });
    setModalType('reserva');
    setShowModal(true);
  };

  const excluirReserva = (id) => {
    if (confirm('Tem certeza que deseja excluir esta reserva?')) {
      setReservas(reservas.filter(r => r.id !== id));
    }
  };

  const fecharModal = () => {
    setShowModal(false);
    setModalType('');
    setEditingItem(null);
    setFormQuadra({ nome: '', modalidade: '', valorHora: '', ativa: true });
    setFormCliente({ nome: '', telefone: '', email: '' });
    setFormReserva({
      quadraId: '',
      clienteId: '',
      data: '',
      horaInicio: '',
      horaFim: '',
      valor: '',
      status: 'Confirmada',
      observacoes: ''
    });
  };

  // Calcular estatísticas
  const hoje = new Date().toISOString().split('T')[0];
  const reservasHoje = reservas.filter(r => r.data === hoje);
  const receitaMensal = reservas
    .filter(r => r.data.startsWith(new Date().toISOString().slice(0, 7)))
    .reduce((acc, r) => acc + r.valor, 0);

  // Filtrar dados
  const reservasFiltradas = reservas.filter(reserva => {
    const quadra = quadras.find(q => q.id === reserva.quadraId);
    const cliente = clientes.find(c => c.id === reserva.clienteId);
    const matchSearch = !searchTerm || 
      quadra?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente?.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchData = !filtroData || reserva.data === filtroData;
    return matchSearch && matchData;
  });

  return (
    <>
      <style jsx>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 1cm;
          }
          
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          .print\\:break-inside-avoid {
            break-inside: avoid;
          }
          
          .print\\:text-xs {
            font-size: 0.75rem;
          }
          
          .print\\:text-sm {
            font-size: 0.875rem;
          }
          
          .print\\:text-lg {
            font-size: 1.125rem;
          }
          
          .print\\:p-2 {
            padding: 0.5rem;
          }
          
          .print\\:mb-4 {
            margin-bottom: 1rem;
          }
          
          .print\\:mt-4 {
            margin-top: 1rem;
          }
          
          .print\\:gap-2 {
            gap: 0.5rem;
          }
          
          .print\\:space-x-4 > * + * {
            margin-left: 1rem;
          }
          
          .print\\:shadow-none {
            box-shadow: none;
          }
          
          .print\\:bg-gray-100 {
            background-color: #f3f4f6;
          }
        }
      `}</style>
      <div className="w-full h-full bg-gray-50 overflow-auto">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800">Gestão de Quadras Esportivas</h1>
        <p className="text-gray-600">Sistema completo para controle de aluguel</p>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <nav className="flex space-x-8 px-6">
          {['dashboard', 'reservas', 'quadras', 'clientes', 'impressao'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-2 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'dashboard' ? 'Painel' : 
               tab === 'impressao' ? 'Impressão' : tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Reservas Hoje</p>
                    <p className="text-2xl font-bold text-gray-900">{reservasHoje.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Receita Mensal</p>
                    <p className="text-2xl font-bold text-gray-900">R$ {receitaMensal.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-purple-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Clientes</p>
                    <p className="text-2xl font-bold text-gray-900">{clientes.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-orange-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Quadras Ativas</p>
                    <p className="text-2xl font-bold text-gray-900">{quadras.filter(q => q.ativa).length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Próximas Reservas */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h3 className="text-lg font-medium text-gray-900">Próximas Reservas</h3>
              </div>
              <div className="p-6">
                {reservas.slice(0, 5).map((reserva) => {
                  const quadra = quadras.find(q => q.id === reserva.quadraId);
                  const cliente = clientes.find(c => c.id === reserva.clienteId);
                  return (
                    <div key={reserva.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                      <div>
                        <p className="font-medium">{quadra?.nome}</p>
                        <p className="text-sm text-gray-600">{cliente?.nome} - {reserva.data} às {reserva.horaInicio}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        reserva.status === 'Confirmada' ? 'bg-green-100 text-green-800' :
                        reserva.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {reserva.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Reservas */}
        {activeTab === 'reservas' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Reservas</h2>
              <button
                onClick={() => {
                  setModalType('reserva');
                  setShowModal(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                <span>Nova Reserva</span>
              </button>
            </div>

            {/* Filtros */}
            <div className="bg-white p-4 rounded-lg shadow flex space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Buscar por quadra ou cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <input
                  type="date"
                  value={filtroData}
                  onChange={(e) => setFiltroData(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            {/* Lista de Reservas */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data/Hora</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quadra</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reservasFiltradas.map((reserva) => {
                    const quadra = quadras.find(q => q.id === reserva.quadraId);
                    const cliente = clientes.find(c => c.id === reserva.clienteId);
                    return (
                      <tr key={reserva.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {reserva.data} {reserva.horaInicio}-{reserva.horaFim}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quadra?.nome}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cliente?.nome}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">R$ {reserva.valor?.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            reserva.status === 'Confirmada' ? 'bg-green-100 text-green-800' :
                            reserva.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {reserva.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => editarReserva(reserva)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => excluirReserva(reserva.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quadras */}
        {activeTab === 'quadras' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Quadras</h2>
              <button
                onClick={() => {
                  setModalType('quadra');
                  setShowModal(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                <span>Nova Quadra</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quadras.map((quadra) => (
                <div key={quadra.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium text-gray-900">{quadra.nome}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      quadra.ativa ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {quadra.ativa ? 'Ativa' : 'Inativa'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">Modalidade: {quadra.modalidade}</p>
                  <p className="text-gray-900 font-medium mb-4">R$ {quadra.valorHora}/hora</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => editarQuadra(quadra)}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => excluirQuadra(quadra.id)}
                      className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Clientes */}
        {activeTab === 'clientes' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Clientes</h2>
              <button
                onClick={() => {
                  setModalType('cliente');
                  setShowModal(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                <span>Novo Cliente</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clientes.map((cliente) => (
                    <tr key={cliente.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cliente.nome}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cliente.telefone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cliente.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => editarCliente(cliente)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => excluirCliente(cliente.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Impressão de Horário Mensal */}
        {activeTab === 'impressao' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Impressão de Horário Mensal</h2>
              <div className="flex space-x-3">
                <input
                  type="month"
                  value={mesImpressao}
                  onChange={(e) => setMesImpressao(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
                <button
                  onClick={() => window.print()}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  <span>Imprimir</span>
                </button>
              </div>
            </div>

            {/* Grade de Horários */}
            <div className="bg-white rounded-lg shadow overflow-hidden print:shadow-none">
              <div className="p-6 print:p-2">
                <div className="text-center mb-6 print:mb-4">
                  <h1 className="text-2xl font-bold text-gray-900 print:text-lg">
                    Horários de Reservas - {new Date(mesImpressao + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase()}
                  </h1>
                  <p className="text-gray-600 print:text-sm">Gestão de Quadras Esportivas</p>
                </div>

                {/* Tabela de Horários */}
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300 print:text-xs">
                    <thead>
                      <tr className="bg-gray-50 print:bg-gray-100">
                        <th className="border border-gray-300 px-2 py-1 text-left font-medium">Data</th>
                        <th className="border border-gray-300 px-2 py-1 text-left font-medium">Dia</th>
                        {quadras.filter(q => q.ativa).map(quadra => (
                          <th key={quadra.id} className="border border-gray-300 px-2 py-1 text-left font-medium min-w-32">
                            {quadra.nome}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const [ano, mes] = mesImpressao.split('-');
                        const diasNoMes = new Date(parseInt(ano), parseInt(mes), 0).getDate();
                        const dias = [];
                        
                        for (let dia = 1; dia <= diasNoMes; dia++) {
                          const dataCompleta = `${mesImpressao}-${dia.toString().padStart(2, '0')}`;
                          const dataObj = new Date(dataCompleta);
                          const diaSemana = dataObj.toLocaleDateString('pt-BR', { weekday: 'short' });
                          
                          const reservasDoDia = reservas.filter(r => r.data === dataCompleta);
                          
                          dias.push(
                            <tr key={dia} className={`${dia % 2 === 0 ? 'bg-gray-50' : 'bg-white'} print:break-inside-avoid`}>
                              <td className="border border-gray-300 px-2 py-1 font-medium">
                                {dia.toString().padStart(2, '0')}
                              </td>
                              <td className="border border-gray-300 px-2 py-1">
                                {diaSemana}
                              </td>
                              {quadras.filter(q => q.ativa).map(quadra => {
                                const reservasQuadra = reservasDoDia.filter(r => r.quadraId === quadra.id);
                                return (
                                  <td key={quadra.id} className="border border-gray-300 px-1 py-1 text-xs">
                                    {reservasQuadra.map((reserva, index) => {
                                      const cliente = clientes.find(c => c.id === reserva.clienteId);
                                      return (
                                        <div 
                                          key={index}
                                          className={`mb-1 p-1 rounded text-xs ${
                                            reserva.status === 'Confirmada' ? 'bg-green-100' :
                                            reserva.status === 'Pendente' ? 'bg-yellow-100' :
                                            'bg-red-100'
                                          }`}
                                        >
                                          <div className="font-medium">{reserva.horaInicio}-{reserva.horaFim}</div>
                                          <div className="truncate">{cliente?.nome || 'Cliente não encontrado'}</div>
                                          <div className="text-gray-600">R$ {reserva.valor?.toFixed(2)}</div>
                                        </div>
                                      );
                                    })}
                                    {reservasQuadra.length === 0 && (
                                      <div className="text-gray-400 text-center">-</div>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        }
                        
                        return dias;
                      })()}
                    </tbody>
                  </table>
                </div>

                {/* Legenda */}
                <div className="mt-6 print:mt-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3 print:text-sm">Legenda de Status</h3>
                  <div className="flex space-x-6 print:space-x-4 print:text-xs">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-100 rounded mr-2"></div>
                      <span>Confirmada</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-yellow-100 rounded mr-2"></div>
                      <span>Pendente</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-red-100 rounded mr-2"></div>
                      <span>Cancelada</span>
                    </div>
                  </div>
                </div>

                {/* Resumo Mensal */}
                <div className="mt-6 print:mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 print:gap-2">
                  <div className="bg-blue-50 p-4 rounded-lg print:p-2">
                    <h4 className="font-medium text-blue-900 print:text-sm">Total de Reservas</h4>
                    <p className="text-2xl font-bold text-blue-600 print:text-lg">
                      {reservas.filter(r => r.data.startsWith(mesImpressao)).length}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg print:p-2">
                    <h4 className="font-medium text-green-900 print:text-sm">Receita Total</h4>
                    <p className="text-2xl font-bold text-green-600 print:text-lg">
                      R$ {reservas
                        .filter(r => r.data.startsWith(mesImpressao))
                        .reduce((acc, r) => acc + (r.valor || 0), 0)
                        .toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg print:p-2">
                    <h4 className="font-medium text-purple-900 print:text-sm">Taxa de Ocupação</h4>
                    <p className="text-2xl font-bold text-purple-600 print:text-lg">
                      {(() => {
                        const diasNoMes = new Date(mesImpressao.split('-')[0], mesImpressao.split('-')[1], 0).getDate();
                        const totalSlotsPossiveis = diasNoMes * quadras.filter(q => q.ativa).length;
                        const slotsOcupados = reservas.filter(r => r.data.startsWith(mesImpressao) && r.status === 'Confirmada').length;
                        return totalSlotsPossiveis > 0 ? Math.round((slotsOcupados / totalSlotsPossiveis) * 100) : 0;
                      })()}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {editingItem ? 'Editar' : 'Nova'} {
                  modalType === 'quadra' ? 'Quadra' :
                  modalType === 'cliente' ? 'Cliente' : 'Reserva'
                }
              </h3>
              <button onClick={fecharModal}>
                <X className="h-5 w-5" />
              </button>
            </div>

            {modalType === 'quadra' && (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nome da quadra"
                  value={formQuadra.nome}
                  onChange={(e) => setFormQuadra({...formQuadra, nome: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <select
                  value={formQuadra.modalidade}
                  onChange={(e) => setFormQuadra({...formQuadra, modalidade: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Selecione a modalidade</option>
                  <option value="Campo de Futebol">Campo de Futebol</option>
                  <option value="Quadra de Futsal">Quadra de Futsal</option>
                </select>
                <input
                  type="number"
                  placeholder="Valor por hora"
                  value={formQuadra.valorHora}
                  onChange={(e) => setFormQuadra({...formQuadra, valorHora: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formQuadra.ativa}
                    onChange={(e) => setFormQuadra({...formQuadra, ativa: e.target.checked})}
                    className="mr-2"
                  />
                  Quadra ativa
                </label>
                <button
                  onClick={adicionarQuadra}
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                  {editingItem ? 'Atualizar' : 'Adicionar'}
                </button>
              </div>
            )}

            {modalType === 'cliente' && (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nome do cliente"
                  value={formCliente.nome}
                  onChange={(e) => setFormCliente({...formCliente, nome: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Telefone"
                  value={formCliente.telefone}
                  onChange={(e) => setFormCliente({...formCliente, telefone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formCliente.email}
                  onChange={(e) => setFormCliente({...formCliente, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <button
                  onClick={adicionarCliente}
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                  {editingItem ? 'Atualizar' : 'Adicionar'}
                </button>
              </div>
            )}

            {modalType === 'reserva' && (
              <div className="space-y-4">
                <select
                  value={formReserva.quadraId}
                  onChange={(e) => setFormReserva({...formReserva, quadraId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Selecione a quadra</option>
                  {quadras.filter(q => q.ativa).map(quadra => (
                    <option key={quadra.id} value={quadra.id}>{quadra.nome}</option>
                  ))}
                </select>
                <select
                  value={formReserva.clienteId}
                  onChange={(e) => setFormReserva({...formReserva, clienteId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Selecione o cliente</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
                  ))}
                </select>
                <input
                  type="date"
                  value={formReserva.data}
                  onChange={(e) => setFormReserva({...formReserva, data: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="time"
                    placeholder="Hora início"
                    value={formReserva.horaInicio}
                    onChange={(e) => setFormReserva({...formReserva, horaInicio: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="time"
                    placeholder="Hora fim"
                    value={formReserva.horaFim}
                    onChange={(e) => setFormReserva({...formReserva, horaFim: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <input
                  type="number"
                  placeholder="Valor (opcional - será calculado automaticamente)"
                  value={formReserva.valor}
                  onChange={(e) => setFormReserva({...formReserva, valor: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <select
                  value={formReserva.status}
                  onChange={(e) => setFormReserva({...formReserva, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Confirmada">Confirmada</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
                <textarea
                  placeholder="Observações (opcional)"
                  value={formReserva.observacoes}
                  onChange={(e) => setFormReserva({...formReserva, observacoes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows="3"
                />
                <button
                  onClick={adicionarReserva}
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                  {editingItem ? 'Atualizar' : 'Adicionar'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default QuadraManagementSystem;