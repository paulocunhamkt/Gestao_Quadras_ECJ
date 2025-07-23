import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, DollarSign, Plus, Edit, Trash2, Save, X, Search, Filter, Menu, Home, CalendarDays, Building, UserCheck, Printer, LogOut, Shield, Eye, EyeOff, Settings, CreditCard, TrendingUp, AlertCircle, CheckCircle, FileText, BarChart3, PieChart } from 'lucide-react';

const QuadraManagementSystem = () => {
  const { useStoredState } = hatch;
  
  // Sistema de Autenticação
  const [isAuthenticated, setIsAuthenticated] = useStoredState('isAuthenticated', false);
  const [usuarioLogado, setUsuarioLogado] = useStoredState('usuarioLogado', null);
  const [showLogin, setShowLogin] = useState(true); // Sempre inicia na tela de login
  const [loginForm, setLoginForm] = useState({ usuario: '', senha: '' });
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Usuários administrativos (gerenciáveis)
  const [usuariosAdmin, setUsuariosAdmin] = useStoredState('usuariosAdmin', [
    { id: 1, usuario: 'admin', senha: 'jurema2025', nome: 'Administrador', cargo: 'Administrador Geral' },
    { id: 2, usuario: 'gerente', senha: 'gestao123', nome: 'Gerente', cargo: 'Gerente de Operações' },
    { id: 3, usuario: 'secretario', senha: 'quadras456', nome: 'Secretário', cargo: 'Secretário do Clube' }
  ]);
  
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
  
  // Estados para Financeiro
  const [faturamentos, setFaturamentos] = useStoredState('faturamentos', []);
  const [recebimentos, setRecebimentos] = useStoredState('recebimentos', []);
  
  // Estados da interface
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroData, setFiltroData] = useState('');
  const [mesImpressao, setMesImpressao] = useState(new Date().toISOString().slice(0, 7));
  const [quadraImpressao, setQuadraImpressao] = useState('');
  const [semanaImpressao, setSemanaImpressao] = useState(new Date().toISOString().slice(0, 10));
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Estados específicos para Relatórios
  const [tipoRelatorio, setTipoRelatorio] = useState('financeiro-mensal');
  const [dataRelatorio, setDataRelatorio] = useState(new Date().toISOString().slice(0, 10));
  const [periodoRelatorio, setPeriodoRelatorio] = useState('mensal');
  const [anoRelatorio, setAnoRelatorio] = useState(new Date().getFullYear().toString());

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
    statusPagamento: 'Pendente',
    valorPago: '',
    formaPagamento: '',
    dataPagamento: '',
    observacoes: ''
  });
  const [formAdmin, setFormAdmin] = useState({ nome: '', usuario: '', senha: '', cargo: '' });
  const [formFaturamento, setFormFaturamento] = useState({
    data: '',
    cliente: '',
    mesLocacao: '',
    hora: '',
    tipoQuadra: '',
    tipoLocacao: '',
    reciboPagamento: '',
    dataLocacao: '',
    valor: '',
    formaPagamento: '',
    valorRecebido: '',
    valorEmAberto: '',
    valorRealRecebido: '',
    observacoes: ''
  });
  const [formRecebimento, setFormRecebimento] = useState({
    faturamentoId: '',
    data: '',
    valor: '',
    formaPagamento: '',
    observacoes: ''
  });

  // Funções para Quadras
  const adicionarQuadra = () => {
    if (editingItem) {
      setQuadras(quadras.map(q => q.id === editingItem.id ? 
        { ...formQuadra, id: editingItem.id, valorHora: parseFloat(formQuadra.valorHora) } : q
      ));
      registrarAtividade('QUADRA_EDITADA', `Quadra "${formQuadra.nome}" editada`);
    } else {
      const novaQuadra = {
        id: Date.now(),
        ...formQuadra,
        valorHora: parseFloat(formQuadra.valorHora)
      };
      setQuadras([...quadras, novaQuadra]);
      registrarAtividade('QUADRA_CRIADA', `Nova quadra "${formQuadra.nome}" criada`);
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
    const quadra = quadras.find(q => q.id === id);
    if (confirm('Tem certeza que deseja excluir esta quadra?')) {
      setQuadras(quadras.filter(q => q.id !== id));
      registrarAtividade('QUADRA_EXCLUIDA', `Quadra "${quadra?.nome}" excluída`);
    }
  };

  // Funções para Financeiro
  const adicionarFaturamento = () => {
    const valorTotal = parseFloat(formFaturamento.valor) || 0;
    const valorRecebido = parseFloat(formFaturamento.valorRecebido) || 0;
    const valorEmAberto = valorTotal - valorRecebido;

    if (editingItem) {
      setFaturamentos(faturamentos.map(f => f.id === editingItem.id ? 
        { 
          ...formFaturamento, 
          id: editingItem.id,
          valor: valorTotal,
          valorRecebido: valorRecebido,
          valorEmAberto: valorEmAberto,
          valorRealRecebido: parseFloat(formFaturamento.valorRealRecebido) || valorRecebido,
          usuarioEdicao: usuarioLogado?.nome || 'Sistema',
          dataEdicao: new Date().toISOString()
        } : f
      ));
    } else {
      const novoFaturamento = {
        id: Date.now(),
        ...formFaturamento,
        valor: valorTotal,
        valorRecebido: valorRecebido,
        valorEmAberto: valorEmAberto,
        valorRealRecebido: parseFloat(formFaturamento.valorRealRecebido) || valorRecebido,
        status: valorEmAberto > 0 ? 'Em Aberto' : 'Pago',
        usuarioResponsavel: usuarioLogado?.nome || 'Sistema',
        dataLancamento: new Date().toISOString()
      };
      setFaturamentos([...faturamentos, novoFaturamento]);
    }
    fecharModal();
  };

  const editarFaturamento = (faturamento) => {
    setEditingItem(faturamento);
    setFormFaturamento({
      data: faturamento.data,
      cliente: faturamento.cliente,
      mesLocacao: faturamento.mesLocacao,
      hora: faturamento.hora,
      tipoQuadra: faturamento.tipoQuadra,
      tipoLocacao: faturamento.tipoLocacao,
      reciboPagamento: faturamento.reciboPagamento,
      dataLocacao: faturamento.dataLocacao,
      valor: faturamento.valor.toString(),
      formaPagamento: faturamento.formaPagamento,
      valorRecebido: faturamento.valorRecebido.toString(),
      valorEmAberto: faturamento.valorEmAberto.toString(),
      valorRealRecebido: faturamento.valorRealRecebido.toString(),
      observacoes: faturamento.observacoes || ''
    });
    setModalType('faturamento');
    setShowModal(true);
  };

  const excluirFaturamento = (id) => {
    if (confirm('Tem certeza que deseja excluir este faturamento?')) {
      setFaturamentos(faturamentos.filter(f => f.id !== id));
      // Remover recebimentos relacionados
      setRecebimentos(recebimentos.filter(r => r.faturamentoId !== id));
    }
  };

  const adicionarRecebimento = () => {
    const novoRecebimento = {
      id: Date.now(),
      ...formRecebimento,
      faturamentoId: parseInt(formRecebimento.faturamentoId),
      valor: parseFloat(formRecebimento.valor),
      usuarioResponsavel: usuarioLogado?.nome || 'Sistema',
      dataLancamento: new Date().toISOString()
    };
    
    setRecebimentos([...recebimentos, novoRecebimento]);
    
    // Atualizar faturamento
    setFaturamentos(faturamentos.map(f => {
      if (f.id === parseInt(formRecebimento.faturamentoId)) {
        const novoValorRecebido = f.valorRealRecebido + parseFloat(formRecebimento.valor);
        const novoValorEmAberto = f.valor - novoValorRecebido;
        return {
          ...f,
          valorRealRecebido: novoValorRecebido,
          valorEmAberto: Math.max(0, novoValorEmAberto),
          status: novoValorEmAberto <= 0 ? 'Pago' : 'Em Aberto',
          ultimoRecebimento: {
            usuario: usuarioLogado?.nome || 'Sistema',
            data: new Date().toISOString()
          }
        };
      }
      return f;
    }));
    
    fecharModal();
  };

  const excluirRecebimento = (id) => {
    const recebimento = recebimentos.find(r => r.id === id);
    if (recebimento && confirm('Tem certeza que deseja excluir este recebimento?')) {
      setRecebimentos(recebimentos.filter(r => r.id !== id));
      
      // Atualizar faturamento
      setFaturamentos(faturamentos.map(f => {
        if (f.id === recebimento.faturamentoId) {
          const novoValorRecebido = f.valorRealRecebido - recebimento.valor;
          const novoValorEmAberto = f.valor - novoValorRecebido;
          return {
            ...f,
            valorRealRecebido: Math.max(0, novoValorRecebido),
            valorEmAberto: novoValorEmAberto,
            status: novoValorEmAberto > 0 ? 'Em Aberto' : 'Pago'
          };
        }
        return f;
      }));
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
    
    // Validar se a quadra existe
    if (!quadra) {
      alert('Selecione uma quadra válida!');
      return;
    }
    
    // Validar campos obrigatórios
    if (!formReserva.data || !formReserva.horaInicio || !formReserva.horaFim || !formReserva.clienteId) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }
    
    // Verificar conflito de horários (apenas para novas reservas ou quando mudar horário/data)
    const reservasNoDia = reservas.filter(r => 
      r.data === formReserva.data && 
      r.quadraId === parseInt(formReserva.quadraId) &&
      (!editingItem || r.id !== editingItem.id) // Excluir reserva atual se estiver editando
    );
    
    // Verificar limite de 6 reservas diárias por quadra
    if (reservasNoDia.length >= 6) {
      alert(`Esta quadra já possui o limite máximo de 6 reservas para o dia ${formReserva.data}. Escolha outra data.`);
      return;
    }
    
    // Verificar se hora fim é posterior à hora início
    if (formReserva.horaInicio >= formReserva.horaFim) {
      alert('A hora de fim deve ser posterior à hora de início!');
      return;
    }
    
    // Função para adicionar 5 minutos a um horário
    const adicionarMinutos = (horario, minutos) => {
      const [horas, mins] = horario.split(':').map(Number);
      const totalMinutos = horas * 60 + mins + minutos;
      const novasHoras = Math.floor(totalMinutos / 60);
      const novosMinutos = totalMinutos % 60;
      return `${novasHoras.toString().padStart(2, '0')}:${novosMinutos.toString().padStart(2, '0')}`;
    };
    
    // Verificar conflitos com intervalo de 5 minutos entre reservas
    const novaHoraInicio = formReserva.horaInicio;
    const novaHoraFim = formReserva.horaFim;
    
    const temConflito = reservasNoDia.some(reserva => {
      const reservaInicio = reserva.horaInicio;
      const reservaFim = reserva.horaFim;
      const reservaFimMais5min = adicionarMinutos(reservaFim, 5);
      const novaFimMais5min = adicionarMinutos(novaHoraFim, 5);
      
      // Verificar sobreposição considerando intervalo de 5 minutos
      // Nova reserva não pode começar antes de 5 minutos após o fim da reserva existente
      // E reserva existente não pode começar antes de 5 minutos após o fim da nova reserva
      return (
        (novaHoraInicio < reservaFimMais5min && novaHoraFim > reservaInicio) ||
        (reservaInicio < novaFimMais5min && reservaFim > novaHoraInicio)
      );
    });
    
    if (temConflito) {
      alert(`Conflito de horário! Deve haver um intervalo mínimo de 5 minutos entre as reservas na quadra ${quadra.nome} no dia ${formReserva.data}.`);
      return;
    }
    
    // Calcular valor baseado na duração da reserva
    const horaInicio = new Date(`${formReserva.data}T${formReserva.horaInicio}`);
    const horaFim = new Date(`${formReserva.data}T${formReserva.horaFim}`);
    const minutos = (horaFim - horaInicio) / (1000 * 60);
    const horas = minutos / 60;
    const valorCalculado = horas * quadra.valorHora;

    if (editingItem) {
      setReservas(reservas.map(r => r.id === editingItem.id ? 
        { 
          ...formReserva, 
          id: editingItem.id,
          quadraId: parseInt(formReserva.quadraId),
          clienteId: parseInt(formReserva.clienteId),
          valor: parseFloat(formReserva.valor) || valorCalculado,
          valorPago: parseFloat(formReserva.valorPago) || 0,
          usuarioEdicao: usuarioLogado?.nome || 'Sistema',
          dataEdicao: new Date().toISOString()
        } : r
      ));
      registrarAtividade('RESERVA_EDITADA', `Reserva editada - ${quadra.nome} em ${formReserva.data}`);
    } else {
      const novaReserva = {
        id: Date.now(),
        ...formReserva,
        quadraId: parseInt(formReserva.quadraId),
        clienteId: parseInt(formReserva.clienteId),
        valor: parseFloat(formReserva.valor) || valorCalculado,
        valorPago: parseFloat(formReserva.valorPago) || 0,
        usuarioResponsavel: usuarioLogado?.nome || 'Sistema',
        dataLancamento: new Date().toISOString()
      };
      setReservas([...reservas, novaReserva]);
      registrarAtividade('RESERVA_CRIADA', `Nova reserva - ${quadra.nome} em ${formReserva.data}`);
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
      statusPagamento: reserva.statusPagamento || 'Pendente',
      valorPago: (reserva.valorPago || 0).toString(),
      formaPagamento: reserva.formaPagamento || '',
      dataPagamento: reserva.dataPagamento || '',
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

  // Funções para Administradores
  const adicionarAdmin = () => {
    // Verificar se usuário já existe
    const usuarioExiste = usuariosAdmin.find(u => u.usuario === formAdmin.usuario && (!editingItem || u.id !== editingItem.id));
    if (usuarioExiste) {
      alert('Este nome de usuário já existe!');
      return;
    }

    if (editingItem) {
      setUsuariosAdmin(usuariosAdmin.map(u => u.id === editingItem.id ? 
        { ...formAdmin, id: editingItem.id } : u
      ));
    } else {
      const novoAdmin = {
        id: Date.now(),
        ...formAdmin
      };
      setUsuariosAdmin([...usuariosAdmin, novoAdmin]);
    }
    fecharModal();
  };

  const editarAdmin = (admin) => {
    setEditingItem(admin);
    setFormAdmin({
      nome: admin.nome,
      usuario: admin.usuario,
      senha: admin.senha,
      cargo: admin.cargo
    });
    setModalType('admin');
    setShowModal(true);
  };

  const excluirAdmin = (id) => {
    if (usuariosAdmin.length <= 1) {
      alert('Não é possível excluir o último administrador!');
      return;
    }
    if (confirm('Tem certeza que deseja excluir este administrador?')) {
      setUsuariosAdmin(usuariosAdmin.filter(u => u.id !== id));
    }
  };

  // Verificar se há sessão válida ao carregar
  useEffect(() => {
    // Apenas permite acesso direto se já estiver autenticado E tiver usuário válido
    if (isAuthenticated && usuarioLogado && usuariosAdmin.find(u => u.id === usuarioLogado.id)) {
      setShowLogin(false);
    } else {
      // Limpa qualquer estado inválido
      setIsAuthenticated(false);
      setUsuarioLogado(null);
      setShowLogin(true);
    }
  }, [isAuthenticated, usuarioLogado, usuariosAdmin]);

  // Funções de Autenticação
  const handleLogin = (e) => {
    e.preventDefault();
    const usuario = usuariosAdmin.find(
      u => u.usuario === loginForm.usuario && u.senha === loginForm.senha
    );
    
    if (usuario) {
      setIsAuthenticated(true);
      setUsuarioLogado(usuario);
      setShowLogin(false);
      setLoginError('');
      setLoginForm({ usuario: '', senha: '' });
    } else {
      setLoginError('Usuário ou senha incorretos');
    }
  };

  const handleLogout = () => {
    registrarAtividade('LOGOUT', `Usuário ${usuarioLogado?.nome} fez logout`);
    setIsAuthenticated(false);
    setUsuarioLogado(null);
    setShowLogin(true);
    setActiveTab('dashboard');
    // Limpar formulários
    setLoginForm({ usuario: '', senha: '' });
    setLoginError('');
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
      statusPagamento: 'Pendente',
      valorPago: '',
      formaPagamento: '',
      dataPagamento: '',
      observacoes: ''
    });
    setFormAdmin({ nome: '', usuario: '', senha: '', cargo: '' });
    setFormFaturamento({
      data: '',
      cliente: '',
      mesLocacao: '',
      hora: '',
      tipoQuadra: '',
      tipoLocacao: '',
      reciboPagamento: '',
      dataLocacao: '',
      valor: '',
      formaPagamento: '',
      valorRecebido: '',
      valorEmAberto: '',
      valorRealRecebido: '',
      observacoes: ''
    });
    setFormRecebimento({
      faturamentoId: '',
      data: '',
      valor: '',
      formaPagamento: '',
      observacoes: ''
    });
  };

  // Sistema de Backup e Logs de Segurança
  const [backupLogs, setBackupLogs] = useStoredState('backupLogs', []);
  const [ultimoBackup, setUltimoBackup] = useStoredState('ultimoBackup', null);
  const [configuracaoBackup, setConfiguracaoBackup] = useStoredState('configuracaoBackup', {
    autoBackup: true,
    intervaloDias: 1,
    manterHistorico: 30, // dias
    incluirLogs: true,
    compactarDados: true
  });

  // Função para gerar backup completo
  const gerarBackup = (tipoBackup = 'manual') => {
    try {
      const timestamp = new Date().toISOString();
      const dataBackup = new Date().toLocaleDateString('pt-BR');
      const horaBackup = new Date().toLocaleTimeString('pt-BR');
      
      // Dados completos do sistema
      const dadosBackup = {
        timestamp: timestamp,
        versaoSistema: '2.1.0',
        tipoBackup: tipoBackup,
        usuario: usuarioLogado?.nome || 'Sistema',
        dados: {
          quadras: quadras,
          clientes: clientes,
          reservas: reservas,
          faturamentos: faturamentos,
          recebimentos: recebimentos,
          usuariosAdmin: usuariosAdmin.map(u => ({...u, senha: '***PROTEGIDA***'})), // Senhas protegidas
          configuracoes: configuracaoBackup
        },
        estatisticas: {
          totalQuadras: quadras.length,
          totalClientes: clientes.length,
          totalReservas: reservas.length,
          totalFaturamentos: faturamentos.length,
          totalRecebimentos: recebimentos.length,
          totalUsuarios: usuariosAdmin.length,
          receitaTotal: reservas.reduce((acc, r) => acc + (r.valor || 0), 0) + faturamentos.reduce((acc, f) => acc + (f.valor || 0), 0),
          valorRecebido: reservas.reduce((acc, r) => acc + (r.valorPago || 0), 0) + faturamentos.reduce((acc, f) => acc + (f.valorRealRecebido || 0), 0)
        },
        integridade: {
          checksum: `${quadras.length}-${clientes.length}-${reservas.length}-${faturamentos.length}`,
          validacao: 'OK'
        }
      };
      
      // Criar log de backup
      const logBackup = {
        id: Date.now(),
        data: dataBackup,
        hora: horaBackup,
        timestamp: timestamp,
        tipo: tipoBackup,
        usuario: usuarioLogado?.nome || 'Sistema',
        status: 'Sucesso',
        tamanho: JSON.stringify(dadosBackup).length,
        registros: dadosBackup.estatisticas.totalQuadras + dadosBackup.estatisticas.totalClientes + 
                  dadosBackup.estatisticas.totalReservas + dadosBackup.estatisticas.totalFaturamentos,
        observacoes: `Backup ${tipoBackup} executado com sucesso`
      };
      
      // Salvar backup em localStorage com chave única
      const chaveBackup = `backup_${timestamp.replace(/[:.]/g, '_')}`;
      localStorage.setItem(chaveBackup, JSON.stringify(dadosBackup));
      
      // Atualizar logs
      const novosLogs = [...backupLogs, logBackup];
      setBackupLogs(novosLogs);
      setUltimoBackup(timestamp);
      
      // Limpar backups antigos (manter apenas os últimos 30 dias)
      limparBackupsAntigos();
      
      alert(`✅ Backup realizado com sucesso!\nData: ${dataBackup} às ${horaBackup}\nTipo: ${tipoBackup.toUpperCase()}\nRegistros: ${logBackup.registros}`);
      
      return { sucesso: true, backup: dadosBackup, log: logBackup };
      
    } catch (error) {
      console.error('Erro ao gerar backup:', error);
      
      const logErro = {
        id: Date.now(),
        data: new Date().toLocaleDateString('pt-BR'),
        hora: new Date().toLocaleTimeString('pt-BR'),
        timestamp: new Date().toISOString(),
        tipo: tipoBackup,
        usuario: usuarioLogado?.nome || 'Sistema',
        status: 'Erro',
        tamanho: 0,
        registros: 0,
        observacoes: `Erro no backup: ${error.message}`
      };
      
      setBackupLogs([...backupLogs, logErro]);
      alert(`❌ Erro ao realizar backup!\nDetalhes: ${error.message}`);
      
      return { sucesso: false, erro: error.message };
    }
  };

  // Função para restaurar backup
  const restaurarBackup = (chaveBackup) => {
    try {
      const dadosBackup = localStorage.getItem(chaveBackup);
      if (!dadosBackup) {
        throw new Error('Backup não encontrado');
      }
      
      const backup = JSON.parse(dadosBackup);
      
      // Confirmar restauração
      const confirmacao = confirm(
        `⚠️ ATENÇÃO: RESTAURAÇÃO DE BACKUP\n\n` +
        `Esta operação irá substituir TODOS os dados atuais!\n\n` +
        `Backup de: ${new Date(backup.timestamp).toLocaleString('pt-BR')}\n` +
        `Tipo: ${backup.tipoBackup.toUpperCase()}\n` +
        `Usuário: ${backup.usuario}\n` +
        `Registros: ${Object.values(backup.estatisticas).reduce((a, b) => typeof b === 'number' ? a + b : a, 0)}\n\n` +
        `Deseja prosseguir com a restauração?`
      );
      
      if (!confirmacao) return;
      
      // Restaurar dados (exceto senhas que foram protegidas)
      if (backup.dados.quadras) setQuadras(backup.dados.quadras);
      if (backup.dados.clientes) setClientes(backup.dados.clientes);
      if (backup.dados.reservas) setReservas(backup.dados.reservas);
      if (backup.dados.faturamentos) setFaturamentos(backup.dados.faturamentos);
      if (backup.dados.recebimentos) setRecebimentos(backup.dados.recebimentos);
      // Nota: usuariosAdmin não é restaurado por segurança
      
      // Log da restauração
      const logRestauracao = {
        id: Date.now(),
        data: new Date().toLocaleDateString('pt-BR'),
        hora: new Date().toLocaleTimeString('pt-BR'),
        timestamp: new Date().toISOString(),
        tipo: 'restauracao',
        usuario: usuarioLogado?.nome || 'Sistema',
        status: 'Sucesso',
        tamanho: backup.tamanho || 0,
        registros: Object.values(backup.estatisticas).reduce((a, b) => typeof b === 'number' ? a + b : a, 0),
        observacoes: `Dados restaurados do backup de ${new Date(backup.timestamp).toLocaleString('pt-BR')}`
      };
      
      setBackupLogs([...backupLogs, logRestauracao]);
      
      alert(`✅ Restauração concluída com sucesso!\nDados restaurados do backup de ${new Date(backup.timestamp).toLocaleString('pt-BR')}`);
      
    } catch (error) {
      console.error('Erro na restauração:', error);
      alert(`❌ Erro na restauração!\nDetalhes: ${error.message}`);
    }
  };

  // Função para limpar backups antigos
  const limparBackupsAntigos = () => {
    try {
      const diasManter = configuracaoBackup.manterHistorico;
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() - diasManter);
      
      // Encontrar todas as chaves de backup no localStorage
      const chaves = Object.keys(localStorage);
      const chavesBackup = chaves.filter(chave => chave.startsWith('backup_'));
      
      let removidos = 0;
      chavesBackup.forEach(chave => {
        try {
          const timestampStr = chave.replace('backup_', '').replace(/_/g, ':');
          const dataBackup = new Date(timestampStr);
          
          if (dataBackup < dataLimite) {
            localStorage.removeItem(chave);
            removidos++;
          }
        } catch (e) {
          // Se não conseguir processar a data, remove o backup por segurança
          localStorage.removeItem(chave);
          removidos++;
        }
      });
      
      console.log(`Backups antigos removidos: ${removidos}`);
    } catch (error) {
      console.error('Erro ao limpar backups antigos:', error);
    }
  };

  // Função para listar backups disponíveis
  const listarBackups = () => {
    const chaves = Object.keys(localStorage);
    const chavesBackup = chaves.filter(chave => chave.startsWith('backup_'));
    
    return chavesBackup.map(chave => {
      try {
        const dados = JSON.parse(localStorage.getItem(chave));
        return {
          chave: chave,
          timestamp: dados.timestamp,
          data: new Date(dados.timestamp).toLocaleDateString('pt-BR'),
          hora: new Date(dados.timestamp).toLocaleTimeString('pt-BR'),
          tipo: dados.tipoBackup,
          usuario: dados.usuario,
          registros: Object.values(dados.estatisticas).reduce((a, b) => typeof b === 'number' ? a + b : a, 0),
          tamanho: (JSON.stringify(dados).length / 1024).toFixed(2) + ' KB'
        };
      } catch (e) {
        return null;
      }
    }).filter(backup => backup !== null)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  // Backup automático diário
  useEffect(() => {
    if (!configuracaoBackup.autoBackup) return;
    
    const verificarBackupAutomatico = () => {
      const agora = new Date();
      const hoje = agora.toDateString();
      const ultimoBackupData = ultimoBackup ? new Date(ultimoBackup).toDateString() : null;
      
      // Se não fez backup hoje, fazer backup automático
      if (ultimoBackupData !== hoje && agora.getHours() >= 23) { // Backup após 23h
        gerarBackup('automatico');
      }
    };
    
    // Verificar a cada hora se precisa fazer backup
    const interval = setInterval(verificarBackupAutomatico, 60 * 60 * 1000);
    
    // Verificar imediatamente
    verificarBackupAutomatico();
    
    return () => clearInterval(interval);
  }, [ultimoBackup, configuracaoBackup.autoBackup]);

  // Log de atividades do sistema
  const registrarAtividade = (acao, detalhes = '') => {
    const logAtividade = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      data: new Date().toLocaleDateString('pt-BR'),
      hora: new Date().toLocaleTimeString('pt-BR'),
      usuario: usuarioLogado?.nome || 'Sistema',
      acao: acao,
      detalhes: detalhes,
      ip: 'Local', // Em produção, capturar IP real
      dispositivo: navigator.userAgent.substring(0, 50) + '...'
    };
    
    // Manter log de atividades separado
    const logsAtividade = JSON.parse(localStorage.getItem('logs_atividade') || '[]');
    logsAtividade.push(logAtividade);
    
    // Manter apenas os últimos 1000 logs
    if (logsAtividade.length > 1000) {
      logsAtividade.splice(0, logsAtividade.length - 1000);
    }
    
    localStorage.setItem('logs_atividade', JSON.stringify(logsAtividade));
  };

  // Interceptar ações críticas para log
  useEffect(() => {
    // Log de login
    if (isAuthenticated && usuarioLogado) {
      registrarAtividade('LOGIN', `Usuário ${usuarioLogado.nome} fez login`);
    }
  }, [isAuthenticated, usuarioLogado]);

  // Função para impressão otimizada
  const imprimirRelatorio = () => {
    // Ocultar elementos desnecessários temporariamente
    const elementsToHide = document.querySelectorAll('nav, button, .fixed, .sticky, .md\\:hidden, .hover\\:bg-green-700');
    const originalDisplays = [];
    
    elementsToHide.forEach((el, index) => {
      originalDisplays[index] = el.style.display;
      el.style.display = 'none';
    });
    
    // Configurar o documento para impressão
    document.body.classList.add('printing');
    
    // Aguardar um momento para aplicar os estilos
    setTimeout(() => {
      window.print();
      
      // Restaurar elementos após a impressão
      setTimeout(() => {
        elementsToHide.forEach((el, index) => {
          el.style.display = originalDisplays[index];
        });
        document.body.classList.remove('printing');
      }, 1000);
    }, 100);
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

  // Configuração dos ícones para cada aba
  const tabIcons = {
    dashboard: Home,
    reservas: CalendarDays,
    quadras: Building,
    clientes: UserCheck,
    financeiro: CreditCard,
    relatorios: FileText,
    admin: Settings,
    sistema: Shield
  };

  const tabLabels = {
    dashboard: 'Painel',
    reservas: 'Reservas',
    quadras: 'Quadras',
    clientes: 'Clientes',
    financeiro: 'Financeiro',
    relatorios: 'Relatórios',
    admin: 'ADM',
    sistema: 'Sistema'
  };

  // Se não estiver autenticado, mostrar tela de login
  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <img 
              src="assets/QnQ2IRKmq0zfR25_j1Nkf.png" 
              alt="Esporte Clube Jurema" 
              className="h-20 w-20 mx-auto rounded-full bg-gray-100 p-2 mb-4"
            />
            <h1 className="text-2xl font-bold text-green-700 mb-2">Esporte Clube Jurema</h1>
            <p className="text-gray-600">Sistema de Gestão de Quadras</p>
            <p className="text-sm text-gray-500 mt-1">Acesso Restrito - Administradores</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuário
              </label>
              <input
                type="text"
                value={loginForm.usuario}
                onChange={(e) => setLoginForm({...loginForm, usuario: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Digite seu usuário"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginForm.senha}
                  onChange={(e) => setLoginForm({...loginForm, senha: e.target.value})}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Digite sua senha"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {loginError}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition duration-200 font-medium"
            >
              Entrar
            </button>
          </form>
          
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Usuários Autorizados:</h3>
            <div className="text-xs text-gray-600 space-y-1">
              {usuariosAdmin.map(user => (
                <div key={user.id}>• <strong>{user.usuario}</strong> - {user.cargo}</div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Entre em contato com a administração para obter as credenciais.
            </p>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                <strong>Acesso Inicial:</strong> A cada nova sessão, é necessário fazer login novamente por segurança.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0.8cm;
          }
          
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          body {
            font-size: 12px !important;
            line-height: 1.3 !important;
          }
          
          /* Ocultar elementos desnecessários na impressão */
          nav, .md\\:hidden, button, .hover\\:bg-green-700,
          .fixed, .sticky, .z-40, .z-50, .bg-gradient-to-r {
            display: none !important;
          }
          
          /* Container principal */
          .w-full.h-full.bg-gray-50 {
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          /* Conteúdo do relatório */
          .bg-white.rounded-lg.shadow {
            box-shadow: none !important;
            border-radius: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          /* Cabeçalho */
          .text-center.mb-4 {
            margin-bottom: 15px !important;
            page-break-after: avoid;
          }
          
          .text-lg, .text-xl, .text-2xl {
            font-size: 16px !important;
            font-weight: bold !important;
          }
          
          .text-sm {
            font-size: 11px !important;
          }
          
          .text-xs {
            font-size: 10px !important;
          }
          
          /* Logo */
          img {
            width: 40px !important;
            height: 40px !important;
          }
          
          /* Tabelas */
          table {
            width: 100% !important;
            border-collapse: collapse !important;
            font-size: 10px !important;
            margin: 10px 0 !important;
          }
          
          th, td {
            border: 1px solid #ccc !important;
            padding: 4px 6px !important;
            text-align: left !important;
            vertical-align: top !important;
          }
          
          th {
            background-color: #f5f5f5 !important;
            font-weight: bold !important;
            font-size: 9px !important;
          }
          
          /* Cores de status */
          .bg-green-100 {
            background-color: #dcfce7 !important;
          }
          
          .bg-yellow-100 {
            background-color: #fefce8 !important;
          }
          
          .bg-red-100 {
            background-color: #fef2f2 !important;
          }
          
          .text-green-800 {
            color: #166534 !important;
          }
          
          .text-yellow-800 {
            color: #92400e !important;
          }
          
          .text-red-800 {
            color: #991b1b !important;
          }
          
          .text-blue-600 {
            color: #2563eb !important;
          }
          
          /* Cards de resumo */
          .grid.grid-cols-2, .grid.grid-cols-4 {
            display: grid !important;
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 8px !important;
            margin: 15px 0 !important;
          }
          
          .bg-blue-50, .bg-green-50, .bg-purple-50, .bg-orange-50 {
            border: 1px solid #ddd !important;
            padding: 8px !important;
            border-radius: 4px !important;
          }
          
          /* Seções */
          .border.rounded-lg {
            border: 1px solid #ccc !important;
            border-radius: 4px !important;
            margin: 10px 0 !important;
            padding: 10px !important;
            page-break-inside: avoid;
          }
          
          /* Títulos de seção */
          h3, h4 {
            font-size: 12px !important;
            font-weight: bold !important;
            margin: 8px 0 4px 0 !important;
            color: #1f2937 !important;
          }
          
          /* Quebras de página */
          .space-y-6 > * {
            margin-bottom: 10px !important;
          }
          
          /* Legenda */
          .grid.grid-cols-1.md\\:grid-cols-3 {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 10px !important;
            margin-top: 15px !important;
            font-size: 9px !important;
          }
          
          /* Status badges */
          .px-1.py-0\\.5.text-xs.rounded,
          .px-2.py-1.text-xs.rounded-full {
            padding: 2px 4px !important;
            border-radius: 2px !important;
            font-size: 8px !important;
            font-weight: bold !important;
          }
          
          /* Evitar quebras em elementos importantes */
          .print\\:break-inside-avoid {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          
          /* Ajustes de espaçamento */
          .space-y-6 > *:not(:first-child) {
            margin-top: 10px !important;
          }
          
          .space-y-4 > *:not(:first-child) {
            margin-top: 8px !important;
          }
          
          .space-y-3 > *:not(:first-child) {
            margin-top: 6px !important;
          }
          
          .space-y-2 > *:not(:first-child) {
            margin-top: 4px !important;
          }
          
          /* Overflow para tabelas */
          .overflow-x-auto {
            overflow: visible !important;
          }
          
          /* Responsividade para impressão */
          .hidden.md\\:block {
            display: block !important;
          }
          
          .md\\:hidden {
            display: none !important;
          }
        }
      `}</style>
      <div className="w-full h-full bg-gray-50 overflow-auto">
        {/* Header Mobile */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 shadow-sm border-b px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="assets/QnQ2IRKmq0zfR25_j1Nkf.png" 
                alt="Esporte Clube Jurema" 
                className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-white p-1"
              />
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-white">Esporte Clube Jurema</h1>
                <p className="text-xs md:text-sm text-green-100 hidden sm:block">Sistema de Gestão de Quadras - Valinhos</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block text-right text-green-100">
                <p className="text-sm font-medium">
                  Olá, {usuarioLogado?.nome || 'Usuário'}!
                </p>
                <p className="text-xs opacity-90">
                  {usuarioLogado?.cargo || 'Sistema Administrativo'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-800 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {usuarioLogado?.nome ? usuarioLogado.nome.charAt(0).toUpperCase() : 'U'}
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-green-800 hover:bg-green-900 text-white px-3 py-2 rounded-lg text-sm transition duration-200 flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sair</span>
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-md text-green-100 hover:text-white hover:bg-green-800"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Navigation Desktop */}
        <div className="hidden md:block bg-white border-b">
          <nav className="flex space-x-8 px-6">
            {Object.entries(tabLabels).map(([tab, label]) => {
              const IconComponent = tabIcons[tab];
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mobile Menu Overlay */}
        {showMobileMenu && (
          <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setShowMobileMenu(false)}>
            <div className="bg-white w-64 h-full shadow-lg" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 border-b">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-medium">
                    {usuarioLogado?.nome ? usuarioLogado.nome.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{usuarioLogado?.nome || 'Usuário'}</h3>
                    <p className="text-xs text-gray-600">{usuarioLogado?.cargo || 'Administrador'}</p>
                  </div>
                </div>
                <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
              </div>
              <nav className="p-2">
                {Object.entries(tabLabels).map(([tab, label]) => {
                  const IconComponent = tabIcons[tab];
                  return (
                    <button
                      key={tab}
                      onClick={() => {
                        setActiveTab(tab);
                        setShowMobileMenu(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
                        activeTab === tab
                          ? 'bg-green-100 text-green-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <IconComponent className="h-5 w-5" />
                      <span>{label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Bottom Navigation Mobile */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
          <nav className="flex">
            {Object.entries(tabLabels).map(([tab, label]) => {
              const IconComponent = tabIcons[tab];
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 px-1 text-xs flex flex-col items-center space-y-1 ${
                    activeTab === tab
                      ? 'text-green-600'
                      : 'text-gray-500'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="text-xs">{label}</span>
                </button>
              );
            })}
          </nav>
          
          {/* Rodapé Mobile - Copyright */}
          <div className="bg-gray-800 text-center py-1">
            <p className="text-xs text-gray-300">
              © 2025 PauloCunhaMKT Soluções TI • v2.1.0
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 md:p-6 pb-24 md:pb-16">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                <div className="bg-white p-3 md:p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <Calendar className="h-6 w-6 md:h-8 md:w-8 text-blue-500" />
                    <div className="ml-2 md:ml-4">
                      <p className="text-xs md:text-sm font-medium text-gray-600">Hoje</p>
                      <p className="text-lg md:text-2xl font-bold text-gray-900">{reservasHoje.length}</p>
                      <p className="text-xs text-gray-500">Máx: {quadras.filter(q => q.ativa).length * 6}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-3 md:p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <DollarSign className="h-6 w-6 md:h-8 md:w-8 text-green-500" />
                    <div className="ml-2 md:ml-4">
                      <p className="text-xs md:text-sm font-medium text-gray-600">Receita</p>
                      <p className="text-sm md:text-2xl font-bold text-gray-900">R$ {receitaMensal.toFixed(0)}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-3 md:p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <Users className="h-6 w-6 md:h-8 md:w-8 text-purple-500" />
                    <div className="ml-2 md:ml-4">
                      <p className="text-xs md:text-sm font-medium text-gray-600">Clientes</p>
                      <p className="text-lg md:text-2xl font-bold text-gray-900">{clientes.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-3 md:p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <Clock className="h-6 w-6 md:h-8 md:w-8 text-orange-500" />
                    <div className="ml-2 md:ml-4">
                      <p className="text-xs md:text-sm font-medium text-gray-600">Quadras</p>
                      <p className="text-lg md:text-2xl font-bold text-gray-900">{quadras.filter(q => q.ativa).length}</p>
                      <p className="text-xs text-gray-500">6 slots/dia • 5min intervalo</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Próximas Reservas */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 md:p-6 border-b">
                  <h3 className="text-base md:text-lg font-medium text-gray-900">Próximas Reservas</h3>
                </div>
                <div className="p-4 md:p-6">
                  {reservas.slice(0, 5).map((reserva) => {
                    const quadra = quadras.find(q => q.id === reserva.quadraId);
                    const cliente = clientes.find(c => c.id === reserva.clienteId);
                    return (
                      <div key={reserva.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{quadra?.nome}</p>
                          <p className="text-sm text-gray-600 truncate">{cliente?.nome}</p>
                          <p className="text-xs text-gray-500">{reserva.data} às {reserva.horaInicio}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ml-2 ${
                          reserva.status === 'Confirmada' ? 'bg-green-100 text-green-800' :
                          reserva.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {reserva.status}
                        </span>
                      </div>
                    );
                  })}
                  {reservas.length === 0 && (
                    <p className="text-gray-500 text-center py-8">Nenhuma reserva cadastrada</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Reservas */}
          {activeTab === 'reservas' && (
            <div className="space-y-4 md:space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">Reservas</h2>
                <button
                  onClick={() => {
                    setModalType('reserva');
                    setShowModal(true);
                  }}
                  className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4" />
                  <span>Nova Reserva</span>
                </button>
              </div>

              {/* Filtros Mobile */}
              <div className="bg-white p-4 rounded-lg shadow space-y-3 md:space-y-0 md:flex md:space-x-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div className="w-full md:w-auto">
                  <input
                    type="date"
                    value={filtroData}
                    onChange={(e) => setFiltroData(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>

              {/* Lista de Reservas Mobile */}
              <div className="space-y-3 md:hidden">
                {reservasFiltradas.map((reserva) => {
                  const quadra = quadras.find(q => q.id === reserva.quadraId);
                  const cliente = clientes.find(c => c.id === reserva.clienteId);
                  return (
                    <div key={reserva.id} className="bg-white rounded-lg shadow p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{quadra?.nome}</h3>
                          <p className="text-sm text-gray-600">{cliente?.nome}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          reserva.status === 'Confirmada' ? 'bg-green-100 text-green-800' :
                          reserva.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {reserva.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                        <div>Data: {reserva.data}</div>
                        <div>Valor: R$ {reserva.valor?.toFixed(2)}</div>
                        <div>Início: {reserva.horaInicio}</div>
                        <div>Fim: {reserva.horaFim}</div>
                      </div>
                      
                      {/* Status de Pagamento */}
                      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                        <div className="flex items-center">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            reserva.statusPagamento === 'Pago' ? 'bg-green-100 text-green-800' :
                            reserva.statusPagamento === 'Parcial' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {reserva.statusPagamento || 'Pendente'}
                          </span>
                        </div>
                        <div className="text-green-600 font-medium">
                          Pago: R$ {(reserva.valorPago || 0).toFixed(2)}
                        </div>
                      </div>
                      
                      {reserva.valorPago > 0 && (
                        <div className="text-xs text-blue-600 mb-2">
                          {reserva.formaPagamento && `Forma: ${reserva.formaPagamento}`}
                          {reserva.dataPagamento && ` • Data: ${new Date(reserva.dataPagamento).toLocaleDateString('pt-BR')}`}
                        </div>
                      )}
                      {reserva.usuarioResponsavel && (
                        <div className="text-xs text-gray-500 mb-2 flex items-center">
                          <UserCheck className="h-3 w-3 mr-1" />
                          Lançado por: {reserva.usuarioResponsavel}
                          {reserva.dataLancamento && (
                            <span className="ml-2">
                              • {new Date(reserva.dataLancamento).toLocaleDateString('pt-BR')}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => editarReserva(reserva)}
                          className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => excluirReserva(reserva.id)}
                          className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
                {reservasFiltradas.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Nenhuma reserva encontrada
                  </div>
                )}
              </div>

              {/* Tabela Desktop */}
              <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data/Hora</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quadra</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pagamento</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Responsável</th>
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
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  reserva.statusPagamento === 'Pago' ? 'bg-green-100 text-green-800' :
                                  reserva.statusPagamento === 'Parcial' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {reserva.statusPagamento || 'Pendente'}
                                </span>
                              </div>
                              <div className="text-xs text-green-600 font-medium">
                                R$ {(reserva.valorPago || 0).toFixed(2)}
                                {reserva.valorPago > 0 && reserva.formaPagamento && (
                                  <span className="text-gray-500"> • {reserva.formaPagamento}</span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {reserva.usuarioResponsavel || 'N/A'}
                              </div>
                              {reserva.dataLancamento && (
                                <div className="text-xs text-gray-500">
                                  {new Date(reserva.dataLancamento).toLocaleDateString('pt-BR')}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => editarReserva(reserva)}
                                className="text-green-600 hover:text-green-900 mr-3"
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
            </div>
          )}

          {/* Quadras */}
          {activeTab === 'quadras' && (
            <div className="space-y-4 md:space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">Quadras</h2>
                <button
                  onClick={() => {
                    setModalType('quadra');
                    setShowModal(true);
                  }}
                  className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4" />
                  <span>Nova Quadra</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {quadras.map((quadra) => (
                  <div key={quadra.id} className="bg-white rounded-lg shadow p-4 md:p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-base md:text-lg font-medium text-gray-900">{quadra.nome}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        quadra.ativa ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {quadra.ativa ? 'Ativa' : 'Inativa'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2 text-sm">{quadra.modalidade}</p>
                    <p className="text-gray-900 font-medium mb-4">R$ {quadra.valorHora}/hora</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => editarQuadra(quadra)}
                        className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700"
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
            <div className="space-y-4 md:space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">Clientes</h2>
                <button
                  onClick={() => {
                    setModalType('cliente');
                    setShowModal(true);
                  }}
                  className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  <span>Novo Cliente</span>
                </button>
              </div>

              {/* Lista Mobile */}
              <div className="space-y-3 md:hidden">
                {clientes.map((cliente) => (
                  <div key={cliente.id} className="bg-white rounded-lg shadow p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{cliente.nome}</h3>
                        <p className="text-sm text-gray-600">{cliente.telefone}</p>
                        <p className="text-sm text-gray-600">{cliente.email}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => editarCliente(cliente)}
                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => excluirCliente(cliente.id)}
                        className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tabela Desktop */}
              <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
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
                            className="text-green-600 hover:text-green-900 mr-3"
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

          {/* Financeiro */}
          {activeTab === 'financeiro' && (
            <div className="space-y-4 md:space-y-6">
              {/* Cabeçalho */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900">Controle Financeiro</h2>
                  <p className="text-sm text-gray-600">Gestão de faturamentos e recebimentos</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setModalType('faturamento');
                      setShowModal(true);
                    }}
                    className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Novo Faturamento</span>
                  </button>
                  <button
                    onClick={() => {
                      setModalType('recebimento');
                      setShowModal(true);
                    }}
                    className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-700"
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Registrar Recebimento</span>
                  </button>
                </div>
              </div>

              {/* Dashboard Financeiro */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <div className="bg-blue-50 p-3 md:p-4 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="h-6 w-6 md:h-8 md:w-8 text-blue-500 mr-2 md:mr-3" />
                    <div>
                      <p className="text-xs md:text-sm font-medium text-blue-900">Receita Total</p>
                      <p className="text-sm md:text-xl font-bold text-blue-600">
                        R$ {(() => {
                          const receitaReservas = reservas.reduce((acc, r) => acc + (r.valor || 0), 0);
                          const receitaFaturamentos = faturamentos.reduce((acc, f) => acc + (f.valor || 0), 0);
                          return (receitaReservas + receitaFaturamentos).toFixed(2);
                        })()}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 p-3 md:p-4 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-green-500 mr-2 md:mr-3" />
                    <div>
                      <p className="text-xs md:text-sm font-medium text-green-900">Valores Recebidos</p>
                      <p className="text-sm md:text-xl font-bold text-green-600">
                        R$ {(() => {
                          const reservasPagas = reservas.reduce((acc, r) => acc + (r.valorPago || 0), 0);
                          const faturamentosRecebidos = faturamentos.reduce((acc, f) => acc + (f.valorRealRecebido || 0), 0);
                          return (reservasPagas + faturamentosRecebidos).toFixed(2);
                        })()}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-red-50 p-3 md:p-4 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="h-6 w-6 md:h-8 md:w-8 text-red-500 mr-2 md:mr-3" />
                    <div>
                      <p className="text-xs md:text-sm font-medium text-red-900">Em Aberto</p>
                      <p className="text-sm md:text-xl font-bold text-red-600">
                        R$ {(() => {
                          const reservasEmAberto = reservas.reduce((acc, r) => {
                            const valorPendente = (r.valor || 0) - (r.valorPago || 0);
                            return acc + Math.max(0, valorPendente);
                          }, 0);
                          const faturamentosEmAberto = faturamentos.reduce((acc, f) => acc + (f.valorEmAberto || 0), 0);
                          return (reservasEmAberto + faturamentosEmAberto).toFixed(2);
                        })()}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 p-3 md:p-4 rounded-lg">
                  <div className="flex items-center">
                    <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-purple-500 mr-2 md:mr-3" />
                    <div>
                      <p className="text-xs md:text-sm font-medium text-purple-900">Taxa Recebimento</p>
                      <p className="text-sm md:text-xl font-bold text-purple-600">
                        {(() => {
                          const receitaReservas = reservas.reduce((acc, r) => acc + (r.valor || 0), 0);
                          const receitaFaturamentos = faturamentos.reduce((acc, f) => acc + (f.valor || 0), 0);
                          const totalReceita = receitaReservas + receitaFaturamentos;
                          
                          const reservasRecebidas = reservas.reduce((acc, r) => acc + (r.valorPago || 0), 0);
                          const faturamentosRecebidos = faturamentos.reduce((acc, f) => acc + (f.valorRealRecebido || 0), 0);
                          const totalRecebido = reservasRecebidas + faturamentosRecebidos;
                          
                          return totalReceita > 0 ? Math.round((totalRecebido / totalReceita) * 100) : 0;
                        })()}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gráficos Financeiros */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {/* Gráfico de Pizza - Status dos Faturamentos */}
                <div className="bg-white rounded-lg shadow p-4 md:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base md:text-lg font-medium text-gray-900">Status dos Faturamentos</h3>
                    <PieChart className="h-5 w-5 text-blue-500" />
                  </div>
                  
                  {(() => {
                    const receitaReservas = reservas.reduce((acc, r) => acc + (r.valor || 0), 0);
                    const receitaFaturamentos = faturamentos.reduce((acc, f) => acc + (f.valor || 0), 0);
                    const totalFaturado = receitaReservas + receitaFaturamentos;
                    
                    const reservasRecebidas = reservas.filter(r => r.status === 'Confirmada').reduce((acc, r) => acc + (r.valor || 0), 0);
                    const faturamentosRecebidos = faturamentos.reduce((acc, f) => acc + (f.valorRealRecebido || 0), 0);
                    const totalRecebido = reservasRecebidas + faturamentosRecebidos;
                    
                    const reservasEmAberto = reservas.reduce((acc, r) => {
                      const valorPendente = (r.valor || 0) - (r.valorPago || 0);
                      return acc + Math.max(0, valorPendente);
                    }, 0);
                    const faturamentosEmAberto = faturamentos.reduce((acc, f) => acc + (f.valorEmAberto || 0), 0);
                    const totalEmAberto = reservasEmAberto + faturamentosEmAberto;
                    
                    const percentualRecebido = totalFaturado > 0 ? (totalRecebido / totalFaturado) * 100 : 0;
                    const percentualEmAberto = totalFaturado > 0 ? (totalEmAberto / totalFaturado) * 100 : 0;
                    
                    return (
                      <div className="space-y-4">
                        {/* Gráfico Circular Manual */}
                        <div className="flex justify-center mb-4">
                          <div className="relative w-32 h-32">
                            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                              {/* Círculo de fundo */}
                              <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#f3f4f6"
                                strokeWidth="3"
                              />
                              {/* Valores Recebidos */}
                              <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="3"
                                strokeDasharray={`${percentualRecebido}, 100`}
                              />
                              {/* Valores em Aberto */}
                              <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#ef4444"
                                strokeWidth="3"
                                strokeDasharray={`${percentualEmAberto}, 100`}
                                strokeDashoffset={-percentualRecebido}
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-sm font-bold text-gray-900">
                                  {Math.round(percentualRecebido)}%
                                </div>
                                <div className="text-xs text-gray-600">Recebido</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Legenda */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                              <span className="text-sm text-gray-700">Recebido</span>
                            </div>
                            <span className="text-sm font-medium text-green-600">
                              R$ {totalRecebido.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                              <span className="text-sm text-gray-700">Em Aberto</span>
                            </div>
                            <span className="text-sm font-medium text-red-600">
                              R$ {totalEmAberto.toFixed(2)}
                            </span>
                          </div>
                          <div className="border-t pt-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-900">Total Faturado</span>
                              <span className="text-sm font-bold text-blue-600">
                                R$ {totalFaturado.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Gráfico de Barras - Faturamento por Mês */}
                <div className="bg-white rounded-lg shadow p-4 md:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base md:text-lg font-medium text-gray-900">Faturamento por Mês</h3>
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                  </div>
                  
                  {(() => {
                    // Agrupar receitas por mês (reservas + faturamentos)
                    const faturamentosPorMes = {};
                    const recebimentosPorMes = {};
                    
                    // Adicionar receitas das reservas
                    reservas.forEach(r => {
                      if (r.data) {
                        const mes = r.data.substring(0, 7); // YYYY-MM
                        faturamentosPorMes[mes] = (faturamentosPorMes[mes] || 0) + (r.valor || 0);
                        recebimentosPorMes[mes] = (recebimentosPorMes[mes] || 0) + (r.valorPago || 0);
                      }
                    });
                    
                    // Adicionar faturamentos administrativos
                    faturamentos.forEach(f => {
                      if (f.data) {
                        const mes = f.data.substring(0, 7); // YYYY-MM
                        faturamentosPorMes[mes] = (faturamentosPorMes[mes] || 0) + (f.valor || 0);
                        recebimentosPorMes[mes] = (recebimentosPorMes[mes] || 0) + (f.valorRealRecebido || 0);
                      }
                    });
                    
                    // Pegar últimos 6 meses
                    const hoje = new Date();
                    const meses = [];
                    for (let i = 5; i >= 0; i--) {
                      const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
                      const mesAno = `${data.getFullYear()}-${(data.getMonth() + 1).toString().padStart(2, '0')}`;
                      const nomemes = data.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase();
                      meses.push({
                        id: mesAno,
                        nome: nomemes,
                        faturado: faturamentosPorMes[mesAno] || 0,
                        recebido: recebimentosPorMes[mesAno] || 0
                      });
                    }
                    
                    const maxValor = Math.max(...meses.map(m => Math.max(m.faturado, m.recebido)));
                    
                    return (
                      <div className="space-y-4">
                        <div className="space-y-3">
                          {meses.map((mes, index) => (
                            <div key={mes.id} className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="font-medium text-gray-700">{mes.nome}</span>
                                <span className="text-gray-600">
                                  R$ {mes.faturado.toFixed(0)} / R$ {mes.recebido.toFixed(0)}
                                </span>
                              </div>
                              <div className="relative">
                                {/* Barra de Faturamento */}
                                <div className="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden">
                                  <div
                                    className="bg-blue-500 h-full rounded-full transition-all duration-300"
                                    style={{ width: `${maxValor > 0 ? (mes.faturado / maxValor) * 100 : 0}%` }}
                                  ></div>
                                  {/* Barra de Recebimento sobreposta */}
                                  <div
                                    className="bg-green-500 h-full rounded-full absolute top-0 left-0 transition-all duration-300"
                                    style={{ width: `${maxValor > 0 ? (mes.recebido / maxValor) * 100 : 0}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Legenda */}
                        <div className="flex justify-center space-x-4 pt-4 border-t">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                            <span className="text-xs text-gray-600">Faturado</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                            <span className="text-xs text-gray-600">Recebido</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Resumo Detalhado por Tipo */}
              <div className="bg-white rounded-lg shadow p-4 md:p-6">
                <h3 className="text-base md:text-lg font-medium text-gray-900 mb-4">Análise por Tipo de Locação</h3>
                
                {(() => {
                  const analise = {
                    mensal: { faturado: 0, recebido: 0, emAberto: 0, count: 0 },
                    avulso: { faturado: 0, recebido: 0, emAberto: 0, count: 0 }
                  };
                  
                  // Analisar reservas (considerando como avulsas se não especificado)
                  reservas.forEach(r => {
                    const tipo = 'avulso'; // Reservas são geralmente avulsas
                    analise[tipo].faturado += r.valor || 0;
                    analise[tipo].recebido += r.valorPago || 0;
                    const valorEmAberto = (r.valor || 0) - (r.valorPago || 0);
                    analise[tipo].emAberto += Math.max(0, valorEmAberto);
                    analise[tipo].count += 1;
                  });
                  
                  // Analisar faturamentos administrativos
                  faturamentos.forEach(f => {
                    const tipo = f.tipoLocacao?.toLowerCase() === 'mensal' ? 'mensal' : 'avulso';
                    analise[tipo].faturado += f.valor || 0;
                    analise[tipo].recebido += f.valorRealRecebido || 0;
                    analise[tipo].emAberto += f.valorEmAberto || 0;
                    analise[tipo].count += 1;
                  });
                  
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      {/* Locações Mensais */}
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                          <Calendar className="h-4 w-4 text-blue-500 mr-2" />
                          Locações Mensais
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Contratos:</span>
                            <span className="text-sm font-medium">{analise.mensal.count}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Faturado:</span>
                            <span className="text-sm font-medium text-blue-600">
                              R$ {analise.mensal.faturado.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Recebido:</span>
                            <span className="text-sm font-medium text-green-600">
                              R$ {analise.mensal.recebido.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Em Aberto:</span>
                            <span className="text-sm font-medium text-red-600">
                              R$ {analise.mensal.emAberto.toFixed(2)}
                            </span>
                          </div>
                          <div className="pt-2 border-t">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-900">Taxa de Recebimento:</span>
                              <span className="text-sm font-bold text-purple-600">
                                {analise.mensal.faturado > 0 ? 
                                  Math.round((analise.mensal.recebido / analise.mensal.faturado) * 100) : 0}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Locações Avulsas */}
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                          <Clock className="h-4 w-4 text-orange-500 mr-2" />
                          Locações Avulsas
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Locações:</span>
                            <span className="text-sm font-medium">{analise.avulso.count}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Faturado:</span>
                            <span className="text-sm font-medium text-blue-600">
                              R$ {analise.avulso.faturado.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Recebido:</span>
                            <span className="text-sm font-medium text-green-600">
                              R$ {analise.avulso.recebido.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Em Aberto:</span>
                            <span className="text-sm font-medium text-red-600">
                              R$ {analise.avulso.emAberto.toFixed(2)}
                            </span>
                          </div>
                          <div className="pt-2 border-t">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-900">Taxa de Recebimento:</span>
                              <span className="text-sm font-bold text-purple-600">
                                {analise.avulso.faturado > 0 ? 
                                  Math.round((analise.avulso.recebido / analise.avulso.faturado) * 100) : 0}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Gráficos Financeiros */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {/* Gráfico de Pizza - Status dos Faturamentos */}
                <div className="bg-white rounded-lg shadow p-4 md:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base md:text-lg font-medium text-gray-900">Status dos Faturamentos</h3>
                    <PieChart className="h-5 w-5 text-blue-500" />
                  </div>
                  
                  {(() => {
                    const totalFaturado = faturamentos.reduce((acc, f) => acc + (f.valor || 0), 0);
                    const totalRecebido = faturamentos.reduce((acc, f) => acc + (f.valorRealRecebido || 0), 0);
                    const totalEmAberto = faturamentos.reduce((acc, f) => acc + (f.valorEmAberto || 0), 0);
                    
                    const percentualRecebido = totalFaturado > 0 ? (totalRecebido / totalFaturado) * 100 : 0;
                    const percentualEmAberto = totalFaturado > 0 ? (totalEmAberto / totalFaturado) * 100 : 0;
                    
                    return (
                      <div className="space-y-4">
                        {/* Gráfico Circular Manual */}
                        <div className="flex justify-center mb-4">
                          <div className="relative w-32 h-32">
                            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                              {/* Círculo de fundo */}
                              <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#f3f4f6"
                                strokeWidth="3"
                              />
                              {/* Valores Recebidos */}
                              <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="3"
                                strokeDasharray={`${percentualRecebido}, 100`}
                              />
                              {/* Valores em Aberto */}
                              <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#ef4444"
                                strokeWidth="3"
                                strokeDasharray={`${percentualEmAberto}, 100`}
                                strokeDashoffset={-percentualRecebido}
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-sm font-bold text-gray-900">
                                  {Math.round(percentualRecebido)}%
                                </div>
                                <div className="text-xs text-gray-600">Recebido</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Legenda */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                              <span className="text-sm text-gray-700">Recebido</span>
                            </div>
                            <span className="text-sm font-medium text-green-600">
                              R$ {totalRecebido.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                              <span className="text-sm text-gray-700">Em Aberto</span>
                            </div>
                            <span className="text-sm font-medium text-red-600">
                              R$ {totalEmAberto.toFixed(2)}
                            </span>
                          </div>
                          <div className="border-t pt-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-900">Total Faturado</span>
                              <span className="text-sm font-bold text-blue-600">
                                R$ {totalFaturado.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Gráfico de Barras - Faturamento por Mês */}
                <div className="bg-white rounded-lg shadow p-4 md:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base md:text-lg font-medium text-gray-900">Faturamento por Mês</h3>
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                  </div>
                  
                  {(() => {
                    // Agrupar faturamentos por mês
                    const faturamentosPorMes = {};
                    const recebimentosPorMes = {};
                    
                    faturamentos.forEach(f => {
                      if (f.data) {
                        const mes = f.data.substring(0, 7); // YYYY-MM
                        faturamentosPorMes[mes] = (faturamentosPorMes[mes] || 0) + (f.valor || 0);
                        recebimentosPorMes[mes] = (recebimentosPorMes[mes] || 0) + (f.valorRealRecebido || 0);
                      }
                    });
                    
                    // Pegar últimos 6 meses
                    const hoje = new Date();
                    const meses = [];
                    for (let i = 5; i >= 0; i--) {
                      const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
                      const mesAno = `${data.getFullYear()}-${(data.getMonth() + 1).toString().padStart(2, '0')}`;
                      const nomemes = data.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase();
                      meses.push({
                        id: mesAno,
                        nome: nomemes,
                        faturado: faturamentosPorMes[mesAno] || 0,
                        recebido: recebimentosPorMes[mesAno] || 0
                      });
                    }
                    
                    const maxValor = Math.max(...meses.map(m => Math.max(m.faturado, m.recebido)));
                    
                    return (
                      <div className="space-y-4">
                        <div className="space-y-3">
                          {meses.map((mes, index) => (
                            <div key={mes.id} className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="font-medium text-gray-700">{mes.nome}</span>
                                <span className="text-gray-600">
                                  R$ {mes.faturado.toFixed(0)} / R$ {mes.recebido.toFixed(0)}
                                </span>
                              </div>
                              <div className="relative">
                                {/* Barra de Faturamento */}
                                <div className="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden">
                                  <div
                                    className="bg-blue-500 h-full rounded-full transition-all duration-300"
                                    style={{ width: `${maxValor > 0 ? (mes.faturado / maxValor) * 100 : 0}%` }}
                                  ></div>
                                  {/* Barra de Recebimento sobreposta */}
                                  <div
                                    className="bg-green-500 h-full rounded-full absolute top-0 left-0 transition-all duration-300"
                                    style={{ width: `${maxValor > 0 ? (mes.recebido / maxValor) * 100 : 0}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Legenda */}
                        <div className="flex justify-center space-x-4 pt-4 border-t">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                            <span className="text-xs text-gray-600">Faturado</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                            <span className="text-xs text-gray-600">Recebido</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Resumo Detalhado por Tipo */}
              <div className="bg-white rounded-lg shadow p-4 md:p-6">
                <h3 className="text-base md:text-lg font-medium text-gray-900 mb-4">Análise por Tipo de Locação</h3>
                
                {(() => {
                  const analise = {
                    mensal: { faturado: 0, recebido: 0, emAberto: 0, count: 0 },
                    avulso: { faturado: 0, recebido: 0, emAberto: 0, count: 0 }
                  };
                  
                  faturamentos.forEach(f => {
                    const tipo = f.tipoLocacao?.toLowerCase() === 'mensal' ? 'mensal' : 'avulso';
                    analise[tipo].faturado += f.valor || 0;
                    analise[tipo].recebido += f.valorRealRecebido || 0;
                    analise[tipo].emAberto += f.valorEmAberto || 0;
                    analise[tipo].count += 1;
                  });
                  
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      {/* Locações Mensais */}
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                          <Calendar className="h-4 w-4 text-blue-500 mr-2" />
                          Locações Mensais
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Contratos:</span>
                            <span className="text-sm font-medium">{analise.mensal.count}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Faturado:</span>
                            <span className="text-sm font-medium text-blue-600">
                              R$ {analise.mensal.faturado.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Recebido:</span>
                            <span className="text-sm font-medium text-green-600">
                              R$ {analise.mensal.recebido.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Em Aberto:</span>
                            <span className="text-sm font-medium text-red-600">
                              R$ {analise.mensal.emAberto.toFixed(2)}
                            </span>
                          </div>
                          <div className="pt-2 border-t">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-900">Taxa de Recebimento:</span>
                              <span className="text-sm font-bold text-purple-600">
                                {analise.mensal.faturado > 0 ? 
                                  Math.round((analise.mensal.recebido / analise.mensal.faturado) * 100) : 0}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Locações Avulsas */}
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                          <Clock className="h-4 w-4 text-orange-500 mr-2" />
                          Locações Avulsas
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Locações:</span>
                            <span className="text-sm font-medium">{analise.avulso.count}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Faturado:</span>
                            <span className="text-sm font-medium text-blue-600">
                              R$ {analise.avulso.faturado.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Recebido:</span>
                            <span className="text-sm font-medium text-green-600">
                              R$ {analise.avulso.recebido.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Em Aberto:</span>
                            <span className="text-sm font-medium text-red-600">
                              R$ {analise.avulso.emAberto.toFixed(2)}
                            </span>
                          </div>
                          <div className="pt-2 border-t">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-900">Taxa de Recebimento:</span>
                              <span className="text-sm font-bold text-purple-600">
                                {analise.avulso.faturado > 0 ? 
                                  Math.round((analise.avulso.recebido / analise.avulso.faturado) * 100) : 0}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Filtros */}
              <div className="bg-white p-4 rounded-lg shadow space-y-3 md:space-y-0 md:flex md:space-x-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Buscar cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div className="w-full md:w-auto">
                  <select
                    value={filtroData}
                    onChange={(e) => setFiltroData(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Todos os status</option>
                    <option value="Pago">Pago</option>
                    <option value="Em Aberto">Em Aberto</option>
                  </select>
                </div>
              </div>

              {/* Lista de Faturamentos Mobile */}
              <div className="space-y-3 md:hidden">
                {faturamentos
                  .filter(faturamento => {
                    const matchSearch = !searchTerm || 
                      faturamento.cliente?.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchStatus = !filtroData || faturamento.status === filtroData;
                    return matchSearch && matchStatus;
                  })
                  .map((faturamento) => (
                    <div key={faturamento.id} className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{faturamento.cliente}</h3>
                          <p className="text-sm text-gray-600">{faturamento.tipoQuadra} - {faturamento.mesLocacao}</p>
                          <p className="text-sm text-blue-600">R$ {faturamento.valor?.toFixed(2)}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          faturamento.status === 'Pago' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {faturamento.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                        <div>Recebido: R$ {faturamento.valorRealRecebido?.toFixed(2)}</div>
                        <div>Em Aberto: R$ {faturamento.valorEmAberto?.toFixed(2)}</div>
                        <div>Data: {faturamento.data}</div>
                        <div>Forma: {faturamento.formaPagamento}</div>
                      </div>
                      {faturamento.usuarioResponsavel && (
                        <div className="text-xs text-gray-500 mb-2 flex items-center">
                          <UserCheck className="h-3 w-3 mr-1" />
                          Lançado por: {faturamento.usuarioResponsavel}
                          {faturamento.dataLancamento && (
                            <span className="ml-2">
                              • {new Date(faturamento.dataLancamento).toLocaleDateString('pt-BR')}
                            </span>
                          )}
                        </div>
                      )}
                      {faturamento.usuarioResponsavel && (
                        <div className="text-xs text-gray-500 mb-2 flex items-center">
                          <UserCheck className="h-3 w-3 mr-1" />
                          Lançado por: {faturamento.usuarioResponsavel}
                          {faturamento.dataLancamento && (
                            <span className="ml-2">
                              • {new Date(faturamento.dataLancamento).toLocaleDateString('pt-BR')}
                            </span>
                          )}
                        </div>
                      )}
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => editarFaturamento(faturamento)}
                          className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => excluirFaturamento(faturamento.id)}
                          className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Tabela Desktop */}
              <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mês/Quadra</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recebido</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Em Aberto</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Responsável</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {faturamentos
                        .filter(faturamento => {
                          const matchSearch = !searchTerm || 
                            faturamento.cliente?.toLowerCase().includes(searchTerm.toLowerCase());
                          const matchStatus = !filtroData || faturamento.status === filtroData;
                          return matchSearch && matchStatus;
                        })
                        .map((faturamento) => (
                          <tr key={faturamento.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{faturamento.cliente}</div>
                                <div className="text-sm text-gray-500">{faturamento.data}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{faturamento.mesLocacao}</div>
                              <div className="text-sm text-gray-500">{faturamento.tipoQuadra}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              R$ {faturamento.valor?.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                              R$ {faturamento.valorRealRecebido?.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                              R$ {faturamento.valorEmAberto?.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                faturamento.status === 'Pago' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {faturamento.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {faturamento.usuarioResponsavel || 'N/A'}
                              </div>
                              {faturamento.dataLancamento && (
                                <div className="text-xs text-gray-500">
                                  {new Date(faturamento.dataLancamento).toLocaleDateString('pt-BR')}
                                </div>
                              )}
                              {faturamento.ultimoRecebimento && (
                                <div className="text-xs text-blue-600">
                                  Último receb.: {faturamento.ultimoRecebimento.usuario}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => editarFaturamento(faturamento)}
                                className="text-blue-600 hover:text-blue-900 mr-3"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => excluirFaturamento(faturamento.id)}
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

              {/* Histórico de Recebimentos */}
              {recebimentos.length > 0 && (
                <div className="bg-white rounded-lg shadow">
                  <div className="p-4 md:p-6 border-b">
                    <h3 className="text-base md:text-lg font-medium text-gray-900">Histórico de Recebimentos</h3>
                  </div>
                  <div className="p-4 md:p-6">
                    <div className="space-y-3">
                      {recebimentos.slice(-10).reverse().map((recebimento) => {
                        const faturamento = faturamentos.find(f => f.id === recebimento.faturamentoId);
                        return (
                          <div key={recebimento.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{faturamento?.cliente || 'Cliente não encontrado'}</p>
                              <p className="text-sm text-gray-600 truncate">
                                {recebimento.data} - {recebimento.formaPagamento}
                              </p>
                              {recebimento.usuarioResponsavel && (
                                <p className="text-xs text-gray-500 flex items-center">
                                  <UserCheck className="h-3 w-3 mr-1" />
                                  por: {recebimento.usuarioResponsavel}
                                </p>
                              )}
                            </div>
                            <div className="text-right ml-2">
                              <p className="font-medium text-green-600">R$ {recebimento.valor?.toFixed(2)}</p>
                              <button
                                onClick={() => excluirRecebimento(recebimento.id)}
                                className="text-red-500 hover:text-red-700 text-xs"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sistema - Backup e Logs */}
          {activeTab === 'sistema' && (
            <div className="space-y-4 md:space-y-6">
              {/* Cabeçalho */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900">Sistema - Backup e Logs</h2>
                  <p className="text-sm text-gray-600">Controle de segurança, backup automático e logs de atividades</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => gerarBackup('manual')}
                    className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700"
                  >
                    <Shield className="h-4 w-4" />
                    <span>Backup Manual</span>
                  </button>
                </div>
              </div>

              {/* Status do Sistema */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-green-900">Status do Sistema</p>
                      <p className="text-lg font-bold text-green-600">Online</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center">
                    <Shield className="h-8 w-8 text-blue-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Último Backup</p>
                      <p className="text-sm font-bold text-blue-600">
                        {ultimoBackup ? 
                          new Date(ultimoBackup).toLocaleDateString('pt-BR') : 
                          'Nunca'
                        }
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-purple-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-purple-900">Logs de Backup</p>
                      <p className="text-lg font-bold text-purple-600">{backupLogs.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="flex items-center">
                    <AlertCircle className="h-8 w-8 text-orange-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-orange-900">Backup Automático</p>
                      <p className="text-sm font-bold text-orange-600">
                        {configuracaoBackup.autoBackup ? 'Ativo' : 'Inativo'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Configurações de Backup */}
              <div className="bg-white rounded-lg shadow p-4 md:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Configurações de Backup</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={configuracaoBackup.autoBackup}
                        onChange={(e) => setConfiguracaoBackup({
                          ...configuracaoBackup, 
                          autoBackup: e.target.checked
                        })}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm font-medium text-gray-900">Backup Automático Diário</span>
                    </label>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Intervalo (dias)
                      </label>
                      <select
                        value={configuracaoBackup.intervaloDias}
                        onChange={(e) => setConfiguracaoBackup({
                          ...configuracaoBackup, 
                          intervaloDias: parseInt(e.target.value)
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value={1}>Diário</option>
                        <option value={2}>A cada 2 dias</option>
                        <option value={7}>Semanal</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Manter histórico (dias)
                      </label>
                      <select
                        value={configuracaoBackup.manterHistorico}
                        onChange={(e) => setConfiguracaoBackup({
                          ...configuracaoBackup, 
                          manterHistorico: parseInt(e.target.value)
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value={7}>7 dias</option>
                        <option value={15}>15 dias</option>
                        <option value={30}>30 dias</option>
                        <option value={60}>60 dias</option>
                      </select>
                    </div>
                    
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={configuracaoBackup.incluirLogs}
                        onChange={(e) => setConfiguracaoBackup({
                          ...configuracaoBackup, 
                          incluirLogs: e.target.checked
                        })}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm font-medium text-gray-900">Incluir Logs nos Backups</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Backups Disponíveis */}
              <div className="bg-white rounded-lg shadow p-4 md:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Backups Disponíveis</h3>
                  <button
                    onClick={limparBackupsAntigos}
                    className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
                  >
                    Limpar Antigos
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data/Hora</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuário</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registros</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tamanho</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {listarBackups().slice(0, 10).map((backup, index) => (
                        <tr key={backup.chave} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {backup.data} {backup.hora}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              backup.tipo === 'automatico' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {backup.tipo.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {backup.usuario}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {backup.registros}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {backup.tamanho}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => restaurarBackup(backup.chave)}
                              className="text-green-600 hover:text-green-900 mr-3"
                            >
                              Restaurar
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Excluir este backup?')) {
                                  localStorage.removeItem(backup.chave);
                                  // Force re-render
                                  setActiveTab('sistema');
                                }
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              Excluir
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {listarBackups().length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Nenhum backup encontrado
                    </div>
                  )}
                </div>
              </div>

              {/* Logs de Backup */}
              <div className="bg-white rounded-lg shadow p-4 md:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Histórico de Backups</h3>
                
                <div className="space-y-3">
                  {backupLogs.slice(-10).reverse().map((log) => (
                    <div key={log.id} className={`p-3 rounded border-l-4 ${
                      log.status === 'Sucesso' ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'
                    }`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">
                            {log.tipo.toUpperCase()} - {log.status}
                          </p>
                          <p className="text-xs text-gray-600">
                            {log.data} às {log.hora} por {log.usuario}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {log.observacoes}
                          </p>
                        </div>
                        <div className="text-right text-xs text-gray-500">
                          <p>{log.registros} registros</p>
                          <p>{(log.tamanho / 1024).toFixed(2)} KB</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {backupLogs.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Nenhum log de backup encontrado
                    </div>
                  )}
                </div>
              </div>

              {/* Logs de Atividade */}
              <div className="bg-white rounded-lg shadow p-4 md:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Logs de Atividade do Sistema</h3>
                
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {(() => {
                    const logsAtividade = JSON.parse(localStorage.getItem('logs_atividade') || '[]');
                    return logsAtividade.slice(-20).reverse().map((log) => (
                      <div key={log.id} className="p-2 border rounded text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{log.acao}</span>
                          <span className="text-gray-500">{log.data} {log.hora}</span>
                        </div>
                        <div className="text-gray-600 mt-1">
                          <p>Usuário: {log.usuario}</p>
                          {log.detalhes && <p>Detalhes: {log.detalhes}</p>}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Informações do Sistema */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Informações do Sistema</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
                  <div>
                    <p><strong>Versão:</strong> v2.1.0</p>
                    <p><strong>Build:</strong> 2025.01</p>
                  </div>
                  <div>
                    <p><strong>Navegador:</strong> {navigator.userAgent.substring(0, 30)}...</p>
                    <p><strong>Armazenamento:</strong> LocalStorage</p>
                  </div>
                  <div>
                    <p><strong>Backup Automático:</strong> {configuracaoBackup.autoBackup ? 'Ativo' : 'Inativo'}</p>
                    <p><strong>Próximo Backup:</strong> {
                      ultimoBackup ? 
                        new Date(new Date(ultimoBackup).getTime() + (configuracaoBackup.intervaloDias * 24 * 60 * 60 * 1000)).toLocaleDateString('pt-BR') :
                        'Hoje'
                    }</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Administradores */}
          {activeTab === 'admin' && (
            <div className="space-y-4 md:space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900">Administradores</h2>
                  <p className="text-sm text-gray-600">Gerencie usuários com acesso ao sistema</p>
                </div>
                <button
                  onClick={() => {
                    setModalType('admin');
                    setShowModal(true);
                  }}
                  className="w-full sm:w-auto bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-orange-700"
                >
                  <Plus className="h-4 w-4" />
                  <span>Novo Administrador</span>
                </button>
              </div>

              {/* Alert de Segurança */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex">
                  <Shield className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-amber-800">Área Restrita</h3>
                    <p className="text-sm text-amber-700 mt-1">
                      Apenas usuários com permissões administrativas podem acessar esta seção. 
                      Mantenha as credenciais seguras e atualize as senhas regularmente.
                    </p>
                  </div>
                </div>
              </div>

              {/* Lista de Administradores Mobile */}
              <div className="space-y-3 md:hidden">
                {usuariosAdmin.map((admin) => (
                  <div key={admin.id} className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{admin.nome}</h3>
                        <p className="text-sm text-gray-600">{admin.cargo}</p>
                        <p className="text-sm text-orange-600 font-medium">@{admin.usuario}</p>
                      </div>
                      <Shield className="h-5 w-5 text-orange-500" />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => editarAdmin(admin)}
                        className="flex-1 bg-orange-600 text-white px-3 py-2 rounded text-sm hover:bg-orange-700"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => excluirAdmin(admin.id)}
                        className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
                        disabled={usuariosAdmin.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    {usuariosAdmin.length <= 1 && (
                      <p className="text-xs text-red-500 mt-2">
                        ⚠️ Último administrador - não pode ser excluído
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Tabela Desktop */}
              <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuário</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cargo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Senha</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {usuariosAdmin.map((admin) => (
                      <tr key={admin.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Shield className="h-5 w-5 text-orange-500 mr-3" />
                            <div className="text-sm font-medium text-gray-900">{admin.nome}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-orange-600 font-medium">@{admin.usuario}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{admin.cargo}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">••••••••</code>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => editarAdmin(admin)}
                            className="text-orange-600 hover:text-orange-900 mr-3"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => excluirAdmin(admin.id)}
                            className={`${usuariosAdmin.length <= 1 ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:text-red-900'}`}
                            disabled={usuariosAdmin.length <= 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {usuariosAdmin.length <= 1 && (
                  <div className="px-6 py-3 bg-red-50 border-t border-red-200">
                    <p className="text-sm text-red-700 flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      Último administrador ativo - não pode ser excluído por segurança
                    </p>
                  </div>
                )}
              </div>

              {/* Estatísticas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-orange-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-orange-900">Total de Administradores</p>
                      <p className="text-2xl font-bold text-orange-600">{usuariosAdmin.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Shield className="h-8 w-8 text-green-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-green-900">Sistema Seguro</p>
                      <p className="text-2xl font-bold text-green-600">✓</p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Calendar className="h-8 w-8 text-blue-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Último Acesso</p>
                      <p className="text-sm font-bold text-blue-600">Hoje</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Relatórios */}
          {activeTab === 'relatorios' && (
            <div className="space-y-4 md:space-y-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-lg md:text-xl font-semibold text-gray-900">Centro de Relatórios</h2>
                    <p className="text-sm text-gray-600">Gere relatórios detalhados para impressão e análise</p>
                  </div>
                  <button
                    onClick={imprimirRelatorio}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-700 print:hidden"
                  >
                    <Printer className="h-4 w-4" />
                    <span>Imprimir Relatório</span>
                  </button>
                </div>
                
                {/* Seletor de Tipo de Relatório */}
                <div className="bg-white p-4 rounded-lg shadow print:hidden">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Tipo de Relatório</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Categoria:</label>
                      <select
                        value={tipoRelatorio.split('-')[0]}
                        onChange={(e) => {
                          const categoria = e.target.value;
                          const periodo = tipoRelatorio.split('-')[1] || 'diario';
                          setTipoRelatorio(`${categoria}-${periodo}`);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="financeiro">Financeiro</option>
                        <option value="reservas">Reservas</option>
                        <option value="quadras">Programação de Quadras</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Período:</label>
                      <select
                        value={tipoRelatorio.split('-')[1]}
                        onChange={(e) => {
                          const categoria = tipoRelatorio.split('-')[0];
                          const periodo = e.target.value;
                          setTipoRelatorio(`${categoria}-${periodo}`);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="diario">Diário</option>
                        <option value="semanal">Semanal</option>
                        <option value="mensal">Mensal</option>
                        <option value="anual">Anual</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        {tipoRelatorio.includes('diario') ? 'Data:' : 
                         tipoRelatorio.includes('semanal') ? 'Semana de:' : 
                         tipoRelatorio.includes('anual') ? 'Ano:' : 'Mês/Ano:'}
                      </label>
                      {tipoRelatorio.includes('anual') ? (
                        <select
                          value={anoRelatorio}
                          onChange={(e) => setAnoRelatorio(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                          {Array.from({length: 5}, (_, i) => {
                            const ano = new Date().getFullYear() - 2 + i;
                            return <option key={ano} value={ano}>{ano}</option>;
                          })}
                        </select>
                      ) : tipoRelatorio.includes('mensal') ? (
                        <select
                          value={mesImpressao}
                          onChange={(e) => setMesImpressao(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                          {(() => {
                            const options = [];
                            const hoje = new Date();
                            for (let i = -6; i <= 6; i++) {
                              const data = new Date(hoje.getFullYear(), hoje.getMonth() + i, 1);
                              const valor = `${data.getFullYear()}-${(data.getMonth() + 1).toString().padStart(2, '0')}`;
                              const texto = data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
                              options.push(
                                <option key={valor} value={valor}>
                                  {texto.charAt(0).toUpperCase() + texto.slice(1)}
                                </option>
                              );
                            }
                            return options;
                          })()}
                        </select>
                      ) : (
                        <input
                          type="date"
                          value={tipoRelatorio.includes('semanal') ? semanaImpressao : dataRelatorio}
                          onChange={(e) => {
                            if (tipoRelatorio.includes('semanal')) {
                              setSemanaImpressao(e.target.value);
                            } else {
                              setDataRelatorio(e.target.value);
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      )}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Quadra:</label>
                      <select
                        value={quadraImpressao}
                        onChange={(e) => setQuadraImpressao(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="">Todas as Quadras</option>
                        {quadras.filter(q => q.ativa).map(quadra => (
                          <option key={quadra.id} value={quadra.id}>{quadra.nome}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>



              {/* Conteúdo do Relatório */}
              <div className="bg-white rounded-lg shadow overflow-hidden print:shadow-none print:border-0 print:rounded-none">
                <div className="p-3 md:p-6 print:p-0 print:m-0">
                  {/* Cabeçalho do Relatório */}
                  <div className="text-center mb-4 md:mb-6 print:mb-3 print:break-inside-avoid">
                    <div className="flex items-center justify-center mb-2 print:mb-1">
                      <img 
                        src="assets/QnQ2IRKmq0zfR25_j1Nkf.png" 
                        alt="Esporte Clube Jurema" 
                        className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-white p-1 mr-3 print:h-10 print:w-10"
                      />
                      <div>
                        <h1 className="text-lg md:text-2xl font-bold text-green-700 print:text-lg">
                          ESPORTE CLUBE JUREMA
                        </h1>
                        <p className="text-sm text-green-600 print:text-sm">Valinhos - Fundado em 03/09/2006</p>
                        <p className="text-xs text-gray-600 print:text-xs mt-1">
                          Sistema de Gestão com Controle de Usuários - {
                            tipoRelatorio.includes('financeiro') ? 'Relatório Financeiro' :
                            tipoRelatorio.includes('reservas') ? 'Relatório de Reservas' :
                            'Programação de Quadras'
                          }
                        </p>
                      </div>
                    </div>
                    {(() => {
                      const getTituloRelatorio = () => {
                        const categoria = tipoRelatorio.split('-')[0];
                        const periodo = tipoRelatorio.split('-')[1];
                        const quadraSelecionada = quadraImpressao ? 
                          quadras.find(q => q.id == quadraImpressao) : null;
                        
                        let titulo = '';
                        if (categoria === 'financeiro') titulo = 'Relatório Financeiro';
                        else if (categoria === 'reservas') titulo = 'Relatório de Reservas';
                        else titulo = 'Programação de Quadras';
                        
                        if (periodo === 'diario') {
                          return `${titulo} - ${new Date(dataRelatorio).toLocaleDateString('pt-BR')}`;
                        } else if (periodo === 'semanal') {
                          const dataInicio = new Date(semanaImpressao);
                          const dataFim = new Date(dataInicio);
                          dataFim.setDate(dataInicio.getDate() + 6);
                          return `${titulo} - Semana de ${dataInicio.toLocaleDateString('pt-BR')} a ${dataFim.toLocaleDateString('pt-BR')}`;
                        } else if (periodo === 'mensal') {
                          const [ano, mes] = mesImpressao.split('-');
                          const data = new Date(parseInt(ano), parseInt(mes) - 1, 1);
                          return `${titulo} - ${data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase()}`;
                        } else if (periodo === 'anual') {
                          return `${titulo} - Ano ${anoRelatorio}`;
                        }
                        return titulo;
                      };
                      
                      return (
                        <div>
                          <h2 className="text-base md:text-lg font-semibold text-gray-800 print:text-base">
                            {quadraImpressao ? 
                              `${quadras.find(q => q.id == quadraImpressao)?.nome} - ` : 
                              'Todas as Quadras - '
                            }
                            {getTituloRelatorio()}
                          </h2>
                          <p className="text-sm text-gray-600 print:text-sm mt-1">
                            Gerado em: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
                          </p>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Conteúdo baseado no tipo de relatório */}
                  {(() => {
                    if (tipoRelatorio.includes('financeiro')) {
                      // RELATÓRIO FINANCEIRO
                      return (
                        <div>
                          {(() => {
                            let dataInicio, dataFim;
                            
                            if (tipoRelatorio.includes('diario')) {
                              dataInicio = new Date(dataRelatorio);
                              dataFim = new Date(dataInicio);
                              dataFim.setDate(dataInicio.getDate() + 1);
                            } else if (tipoRelatorio.includes('semanal')) {
                              dataInicio = new Date(semanaImpressao);
                              dataFim = new Date(dataInicio);
                              dataFim.setDate(dataInicio.getDate() + 6);
                            } else if (tipoRelatorio.includes('mensal')) {
                              const [ano, mes] = mesImpressao.split('-');
                              dataInicio = new Date(parseInt(ano), parseInt(mes) - 1, 1);
                              dataFim = new Date(parseInt(ano), parseInt(mes), 0);
                            } else if (tipoRelatorio.includes('anual')) {
                              dataInicio = new Date(parseInt(anoRelatorio), 0, 1);
                              dataFim = new Date(parseInt(anoRelatorio), 11, 31);
                            }
                            
                            const reservasPeriodo = reservas.filter(r => {
                              const dataReserva = new Date(r.data);
                              return dataReserva >= dataInicio && dataReserva <= dataFim &&
                                     (!quadraImpressao || r.quadraId == quadraImpressao);
                            });
                            
                            const faturamentosPeriodo = faturamentos.filter(f => {
                              const dataFaturamento = new Date(f.data);
                              return dataFaturamento >= dataInicio && dataFaturamento <= dataFim;
                            });
                            
                            return (
                              <div className="space-y-6">
                                {/* Resumo Financeiro */}
                                <div className="border rounded-lg p-4">
                                  <h3 className="text-lg font-semibold text-blue-700 mb-4">Resumo Financeiro</h3>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div className="bg-blue-50 p-3 rounded">
                                      <p className="text-blue-600 font-medium">Faturamento Reservas</p>
                                      <p className="text-xl font-bold text-blue-700">
                                        R$ {reservasPeriodo.reduce((acc, r) => acc + (r.valor || 0), 0).toFixed(2)}
                                      </p>
                                    </div>
                                    <div className="bg-green-50 p-3 rounded">
                                      <p className="text-green-600 font-medium">Recebido Reservas</p>
                                      <p className="text-xl font-bold text-green-700">
                                        R$ {reservasPeriodo.reduce((acc, r) => acc + (r.valorPago || 0), 0).toFixed(2)}
                                      </p>
                                    </div>
                                    <div className="bg-purple-50 p-3 rounded">
                                      <p className="text-purple-600 font-medium">Faturamento Outros</p>
                                      <p className="text-xl font-bold text-purple-700">
                                        R$ {faturamentosPeriodo.reduce((acc, f) => acc + (f.valor || 0), 0).toFixed(2)}
                                      </p>
                                    </div>
                                    <div className="bg-orange-50 p-3 rounded">
                                      <p className="text-orange-600 font-medium">Recebido Outros</p>
                                      <p className="text-xl font-bold text-orange-700">
                                        R$ {faturamentosPeriodo.reduce((acc, f) => acc + (f.valorRealRecebido || 0), 0).toFixed(2)}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Detalhamento por Quadra */}
                                {(quadraImpressao ? quadras.filter(q => q.id == quadraImpressao) : quadras.filter(q => q.ativa)).map(quadra => {
                                  const reservasQuadra = reservasPeriodo.filter(r => r.quadraId === quadra.id);
                                  const receitaQuadra = reservasQuadra.reduce((acc, r) => acc + (r.valor || 0), 0);
                                  const recebidoQuadra = reservasQuadra.reduce((acc, r) => acc + (r.valorPago || 0), 0);
                                  
                                  return (
                                    <div key={quadra.id} className="border rounded-lg p-4">
                                      <h4 className="text-base font-semibold text-gray-800 mb-3">
                                        {quadra.nome} - {quadra.modalidade}
                                      </h4>
                                      <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                                        <div>
                                          <p className="text-gray-600">Reservas:</p>
                                          <p className="font-bold text-lg">{reservasQuadra.length}</p>
                                        </div>
                                        <div>
                                          <p className="text-gray-600">Faturado:</p>
                                          <p className="font-bold text-lg text-blue-600">R$ {receitaQuadra.toFixed(2)}</p>
                                        </div>
                                        <div>
                                          <p className="text-gray-600">Recebido:</p>
                                          <p className="font-bold text-lg text-green-600">R$ {recebidoQuadra.toFixed(2)}</p>
                                        </div>
                                      </div>
                                      
                                      {/* Lista de reservas */}
                                      {reservasQuadra.length > 0 && (
                                        <div className="overflow-x-auto print:overflow-visible">
                                          <table className="min-w-full border-collapse border border-gray-300 text-xs print:text-xs print:w-full">
                                            <thead>
                                              <tr className="bg-gray-50">
                                                <th className="border border-gray-300 px-2 py-1 text-left">Data</th>
                                                <th className="border border-gray-300 px-2 py-1 text-left">Horário</th>
                                                <th className="border border-gray-300 px-2 py-1 text-left">Cliente</th>
                                                <th className="border border-gray-300 px-2 py-1 text-left">Valor</th>
                                                <th className="border border-gray-300 px-2 py-1 text-left">Pago</th>
                                                <th className="border border-gray-300 px-2 py-1 text-left">Status</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {reservasQuadra.sort((a, b) => a.data.localeCompare(b.data)).map((reserva, idx) => {
                                                const cliente = clientes.find(c => c.id === reserva.clienteId);
                                                return (
                                                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                    <td className="border border-gray-300 px-2 py-1">
                                                      {new Date(reserva.data).toLocaleDateString('pt-BR')}
                                                    </td>
                                                    <td className="border border-gray-300 px-2 py-1">
                                                      {reserva.horaInicio} - {reserva.horaFim}
                                                    </td>
                                                    <td className="border border-gray-300 px-2 py-1">
                                                      {cliente?.nome || 'N/A'}
                                                    </td>
                                                    <td className="border border-gray-300 px-2 py-1 text-blue-600 font-medium">
                                                      R$ {reserva.valor?.toFixed(2)}
                                                    </td>
                                                    <td className="border border-gray-300 px-2 py-1 text-green-600 font-medium">
                                                      R$ {(reserva.valorPago || 0).toFixed(2)}
                                                    </td>
                                                    <td className="border border-gray-300 px-2 py-1">
                                                      <span className={`px-1 py-0.5 text-xs rounded ${
                                                        reserva.statusPagamento === 'Pago' ? 'bg-green-100 text-green-800' :
                                                        reserva.statusPagamento === 'Parcial' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                      }`}>
                                                        {reserva.statusPagamento || 'Pendente'}
                                                      </span>
                                                    </td>
                                                  </tr>
                                                );
                                              })}
                                            </tbody>
                                          </table>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}

                                {/* Faturamentos Administrativos */}
                                {faturamentosPeriodo.length > 0 && (
                                  <div className="border rounded-lg p-4 print:break-inside-avoid print:page-break-before-auto">
                                    <h4 className="text-base font-semibold text-gray-800 mb-3">
                                      Faturamentos Administrativos
                                    </h4>
                                    <div className="overflow-x-auto print:overflow-visible">
                                      <table className="min-w-full border-collapse border border-gray-300 text-xs print:text-xs print:w-full">
                                        <thead>
                                          <tr className="bg-gray-50">
                                            <th className="border border-gray-300 px-2 py-1 text-left">Data</th>
                                            <th className="border border-gray-300 px-2 py-1 text-left">Cliente</th>
                                            <th className="border border-gray-300 px-2 py-1 text-left">Tipo</th>
                                            <th className="border border-gray-300 px-2 py-1 text-left">Valor</th>
                                            <th className="border border-gray-300 px-2 py-1 text-left">Recebido</th>
                                            <th className="border border-gray-300 px-2 py-1 text-left">Em Aberto</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {faturamentosPeriodo.sort((a, b) => a.data.localeCompare(b.data)).map((faturamento, idx) => (
                                            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                              <td className="border border-gray-300 px-2 py-1">
                                                {new Date(faturamento.data).toLocaleDateString('pt-BR')}
                                              </td>
                                              <td className="border border-gray-300 px-2 py-1">
                                                {faturamento.cliente}
                                              </td>
                                              <td className="border border-gray-300 px-2 py-1">
                                                {faturamento.tipoLocacao}
                                              </td>
                                              <td className="border border-gray-300 px-2 py-1 text-blue-600 font-medium">
                                                R$ {faturamento.valor?.toFixed(2)}
                                              </td>
                                              <td className="border border-gray-300 px-2 py-1 text-green-600 font-medium">
                                                R$ {(faturamento.valorRealRecebido || 0).toFixed(2)}
                                              </td>
                                              <td className="border border-gray-300 px-2 py-1 text-red-600 font-medium">
                                                R$ {(faturamento.valorEmAberto || 0).toFixed(2)}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      );
                    } else if (tipoRelatorio.includes('reservas')) {
                      // RELATÓRIO DE RESERVAS
                      return (
                        <div>
                          {(() => {
                            let dataInicio, dataFim;
                            
                            if (tipoRelatorio.includes('diario')) {
                              dataInicio = new Date(dataRelatorio);
                              dataFim = new Date(dataInicio);
                              dataFim.setDate(dataInicio.getDate() + 1);
                            } else if (tipoRelatorio.includes('semanal')) {
                              dataInicio = new Date(semanaImpressao);
                              dataFim = new Date(dataInicio);
                              dataFim.setDate(dataInicio.getDate() + 6);
                            } else if (tipoRelatorio.includes('mensal')) {
                              const [ano, mes] = mesImpressao.split('-');
                              dataInicio = new Date(parseInt(ano), parseInt(mes) - 1, 1);
                              dataFim = new Date(parseInt(ano), parseInt(mes), 0);
                            } else if (tipoRelatorio.includes('anual')) {
                              dataInicio = new Date(parseInt(anoRelatorio), 0, 1);
                              dataFim = new Date(parseInt(anoRelatorio), 11, 31);
                            }
                            
                            const reservasPeriodo = reservas.filter(r => {
                              const dataReserva = new Date(r.data);
                              return dataReserva >= dataInicio && dataReserva <= dataFim &&
                                     (!quadraImpressao || r.quadraId == quadraImpressao);
                            });
                            
                            // Agrupar por status
                            const confirmadasCount = reservasPeriodo.filter(r => r.status === 'Confirmada').length;
                            const pendentesCount = reservasPeriodo.filter(r => r.status === 'Pendente').length;
                            const canceladasCount = reservasPeriodo.filter(r => r.status === 'Cancelada').length;
                            
                            return (
                              <div className="space-y-6">
                                {/* Resumo de Reservas */}
                                <div className="border rounded-lg p-4">
                                  <h3 className="text-lg font-semibold text-blue-700 mb-4">Resumo de Reservas</h3>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div className="bg-blue-50 p-3 rounded">
                                      <p className="text-blue-600 font-medium">Total</p>
                                      <p className="text-xl font-bold text-blue-700">{reservasPeriodo.length}</p>
                                    </div>
                                    <div className="bg-green-50 p-3 rounded">
                                      <p className="text-green-600 font-medium">Confirmadas</p>
                                      <p className="text-xl font-bold text-green-700">{confirmadasCount}</p>
                                    </div>
                                    <div className="bg-yellow-50 p-3 rounded">
                                      <p className="text-yellow-600 font-medium">Pendentes</p>
                                      <p className="text-xl font-bold text-yellow-700">{pendentesCount}</p>
                                    </div>
                                    <div className="bg-red-50 p-3 rounded">
                                      <p className="text-red-600 font-medium">Canceladas</p>
                                      <p className="text-xl font-bold text-red-700">{canceladasCount}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Lista completa de reservas */}
                                {tipoRelatorio.includes('diario') ? (
                                  // Para relatório diário, mostrar por horário
                                  <div className="border rounded-lg p-4">
                                    <h4 className="text-base font-semibold text-gray-800 mb-3">
                                      Reservas do Dia - {new Date(dataRelatorio).toLocaleDateString('pt-BR')}
                                    </h4>
                                    <div className="overflow-x-auto">
                                      <table className="min-w-full border-collapse border border-gray-300 text-xs">
                                        <thead>
                                          <tr className="bg-gray-50">
                                            <th className="border border-gray-300 px-2 py-1 text-left">Horário</th>
                                            <th className="border border-gray-300 px-2 py-1 text-left">Quadra</th>
                                            <th className="border border-gray-300 px-2 py-1 text-left">Cliente</th>
                                            <th className="border border-gray-300 px-2 py-1 text-left">Valor</th>
                                            <th className="border border-gray-300 px-2 py-1 text-left">Status</th>
                                            <th className="border border-gray-300 px-2 py-1 text-left">Responsável</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {reservasPeriodo.sort((a, b) => a.horaInicio.localeCompare(b.horaInicio)).map((reserva, idx) => {
                                            const quadra = quadras.find(q => q.id === reserva.quadraId);
                                            const cliente = clientes.find(c => c.id === reserva.clienteId);
                                            return (
                                              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                <td className="border border-gray-300 px-2 py-1 font-medium">
                                                  {reserva.horaInicio} - {reserva.horaFim}
                                                </td>
                                                <td className="border border-gray-300 px-2 py-1">
                                                  {quadra?.nome}
                                                </td>
                                                <td className="border border-gray-300 px-2 py-1">
                                                  {cliente?.nome}
                                                </td>
                                                <td className="border border-gray-300 px-2 py-1 text-blue-600 font-medium">
                                                  R$ {reserva.valor?.toFixed(2)}
                                                </td>
                                                <td className="border border-gray-300 px-2 py-1">
                                                  <span className={`px-1 py-0.5 text-xs rounded ${
                                                    reserva.status === 'Confirmada' ? 'bg-green-100 text-green-800' :
                                                    reserva.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                  }`}>
                                                    {reserva.status}
                                                  </span>
                                                </td>
                                                <td className="border border-gray-300 px-2 py-1 text-xs">
                                                  {reserva.usuarioResponsavel || 'N/A'}
                                                </td>
                                              </tr>
                                            );
                                          })}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                ) : (
                                  // Para outros períodos, agrupar por quadra
                                  (quadraImpressao ? quadras.filter(q => q.id == quadraImpressao) : quadras.filter(q => q.ativa)).map(quadra => {
                                    const reservasQuadra = reservasPeriodo.filter(r => r.quadraId === quadra.id);
                                    
                                    return reservasQuadra.length > 0 && (
                                      <div key={quadra.id} className="border rounded-lg p-4">
                                        <h4 className="text-base font-semibold text-gray-800 mb-3">
                                          {quadra.nome} - {quadra.modalidade}
                                        </h4>
                                        <div className="overflow-x-auto">
                                          <table className="min-w-full border-collapse border border-gray-300 text-xs">
                                            <thead>
                                              <tr className="bg-gray-50">
                                                <th className="border border-gray-300 px-2 py-1 text-left">Data</th>
                                                <th className="border border-gray-300 px-2 py-1 text-left">Horário</th>
                                                <th className="border border-gray-300 px-2 py-1 text-left">Cliente</th>
                                                <th className="border border-gray-300 px-2 py-1 text-left">Valor</th>
                                                <th className="border border-gray-300 px-2 py-1 text-left">Status</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {reservasQuadra.sort((a, b) => a.data.localeCompare(b.data) || a.horaInicio.localeCompare(b.horaInicio)).map((reserva, idx) => {
                                                const cliente = clientes.find(c => c.id === reserva.clienteId);
                                                return (
                                                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                    <td className="border border-gray-300 px-2 py-1">
                                                      {new Date(reserva.data).toLocaleDateString('pt-BR')}
                                                    </td>
                                                    <td className="border border-gray-300 px-2 py-1 font-medium">
                                                      {reserva.horaInicio} - {reserva.horaFim}
                                                    </td>
                                                    <td className="border border-gray-300 px-2 py-1">
                                                      {cliente?.nome}
                                                    </td>
                                                    <td className="border border-gray-300 px-2 py-1 text-blue-600 font-medium">
                                                      R$ {reserva.valor?.toFixed(2)}
                                                    </td>
                                                    <td className="border border-gray-300 px-2 py-1">
                                                      <span className={`px-1 py-0.5 text-xs rounded ${
                                                        reserva.status === 'Confirmada' ? 'bg-green-100 text-green-800' :
                                                        reserva.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                      }`}>
                                                        {reserva.status}
                                                      </span>
                                                    </td>
                                                  </tr>
                                                );
                                              })}
                                            </tbody>
                                          </table>
                                        </div>
                                      </div>
                                    );
                                  })
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      );
                    } else {
                      // PROGRAMAÇÃO DE QUADRAS (original semanal)
                      return (

                        <div>
                          {(() => {
                            const dataInicio = new Date(semanaImpressao);
                            const quadrasParaExibir = quadraImpressao ? 
                              quadras.filter(q => q.id == quadraImpressao) : 
                              quadras.filter(q => q.ativa);
                            
                            // Gerar os 7 dias da semana
                            const diasSemana = [];
                            for (let i = 0; i < 7; i++) {
                              const data = new Date(dataInicio);
                              data.setDate(dataInicio.getDate() + i);
                              diasSemana.push(data);
                            }
                            
                            return quadrasParaExibir.map(quadra => (
                      <div key={quadra.id} className="mb-6 print:mb-4 print:break-inside-avoid">
                        <h3 className="text-base md:text-lg font-semibold text-blue-700 mb-3 print:text-base border-b border-blue-200 pb-2">
                          {quadra.nome} - {quadra.modalidade}
                        </h3>
                        
                        <div className="overflow-x-auto">
                          <table className="min-w-full border-collapse border border-gray-300 text-xs md:text-sm print:text-xs">
                            <thead>
                              <tr className="bg-blue-50 print:bg-gray-100">
                                <th className="border border-gray-300 px-2 md:px-3 py-2 text-left font-medium w-20">Data</th>
                                <th className="border border-gray-300 px-2 md:px-3 py-2 text-left font-medium w-16">Dia</th>
                                <th className="border border-gray-300 px-2 md:px-3 py-2 text-left font-medium">Horários e Reservas</th>
                              </tr>
                            </thead>
                            <tbody>
                              {diasSemana.map((data, index) => {
                                const dataStr = data.toISOString().split('T')[0];
                                const diaSemana = data.toLocaleDateString('pt-BR', { weekday: 'long' });
                                const reservasDoDia = reservas.filter(r => 
                                  r.data === dataStr && r.quadraId === quadra.id
                                ).sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
                                
                                return (
                                  <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} print:break-inside-avoid`}>
                                    <td className="border border-gray-300 px-2 md:px-3 py-2 font-medium text-blue-600">
                                      {data.getDate().toString().padStart(2, '0')}/{(data.getMonth() + 1).toString().padStart(2, '0')}
                                    </td>
                                    <td className="border border-gray-300 px-2 md:px-3 py-2 text-gray-700 capitalize">
                                      {diaSemana}
                                    </td>
                                    <td className="border border-gray-300 px-2 md:px-3 py-2">
                                      {reservasDoDia.length > 0 ? (
                                        <div className="space-y-2">
                                          {reservasDoDia.map((reserva, idx) => {
                                            const cliente = clientes.find(c => c.id === reserva.clienteId);
                                            return (
                                              <div 
                                                key={idx}
                                                className={`p-2 rounded border-l-4 ${
                                                  reserva.status === 'Confirmada' ? 'bg-green-50 border-green-400' :
                                                  reserva.status === 'Pendente' ? 'bg-yellow-50 border-yellow-400' :
                                                  'bg-red-50 border-red-400'
                                                }`}
                                              >
                                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                                  <span className="font-bold text-blue-700">
                                                    {reserva.horaInicio} - {reserva.horaFim}
                                                  </span>
                                                  <span className="font-medium text-gray-800">
                                                    {cliente?.nome || 'Cliente N/A'}
                                                  </span>
                                                  <span className="text-green-600 font-medium">
                                                    R$ {reserva.valor?.toFixed(2)}
                                                  </span>
                                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    reserva.status === 'Confirmada' ? 'bg-green-100 text-green-800' :
                                                    reserva.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                  }`}>
                                                    {reserva.status}
                                                  </span>
                                                </div>
                                                {reserva.usuarioResponsavel && (
                                                  <div className="mt-1 text-xs text-gray-500 flex items-center">
                                                    <UserCheck className="h-3 w-3 mr-1" />
                                                    Agendado por: <strong className="ml-1">{reserva.usuarioResponsavel}</strong>
                                                    {reserva.dataLancamento && (
                                                      <span className="ml-2 text-gray-400">
                                                        • {new Date(reserva.dataLancamento).toLocaleDateString('pt-BR')}
                                                      </span>
                                                    )}
                                                  </div>
                                                )}
                                                {reserva.observacoes && (
                                                  <div className="mt-1 text-xs text-gray-600 italic">
                                                    Obs: {reserva.observacoes}
                                                  </div>
                                                )}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      ) : (
                                        <div className="text-center text-gray-400 py-4 italic">
                                          Nenhuma reserva para este dia
                                        </div>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        
                        {/* Resumo da Quadra */}
                        <div className="mt-3 p-3 bg-blue-50 rounded border print:bg-gray-100">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                            {(() => {
                              const reservasQuadra = reservas.filter(r => {
                                const dataReserva = new Date(r.data);
                                const dataInicio = new Date(semanaImpressao);
                                const dataFim = new Date(dataInicio);
                                dataFim.setDate(dataInicio.getDate() + 6);
                                return r.quadraId === quadra.id && 
                                       dataReserva >= dataInicio && dataReserva <= dataFim;
                              });
                              
                              const totalReservas = reservasQuadra.length;
                              const reservasConfirmadas = reservasQuadra.filter(r => r.status === 'Confirmada').length;
                              const receitaTotal = reservasQuadra.reduce((acc, r) => acc + (r.valor || 0), 0);
                              const receitaPaga = reservasQuadra.reduce((acc, r) => acc + (r.valorPago || 0), 0);
                              
                              return (
                                <>
                                  <div>
                                    <span className="text-gray-600">Total de Reservas:</span>
                                    <span className="font-bold text-blue-600 ml-1">{totalReservas}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Confirmadas:</span>
                                    <span className="font-bold text-green-600 ml-1">{reservasConfirmadas}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Receita Total:</span>
                                    <span className="font-bold text-blue-600 ml-1">R$ {receitaTotal.toFixed(2)}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Valor Recebido:</span>
                                    <span className="font-bold text-green-600 ml-1">R$ {receitaPaga.toFixed(2)}</span>
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        </div>
                              </div>
                            ));
                          })()}
                        </div>
                      );
                    }
                  })()}

                  {/* Legenda e Informações */}
                  <div className="mt-4 md:mt-6 print:mt-4">
                    <h3 className="text-sm md:text-lg font-medium text-gray-900 mb-2 md:mb-3 print:text-sm">Legenda e Informações</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 print:gap-4 text-xs md:text-sm print:text-xs">
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-800">Status das Reservas:</h4>
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-100 border-l-4 border-green-400 rounded-sm mr-2"></div>
                            <span>Confirmada</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-yellow-100 border-l-4 border-yellow-400 rounded-sm mr-2"></div>
                            <span>Pendente</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-red-100 border-l-4 border-red-400 rounded-sm mr-2"></div>
                            <span>Cancelada</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-800">
                          {tipoRelatorio.includes('financeiro') ? 'Informações Financeiras:' :
                           tipoRelatorio.includes('reservas') ? 'Dados das Reservas:' :
                           'Programação de Quadras:'}
                        </h4>
                        <div className="text-xs space-y-1">
                          {tipoRelatorio.includes('financeiro') ? (
                            <>
                              <div>• Valores faturados e recebidos</div>
                              <div>• Separação por reservas e outros</div>
                              <div>• Status de pagamento detalhado</div>
                              <div>• Análise por quadra e período</div>
                              <div>• Controle de inadimplência</div>
                            </>
                          ) : tipoRelatorio.includes('reservas') ? (
                            <>
                              <div>• Horários e durações das reservas</div>
                              <div>• Dados completos dos clientes</div>
                              <div>• Status e valores das reservas</div>
                              <div>• Usuário responsável pelo agendamento</div>
                              <div>• Controle de ocupação por período</div>
                            </>
                          ) : (
                            <>
                              <div>• Horário de início e fim (intervalos de 5 minutos)</div>
                              <div>• Nome completo do cliente</div>
                              <div>• Valor da locação proporcional ao tempo</div>
                              <div>• Status da reserva (cores visuais)</div>
                              <div>• Usuário responsável pelo agendamento</div>
                              <div>• Data do lançamento da reserva</div>
                              <div>• Observações (quando houver)</div>
                              <div>• Máximo 6 reservas por quadra/dia</div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-800">Características do Relatório:</h4>
                        <div className="text-xs space-y-1">
                          <div>• Período: {
                            tipoRelatorio.includes('diario') ? 'Diário' :
                            tipoRelatorio.includes('semanal') ? 'Semanal' :
                            tipoRelatorio.includes('mensal') ? 'Mensal' :
                            'Anual'
                          }</div>
                          <div>• Categoria: {
                            tipoRelatorio.includes('financeiro') ? 'Financeiro' :
                            tipoRelatorio.includes('reservas') ? 'Reservas' :
                            'Programação'
                          }</div>
                          <div>• Quadra(s): {quadraImpressao ? 
                            quadras.find(q => q.id == quadraImpressao)?.nome : 
                            'Todas as ativas'
                          }</div>
                          <div>• Gerado em: {new Date().toLocaleDateString('pt-BR')}</div>
                          <div>• Usuário: {usuarioLogado?.nome}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded print:bg-gray-100">
                      <p className="text-xs text-blue-700 print:text-gray-700">
                        <strong>Centro de Relatórios:</strong> {
                          tipoRelatorio.includes('financeiro') ? 
                            'Relatório financeiro detalhado com controle de faturamento, recebimentos e inadimplência. Ideal para análise de desempenho financeiro e tomada de decisões.' :
                          tipoRelatorio.includes('reservas') ?
                            'Relatório completo de reservas com dados operacionais e de ocupação. Perfeito para controle administrativo e análise de demanda.' :
                            'Programação detalhada por quadra incluindo informações completas de cada reserva e controle de responsabilidade por agendamento. Ideal para controle operacional e acompanhamento de ocupação.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé Desktop */}
        <div className="hidden md:block bg-gray-800 text-center py-3 mt-8 border-t border-gray-700">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300">Sistema Online</span>
              </div>
              <div className="text-gray-500">•</div>
              <p className="text-sm text-gray-300">
                © 2025 <span className="font-medium text-green-400">PauloCunhaMKT</span> Soluções TI
              </p>
              <div className="text-gray-500">•</div>
              <div className="flex items-center space-x-1">
                <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-400">v2.1.0</span>
                <span className="text-xs text-gray-500">Build 2025.01</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Sistema de Gestão Esportiva • Desenvolvido especialmente para o Esporte Clube Jurema
            </p>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-4 md:p-6 w-full max-w-md mx-4 max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base md:text-lg font-medium">
                  {editingItem ? 'Editar' : 'Novo'} {
                    modalType === 'quadra' ? 'Quadra' :
                    modalType === 'cliente' ? 'Cliente' : 
                    modalType === 'admin' ? 'Administrador' :
                    modalType === 'faturamento' ? 'Faturamento' :
                    modalType === 'recebimento' ? 'Recebimento' : 'Reserva'
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <select
                    value={formQuadra.modalidade}
                    onChange={(e) => setFormQuadra({...formQuadra, modalidade: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <label className="flex items-center text-sm">
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
                    className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 text-sm"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Telefone"
                    value={formCliente.telefone}
                    onChange={(e) => setFormCliente({...formCliente, telefone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={formCliente.email}
                    onChange={(e) => setFormCliente({...formCliente, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <button
                    onClick={adicionarCliente}
                    className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 text-sm"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Selecione a quadra</option>
                    {quadras.filter(q => q.ativa).map(quadra => (
                      <option key={quadra.id} value={quadra.id}>{quadra.nome}</option>
                    ))}
                  </select>
                  <select
                    value={formReserva.clienteId}
                    onChange={(e) => setFormReserva({...formReserva, clienteId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="time"
                      placeholder="Hora início"
                      value={formReserva.horaInicio}
                      onChange={(e) => setFormReserva({...formReserva, horaInicio: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                      min="06:00"
                      max="22:00"
                    />
                    <input
                      type="time"
                      placeholder="Hora fim"
                      value={formReserva.horaFim}
                      onChange={(e) => setFormReserva({...formReserva, horaFim: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                      min="07:00"
                      max="23:00"
                    />
                  </div>
                  
                  {/* Aviso sobre disponibilidade */}
                  {formReserva.data && formReserva.quadraId && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="text-sm text-blue-700">
                        <strong>Disponibilidade:</strong>
                        {(() => {
                          const reservasNoDia = reservas.filter(r => 
                            r.data === formReserva.data && 
                            r.quadraId === parseInt(formReserva.quadraId) &&
                            (!editingItem || r.id !== editingItem.id)
                          );
                          const quadraSelecionada = quadras.find(q => q.id === parseInt(formReserva.quadraId));
                          
                          return (
                            <div className="mt-2">
                              <p>• Quadra: <strong>{quadraSelecionada?.nome}</strong></p>
                              <p>• Data: <strong>{new Date(formReserva.data + 'T00:00:00').toLocaleDateString('pt-BR')}</strong></p>
                              <p>• Reservas no dia: <strong>{reservasNoDia.length}/6</strong></p>
                              <p>• Horário de funcionamento: <strong>06:00 às 23:00</strong></p>
                              <p>• Intervalo entre reservas: <strong>mínimo 5 minutos</strong></p>
                              
                              {reservasNoDia.length > 0 && (
                                <div className="mt-2">
                                  <p className="font-medium">Horários ocupados:</p>
                                  <div className="space-y-1">
                                    {reservasNoDia
                                      .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio))
                                      .map((r, idx) => {
                                        const cliente = clientes.find(c => c.id === r.clienteId);
                                        return (
                                          <div key={idx} className="text-xs bg-white p-2 rounded border">
                                            <strong>{r.horaInicio} - {r.horaFim}</strong> • {cliente?.nome}
                                          </div>
                                        );
                                      })}
                                  </div>
                                </div>
                              )}
                              
                              {reservasNoDia.length >= 6 && (
                                <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-700">
                                  <strong>⚠️ Limite atingido!</strong> Esta quadra já possui 6 reservas neste dia.
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                  <input
                    type="number"
                    placeholder="Valor (opcional)"
                    value={formReserva.valor}
                    onChange={(e) => setFormReserva({...formReserva, valor: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={formReserva.status}
                      onChange={(e) => setFormReserva({...formReserva, status: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="Confirmada">Confirmada</option>
                      <option value="Pendente">Pendente</option>
                      <option value="Cancelada">Cancelada</option>
                    </select>
                    <select
                      value={formReserva.statusPagamento}
                      onChange={(e) => {
                        const novoStatus = e.target.value;
                        setFormReserva({
                          ...formReserva, 
                          statusPagamento: novoStatus,
                          // Auto-ajustar valorPago baseado no status
                          valorPago: novoStatus === 'Pago' && !formReserva.valorPago ? formReserva.valor : formReserva.valorPago,
                          dataPagamento: novoStatus !== 'Pendente' && !formReserva.dataPagamento ? new Date().toISOString().split('T')[0] : formReserva.dataPagamento
                        });
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="Pendente">Pendente</option>
                      <option value="Parcial">Parcial</option>
                      <option value="Pago">Pago</option>
                    </select>
                  </div>
                  
                  {/* Campos de Pagamento - Mostrar apenas se não for Pendente */}
                  {formReserva.statusPagamento !== 'Pendente' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-3">
                      <h4 className="text-sm font-medium text-green-800">Informações de Pagamento</h4>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Valor pago"
                          value={formReserva.valorPago}
                          onChange={(e) => {
                            const valorPago = parseFloat(e.target.value) || 0;
                            const valorTotal = parseFloat(formReserva.valor) || 0;
                            let novoStatus = 'Pendente';
                            
                            if (valorPago === 0) {
                              novoStatus = 'Pendente';
                            } else if (valorPago >= valorTotal) {
                              novoStatus = 'Pago';
                            } else {
                              novoStatus = 'Parcial';
                            }
                            
                            setFormReserva({
                              ...formReserva, 
                              valorPago: e.target.value,
                              statusPagamento: novoStatus
                            });
                          }}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                        <input
                          type="date"
                          value={formReserva.dataPagamento}
                          onChange={(e) => setFormReserva({...formReserva, dataPagamento: e.target.value})}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      
                      <select
                        value={formReserva.formaPagamento}
                        onChange={(e) => setFormReserva({...formReserva, formaPagamento: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="">Forma de pagamento</option>
                        <option value="Pix">Pix</option>
                        <option value="Dinheiro">Dinheiro</option>
                        <option value="Transferência">Transferência</option>
                        <option value="Cartão">Cartão</option>
                        <option value="Cheque">Cheque</option>
                      </select>
                      
                      {formReserva.valorPago && formReserva.valor && (
                        <div className="text-xs text-green-700">
                          <strong>Saldo:</strong> R$ {((parseFloat(formReserva.valor) || 0) - (parseFloat(formReserva.valorPago) || 0)).toFixed(2)}
                          {parseFloat(formReserva.valorPago) >= parseFloat(formReserva.valor) && ' ✓ Pago'}
                        </div>
                      )}
                    </div>
                  )}
                  <textarea
                    placeholder="Observações (opcional)"
                    value={formReserva.observacoes}
                    onChange={(e) => setFormReserva({...formReserva, observacoes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    rows="3"
                  />
                  <button
                    onClick={adicionarReserva}
                    className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 text-sm"
                  >
                    {editingItem ? 'Atualizar' : 'Adicionar'}
                  </button>
                </div>
              )}

              {modalType === 'admin' && (
                <div className="space-y-4">
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                    <div className="flex">
                      <Shield className="h-4 w-4 text-orange-500 mr-2 mt-0.5" />
                      <p className="text-sm text-orange-700">
                        <strong>Importante:</strong> Mantenha as credenciais seguras. Evite senhas simples.
                      </p>
                    </div>
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Nome completo"
                    value={formAdmin.nome}
                    onChange={(e) => setFormAdmin({...formAdmin, nome: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  
                  <input
                    type="text"
                    placeholder="Nome de usuário (login)"
                    value={formAdmin.usuario}
                    onChange={(e) => setFormAdmin({...formAdmin, usuario: e.target.value.toLowerCase().replace(/\s+/g, '')})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Senha de acesso"
                      value={formAdmin.senha}
                      onChange={(e) => setFormAdmin({...formAdmin, senha: e.target.value})}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  
                  <select
                    value={formAdmin.cargo}
                    onChange={(e) => setFormAdmin({...formAdmin, cargo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Selecione o cargo</option>
                    <option value="Administrador Geral">Administrador Geral</option>
                    <option value="Gerente de Operações">Gerente de Operações</option>
                    <option value="Secretário do Clube">Secretário do Clube</option>
                    <option value="Assistente Administrativo">Assistente Administrativo</option>
                    <option value="Coordenador de Quadras">Coordenador de Quadras</option>
                  </select>

                  <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
                    <p><strong>Dicas de Segurança:</strong></p>
                    <ul className="mt-1 space-y-1">
                      <li>• Use senhas com pelo menos 8 caracteres</li>
                      <li>• Combine letras, números e símbolos</li>
                      <li>• Evite informações pessoais óbvias</li>
                      <li>• Altere a senha regularmente</li>
                    </ul>
                  </div>
                  
                  <button
                    onClick={adicionarAdmin}
                    className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 text-sm"
                  >
                    {editingItem ? 'Atualizar Administrador' : 'Adicionar Administrador'}
                  </button>
                </div>
              )}

              {modalType === 'faturamento' && (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-700">
                      <strong>Faturamento:</strong> Registre todas as informações da locação conforme orientações.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="date"
                      placeholder="Data"
                      value={formFaturamento.data}
                      onChange={(e) => setFormFaturamento({...formFaturamento, data: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Cliente"
                      value={formFaturamento.cliente}
                      onChange={(e) => setFormFaturamento({...formFaturamento, cliente: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Mês Locação (ex: JAN/2025)"
                      value={formFaturamento.mesLocacao}
                      onChange={(e) => setFormFaturamento({...formFaturamento, mesLocacao: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Hora"
                      value={formFaturamento.hora}
                      onChange={(e) => setFormFaturamento({...formFaturamento, hora: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={formFaturamento.tipoQuadra}
                      onChange={(e) => setFormFaturamento({...formFaturamento, tipoQuadra: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="">Tipo de Quadra</option>
                      <option value="Campo de Futebol">Campo de Futebol</option>
                      <option value="Quadra de Futsal">Quadra de Futsal</option>
                    </select>
                    <select
                      value={formFaturamento.tipoLocacao}
                      onChange={(e) => setFormFaturamento({...formFaturamento, tipoLocacao: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="">Tipo de Locação</option>
                      <option value="Mensal">Mensal</option>
                      <option value="Avulso">Avulso</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Recibo de Pagamento Nº"
                      value={formFaturamento.reciboPagamento}
                      onChange={(e) => setFormFaturamento({...formFaturamento, reciboPagamento: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <input
                      type="date"
                      placeholder="Data da Locação"
                      value={formFaturamento.dataLocacao}
                      onChange={(e) => setFormFaturamento({...formFaturamento, dataLocacao: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Valor da Locação"
                    value={formFaturamento.valor}
                    onChange={(e) => setFormFaturamento({...formFaturamento, valor: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  
                  <select
                    value={formFaturamento.formaPagamento}
                    onChange={(e) => setFormFaturamento({...formFaturamento, formaPagamento: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Forma de Pagamento</option>
                    <option value="Pix">Pix</option>
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="Transferência">Transferência</option>
                    <option value="Cartão">Cartão</option>
                  </select>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Valor Recebido (inicial)"
                      value={formFaturamento.valorRecebido}
                      onChange={(e) => setFormFaturamento({...formFaturamento, valorRecebido: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Valor Real Recebido"
                      value={formFaturamento.valorRealRecebido}
                      onChange={(e) => setFormFaturamento({...formFaturamento, valorRealRecebido: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  
                  <textarea
                    placeholder="Observações"
                    value={formFaturamento.observacoes}
                    onChange={(e) => setFormFaturamento({...formFaturamento, observacoes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    rows="3"
                  />
                  
                  <button
                    onClick={adicionarFaturamento}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 text-sm"
                  >
                    {editingItem ? 'Atualizar Faturamento' : 'Registrar Faturamento'}
                  </button>
                </div>
              )}

              {modalType === 'recebimento' && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-700">
                      <strong>Recebimento:</strong> Registre valores recebidos posteriormente ao faturamento.
                    </p>
                  </div>
                  
                  <select
                    value={formRecebimento.faturamentoId}
                    onChange={(e) => setFormRecebimento({...formRecebimento, faturamentoId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Selecione o Faturamento</option>
                    {faturamentos
                      .filter(f => f.valorEmAberto > 0)
                      .map(faturamento => (
                        <option key={faturamento.id} value={faturamento.id}>
                          {faturamento.cliente} - {faturamento.mesLocacao} (R$ {faturamento.valorEmAberto?.toFixed(2)} em aberto)
                        </option>
                      ))}
                  </select>
                  
                  <input
                    type="date"
                    value={formRecebimento.data}
                    onChange={(e) => setFormRecebimento({...formRecebimento, data: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Valor Recebido"
                    value={formRecebimento.valor}
                    onChange={(e) => setFormRecebimento({...formRecebimento, valor: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  
                  <select
                    value={formRecebimento.formaPagamento}
                    onChange={(e) => setFormRecebimento({...formRecebimento, formaPagamento: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Forma de Pagamento</option>
                    <option value="Pix">Pix</option>
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="Transferência">Transferência</option>
                    <option value="Cartão">Cartão</option>
                  </select>
                  
                  <textarea
                    placeholder="Observações"
                    value={formRecebimento.observacoes}
                    onChange={(e) => setFormRecebimento({...formRecebimento, observacoes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    rows="3"
                  />
                  
                  <button
                    onClick={adicionarRecebimento}
                    className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 text-sm"
                  >
                    Registrar Recebimento
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