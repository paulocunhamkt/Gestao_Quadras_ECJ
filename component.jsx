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
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  
  // Usuários administrativos (gerenciáveis)
  const [usuariosAdmin, setUsuariosAdmin] = useStoredState('usuariosAdmin', [
    { id: 1, usuario: 'admin', senha: 'jurema2025', nome: 'Administrador', cargo: 'Administrador Geral' },
    { id: 2, usuario: 'gerente', senha: 'gestao123', nome: 'Gerente', cargo: 'Gerente de Operações' },
    { id: 3, usuario: 'secretario', senha: 'quadras456', nome: 'Secretário', cargo: 'Secretário do Clube' }
  ]);
  
  // Estados para dados
  const [quadras, setQuadras] = useStoredState('quadras', [
    { 
      id: 1, 
      nome: 'Campo de Futebol 1', 
      modalidade: 'Campo de Futebol', 
      valorHora: 100, 
      ativa: true,
      usarTabelaDiferenciada: false,
      valorManha: 80,
      valorNoite: 100
    },
    { 
      id: 2, 
      nome: 'Quadra de Futsal 1', 
      modalidade: 'Quadra de Futsal', 
      valorHora: 80, 
      ativa: true,
      usarTabelaDiferenciada: false,
      valorManha: 60,
      valorNoite: 80
    }
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
  const [clientesExpandidos, setClientesExpandidos] = useState({});
  
  // Estados específicos para Relatórios
  const [tipoRelatorio, setTipoRelatorio] = useState('financeiro-mensal');
  const [dataRelatorio, setDataRelatorio] = useState(new Date().toISOString().slice(0, 10));
  const [periodoRelatorio, setPeriodoRelatorio] = useState('mensal');
  const [anoRelatorio, setAnoRelatorio] = useState(new Date().getFullYear().toString());

  // Formulários
  const [formQuadra, setFormQuadra] = useState({ 
    nome: '', 
    modalidade: '', 
    valorHora: '', 
    ativa: true,
    usarTabelaDiferenciada: false,
    valorManha: '', // 06:00 - 17:59
    valorNoite: ''  // 18:00 - 22:59
  });
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
    observacoes: '',
    // Campos para reserva mensal
    tipoReserva: 'avulsa', // 'avulsa' ou 'mensal'
    mesReferencia: '',
    diasSemana: [], // array com dias da semana selecionados
    valorMensal: 0,
    numeroParcelas: 1,
    valorParcela: 0,
    dataVencimentoPrimeiraParcela: '',
    observacoesMensal: ''
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

  // Função para calcular valor por horário baseado no período (CORRIGIDA)
  const calcularValorPorHorario = (quadra, horaInicio) => {
    if (!quadra.usarTabelaDiferenciada) {
      return parseFloat(quadra.valorHora) || 0;
    }
    
    // Converter hora para número para comparação
    const hora = parseInt(horaInicio.split(':')[0]);
    
    // Manhã/Tarde: 06:00 - 17:59 (6h às 17h59) = valorManha
    // Noite: 18:00 - 22:59 (18h às 22h59) = valorNoite
    if (hora >= 6 && hora < 18) {
      return parseFloat(quadra.valorManha) || parseFloat(quadra.valorHora) || 0;
    } else if (hora >= 18 && hora < 23) {
      return parseFloat(quadra.valorNoite) || parseFloat(quadra.valorHora) || 0;
    } else {
      // Horário fora do funcionamento, usar valor padrão
      return parseFloat(quadra.valorHora) || parseFloat(quadra.valorManha) || 0;
    }
  };

  // Funções para Quadras
  const adicionarQuadra = () => {
    if (editingItem) {
      setQuadras(quadras.map(q => q.id === editingItem.id ? 
        { 
          ...formQuadra, 
          id: editingItem.id, 
          valorHora: parseFloat(formQuadra.valorHora) || 0,
          valorManha: parseFloat(formQuadra.valorManha) || 0,
          valorNoite: parseFloat(formQuadra.valorNoite) || 0
        } : q
      ));
      registrarAtividade('QUADRA_EDITADA', `Quadra "${formQuadra.nome}" editada`);
    } else {
      const novaQuadra = {
        id: Date.now(),
        ...formQuadra,
        valorHora: parseFloat(formQuadra.valorHora) || 0,
        valorManha: parseFloat(formQuadra.valorManha) || 0,
        valorNoite: parseFloat(formQuadra.valorNoite) || 0
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
      ativa: quadra.ativa,
      usarTabelaDiferenciada: quadra.usarTabelaDiferenciada || false,
      valorManha: (quadra.valorManha || '').toString(),
      valorNoite: (quadra.valorNoite || '').toString()
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
    const tipoId = formRecebimento.faturamentoId;
    const [tipo, idStr] = tipoId.split('_');
    const id = parseInt(idStr);
    const valorRecebimento = parseFloat(formRecebimento.valor);
    
    const novoRecebimento = {
      id: Date.now(),
      ...formRecebimento,
      faturamentoId: tipo === 'fat' ? id : null,
      reservaId: tipo === 'res' ? id : null,
      tipoItem: tipo === 'fat' ? 'faturamento' : 'reserva',
      valor: valorRecebimento,
      usuarioResponsavel: usuarioLogado?.nome || 'Sistema',
      dataLancamento: new Date().toISOString()
    };
    
    setRecebimentos([...recebimentos, novoRecebimento]);
    
    if (tipo === 'fat') {
      // Atualizar faturamento
      setFaturamentos(faturamentos.map(f => {
        if (f.id === id) {
          const novoValorRecebido = f.valorRealRecebido + valorRecebimento;
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
    } else {
      // Atualizar reserva
      setReservas(reservas.map(r => {
        if (r.id === id) {
          const valorAtual = r.valorPago || 0;
          const novoValorPago = valorAtual + valorRecebimento;
          const valorTotal = r.valor || 0;
          let novoStatusPagamento = 'Pendente';
          
          if (novoValorPago >= valorTotal) {
            novoStatusPagamento = 'Pago';
          } else if (novoValorPago > 0) {
            novoStatusPagamento = 'Parcial';
          }
          
          return {
            ...r,
            valorPago: novoValorPago,
            statusPagamento: novoStatusPagamento,
            formaPagamento: formRecebimento.formaPagamento,
            dataPagamento: formRecebimento.data,
            ultimoRecebimento: {
              usuario: usuarioLogado?.nome || 'Sistema',
              data: new Date().toISOString(),
              valor: valorRecebimento
            }
          };
        }
        return r;
      }));
    }
    
    fecharModal();
  };

  const excluirRecebimento = (id) => {
    const recebimento = recebimentos.find(r => r.id === id);
    if (recebimento && confirm('Tem certeza que deseja excluir este recebimento?')) {
      setRecebimentos(recebimentos.filter(r => r.id !== id));
      
      if (recebimento.tipoItem === 'faturamento' && recebimento.faturamentoId) {
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
      } else if (recebimento.tipoItem === 'reserva' && recebimento.reservaId) {
        // Atualizar reserva
        setReservas(reservas.map(r => {
          if (r.id === recebimento.reservaId) {
            const valorAtual = r.valorPago || 0;
            const novoValorPago = Math.max(0, valorAtual - recebimento.valor);
            const valorTotal = r.valor || 0;
            let novoStatusPagamento = 'Pendente';
            
            if (novoValorPago >= valorTotal) {
              novoStatusPagamento = 'Pago';
            } else if (novoValorPago > 0) {
              novoStatusPagamento = 'Parcial';
            }
            
            return {
              ...r,
              valorPago: novoValorPago,
              statusPagamento: novoStatusPagamento
            };
          }
          return r;
        }));
      }
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

  // Função para calcular valor mensal SEM DESCONTO (CORRIGIDA)
  const calcularValorMensal = () => {
    if (!formReserva.quadraId || !formReserva.horaInicio || !formReserva.horaFim || formReserva.diasSemana.length === 0) {
      return 0;
    }
    
    const quadra = quadras.find(q => q.id === parseInt(formReserva.quadraId));
    if (!quadra) return 0;
    
    // Calcular duração em horas
    const horaInicio = new Date(`2000-01-01T${formReserva.horaInicio}`);
    const horaFim = new Date(`2000-01-01T${formReserva.horaFim}`);
    const minutos = (horaFim - horaInicio) / (1000 * 60);
    const horas = minutos / 60;
    
    // Calcular valor por sessão baseado no período (SEM DESCONTO)
    let valorPorHora;
    if (quadra.usarTabelaDiferenciada) {
      // Usar a função corrigida para calcular valor por horário
      const hora = parseInt(formReserva.horaInicio.split(':')[0]);
      if (hora >= 6 && hora < 18) {
        valorPorHora = parseFloat(quadra.valorManha) || 0;
      } else if (hora >= 18 && hora < 23) {
        valorPorHora = parseFloat(quadra.valorNoite) || 0;
      } else {
        valorPorHora = parseFloat(quadra.valorHora) || 0;
      }
    } else {
      valorPorHora = parseFloat(quadra.valorHora) || 0;
    }
    
    const valorPorSessao = horas * valorPorHora;
    
    // Calcular número de sessões no mês (aproximadamente 4.33 semanas por mês)
    const sessoesPorSemana = formReserva.diasSemana.length;
    const sessoesPorMes = Math.round(sessoesPorSemana * 4.33);
    
    // Valor total mensal SEM DESCONTO
    const valorMensal = valorPorSessao * sessoesPorMes;
    
    return valorMensal;
  };

  // Função para calcular valor das parcelas
  const calcularParcelas = (valorTotal, numeroParcelas) => {
    if (numeroParcelas <= 0) return 0;
    return valorTotal / numeroParcelas;
  };

  // Função para gerar reservas mensais com cálculo inteligente do período
  const gerarReservasMensais = (dadosReserva) => {
    const reservasGeradas = [];
    const [ano, mes] = dadosReserva.mesReferencia.split('-');
    
    // Mapeamento dos dias da semana
    const diasSemanaMap = {
      'domingo': 0,
      'segunda': 1,
      'terca': 2,
      'quarta': 3,
      'quinta': 4,
      'sexta': 5,
      'sabado': 6
    };
    
    // PASSO 1: Encontrar a PRIMEIRA data disponível no mês selecionado (a partir de hoje)
    let primeiraDataDisponivel = null;
    const diasDoMes = new Date(parseInt(ano), parseInt(mes), 0).getDate();
    
    // Data de hoje para não buscar datas passadas
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    // Buscar do primeiro ao último dia do mês, mas só datas futuras ou de hoje
    for (let dia = 1; dia <= diasDoMes; dia++) {
      const dataAtual = new Date(parseInt(ano), parseInt(mes) - 1, dia);
      const diaSemanaAtual = dataAtual.getDay();
      
      // Pular datas que já passaram
      if (dataAtual < hoje) {
        continue;
      }
      
      // Verificar se este dia coincide com algum dos dias selecionados
      const diaCoincide = dadosReserva.diasSemana.some(diaSelecionado => 
        diasSemanaMap[diaSelecionado] === diaSemanaAtual
      );
      
      if (diaCoincide) {
        const dataFormatada = dataAtual.toISOString().split('T')[0];
        
        // Verificar se não há conflito com reservas existentes no mesmo horário
        const conflito = reservas.some(r => 
          r.data === dataFormatada && 
          r.quadraId === dadosReserva.quadraId &&
          ((r.horaInicio < dadosReserva.horaFim && r.horaFim > dadosReserva.horaInicio))
        );
        
        if (!conflito) {
          primeiraDataDisponivel = dataAtual;
          break; // Encontrou a primeira data disponível, parar busca
        }
      }
    }
    
    // Se não encontrou nenhuma data disponível no mês selecionado
    if (!primeiraDataDisponivel) {
      throw new Error(`Não foi encontrada nenhuma data disponível no mês selecionado (${new Date(parseInt(ano), parseInt(mes) - 1, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}) para os dias da semana escolhidos: ${dadosReserva.diasSemana.join(', ')}.`);
    }
    
    // PASSO 2: Calcular data final (30 dias corridos a partir da primeira data)
    const dataFinal = new Date(primeiraDataDisponivel);
    dataFinal.setDate(dataFinal.getDate() + 29); // +29 para completar 30 dias total
    
    const periodoMensal = `${primeiraDataDisponivel.toLocaleDateString('pt-BR')} a ${dataFinal.toLocaleDateString('pt-BR')}`;
    
    // PASSO 3: Gerar todas as reservas no período de 30 dias corridos
    let dataAtual = new Date(primeiraDataDisponivel);
    const dataLimite = new Date(dataFinal);
    
    while (dataAtual <= dataLimite) {
      const diaSemanaAtual = dataAtual.getDay();
      
      // Verificar se este dia coincide com algum dos dias selecionados
      const diaCoincide = dadosReserva.diasSemana.some(diaSelecionado => 
        diasSemanaMap[diaSelecionado] === diaSemanaAtual
      );
      
      if (diaCoincide) {
        const dataFormatada = dataAtual.toISOString().split('T')[0];
        
        // Verificar novamente se não há conflito (segurança adicional)
        const conflito = reservas.some(r => 
          r.data === dataFormatada && 
          r.quadraId === dadosReserva.quadraId &&
          ((r.horaInicio < dadosReserva.horaFim && r.horaFim > dadosReserva.horaInicio)) &&
          (!editingItem || r.id !== editingItem.id) // Excluir reserva sendo editada
        );
        
        if (!conflito) {
          reservasGeradas.push({
            id: Date.now() + Math.random(),
            quadraId: dadosReserva.quadraId,
            clienteId: dadosReserva.clienteId,
            data: dataFormatada,
            horaInicio: dadosReserva.horaInicio,
            horaFim: dadosReserva.horaFim,
            valor: dadosReserva.valorPorSessao,
            status: dadosReserva.status || 'Confirmada',
            statusPagamento: 'Pendente',
            valorPago: 0,
            tipoReserva: 'mensal',
            mesReferencia: dadosReserva.mesReferencia,
            periodoReal: periodoMensal,
            primeiraData: primeiraDataDisponivel.toISOString().split('T')[0],
            ultimaData: dataFinal.toISOString().split('T')[0],
            reservaMensalId: dadosReserva.reservaMensalId,
            observacoes: `Reserva mensal (${periodoMensal}) - Dias: ${dadosReserva.diasSemana.join(', ')} - ${dadosReserva.observacoes || ''}`,
            usuarioResponsavel: usuarioLogado?.nome || 'Sistema',
            dataLancamento: new Date().toISOString()
          });
        }
      }
      
      // Avançar para o próximo dia
      dataAtual.setDate(dataAtual.getDate() + 1);
    }
    
    return reservasGeradas;
  };

  // Funções para Reservas
  const adicionarReserva = () => {
    const quadra = quadras.find(q => q.id === parseInt(formReserva.quadraId));
    
    // Validar se a quadra existe
    if (!quadra) {
      alert('Selecione uma quadra válida!');
      return;
    }
    
    // Validar campos obrigatórios baseado no tipo de reserva
    if (formReserva.tipoReserva === 'mensal') {
      if (!formReserva.mesReferencia || !formReserva.horaInicio || !formReserva.horaFim || !formReserva.clienteId || formReserva.diasSemana.length === 0) {
        alert('Para reserva mensal, preencha: mês de referência, horários, cliente e pelo menos um dia da semana!');
        return;
      }
    } else {
      if (!formReserva.data || !formReserva.horaInicio || !formReserva.horaFim || !formReserva.clienteId) {
        alert('Preencha todos os campos obrigatórios!');
        return;
      }
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
    
    // Calcular valor baseado na duração da reserva e tabela de preços
    const horaInicio = new Date(`${formReserva.data}T${formReserva.horaInicio}`);
    const horaFim = new Date(`${formReserva.data}T${formReserva.horaFim}`);
    const minutos = (horaFim - horaInicio) / (1000 * 60);
    const horas = minutos / 60;
    
    // Calcular valor considerando tabela diferenciada (SEM DESCONTO)
    let valorCalculado;
    if (quadra.usarTabelaDiferenciada) {
      const valorPorHora = calcularValorPorHorario(quadra, formReserva.horaInicio);
      valorCalculado = horas * valorPorHora;
    } else {
      valorCalculado = horas * (parseFloat(quadra.valorHora) || 0);
    }

    if (editingItem) {
      // Edição de reserva existente
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
      // Nova reserva
      if (formReserva.tipoReserva === 'mensal') {
        // Processar reserva mensal
        const valorMensal = calcularValorMensal();
        const valorParcela = calcularParcelas(valorMensal, formReserva.numeroParcelas);
        
        // Calcular valor correto por sessão individual
        const quadra = quadras.find(q => q.id === parseInt(formReserva.quadraId));
        const horaInicio = new Date(`2000-01-01T${formReserva.horaInicio}`);
        const horaFim = new Date(`2000-01-01T${formReserva.horaFim}`);
        const minutos = (horaFim - horaInicio) / (1000 * 60);
        const horas = minutos / 60;
        
        let valorPorHora;
        if (quadra.usarTabelaDiferenciada) {
          const hora = parseInt(formReserva.horaInicio.split(':')[0]);
          if (hora >= 6 && hora < 18) {
            valorPorHora = parseFloat(quadra.valorManha) || 0;
          } else if (hora >= 18 && hora < 23) {
            valorPorHora = parseFloat(quadra.valorNoite) || 0;
          } else {
            valorPorHora = parseFloat(quadra.valorHora) || 0;
          }
        } else {
          valorPorHora = parseFloat(quadra.valorHora) || 0;
        }
        
        const valorPorSessao = horas * valorPorHora;
        
        const reservaMensalId = `mensal_${Date.now()}`;
        
        // Criar faturamento mensal principal
        const faturamentoMensal = {
          id: Date.now(),
          data: new Date().toISOString().split('T')[0],
          cliente: clientes.find(c => c.id === parseInt(formReserva.clienteId))?.nome || 'Cliente',
          mesLocacao: formReserva.mesReferencia,
          hora: `${formReserva.horaInicio}-${formReserva.horaFim}`,
          tipoQuadra: quadra.nome,
          tipoLocacao: 'Mensal',
          reciboPagamento: `MENSAL-${reservaMensalId}`,
          dataLocacao: formReserva.mesReferencia,
          valor: valorMensal,
          formaPagamento: formReserva.formaPagamento || '',
          valorRecebido: parseFloat(formReserva.valorPago) || 0,
          valorEmAberto: valorMensal - (parseFloat(formReserva.valorPago) || 0),
          valorRealRecebido: parseFloat(formReserva.valorPago) || 0,
          status: (parseFloat(formReserva.valorPago) || 0) >= valorMensal ? 'Pago' : 'Em Aberto',
          usuarioResponsavel: usuarioLogado?.nome || 'Sistema',
          dataLancamento: new Date().toISOString(),
          reservaMensalId: reservaMensalId,
          numeroParcelas: formReserva.numeroParcelas,
          valorParcela: valorParcela,
          diasSemana: formReserva.diasSemana,
          observacoes: `Reserva mensal - ${formReserva.diasSemana.join(', ')}. Parcelas: ${formReserva.numeroParcelas}x R$ ${valorParcela.toFixed(2)}. ${formReserva.observacoesMensal || ''}`
        };
        
        // Gerar as reservas individuais do mês
        const reservasIndividuais = gerarReservasMensais({
          ...formReserva,
          quadraId: parseInt(formReserva.quadraId),
          clienteId: parseInt(formReserva.clienteId),
          valorPorSessao: valorPorSessao,
          reservaMensalId: reservaMensalId
        });
        
        if (reservasIndividuais.length === 0) {
          alert('❌ Erro: Não foi possível gerar reservas!\n\nVerifique se há disponibilidade nos dias selecionados no período escolhido.');
          return;
        }
        
        // Obter período real das reservas geradas
        const primeiraReserva = reservasIndividuais[0];
        const periodoReal = primeiraReserva.periodoReal;
        
        // Atualizar faturamento com período real
        const faturamentoAtualizado = {
          ...faturamentoMensal,
          mesLocacao: periodoReal,
          dataLocacao: primeiraReserva.primeiraData,
          observacoes: `Reserva mensal (${periodoReal}) - ${formReserva.diasSemana.join(', ')}. Parcelas: ${formReserva.numeroParcelas}x R$ ${valorParcela.toFixed(2)}. ${formReserva.observacoesMensal || ''}`
        };
        
        // Adicionar faturamento e reservas
        setFaturamentos([...faturamentos, faturamentoAtualizado]);
        setReservas([...reservas, ...reservasIndividuais]);
        
        registrarAtividade('RESERVA_MENSAL_CRIADA', 
          `Nova reserva mensal - ${quadra.nome} - Período: ${periodoReal} - ${reservasIndividuais.length} sessões geradas`
        );
        
        // Calcular estatísticas detalhadas para o feedback
        const primeiraReservaData = new Date(primeiraReserva.primeiraData);
        const ultimaReservaData = new Date(primeiraReserva.ultimaData);
        const diasCorridos = Math.ceil((ultimaReservaData - primeiraReservaData) / (1000 * 60 * 60 * 24)) + 1;
        const mesReferenciaOriginal = new Date(parseInt(formReserva.mesReferencia.split('-')[0]), parseInt(formReserva.mesReferencia.split('-')[1]) - 1, 1)
          .toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
        
        alert(`✅ RESERVA MENSAL CRIADA COM SUCESSO!\n\n` +
              `🎯 CÁLCULO APLICADO:\n` +
              `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
              `📋 DADOS DA LOCAÇÃO:\n` +
              `• Quadra: ${quadra.nome}\n` +
              `• Cliente: ${clientes.find(c => c.id === parseInt(formReserva.clienteId))?.nome}\n` +
              `• Dias da semana: ${formReserva.diasSemana.join(', ')}\n` +
              `• Horário: ${formReserva.horaInicio} - ${formReserva.horaFim}\n\n` +
              `📅 PERÍODO CALCULADO:\n` +
              `• Mês de referência: ${mesReferenciaOriginal}\n` +
              `• Período real: ${periodoReal}\n` +
              `• Total de dias corridos: ${diasCorridos} dias\n` +
              `• Sessões geradas: ${reservasIndividuais.length} sessões\n\n` +
              `💰 FINANCEIRO (SEM DESCONTO):\n` +
              `• Valor total mensal: R$ ${valorMensal.toFixed(2)}\n` +
              `• Forma de pagamento: ${formReserva.numeroParcelas}x R$ ${valorParcela.toFixed(2)}\n` +
              `• Valor pago na reserva: R$ ${(parseFloat(formReserva.valorPago) || 0).toFixed(2)}\n` +
              `• Valor por hora: R$ ${quadra.usarTabelaDiferenciada ? 
                (parseInt(formReserva.horaInicio.split(':')[0]) >= 18 ? quadra.valorNoite : quadra.valorManha) : 
                quadra.valorHora}\n\n` +
              `🔄 SISTEMA INTELIGENTE:\n` +
              `• ✓ Primeira data disponível localizada automaticamente\n` +
              `• ✓ Período de 30 dias corridos garantido\n` +
              `• ✓ Conflitos de horário verificados\n` +
              `• ✓ Todas as reservas validadas\n` +
              `• ✓ Valores aplicados conforme tabela de preços\n\n` +
              `📝 Todas as informações foram registradas no sistema!`
        );
        
      } else {
        // Reserva avulsa normal
        const novaReserva = {
          id: Date.now(),
          ...formReserva,
          quadraId: parseInt(formReserva.quadraId),
          clienteId: parseInt(formReserva.clienteId),
          valor: parseFloat(formReserva.valor) || valorCalculado,
          valorPago: parseFloat(formReserva.valorPago) || 0,
          tipoReserva: 'avulsa',
          usuarioResponsavel: usuarioLogado?.nome || 'Sistema',
          dataLancamento: new Date().toISOString()
        };
        setReservas([...reservas, novaReserva]);
        registrarAtividade('RESERVA_CRIADA', `Nova reserva - ${quadra.nome} em ${formReserva.data}`);
      }
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
    setShowAdminPassword(false);
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
      observacoes: '',
      // Campos para reserva mensal
      tipoReserva: 'avulsa',
      mesReferencia: '',
      diasSemana: [],
      valorMensal: 0,
      numeroParcelas: 1,
      valorParcela: 0,
      dataVencimentoPrimeiraParcela: '',
      observacoesMensal: ''
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

  // Função para expandir/colapsar cliente
  const toggleClienteExpandido = (clienteId) => {
    setClientesExpandidos(prev => ({
      ...prev,
      [clienteId]: !prev[clienteId]
    }));
  };

  // Função para limpar todos os dados financeiros
  const limparDadosFinanceiros = () => {
    const confirmacao = confirm(
      '⚠️ ATENÇÃO: LIMPEZA TOTAL DOS DADOS FINANCEIROS\n\n' +
      'Esta operação irá remover PERMANENTEMENTE:\n\n' +
      '• Todas as reservas cadastradas\n' +
      '• Todos os faturamentos administrativos\n' +
      '• Todos os recebimentos registrados\n' +
      '• Histórico completo de receitas\n\n' +
      '❌ ESTA AÇÃO NÃO PODE SER DESFEITA!\n\n' +
      'Deseja prosseguir com a limpeza total?'
    );
    
    if (confirmacao) {
      const segundaConfirmacao = confirm(
        '🔴 CONFIRMAÇÃO FINAL\n\n' +
        'Você tem certeza ABSOLUTA que deseja apagar todos os dados financeiros?\n\n' +
        'Digite "CONFIRMAR" mentalmente e clique em OK para prosseguir.\n\n' +
        'Esta é sua última chance de cancelar!'
      );
      
      if (segundaConfirmacao) {
        // Limpar todos os dados financeiros
        setReservas([]);
        setFaturamentos([]);
        setRecebimentos([]);
        
        // Registrar a limpeza nos logs
        registrarAtividade('LIMPEZA_DADOS_FINANCEIROS', 'Todos os dados financeiros foram removidos pelo usuário');
        
        alert(
          '✅ LIMPEZA CONCLUÍDA COM SUCESSO!\n\n' +
          '🗑️ Dados removidos:\n' +
          '• Reservas: ZERADAS\n' +
          '• Faturamentos: ZERADOS\n' +
          '• Recebimentos: ZERADOS\n' +
          '• Receita Total: R$ 0,00\n' +
          '• Valores Recebidos: R$ 0,00\n\n' +
          '📝 A operação foi registrada nos logs do sistema.\n' +
          '💾 Recomenda-se fazer um backup antes de inserir novos dados.'
        );
      }
    }
  };

  // Função para gerar dados mensais do painel
  const gerarDadosMensaisPainel = () => {
    const dataBase = new Date(dataRelatorio);
    const ano = dataBase.getFullYear();
    const mes = dataBase.getMonth();
    
    // Primeiro e último dia do mês
    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);
    
    // Gerar todos os dias do mês
    const diasDoMes = [];
    for (let d = new Date(primeiroDia); d <= ultimoDia; d.setDate(d.getDate() + 1)) {
      diasDoMes.push(new Date(d));
    }
    
    const quadrasParaExportar = quadraImpressao ? 
      quadras.filter(q => q.id == quadraImpressao) : 
      quadras.filter(q => q.ativa);
    
    const dadosExportacao = {
      periodo: `${primeiroDia.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase()}`,
      dataGeracao: new Date().toLocaleDateString('pt-BR'),
      quadras: quadrasParaExportar.map(quadra => {
        const reservasMes = reservas.filter(r => {
          const dataReserva = new Date(r.data);
          return r.quadraId === quadra.id && 
                 dataReserva >= primeiroDia && 
                 dataReserva <= ultimoDia;
        });
        
        // Estatísticas da quadra
        const totalReservas = reservasMes.length;
        const reservasConfirmadas = reservasMes.filter(r => r.status === 'Confirmada').length;
        const receitaTotal = reservasMes.reduce((acc, r) => acc + (r.valor || 0), 0);
        const receitaPaga = reservasMes.reduce((acc, r) => acc + (r.valorPago || 0), 0);
        
        // Dias com ocupação
        const diasComReservas = diasDoMes.map(dia => {
          const dataStr = dia.toISOString().split('T')[0];
          const reservasDoDia = reservasMes.filter(r => r.data === dataStr);
          
          return {
            data: dia.toLocaleDateString('pt-BR'),
            diaSemana: dia.toLocaleDateString('pt-BR', { weekday: 'long' }),
            totalReservas: reservasDoDia.length,
            reservas: reservasDoDia.map(reserva => {
              const cliente = clientes.find(c => c.id === reserva.clienteId);
              return {
                horario: `${reserva.horaInicio} - ${reserva.horaFim}`,
                cliente: cliente?.nome || 'N/A',
                valor: reserva.valor || 0,
                status: reserva.status,
                statusPagamento: reserva.statusPagamento || 'Pendente',
                valorPago: reserva.valorPago || 0
              };
            })
          };
        });
        
        return {
          id: quadra.id,
          nome: quadra.nome,
          modalidade: quadra.modalidade,
          valorHora: quadra.valorHora,
          usarTabelaDiferenciada: quadra.usarTabelaDiferenciada,
          valorManha: quadra.valorManha,
          valorNoite: quadra.valorNoite,
          estatisticas: {
            totalReservas,
            reservasConfirmadas,
            receitaTotal,
            receitaPaga,
            taxaOcupacao: ((totalReservas / (diasDoMes.length * 17)) * 100).toFixed(1) // 17 horários possíveis por dia
          },
          dias: diasComReservas
        };
      })
    };
    
    return dadosExportacao;
  };

  // Função para exportar PDF do painel
  const gerarExportacaoPainelPDF = () => {
    try {
      const dados = gerarDadosMensaisPainel();
      
      // Criar conteúdo HTML para o PDF
      let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Painel Visual - ${dados.periodo}</title>
          <style>
            body { font-family: Arial, sans-serif; font-size: 10px; margin: 20px; }
            .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #2563eb; padding-bottom: 15px; }
            .logo { width: 40px; height: 40px; border-radius: 50%; margin: 0 auto 10px; }
            .title { font-size: 18px; font-weight: bold; color: #2563eb; margin: 5px 0; }
            .subtitle { font-size: 12px; color: #666; margin: 3px 0; }
            .quadra-section { margin-bottom: 25px; page-break-inside: avoid; }
            .quadra-header { background: #f3f4f6; padding: 10px; border-radius: 5px; margin-bottom: 10px; }
            .quadra-name { font-size: 14px; font-weight: bold; color: #1f2937; }
            .quadra-info { font-size: 10px; color: #6b7280; margin-top: 5px; }
            .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 15px 0; }
            .stat-box { background: #f8fafc; padding: 8px; border-radius: 4px; text-align: center; border-left: 3px solid #2563eb; }
            .stat-value { font-size: 16px; font-weight: bold; color: #2563eb; }
            .stat-label { font-size: 9px; color: #6b7280; margin-top: 2px; }
            .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; margin: 10px 0; }
            .day-header { background: #2563eb; color: white; padding: 5px; text-align: center; font-weight: bold; font-size: 8px; }
            .day-cell { border: 1px solid #e5e7eb; min-height: 60px; padding: 3px; position: relative; font-size: 8px; }
            .day-number { font-weight: bold; color: #1f2937; }
            .day-name { color: #6b7280; font-size: 7px; }
            .reserva-item { background: #dbeafe; margin: 1px 0; padding: 1px 2px; border-radius: 2px; font-size: 7px; }
            .reserva-confirmada { background: #dcfce7; }
            .reserva-pendente { background: #fef3c7; }
            .reserva-cancelada { background: #fee2e2; }
            .footer { text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #e5e7eb; font-size: 8px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">ESPORTE CLUBE JUREMA</div>
            <div class="subtitle">Painel Visual Mensal - ${dados.periodo}</div>
            <div class="subtitle">Gerado em: ${dados.dataGeracao} por ${usuarioLogado?.nome}</div>
          </div>
      `;
      
      dados.quadras.forEach(quadra => {
        htmlContent += `
          <div class="quadra-section">
            <div class="quadra-header">
              <div class="quadra-name">${quadra.nome} - ${quadra.modalidade}</div>
              <div class="quadra-info">
                Valores: ${quadra.usarTabelaDiferenciada ? 
                  `🌅 R$ ${quadra.valorManha}/h • 🌙 R$ ${quadra.valorNoite}/h` : 
                  `R$ ${quadra.valorHora}/h`
                }
              </div>
            </div>
            
            <div class="stats-grid">
              <div class="stat-box">
                <div class="stat-value">${quadra.estatisticas.totalReservas}</div>
                <div class="stat-label">Total Reservas</div>
              </div>
              <div class="stat-box">
                <div class="stat-value">${quadra.estatisticas.reservasConfirmadas}</div>
                <div class="stat-label">Confirmadas</div>
              </div>
              <div class="stat-box">
                <div class="stat-value">R$ ${quadra.estatisticas.receitaTotal.toFixed(0)}</div>
                <div class="stat-label">Receita Total</div>
              </div>
              <div class="stat-box">
                <div class="stat-value">${quadra.estatisticas.taxaOcupacao}%</div>
                <div class="stat-label">Taxa Ocupação</div>
              </div>
            </div>
            
            <div class="calendar-grid">
              <div class="day-header">DOM</div>
              <div class="day-header">SEG</div>
              <div class="day-header">TER</div>
              <div class="day-header">QUA</div>
              <div class="day-header">QUI</div>
              <div class="day-header">SEX</div>
              <div class="day-header">SÁB</div>
        `;
        
        // Preencher células do calendário
        const primeiroDia = new Date(quadra.dias[0].data.split('/').reverse().join('-'));
        const primeiroDiaSemana = primeiroDia.getDay();
        
        // Células vazias no início
        for (let i = 0; i < primeiroDiaSemana; i++) {
          htmlContent += '<div class="day-cell"></div>';
        }
        
        // Dias do mês
        quadra.dias.forEach(dia => {
          const numeroDia = dia.data.split('/')[0];
          htmlContent += `
            <div class="day-cell">
              <div class="day-number">${numeroDia}</div>
              <div class="day-name">${dia.diaSemana.substring(0, 3).toUpperCase()}</div>
          `;
          
          dia.reservas.slice(0, 3).forEach(reserva => {
            const statusClass = reserva.status === 'Confirmada' ? 'reserva-confirmada' :
                               reserva.status === 'Pendente' ? 'reserva-pendente' : 'reserva-cancelada';
            htmlContent += `
              <div class="reserva-item ${statusClass}">
                ${reserva.horario.split(' - ')[0]} ${reserva.cliente.split(' ')[0]}
              </div>
            `;
          });
          
          if (dia.reservas.length > 3) {
            htmlContent += `<div class="reserva-item">+${dia.reservas.length - 3} mais</div>`;
          }
          
          htmlContent += '</div>';
        });
        
        htmlContent += '</div></div>';
      });
      
      htmlContent += `
          <div class="footer">
            © 2025 PauloCunhaMKT Soluções TI • Sistema de Gestão Esportiva v2.1.0<br>
            Relatório gerado automaticamente pelo sistema • Dados atualizados em tempo real
          </div>
        </body>
        </html>
      `;
      
      // Criar blob e download
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Painel_Visual_${dados.periodo.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      registrarAtividade('EXPORT_PDF_PAINEL', `PDF do painel visual exportado - ${dados.periodo}`);
      alert(`✅ PDF do Painel Visual exportado!\nPeríodo: ${dados.periodo}\nArquivo HTML gerado para conversão em PDF.`);
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('❌ Erro ao gerar PDF. Tente novamente.');
    }
  };

  // Função para exportar PDF da semana (formato visual limpo)
  const gerarPDFSemanalVisual = () => {
    try {
      const dataInicio = new Date(dataRelatorio);
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
      
      // Gerar horários de 6h às 22h
      const horarios = [];
      for (let h = 6; h <= 22; h++) {
        horarios.push(`${h.toString().padStart(2, '0')}:00`);
      }
      
      let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Programação Semanal - ${dataInicio.toLocaleDateString('pt-BR')}</title>
          <style>
            @page { size: A4 landscape; margin: 0.5cm; }
            body { font-family: Arial, sans-serif; font-size: 10px; margin: 0; }
            .header { text-align: center; margin-bottom: 15px; background: #2563eb; color: white; padding: 10px; border-radius: 5px; }
            .quadra-section { margin-bottom: 20px; page-break-inside: avoid; border: 1px solid #ddd; border-radius: 5px; overflow: hidden; }
            .quadra-header { background: #f3f4f6; padding: 8px; border-bottom: 1px solid #ddd; }
            .quadra-name { font-size: 12px; font-weight: bold; color: #1f2937; }
            .calendar-grid { width: 100%; border-collapse: collapse; }
            .calendar-grid th, .calendar-grid td { border: 1px solid #ccc; padding: 4px; text-align: center; vertical-align: top; }
            .calendar-grid th { background: #2563eb; color: white; font-weight: bold; font-size: 9px; }
            .horario-col { background: #f8fafc; font-weight: bold; width: 60px; }
            .day-col { width: 120px; min-height: 25px; position: relative; }
            .reserva-item { background: #dcfce7; margin: 1px; padding: 2px; border-radius: 2px; font-size: 8px; border-left: 2px solid #16a34a; }
            .reserva-pendente { background: #fef3c7; border-left-color: #d97706; }
            .reserva-cancelada { background: #fee2e2; border-left-color: #dc2626; }
            .resumo { background: #f0f9ff; padding: 8px; text-align: center; font-size: 9px; }
            .valores-quadra { font-size: 9px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="header">
            <div style="font-size: 14px; font-weight: bold;">ESPORTE CLUBE JUREMA - PROGRAMAÇÃO SEMANAL</div>
            <div style="font-size: 11px;">Semana de ${diasSemana[0].toLocaleDateString('pt-BR')} a ${diasSemana[6].toLocaleDateString('pt-BR')}</div>
            <div style="font-size: 10px;">Gerado em: ${new Date().toLocaleDateString('pt-BR')} por ${usuarioLogado?.nome}</div>
          </div>
      `;
      
      quadrasParaExibir.forEach(quadra => {
        htmlContent += `
          <div class="quadra-section">
            <div class="quadra-header">
              <div class="quadra-name">${quadra.nome} - ${quadra.modalidade}</div>
              <div class="valores-quadra">
                Valores: ${quadra.usarTabelaDiferenciada ? 
                  `🌅 Manhã/Tarde: R$ ${quadra.valorManha}/h • 🌙 Noite: R$ ${quadra.valorNoite}/h` : 
                  `R$ ${quadra.valorHora}/h`
                }
              </div>
            </div>
            
            <table class="calendar-grid">
              <thead>
                <tr>
                  <th class="horario-col">Horário</th>
        `;
        
        // Cabeçalho dos dias
        diasSemana.forEach(data => {
          const diaSemana = data.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase();
          const dataFormatada = `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1).toString().padStart(2, '0')}`;
          htmlContent += `<th class="day-col">${diaSemana}<br>${dataFormatada}</th>`;
        });
        
        htmlContent += `
                </tr>
              </thead>
              <tbody>
        `;
        
        // Linhas de horários
        horarios.forEach(horario => {
          htmlContent += `<tr><td class="horario-col">${horario}</td>`;
          
          diasSemana.forEach(data => {
            const dataStr = data.toISOString().split('T')[0];
            const horaInicio = horario;
            const horaFim = `${(parseInt(horario.split(':')[0]) + 1).toString().padStart(2, '0')}:00`;
            
            // Buscar reservas que se sobrepõem com este slot
            const reservasNoSlot = reservas.filter(r => {
              if (r.quadraId !== quadra.id || r.data !== dataStr) return false;
              return (r.horaInicio < horaFim && r.horaFim > horaInicio);
            });
            
            htmlContent += `<td class="day-col">`;
            
            if (reservasNoSlot.length > 0) {
              const reserva = reservasNoSlot[0];
              const cliente = clientes.find(c => c.id === reserva.clienteId);
              const statusClass = reserva.status === 'Confirmada' ? 'reserva-item' :
                                 reserva.status === 'Pendente' ? 'reserva-item reserva-pendente' : 
                                 'reserva-item reserva-cancelada';
              
              htmlContent += `
                <div class="${statusClass}">
                  <div style="font-weight: bold;">${reserva.horaInicio}-${reserva.horaFim}</div>
                  <div>${cliente?.nome || 'N/A'}</div>
                  <div>R$ ${(reserva.valor || 0).toFixed(0)}</div>
                </div>
              `;
            }
            
            htmlContent += `</td>`;
          });
          
          htmlContent += `</tr>`;
        });
        
        htmlContent += `
              </tbody>
            </table>
            
            <div class="resumo">
        `;
        
        // Calcular estatísticas da semana
        const reservasSemana = reservas.filter(r => {
          const dataReserva = new Date(r.data);
          return r.quadraId === quadra.id && 
                 dataReserva >= diasSemana[0] && 
                 dataReserva <= diasSemana[6];
        });
        
        const totalReservas = reservasSemana.length;
        const receitaSemana = reservasSemana.reduce((acc, r) => acc + (r.valor || 0), 0);
        const totalSlots = 7 * 17; // 7 dias × 17 horários
        const ocupacao = ((totalReservas / totalSlots) * 100).toFixed(1);
        
        htmlContent += `
          Reservas na Semana: <strong>${totalReservas}</strong> • 
          Taxa de Ocupação: <strong>${ocupacao}%</strong> • 
          Receita Semana: <strong>R$ ${receitaSemana.toFixed(2)}</strong> • 
          Slots Disponíveis: <strong>${totalSlots - totalReservas}</strong>
            </div>
          </div>
        `;
      });
      
      htmlContent += `
          <div style="margin-top: 15px; text-align: center; font-size: 8px; color: #666;">
            © 2025 PauloCunhaMKT Soluções TI • Sistema de Gestão Esportiva v2.1.0<br>
            Relatório gerado automaticamente • Layout otimizado para impressão
          </div>
        </body>
        </html>
      `;
      
      // Criar blob e download
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Programacao_Semanal_${diasSemana[0].toLocaleDateString('pt-BR').replace(/\//g, '_')}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      registrarAtividade('EXPORT_PDF_SEMANAL', `PDF semanal visual exportado - ${diasSemana[0].toLocaleDateString('pt-BR')}`);
      alert(`✅ PDF da Programação Semanal exportado!\n\n📅 Período: ${diasSemana[0].toLocaleDateString('pt-BR')} a ${diasSemana[6].toLocaleDateString('pt-BR')}\n📊 Formato: Calendário visual limpo\n📁 Arquivo HTML gerado para conversão em PDF\n\n💡 Abra o arquivo e use Ctrl+P para imprimir em PDF`);
      
    } catch (error) {
      console.error('Erro ao gerar PDF semanal:', error);
      alert('❌ Erro ao gerar PDF semanal. Tente novamente.');
    }
  };

  // Função para exportar XLS da semana (formato planilha)
  const gerarXLSSemanalVisual = () => {
    try {
      const dataInicio = new Date(dataRelatorio);
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
      
      // Gerar horários de 6h às 22h
      const horarios = [];
      for (let h = 6; h <= 22; h++) {
        horarios.push(`${h.toString().padStart(2, '0')}:00`);
      }
      
      let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Programação Semanal - ${dataInicio.toLocaleDateString('pt-BR')}</title>
          <style>
            body { font-family: Arial, sans-serif; font-size: 11px; }
            .header { text-align: center; margin-bottom: 20px; background: #2563eb; color: white; padding: 12px; }
            .quadra-section { margin-bottom: 25px; page-break-inside: avoid; border: 1px solid #ddd; }
            .quadra-header { background: #f3f4f6; padding: 10px; border-bottom: 1px solid #ddd; }
            .calendar-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            .calendar-table th, .calendar-table td { border: 1px solid #000; padding: 6px; text-align: center; vertical-align: top; }
            .calendar-table th { background: #2563eb; color: white; font-weight: bold; font-size: 10px; }
            .horario-cell { background: #f8fafc; font-weight: bold; width: 80px; }
            .day-cell { width: 140px; min-height: 30px; }
            .reserva-info { background: #dcfce7; margin: 2px; padding: 3px; border-radius: 3px; font-size: 9px; border-left: 3px solid #16a34a; }
            .reserva-pendente { background: #fef3c7; border-left-color: #d97706; }
            .reserva-cancelada { background: #fee2e2; border-left-color: #dc2626; }
            .resumo-quadra { background: #f0f9ff; padding: 10px; text-align: center; font-size: 10px; border-top: 1px solid #ddd; }
          </style>
        </head>
        <body>
          <div class="header">
            <div style="font-size: 16px; font-weight: bold;">ESPORTE CLUBE JUREMA</div>
            <div style="font-size: 14px;">PROGRAMAÇÃO SEMANAL DE QUADRAS</div>
            <div style="font-size: 12px;">Semana de ${diasSemana[0].toLocaleDateString('pt-BR')} a ${diasSemana[6].toLocaleDateString('pt-BR')}</div>
            <div style="font-size: 10px;">Gerado em: ${new Date().toLocaleDateString('pt-BR')} por ${usuarioLogado?.nome}</div>
          </div>
      `;
      
      quadrasParaExibir.forEach(quadra => {
        htmlContent += `
          <div class="quadra-section">
            <div class="quadra-header">
              <div style="font-size: 14px; font-weight: bold; color: #1f2937;">${quadra.nome} - ${quadra.modalidade}</div>
              <div style="font-size: 10px; color: #6b7280; margin-top: 5px;">
                Valores: ${quadra.usarTabelaDiferenciada ? 
                  `🌅 Manhã/Tarde (06:00-17:59): R$ ${quadra.valorManha}/h • 🌙 Noite (18:00-22:59): R$ ${quadra.valorNoite}/h` : 
                  `R$ ${quadra.valorHora}/h (todos os horários)`
                }
              </div>
            </div>
            
            <table class="calendar-table">
              <thead>
                <tr>
                  <th class="horario-cell">HORÁRIO</th>
        `;
        
        // Cabeçalho dos dias
        diasSemana.forEach(data => {
          const diaSemana = data.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase();
          const dataFormatada = `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1).toString().padStart(2, '0')}`;
          htmlContent += `<th class="day-cell">${diaSemana}<br>${dataFormatada}</th>`;
        });
        
        htmlContent += `
                </tr>
              </thead>
              <tbody>
        `;
        
        // Linhas de horários
        horarios.forEach(horario => {
          htmlContent += `<tr><td class="horario-cell">${horario}</td>`;
          
          diasSemana.forEach(data => {
            const dataStr = data.toISOString().split('T')[0];
            const horaInicio = horario;
            const horaFim = `${(parseInt(horario.split(':')[0]) + 1).toString().padStart(2, '0')}:00`;
            
            // Buscar reservas que se sobrepõem com este slot
            const reservasNoSlot = reservas.filter(r => {
              if (r.quadraId !== quadra.id || r.data !== dataStr) return false;
              return (r.horaInicio < horaFim && r.horaFim > horaInicio);
            });
            
            htmlContent += `<td class="day-cell">`;
            
            if (reservasNoSlot.length > 0) {
              const reserva = reservasNoSlot[0];
              const cliente = clientes.find(c => c.id === reserva.clienteId);
              const statusClass = reserva.status === 'Confirmada' ? 'reserva-info' :
                                 reserva.status === 'Pendente' ? 'reserva-info reserva-pendente' : 
                                 'reserva-info reserva-cancelada';
              
              htmlContent += `
                <div class="${statusClass}">
                  <div style="font-weight: bold; margin-bottom: 2px;">${reserva.horaInicio} - ${reserva.horaFim}</div>
                  <div style="margin-bottom: 2px;">${cliente?.nome || 'Cliente N/A'}</div>
                  <div style="font-weight: bold; color: #059669;">R$ ${(reserva.valor || 0).toFixed(2)}</div>
                  <div style="font-size: 8px; margin-top: 2px;">${reserva.status}</div>
                </div>
              `;
            } else {
              htmlContent += `<div style="color: #9ca3af; text-align: center; padding: 20px; font-style: italic;">Disponível</div>`;
            }
            
            htmlContent += `</td>`;
          });
          
          htmlContent += `</tr>`;
        });
        
        htmlContent += `
              </tbody>
            </table>
            
            <div class="resumo-quadra">
        `;
        
        // Calcular estatísticas da semana
        const reservasSemana = reservas.filter(r => {
          const dataReserva = new Date(r.data);
          return r.quadraId === quadra.id && 
                 dataReserva >= diasSemana[0] && 
                 dataReserva <= diasSemana[6];
        });
        
        const totalReservas = reservasSemana.length;
        const reservasConfirmadas = reservasSemana.filter(r => r.status === 'Confirmada').length;
        const receitaSemana = reservasSemana.reduce((acc, r) => acc + (r.valor || 0), 0);
        const receitaPaga = reservasSemana.reduce((acc, r) => acc + (r.valorPago || 0), 0);
        const totalSlots = 7 * 17; // 7 dias × 17 horários
        const ocupacao = ((totalReservas / totalSlots) * 100).toFixed(1);
        
        htmlContent += `
          <strong>📊 RESUMO DA SEMANA:</strong><br>
          Total de Reservas: <strong>${totalReservas}</strong> • 
          Confirmadas: <strong>${reservasConfirmadas}</strong> • 
          Taxa de Ocupação: <strong>${ocupacao}%</strong><br>
          Receita Total: <strong>R$ ${receitaSemana.toFixed(2)}</strong> • 
          Valor Recebido: <strong>R$ ${receitaPaga.toFixed(2)}</strong> • 
          Slots Livres: <strong>${totalSlots - totalReservas}</strong>
            </div>
          </div>
        `;
      });
      
      htmlContent += `
          <div style="margin-top: 20px; padding: 10px; background: #f3f4f6; text-align: center; font-size: 10px; color: #6b7280;">
            <strong>LEGENDA:</strong> 
            🟢 Verde = Confirmada • 🟡 Amarelo = Pendente • 🔴 Vermelho = Cancelada<br>
            <strong>© 2025 PauloCunhaMKT Soluções TI</strong> • Sistema de Gestão Esportiva v2.1.0 • 
            Relatório otimizado para impressão e planilhas
          </div>
        </body>
        </html>
      `;
      
      // Criar blob e download
      const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Programacao_Semanal_${diasSemana[0].toLocaleDateString('pt-BR').replace(/\//g, '_')}.xls`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      registrarAtividade('EXPORT_XLS_SEMANAL', `XLS semanal visual exportado - ${diasSemana[0].toLocaleDateString('pt-BR')}`);
      alert(`✅ Excel da Programação Semanal exportado!\n\n📅 Período: ${diasSemana[0].toLocaleDateString('pt-BR')} a ${diasSemana[6].toLocaleDateString('pt-BR')}\n📊 Formato: Planilha com layout de calendário\n📁 Arquivo .XLS otimizado para Excel\n\n💡 Abra no Excel para melhor visualização e impressão`);
      
    } catch (error) {
      console.error('Erro ao gerar XLS semanal:', error);
      alert('❌ Erro ao gerar XLS semanal. Tente novamente.');
    }
  };

  // Função para exportar XLS do painel
  const gerarExportacaoPainelXLS = () => {
    try {
      const dados = gerarDadosMensaisPainel();
      
      // Criar conteúdo HTML estruturado para Excel
      let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Painel Visual - ${dados.periodo}</title>
          <style>
            body { font-family: Arial, sans-serif; font-size: 11px; }
            .header { text-align: center; margin-bottom: 20px; background: #2563eb; color: white; padding: 15px; }
            .title { font-size: 16px; font-weight: bold; margin: 5px 0; }
            .subtitle { font-size: 12px; margin: 3px 0; }
            .quadra-section { margin-bottom: 30px; page-break-inside: avoid; border: 1px solid #ddd; }
            .quadra-header { background: #f3f4f6; padding: 12px; border-bottom: 1px solid #ddd; }
            .quadra-name { font-size: 14px; font-weight: bold; color: #1f2937; }
            .quadra-info { font-size: 10px; color: #6b7280; margin-top: 5px; }
            .stats-section { background: #f8fafc; padding: 10px; margin: 10px 0; }
            .stats-grid { display: table; width: 100%; }
            .stat-row { display: table-row; }
            .stat-cell { display: table-cell; padding: 8px; border: 1px solid #e5e7eb; }
            .stat-label { font-weight: bold; background: #e5e7eb; }
            .calendar-section { margin: 15px 0; }
            .calendar-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            .calendar-table th, .calendar-table td { border: 1px solid #ccc; padding: 8px; text-align: center; font-size: 10px; }
            .calendar-table th { background: #2563eb; color: white; font-weight: bold; }
            .calendar-header { background: #dbeafe; font-weight: bold; text-align: center; padding: 5px; }
            .day-cell { min-height: 80px; vertical-align: top; position: relative; }
            .reserva-item { background: #dcfce7; margin: 2px; padding: 3px; border-radius: 3px; font-size: 9px; border-left: 3px solid #16a34a; }
            .reserva-pendente { background: #fef3c7; border-left-color: #d97706; }
            .reserva-cancelada { background: #fee2e2; border-left-color: #dc2626; }
            .resumo-section { background: #f0f9ff; padding: 10px; margin-top: 15px; border: 1px solid #0ea5e9; }
            .resumo-grid { display: table; width: 100%; }
            .resumo-row { display: table-row; }
            .resumo-cell { display: table-cell; padding: 5px; border: 1px solid #0ea5e9; text-align: center; }
            .resumo-header { background: #0ea5e9; color: white; font-weight: bold; }
            .sem-reservas { color: #9ca3af; font-style: italic; padding: 20px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">ESPORTE CLUBE JUREMA - PAINEL VISUAL MENSAL</div>
            <div class="subtitle">${dados.periodo}</div>
            <div class="subtitle">Gerado em: ${dados.dataGeracao} por ${usuarioLogado?.nome}</div>
          </div>
      `;
      
      dados.quadras.forEach(quadra => {
        htmlContent += `
          <div class="quadra-section">
            <div class="quadra-header">
              <div class="quadra-name">${quadra.nome} - ${quadra.modalidade}</div>
              <div class="quadra-info">
                Valores: ${quadra.usarTabelaDiferenciada ? 
                  `🌅 Manhã/Tarde: R$ ${quadra.valorManha}/h • 🌙 Noite: R$ ${quadra.valorNoite}/h` : 
                  `R$ ${quadra.valorHora}/h`
                }
              </div>
            </div>
            
            <div class="stats-section">
              <h4 style="margin: 0 0 10px 0; color: #1f2937;">📊 Estatísticas da Quadra</h4>
              <div class="stats-grid">
                <div class="stat-row">
                  <div class="stat-cell stat-label">Total de Reservas</div>
                  <div class="stat-cell">${quadra.estatisticas.totalReservas}</div>
                  <div class="stat-cell stat-label">Confirmadas</div>
                  <div class="stat-cell">${quadra.estatisticas.reservasConfirmadas}</div>
                </div>
                <div class="stat-row">
                  <div class="stat-cell stat-label">Receita Total</div>
                  <div class="stat-cell">R$ ${quadra.estatisticas.receitaTotal.toFixed(2)}</div>
                  <div class="stat-cell stat-label">Taxa de Ocupação</div>
                  <div class="stat-cell">${quadra.estatisticas.taxaOcupacao}%</div>
                </div>
                <div class="stat-row">
                  <div class="stat-cell stat-label">Receita Recebida</div>
                  <div class="stat-cell">R$ ${quadra.estatisticas.receitaPaga.toFixed(2)}</div>
                  <div class="stat-cell stat-label">Valor Pendente</div>
                  <div class="stat-cell">R$ ${(quadra.estatisticas.receitaTotal - quadra.estatisticas.receitaPaga).toFixed(2)}</div>
                </div>
              </div>
            </div>
            
            <div class="calendar-section">
              <h4 style="margin: 10px 0; color: #1f2937;">📅 Calendário Mensal - Visualização por Dia</h4>
              <table class="calendar-table">
                <thead>
                  <tr>
                    <th>DOM</th><th>SEG</th><th>TER</th><th>QUA</th><th>QUI</th><th>SEX</th><th>SAB</th>
                  </tr>
                </thead>
                <tbody>
        `;
        
        // Organizar dias em semanas para o calendário
        const primeiroDia = new Date(quadra.dias[0].data.split('/').reverse().join('-'));
        const primeiroDiaSemana = primeiroDia.getDay();
        let diaAtual = 0;
        
        // Calcular quantas semanas precisamos
        const totalDias = quadra.dias.length;
        const semanas = Math.ceil((totalDias + primeiroDiaSemana) / 7);
        
        for (let semana = 0; semana < semanas; semana++) {
          htmlContent += '<tr>';
          
          for (let diaSemana = 0; diaSemana < 7; diaSemana++) {
            if ((semana === 0 && diaSemana < primeiroDiaSemana) || diaAtual >= totalDias) {
              htmlContent += '<td class="day-cell"></td>';
            } else {
              const dia = quadra.dias[diaAtual];
              const numeroDia = dia.data.split('/')[0];
              
              htmlContent += `<td class="day-cell">`;
              htmlContent += `<div style="font-weight: bold; margin-bottom: 5px;">${numeroDia}</div>`;
              htmlContent += `<div style="font-size: 8px; color: #666; margin-bottom: 5px;">${dia.diaSemana.substring(0, 3).toUpperCase()}</div>`;
              
              if (dia.reservas.length > 0) {
                dia.reservas.slice(0, 4).forEach(reserva => {
                  const statusClass = reserva.status === 'Confirmada' ? 'reserva-item' :
                                     reserva.status === 'Pendente' ? 'reserva-item reserva-pendente' : 
                                     'reserva-item reserva-cancelada';
                  htmlContent += `
                    <div class="${statusClass}">
                      <div style="font-weight: bold;">${reserva.horario.split(' - ')[0]}</div>
                      <div>${reserva.cliente.split(' ')[0]}</div>
                      <div>R$ ${reserva.valor.toFixed(0)}</div>
                    </div>
                  `;
                });
                if (dia.reservas.length > 4) {
                  htmlContent += `<div style="font-size: 8px; color: #666; margin-top: 2px;">+${dia.reservas.length - 4} mais</div>`;
                }
              } else {
                htmlContent += '<div class="sem-reservas">Livre</div>';
              }
              
              htmlContent += '</td>';
              diaAtual++;
            }
          }
          htmlContent += '</tr>';
        }
        
        htmlContent += `
                </tbody>
              </table>
            </div>
            
            <div class="resumo-section">
              <h4 style="margin: 0 0 10px 0; color: #0f172a;">📈 Resumo de Performance</h4>
              <div class="resumo-grid">
                <div class="resumo-row">
                  <div class="resumo-cell resumo-header">Reservas na Semana</div>
                  <div class="resumo-cell resumo-header">Ocupação</div>
                  <div class="resumo-cell resumo-header">Receita</div>
                  <div class="resumo-cell resumo-header">Slots Livres</div>
                </div>
                <div class="resumo-row">
                  <div class="resumo-cell">${quadra.estatisticas.totalReservas}</div>
                  <div class="resumo-cell">${quadra.estatisticas.taxaOcupacao}%</div>
                  <div class="resumo-cell">R$ ${quadra.estatisticas.receitaTotal.toFixed(2)}</div>
                  <div class="resumo-cell">${(31 * 17) - quadra.estatisticas.totalReservas}</div>
                </div>
              </div>
            </div>
          </div>
        `;
      });
      
      // Resumo geral consolidado
      const totalReservas = dados.quadras.reduce((acc, q) => acc + q.estatisticas.totalReservas, 0);
      const totalReceita = dados.quadras.reduce((acc, q) => acc + q.estatisticas.receitaTotal, 0);
      const totalRecebido = dados.quadras.reduce((acc, q) => acc + q.estatisticas.receitaPaga, 0);
      
      htmlContent += `
          <div style="background: #065f46; color: white; padding: 15px; margin-top: 20px; border-radius: 8px;">
            <h3 style="margin: 0 0 15px 0; text-align: center;">🏆 RESUMO GERAL DO PERÍODO</h3>
            <div class="resumo-grid">
              <div class="resumo-row">
                <div class="resumo-cell" style="background: rgba(255,255,255,0.1); font-weight: bold;">Total de Quadras</div>
                <div class="resumo-cell" style="background: rgba(255,255,255,0.1); font-weight: bold;">Total de Reservas</div>
                <div class="resumo-cell" style="background: rgba(255,255,255,0.1); font-weight: bold;">Receita Total</div>
                <div class="resumo-cell" style="background: rgba(255,255,255,0.1); font-weight: bold;">Valor Recebido</div>
              </div>
              <div class="resumo-row">
                <div class="resumo-cell" style="background: rgba(255,255,255,0.2); font-size: 14px; font-weight: bold;">${dados.quadras.length}</div>
                <div class="resumo-cell" style="background: rgba(255,255,255,0.2); font-size: 14px; font-weight: bold;">${totalReservas}</div>
                <div class="resumo-cell" style="background: rgba(255,255,255,0.2); font-size: 14px; font-weight: bold;">R$ ${totalReceita.toFixed(2)}</div>
                <div class="resumo-cell" style="background: rgba(255,255,255,0.2); font-size: 14px; font-weight: bold;">R$ ${totalRecebido.toFixed(2)}</div>
              </div>
              <div class="resumo-row">
                <div class="resumo-cell" style="background: rgba(255,255,255,0.1); font-weight: bold;">Taxa Geral</div>
                <div class="resumo-cell" style="background: rgba(255,255,255,0.1); font-weight: bold;">Valor Pendente</div>
                <div class="resumo-cell" style="background: rgba(255,255,255,0.1); font-weight: bold;">% Recebimento</div>
                <div class="resumo-cell" style="background: rgba(255,255,255,0.1); font-weight: bold;">Performance</div>
              </div>
              <div class="resumo-row">
                <div class="resumo-cell" style="background: rgba(255,255,255,0.2); font-size: 14px; font-weight: bold;">
                  ${totalReceita > 0 ? ((totalReservas / (dados.quadras.length * 31 * 17)) * 100).toFixed(1) : 0}%
                </div>
                <div class="resumo-cell" style="background: rgba(255,255,255,0.2); font-size: 14px; font-weight: bold;">
                  R$ ${(totalReceita - totalRecebido).toFixed(2)}
                </div>
                <div class="resumo-cell" style="background: rgba(255,255,255,0.2); font-size: 14px; font-weight: bold;">
                  ${totalReceita > 0 ? Math.round((totalRecebido / totalReceita) * 100) : 0}%
                </div>
                <div class="resumo-cell" style="background: rgba(255,255,255,0.2); font-size: 14px; font-weight: bold;">
                  ${totalReceita > 15000 ? '🟢 Excelente' : totalReceita > 10000 ? '🟡 Bom' : '🔴 Baixo'}
                </div>
              </div>
            </div>
          </div>
          
          <div style="margin-top: 20px; padding: 10px; background: #f3f4f6; border-radius: 5px; text-align: center;">
            <p style="margin: 0; font-size: 10px; color: #6b7280;">
              <strong>© 2025 PauloCunhaMKT Soluções TI</strong> • Sistema de Gestão Esportiva v2.1.0<br>
              Relatório gerado automaticamente • Dados atualizados em tempo real • Esporte Clube Jurema
            </p>
          </div>
        </body>
        </html>
      `;
      
      // Criar blob e download
      const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Painel_Visual_${dados.periodo.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.xls`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      registrarAtividade('EXPORT_XLS_PAINEL', `Excel do painel visual exportado - ${dados.periodo}`);
      alert(`✅ Excel do Painel Visual exportado com formatação!\n\n📊 Conteúdo incluído:\n• Calendário visual mensal por quadra\n• Estatísticas detalhadas de ocupação\n• Resumo financeiro completo\n• Layout similar ao painel do sistema\n\nPeríodo: ${dados.periodo}\n📁 Arquivo: .XLS otimizado para Excel`);
      
    } catch (error) {
      console.error('Erro ao gerar Excel:', error);
      alert('❌ Erro ao gerar Excel. Tente novamente.');
    }
  };

  // Atualizar cálculos automaticamente para reserva mensal e avulsa
  useEffect(() => {
    if (formReserva.tipoReserva === 'mensal' && 
        formReserva.quadraId && 
        formReserva.horaInicio && 
        formReserva.horaFim && 
        formReserva.diasSemana.length > 0) {
      
      const valorMensal = calcularValorMensal();
      const valorParcela = calcularParcelas(valorMensal, formReserva.numeroParcelas);
      
      setFormReserva(prev => ({
        ...prev,
        valorMensal: valorMensal,
        valorParcela: valorParcela
      }));
    } else if (formReserva.tipoReserva === 'avulsa' && 
               formReserva.quadraId && 
               formReserva.horaInicio && 
               formReserva.horaFim) {
      
      const quadra = quadras.find(q => q.id === parseInt(formReserva.quadraId));
      if (quadra && formReserva.horaInicio < formReserva.horaFim) {
        // Calcular duração em horas
        const horaInicio = new Date(`2000-01-01T${formReserva.horaInicio}`);
        const horaFim = new Date(`2000-01-01T${formReserva.horaFim}`);
        const minutos = (horaFim - horaInicio) / (1000 * 60);
        const horas = minutos / 60;
        
        // Calcular valor por hora baseado no período
        let valorPorHora;
        if (quadra.usarTabelaDiferenciada) {
          valorPorHora = calcularValorPorHorario(quadra, formReserva.horaInicio);
        } else {
          valorPorHora = parseFloat(quadra.valorHora) || 0;
        }
        
        const valorCalculado = horas * valorPorHora;
        
        // Atualizar o valor automaticamente apenas se não foi editado manualmente
        setFormReserva(prev => ({
          ...prev,
          valor: valorCalculado.toFixed(2)
        }));
      }
    }
  }, [formReserva.quadraId, formReserva.horaInicio, formReserva.horaFim, formReserva.diasSemana, formReserva.numeroParcelas, formReserva.tipoReserva, quadras]);

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
    painel: BarChart3,
    reservas: CalendarDays,
    quadras: Building,
    clientes: UserCheck,
    financeiro: CreditCard,
    relatorios: FileText,
    admin: Settings,
    sistema: Shield
  };

  const tabLabels = {
    dashboard: 'Início',
    painel: 'Painel',
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
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
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
                <div className="bg-white p-3 md:p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <Calendar className="h-6 w-6 md:h-8 md:w-8 text-purple-500" />
                    <div className="ml-2 md:ml-4">
                      <p className="text-xs md:text-sm font-medium text-gray-600">Mensais</p>
                      <p className="text-lg md:text-2xl font-bold text-gray-900">
                        {faturamentos.filter(f => 
                          f.tipoLocacao === 'Mensal' && 
                          f.mesLocacao >= new Date().toISOString().slice(0, 7)
                        ).length}
                      </p>
                      <p className="text-xs text-gray-500">Contratos mensais ativos</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resumo Reservas Mensais */}
              {(() => {
                const reservasMensaisAtivas = faturamentos.filter(f => 
                  f.tipoLocacao === 'Mensal' && 
                  f.valorEmAberto > 0 &&
                  f.mesLocacao >= new Date().toISOString().slice(0, 7)
                );
                
                return reservasMensaisAtivas.length > 0 && (
                  <div className="bg-white rounded-lg shadow">
                    <div className="p-4 md:p-6 border-b">
                      <h3 className="text-base md:text-lg font-medium text-gray-900">📅 Reservas Mensais Ativas</h3>
                    </div>
                    <div className="p-4 md:p-6">
                      {reservasMensaisAtivas.slice(0, 3).map((faturamento) => (
                        <div key={faturamento.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium truncate">{faturamento.cliente}</p>
                              <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                                MENSAL
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 truncate">{faturamento.tipoQuadra} - {faturamento.mesLocacao}</p>
                            <p className="text-xs text-gray-500">{faturamento.hora}</p>
                            {faturamento.diasSemana && (
                              <p className="text-xs text-purple-600">
                                Dias: {faturamento.diasSemana.join(', ')}
                              </p>
                            )}
                          </div>
                          <div className="text-right ml-2">
                            <p className="font-medium text-purple-600">R$ {faturamento.valor?.toFixed(2)}</p>
                            <p className="text-xs text-red-600">
                              Em aberto: R$ {faturamento.valorEmAberto?.toFixed(2)}
                            </p>
                            {faturamento.numeroParcelas > 1 && (
                              <p className="text-xs text-gray-500">
                                {faturamento.numeroParcelas}x R$ {faturamento.valorParcela?.toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

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
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900">Reservas por Cliente</h2>
                  <p className="text-sm text-gray-600">Clique no cliente para ver suas reservas</p>
                </div>
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
                  <input
                    type="date"
                    value={filtroData}
                    onChange={(e) => setFiltroData(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="Filtrar por data"
                  />
                </div>
                <div className="w-full md:w-auto">
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

              {/* Lista de Clientes com Reservas */}
              <div className="space-y-3">
                {(() => {
                  // Agrupar reservas por cliente
                  const reservasPorCliente = {};
                  const clientesFiltrados = clientes.filter(cliente => {
                    if (searchTerm && !cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())) {
                      return false;
                    }
                    return true;
                  });

                  // Filtrar reservas baseado nos filtros
                  const reservasFiltradas = reservas.filter(reserva => {
                    const matchData = !filtroData || reserva.data === filtroData;
                    const matchQuadra = !quadraImpressao || reserva.quadraId == quadraImpressao;
                    return matchData && matchQuadra;
                  });

                  // Agrupar reservas por cliente
                  reservasFiltradas.forEach(reserva => {
                    const cliente = clientes.find(c => c.id === reserva.clienteId);
                    if (cliente && clientesFiltrados.find(c => c.id === cliente.id)) {
                      if (!reservasPorCliente[cliente.id]) {
                        reservasPorCliente[cliente.id] = {
                          cliente: cliente,
                          reservas: []
                        };
                      }
                      reservasPorCliente[cliente.id].reservas.push(reserva);
                    }
                  });

                  // Ordenar clientes por nome
                  const clientesComReservas = Object.values(reservasPorCliente)
                    .sort((a, b) => a.cliente.nome.localeCompare(b.cliente.nome));

                  if (clientesComReservas.length === 0) {
                    return (
                      <div className="text-center py-12 bg-white rounded-lg shadow">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma reserva encontrada</h3>
                        <p className="text-gray-500 mb-4">
                          {searchTerm || filtroData || quadraImpressao ? 
                            'Ajuste os filtros para ver as reservas.' :
                            'Comece criando uma nova reserva.'
                          }
                        </p>
                        <button
                          onClick={() => {
                            setModalType('reserva');
                            setShowModal(true);
                          }}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-700 mx-auto"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Nova Reserva</span>
                        </button>
                      </div>
                    );
                  }

                  return clientesComReservas.map(({ cliente, reservas: reservasCliente }) => {
                    const isExpanded = clientesExpandidos[cliente.id];
                    const totalReservas = reservasCliente.length;
                    const valorTotalCliente = reservasCliente.reduce((acc, r) => acc + (r.valor || 0), 0);
                    const valorPagoCliente = reservasCliente.reduce((acc, r) => acc + (r.valorPago || 0), 0);
                    const reservasPendentes = reservasCliente.filter(r => (r.statusPagamento || 'Pendente') !== 'Pago').length;

                    return (
                      <div key={cliente.id} className="bg-white rounded-lg shadow overflow-hidden">
                        {/* Cabeçalho do Cliente - Clicável */}
                        <div 
                          className="p-4 cursor-pointer hover:bg-gray-50 transition-colors border-l-4 border-blue-500"
                          onClick={() => toggleClienteExpandido(cliente.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-medium text-lg">
                                  {cliente.nome.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">{cliente.nome}</h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                  <span>{cliente.telefone}</span>
                                  <span>•</span>
                                  <span>{totalReservas} reserva{totalReservas !== 1 ? 's' : ''}</span>
                                  {reservasPendentes > 0 && (
                                    <>
                                      <span>•</span>
                                      <span className="text-red-600 font-medium">
                                        {reservasPendentes} pendente{reservasPendentes !== 1 ? 's' : ''}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <div className="text-lg font-bold text-blue-600">
                                  R$ {valorTotalCliente.toFixed(2)}
                                </div>
                                <div className="text-sm text-green-600 font-medium">
                                  Pago: R$ {valorPagoCliente.toFixed(2)}
                                </div>
                              </div>
                              <div className="transition-transform duration-200">
                                {isExpanded ? (
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 font-bold">−</span>
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                    <span className="text-gray-600 font-bold">+</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Reservas do Cliente - Expansível */}
                        {isExpanded && (
                          <div className="border-t border-gray-200">
                            <div className="overflow-x-auto">
                              {/* Desktop - Tabela */}
                              <div className="hidden md:block">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data/Hora</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quadra</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pagamento</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {reservasCliente
                                      .sort((a, b) => new Date(b.data) - new Date(a.data))
                                      .map((reserva) => {
                                        const quadra = quadras.find(q => q.id === reserva.quadraId);
                                        return (
                                          <tr key={reserva.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                              <div>
                                                <div className="font-medium">
                                                  {new Date(reserva.data).toLocaleDateString('pt-BR')}
                                                </div>
                                                <div className="text-gray-600">
                                                  {reserva.horaInicio} - {reserva.horaFim}
                                                </div>
                                                {reserva.tipoReserva === 'mensal' && (
                                                  <div className="text-xs text-purple-600 font-medium mt-1">
                                                    {reserva.periodoReal ? (
                                                      <>📅 {reserva.periodoReal}</>
                                                    ) : (
                                                      <>📅 Mensal: {reserva.mesReferencia}</>
                                                    )}
                                                  </div>
                                                )}
                                              </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                              <div className="flex items-center gap-2">
                                                {quadra?.nome}
                                                {reserva.tipoReserva === 'mensal' && (
                                                  <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                                                    MENSAL
                                                  </span>
                                                )}
                                              </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                                              R$ {(reserva.valor || 0).toFixed(2)}
                                            </td>
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
                                              <div className="text-xs text-green-600 font-medium mt-1">
                                                R$ {(reserva.valorPago || 0).toFixed(2)}
                                                {reserva.valorPago > 0 && reserva.formaPagamento && (
                                                  <span className="text-gray-500"> • {reserva.formaPagamento}</span>
                                                )}
                                              </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                              <div className="flex space-x-2">
                                                <button
                                                  onClick={() => editarReserva(reserva)}
                                                  className="text-green-600 hover:text-green-900"
                                                  title="Editar reserva"
                                                >
                                                  <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                  onClick={() => excluirReserva(reserva.id)}
                                                  className="text-red-600 hover:text-red-900"
                                                  title="Excluir reserva"
                                                >
                                                  <Trash2 className="h-4 w-4" />
                                                </button>
                                              </div>
                                            </td>
                                          </tr>
                                        );
                                      })}
                                  </tbody>
                                </table>
                              </div>

                              {/* Mobile - Cards */}
                              <div className="md:hidden p-4 space-y-3">
                                {reservasCliente
                                  .sort((a, b) => new Date(b.data) - new Date(a.data))
                                  .map((reserva) => {
                                    const quadra = quadras.find(q => q.id === reserva.quadraId);
                                    return (
                                      <div key={reserva.id} className="bg-gray-50 rounded-lg p-3 border">
                                        <div className="flex justify-between items-start mb-2">
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                              <h4 className="font-medium text-gray-900">{quadra?.nome}</h4>
                                              {reserva.tipoReserva === 'mensal' && (
                                                <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 font-medium">
                                                  📅 MENSAL
                                                </span>
                                              )}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                              {new Date(reserva.data).toLocaleDateString('pt-BR')} • {reserva.horaInicio} - {reserva.horaFim}
                                            </div>
                                            {reserva.tipoReserva === 'mensal' && (
                                              <div className="text-xs text-purple-600 font-medium mt-1">
                                                {reserva.periodoReal ? (
                                                  <>📅 Período: {reserva.periodoReal}</>
                                                ) : (
                                                  <>📅 Ref: {reserva.mesReferencia}</>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                          <div className="text-right">
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                              reserva.status === 'Confirmada' ? 'bg-green-100 text-green-800' :
                                              reserva.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                                              'bg-red-100 text-red-800'
                                            }`}>
                                              {reserva.status}
                                            </span>
                                          </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                                          <div>
                                            <span className="text-gray-600">Valor:</span>
                                            <span className="font-medium text-blue-600 ml-1">R$ {(reserva.valor || 0).toFixed(2)}</span>
                                          </div>
                                          <div>
                                            <span className="text-gray-600">Pago:</span>
                                            <span className="font-medium text-green-600 ml-1">R$ {(reserva.valorPago || 0).toFixed(2)}</span>
                                          </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                          <span className={`px-2 py-1 text-xs rounded-full ${
                                            reserva.statusPagamento === 'Pago' ? 'bg-green-100 text-green-800' :
                                            reserva.statusPagamento === 'Parcial' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                          }`}>
                                            {reserva.statusPagamento || 'Pendente'}
                                          </span>
                                          
                                          <div className="flex space-x-2">
                                            <button
                                              onClick={() => editarReserva(reserva)}
                                              className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                                            >
                                              Editar
                                            </button>
                                            <button
                                              onClick={() => excluirReserva(reserva.id)}
                                              className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                                            >
                                              <Trash2 className="h-3 w-3" />
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Estatísticas Gerais */}
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Resumo Geral</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {(() => {
                        const clientesComReservas = [...new Set(reservas.map(r => r.clienteId))];
                        return clientesComReservas.length;
                      })()}
                    </div>
                    <div className="text-sm text-gray-600">Clientes Ativos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{reservas.length}</div>
                    <div className="text-sm text-gray-600">Total Reservas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      R$ {reservas.reduce((acc, r) => acc + (r.valor || 0), 0).toFixed(0)}
                    </div>
                    <div className="text-sm text-gray-600">Valor Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {reservas.filter(r => (r.statusPagamento || 'Pendente') !== 'Pago').length}
                    </div>
                    <div className="text-sm text-gray-600">Pendentes</div>
                  </div>
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
                    <div className="mb-4">
                      {quadra.usarTabelaDiferenciada ? (
                        <div className="text-sm">
                          <p className="text-orange-600 font-medium">🌅 Manhã/Tarde (06:00-17:59): R$ {quadra.valorManha}/h</p>
                          <p className="text-blue-600 font-medium">🌙 Noite (18:00-22:59): R$ {quadra.valorNoite}/h</p>
                          <p className="text-xs text-gray-500 mt-1">Valores diferenciados por período</p>
                        </div>
                      ) : (
                        <p className="text-gray-900 font-medium">R$ {quadra.valorHora}/hora</p>
                      )}
                    </div>
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
                  <p className="text-sm text-gray-600">Gestão de pendências financeiras - Apenas lançamentos em aberto e parciais</p>
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
                            const valorTotal = r.valor || 0;
                            const valorPago = r.valorPago || 0;
                            const valorPendente = Math.max(0, valorTotal - valorPago);
                            return acc + valorPendente;
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
                    <option value="">Todos os pendentes</option>
                    <option value="Em Aberto">Em Aberto</option>
                    <option value="Parcial">Parciais</option>
                  </select>
                </div>
              </div>

              {/* Lista Unificada - Mobile */}
              <div className="space-y-3 md:hidden">
                {(() => {
                  // Criar lista unificada de itens financeiros APENAS COM VALORES EM ABERTO
                  const itensFinanceiros = [];
                  
                  // Adicionar APENAS faturamentos com valores em aberto
                  faturamentos.forEach(faturamento => {
                    const valorEmAberto = faturamento.valorEmAberto || 0;
                    if (valorEmAberto > 0) {
                      itensFinanceiros.push({
                        id: `fat_${faturamento.id}`,
                        tipo: 'faturamento',
                        origem: 'Faturamento Administrativo',
                        cliente: faturamento.cliente,
                        descricao: `${faturamento.tipoQuadra} - ${faturamento.mesLocacao}`,
                        data: faturamento.data,
                        valor: faturamento.valor,
                        valorRecebido: faturamento.valorRealRecebido || 0,
                        valorEmAberto: valorEmAberto,
                        formaPagamento: faturamento.formaPagamento,
                        status: 'Em Aberto',
                        item: faturamento
                      });
                    }
                  });
                  
                  // Adicionar APENAS reservas com valores em aberto ou parciais
                  reservas.forEach(reserva => {
                    const valorTotal = reserva.valor || 0;
                    const valorPago = reserva.valorPago || 0;
                    const valorEmAberto = Math.max(0, valorTotal - valorPago);
                    
                    if (valorEmAberto > 0) {
                      const cliente = clientes.find(c => c.id === reserva.clienteId);
                      const quadra = quadras.find(q => q.id === reserva.quadraId);
                      
                      let status = 'Em Aberto';
                      if (valorPago > 0) {
                        status = 'Parcial';
                      }
                      
                      itensFinanceiros.push({
                        id: `res_${reserva.id}`,
                        tipo: 'reserva',
                        origem: 'Reserva de Quadra',
                        cliente: cliente?.nome || 'Cliente N/A',
                        descricao: `${quadra?.nome} - ${reserva.data} (${reserva.horaInicio}-${reserva.horaFim})`,
                        data: reserva.data,
                        valor: valorTotal,
                        valorRecebido: valorPago,
                        valorEmAberto: valorEmAberto,
                        formaPagamento: reserva.formaPagamento || '',
                        status: status,
                        item: reserva
                      });
                    }
                  });
                  
                  // Filtrar itens (apenas os que têm valor em aberto)
                  const itensFiltrados = itensFinanceiros.filter(item => {
                    const matchSearch = !searchTerm || 
                      item.cliente?.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchStatus = !filtroData || item.status === filtroData;
                    return matchSearch && matchStatus;
                  });
                  
                  return itensFiltrados.map((item) => (
                    <div key={item.id} className={`bg-white rounded-lg shadow p-4 border-l-4 ${
                      item.tipo === 'faturamento' ? 'border-blue-500' : 'border-green-500'
                    }`}>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900">{item.cliente}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                              item.tipo === 'faturamento' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {item.origem}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{item.descricao}</p>
                          <p className="text-sm text-blue-600 font-medium">R$ {item.valor?.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            item.status === 'Pago' ? 'bg-green-100 text-green-800' :
                            item.status === 'Parcial' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                        <div>Recebido: R$ {item.valorRecebido?.toFixed(2)}</div>
                        <div>Em Aberto: R$ {item.valorEmAberto?.toFixed(2)}</div>
                        <div>Data: {new Date(item.data).toLocaleDateString('pt-BR')}</div>
                        <div>Forma: {item.formaPagamento || 'N/A'}</div>
                      </div>

                      <div className="space-y-2">
                        {item.valorEmAberto > 0 && (
                          <button
                            onClick={() => {
                              setFormRecebimento({
                                faturamentoId: item.id,
                                data: new Date().toISOString().split('T')[0],
                                valor: item.valorEmAberto.toString(),
                                formaPagamento: '',
                                observacoes: ''
                              });
                              setModalType('recebimento');
                              setShowModal(true);
                            }}
                            className="w-full bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 flex items-center justify-center space-x-2"
                          >
                            <CreditCard className="h-4 w-4" />
                            <span>Lançar Recebimento</span>
                          </button>
                        )}
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              if (item.tipo === 'faturamento') {
                                editarFaturamento(item.item);
                              } else {
                                editarReserva(item.item);
                              }
                            }}
                            className={`flex-1 text-white px-3 py-2 rounded text-sm ${
                              item.tipo === 'faturamento' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
                            }`}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => {
                              if (item.tipo === 'faturamento') {
                                excluirFaturamento(item.item.id);
                              } else {
                                excluirReserva(item.item.id);
                              }
                            }}
                            className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ));
                })()}
                
                {(() => {
                  // Verificar se há itens em aberto para mostrar mensagem quando não há
                  const faturamentosEmAberto = faturamentos.filter(f => (f.valorEmAberto || 0) > 0);
                  const reservasEmAberto = reservas.filter(r => {
                    const valorTotal = r.valor || 0;
                    const valorPago = r.valorPago || 0;
                    return Math.max(0, valorTotal - valorPago) > 0;
                  });
                  
                  const totalItensEmAberto = faturamentosEmAberto.length + reservasEmAberto.length;
                  
                  return totalItensEmAberto === 0 && (
                    <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma Pendência Financeira!</h3>
                      <p className="text-sm">
                        {searchTerm ? 
                          'Nenhum resultado encontrado para sua busca.' :
                          'Todos os faturamentos e reservas estão com pagamentos em dia.'
                        }
                      </p>
                    </div>
                  );
                })()}
              </div>

              {/* Tabela Desktop Unificada */}
              <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Origem/Cliente</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recebido</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Em Aberto</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(() => {
                        // Criar lista unificada de itens financeiros APENAS COM VALORES EM ABERTO
                        const itensFinanceiros = [];
                        
                        // Adicionar APENAS faturamentos com valores em aberto
                        faturamentos.forEach(faturamento => {
                          const valorEmAberto = faturamento.valorEmAberto || 0;
                          if (valorEmAberto > 0) {
                            itensFinanceiros.push({
                              id: `fat_${faturamento.id}`,
                              tipo: 'faturamento',
                              origem: 'Faturamento Administrativo',
                              cliente: faturamento.cliente,
                              descricao: `${faturamento.tipoQuadra} - ${faturamento.mesLocacao}`,
                              data: faturamento.data,
                              valor: faturamento.valor,
                              valorRecebido: faturamento.valorRealRecebido || 0,
                              valorEmAberto: valorEmAberto,
                              formaPagamento: faturamento.formaPagamento,
                              status: 'Em Aberto',
                              item: faturamento
                            });
                          }
                        });
                        
                        // Adicionar APENAS reservas com valores em aberto ou parciais
                        reservas.forEach(reserva => {
                          const valorTotal = reserva.valor || 0;
                          const valorPago = reserva.valorPago || 0;
                          const valorEmAberto = Math.max(0, valorTotal - valorPago);
                          
                          if (valorEmAberto > 0) {
                            const cliente = clientes.find(c => c.id === reserva.clienteId);
                            const quadra = quadras.find(q => q.id === reserva.quadraId);
                            
                            let status = 'Em Aberto';
                            if (valorPago > 0) {
                              status = 'Parcial';
                            }
                            
                            itensFinanceiros.push({
                              id: `res_${reserva.id}`,
                              tipo: 'reserva',
                              origem: 'Reserva de Quadra',
                              cliente: cliente?.nome || 'Cliente N/A',
                              descricao: `${quadra?.nome} - ${reserva.data} (${reserva.horaInicio}-${reserva.horaFim})`,
                              data: reserva.data,
                              valor: valorTotal,
                              valorRecebido: valorPago,
                              valorEmAberto: valorEmAberto,
                              formaPagamento: reserva.formaPagamento || '',
                              status: status,
                              item: reserva
                            });
                          }
                        });
                        
                        // Filtrar itens
                        const itensFiltrados = itensFinanceiros.filter(item => {
                          const matchSearch = !searchTerm || 
                            item.cliente?.toLowerCase().includes(searchTerm.toLowerCase());
                          const matchStatus = !filtroData || item.status === filtroData;
                          return matchSearch && matchStatus;
                        });
                        
                        // Ordenar por data
                        itensFiltrados.sort((a, b) => new Date(b.data) - new Date(a.data));
                        
                        const resultados = itensFiltrados.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full mr-3 ${
                                  item.tipo === 'faturamento' ? 'bg-blue-500' : 'bg-green-500'
                                }`}></div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{item.cliente}</div>
                                  <div className={`text-xs font-medium ${
                                    item.tipo === 'faturamento' ? 'text-blue-600' : 'text-green-600'
                                  }`}>
                                    {item.origem}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{item.descricao}</div>
                              <div className="text-sm text-gray-500">{new Date(item.data).toLocaleDateString('pt-BR')}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              R$ {item.valor?.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                              R$ {item.valorRecebido?.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                              R$ {item.valorEmAberto?.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                item.status === 'Pago' ? 'bg-green-100 text-green-800' :
                                item.status === 'Parcial' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                {item.valorEmAberto > 0 && (
                                  <button
                                    onClick={() => {
                                      setFormRecebimento({
                                        faturamentoId: item.id,
                                        data: new Date().toISOString().split('T')[0],
                                        valor: item.valorEmAberto.toString(),
                                        formaPagamento: '',
                                        observacoes: ''
                                      });
                                      setModalType('recebimento');
                                      setShowModal(true);
                                    }}
                                    className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 flex items-center space-x-1"
                                    title="Lançar Recebimento"
                                  >
                                    <CreditCard className="h-3 w-3" />
                                    <span>Receber</span>
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    if (item.tipo === 'faturamento') {
                                      editarFaturamento(item.item);
                                    } else {
                                      editarReserva(item.item);
                                    }
                                  }}
                                  className={`${
                                    item.tipo === 'faturamento' ? 'text-blue-600 hover:text-blue-900' : 'text-green-600 hover:text-green-900'
                                  }`}
                                  title="Editar"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (item.tipo === 'faturamento') {
                                      excluirFaturamento(item.item.id);
                                    } else {
                                      excluirReserva(item.item.id);
                                    }
                                  }}
                                  className="text-red-600 hover:text-red-900"
                                  title="Excluir"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ));
                        
                        return resultados.length > 0 ? resultados : (
                          <tr>
                            <td colSpan="7" className="px-6 py-12 text-center">
                              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma Pendência Financeira!</h3>
                              <p className="text-sm text-gray-500">
                                {searchTerm ? 
                                  'Nenhum resultado encontrado para sua busca.' :
                                  'Todos os faturamentos e reservas estão com pagamentos em dia.'
                                }
                              </p>
                            </td>
                          </tr>
                        );
                      })()}
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
                        let nomeCliente, descricaoItem, tipoOrigem;
                        
                        if (recebimento.tipoItem === 'faturamento' || recebimento.faturamentoId) {
                          const faturamento = faturamentos.find(f => f.id === (recebimento.faturamentoId || parseInt(recebimento.faturamentoId)));
                          nomeCliente = faturamento?.cliente || 'Cliente não encontrado';
                          descricaoItem = faturamento ? `${faturamento.tipoQuadra} - ${faturamento.mesLocacao}` : 'Faturamento excluído';
                          tipoOrigem = 'Faturamento';
                        } else if (recebimento.tipoItem === 'reserva' || recebimento.reservaId) {
                          const reserva = reservas.find(r => r.id === recebimento.reservaId);
                          if (reserva) {
                            const cliente = clientes.find(c => c.id === reserva.clienteId);
                            const quadra = quadras.find(q => q.id === reserva.quadraId);
                            nomeCliente = cliente?.nome || 'Cliente não encontrado';
                            descricaoItem = `${quadra?.nome} - ${reserva.data} (${reserva.horaInicio}-${reserva.horaFim})`;
                            tipoOrigem = 'Reserva';
                          } else {
                            nomeCliente = 'Reserva não encontrada';
                            descricaoItem = 'Reserva excluída';
                            tipoOrigem = 'Reserva';
                          }
                        } else {
                          // Para recebimentos antigos (compatibilidade)
                          const faturamento = faturamentos.find(f => f.id === recebimento.faturamentoId);
                          nomeCliente = faturamento?.cliente || 'Cliente não encontrado';
                          descricaoItem = faturamento ? `${faturamento.tipoQuadra} - ${faturamento.mesLocacao}` : 'Item excluído';
                          tipoOrigem = 'Faturamento';
                        }
                        
                        return (
                          <div key={recebimento.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium truncate">{nomeCliente}</p>
                                <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                  tipoOrigem === 'Faturamento' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                }`}>
                                  {tipoOrigem}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 truncate">{descricaoItem}</p>
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

              {/* Área de Limpeza de Dados */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  <AlertCircle className="h-8 w-8 text-red-500 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-red-800 mb-2">Área de Limpeza de Dados</h3>
                    <p className="text-sm text-red-700 mb-4">
                      <strong>⚠️ OPERAÇÃO IRREVERSÍVEL:</strong> Esta função remove permanentemente todos os dados financeiros do sistema,
                      incluindo reservas, faturamentos e recebimentos. Use apenas quando necessário resetar o sistema.
                    </p>
                    <div className="bg-red-100 p-3 rounded mb-4">
                      <p className="text-xs text-red-600">
                        <strong>Dados que serão removidos:</strong><br/>
                        • Todas as reservas (avulsas e mensais)<br/>
                        • Todos os faturamentos administrativos<br/>
                        • Todo histórico de recebimentos<br/>
                        • Controles de receita e inadimplência
                      </p>
                    </div>
                    <button
                      onClick={limparDadosFinanceiros}
                      className="bg-red-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-red-700 font-medium"
                    >
                      <Trash2 className="h-5 w-5" />
                      <span>Limpar Todos os Dados Financeiros</span>
                    </button>
                  </div>
                </div>
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

          {/* Painel Visual */}
          {activeTab === 'painel' && (
            <div className="space-y-4 md:space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900">Painel Visual das Quadras</h2>
                  <p className="text-sm text-gray-600">Visualização em tempo real dos horários disponíveis e ocupados</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <input
                    type="date"
                    value={dataRelatorio}
                    onChange={(e) => setDataRelatorio(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <select
                    value={quadraImpressao}
                    onChange={(e) => setQuadraImpressao(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Todas as Quadras</option>
                    {quadras.filter(q => q.ativa).map(quadra => (
                      <option key={quadra.id} value={quadra.id}>{quadra.nome}</option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={() => gerarPDFSemanalVisual()}
                      className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 text-sm"
                      title="Exportar PDF Semanal Visual"
                    >
                      <FileText className="h-4 w-4" />
                      <span className="hidden sm:inline">PDF Sem</span>
                    </button>
                    <button
                      onClick={() => gerarXLSSemanalVisual()}
                      className="bg-purple-600 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-purple-700 text-sm"
                      title="Exportar Excel Semanal Visual"
                    >
                      <BarChart3 className="h-4 w-4" />
                      <span className="hidden sm:inline">XLS Sem</span>
                    </button>
                    <button
                      onClick={() => gerarExportacaoPainelPDF()}
                      className="bg-red-600 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-red-700 text-sm"
                      title="Exportar PDF Mensal"
                    >
                      <FileText className="h-4 w-4" />
                      <span className="hidden sm:inline">PDF Men</span>
                    </button>
                    <button
                      onClick={() => gerarExportacaoPainelXLS()}
                      className="bg-green-600 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-700 text-sm"
                      title="Exportar Excel Mensal"
                    >
                      <BarChart3 className="h-4 w-4" />
                      <span className="hidden sm:inline">XLS Men</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Painel de Quadras */}
              <div className="space-y-6">
                {(quadraImpressao ? quadras.filter(q => q.id == quadraImpressao) : quadras.filter(q => q.ativa)).map(quadra => {
                  // Gerar horários de 6h às 23h (slots de 1 hora)
                  const horarios = [];
                  for (let h = 6; h < 23; h++) {
                    horarios.push(`${h.toString().padStart(2, '0')}:00`);
                  }

                  // Obter reservas da quadra para a semana
                  const dataInicio = new Date(dataRelatorio);
                  const diasSemana = [];
                  
                  // Gerar 7 dias a partir da data selecionada
                  for (let i = 0; i < 7; i++) {
                    const data = new Date(dataInicio);
                    data.setDate(dataInicio.getDate() + i);
                    diasSemana.push(data);
                  }

                  return (
                    <div key={quadra.id} className="bg-white rounded-lg shadow overflow-hidden">
                      {/* Cabeçalho da Quadra */}
                      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">{quadra.nome}</h3>
                            <p className="text-blue-100 text-sm">{quadra.modalidade}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-blue-100 text-sm">Valores:</p>
                            {quadra.usarTabelaDiferenciada ? (
                              <div className="text-sm">
                                <p className="text-orange-200">🌅 R$ {quadra.valorManha}/h</p>
                                <p className="text-blue-200">🌙 R$ {quadra.valorNoite}/h</p>
                              </div>
                            ) : (
                              <p className="text-xl font-bold">R$ {quadra.valorHora}/h</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Grade de Horários */}
                      <div className="overflow-x-auto">
                        <div className="min-w-full">
                          {/* Cabeçalho dos Dias */}
                          <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50">
                            <div className="p-3 text-sm font-medium text-gray-700 border-r border-gray-200">
                              Horário
                            </div>
                            {diasSemana.map((data, index) => (
                              <div key={index} className="p-3 text-center border-r border-gray-200 last:border-r-0">
                                <div className="text-sm font-medium text-gray-900">
                                  {data.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase()}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {data.getDate().toString().padStart(2, '0')}/{(data.getMonth() + 1).toString().padStart(2, '0')}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Grid de Horários */}
                          {horarios.map((horario, horarioIndex) => (
                            <div key={horario} className={`grid grid-cols-8 ${horarioIndex % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                              {/* Coluna do Horário */}
                              <div className="p-3 text-sm font-medium text-gray-700 border-r border-b border-gray-200 bg-gray-50">
                                {horario}
                              </div>
                              
                              {/* Colunas dos Dias */}
                              {diasSemana.map((data, diaIndex) => {
                                const dataStr = data.toISOString().split('T')[0];
                                const horaInicio = horario;
                                const horaFim = `${(parseInt(horario.split(':')[0]) + 1).toString().padStart(2, '0')}:00`;
                                
                                // Buscar reservas que se sobrepõem com este slot
                                const reservasNoSlot = reservas.filter(r => {
                                  if (r.quadraId !== quadra.id || r.data !== dataStr) return false;
                                  
                                  // Verificar sobreposição de horários
                                  const reservaInicio = r.horaInicio;
                                  const reservaFim = r.horaFim;
                                  
                                  return (reservaInicio < horaFim && reservaFim > horaInicio);
                                });

                                const reserva = reservasNoSlot[0]; // Pegar a primeira (deve ser única)
                                const isOcupado = reservasNoSlot.length > 0;
                                const isHoje = dataStr === new Date().toISOString().split('T')[0];
                                const isPast = data < new Date().setHours(0, 0, 0, 0);
                                
                                return (
                                  <div 
                                    key={`${horario}-${diaIndex}`} 
                                    className={`p-2 border-r border-b border-gray-200 last:border-r-0 min-h-[60px] relative ${
                                      isPast ? 'bg-gray-100' :
                                      isOcupado ? (
                                        reserva.status === 'Confirmada' ? 'bg-green-100 border-l-4 border-green-500' :
                                        reserva.status === 'Pendente' ? 'bg-yellow-100 border-l-4 border-yellow-500' :
                                        'bg-red-100 border-l-4 border-red-500'
                                      ) : (
                                        isHoje ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'
                                      )
                                    } cursor-pointer transition-colors`}
                                    title={
                                      isOcupado ? 
                                        `${clientes.find(c => c.id === reserva.clienteId)?.nome} - ${reserva.horaInicio} às ${reserva.horaFim}` :
                                        isPast ? 'Horário passado' : 'Disponível - Clique para reservar'
                                    }
                                    onClick={() => {
                                      if (!isPast && !isOcupado) {
                                        // Calcular valor automaticamente ao abrir o modal
                                        const horaInicioTime = new Date(`2000-01-01T${horaInicio}`);
                                        const horaFimTime = new Date(`2000-01-01T${horaFim}`);
                                        const minutos = (horaFimTime - horaInicioTime) / (1000 * 60);
                                        const horas = minutos / 60;
                                        
                                        let valorPorHora;
                                        if (quadra.usarTabelaDiferenciada) {
                                          valorPorHora = calcularValorPorHorario(quadra, horaInicio);
                                        } else {
                                          valorPorHora = parseFloat(quadra.valorHora) || 0;
                                        }
                                        
                                        const valorCalculado = horas * valorPorHora;
                                        
                                        setFormReserva({
                                          ...formReserva,
                                          quadraId: quadra.id.toString(),
                                          data: dataStr,
                                          horaInicio: horaInicio,
                                          horaFim: horaFim,
                                          tipoReserva: 'avulsa',
                                          valor: valorCalculado.toFixed(2)
                                        });
                                        setModalType('reserva');
                                        setShowModal(true);
                                      }
                                    }}
                                  >
                                    {isOcupado ? (
                                      <div className="text-xs">
                                        <div className="font-medium text-gray-900 truncate">
                                          {clientes.find(c => c.id === reserva.clienteId)?.nome}
                                        </div>
                                        <div className="text-gray-600">
                                          {reserva.horaInicio} - {reserva.horaFim}
                                        </div>
                                        <div className={`text-xs px-1 py-0.5 rounded mt-1 inline-block ${
                                          reserva.status === 'Confirmada' ? 'bg-green-200 text-green-800' :
                                          reserva.status === 'Pendente' ? 'bg-yellow-200 text-yellow-800' :
                                          'bg-red-200 text-red-800'
                                        }`}>
                                          {reserva.status}
                                        </div>
                                      </div>
                                    ) : isPast ? (
                                      <div className="text-xs text-gray-400 text-center pt-4">
                                        ⏰
                                      </div>
                                    ) : (
                                      <div className="text-xs text-gray-400 text-center pt-4 opacity-0 group-hover:opacity-100">
                                        + Reservar
                                      </div>
                                    )}
                                    
                                    {isHoje && !isOcupado && (
                                      <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Resumo da Quadra */}
                      <div className="bg-gray-50 p-4 border-t">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          {(() => {
                            const semanaReservas = reservas.filter(r => {
                              const dataReserva = new Date(r.data);
                              const dataInicio = new Date(dataRelatorio);
                              const dataFim = new Date(dataInicio);
                              dataFim.setDate(dataInicio.getDate() + 6);
                              return r.quadraId === quadra.id && 
                                     dataReserva >= dataInicio && dataReserva <= dataFim;
                            });
                            
                            const totalSlots = 7 * 17; // 7 dias × 17 horários (6h-23h)
                            const slotsOcupados = semanaReservas.length;
                            const ocupacao = ((slotsOcupados / totalSlots) * 100).toFixed(1);
                            const receitaSemana = semanaReservas.reduce((acc, r) => acc + (r.valor || 0), 0);
                            
                            return (
                              <>
                                <div>
                                  <span className="text-gray-600">Reservas na Semana:</span>
                                  <span className="font-bold text-blue-600 ml-1">{slotsOcupados}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Taxa de Ocupação:</span>
                                  <span className="font-bold text-purple-600 ml-1">{ocupacao}%</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Receita Semana:</span>
                                  <span className="font-bold text-green-600 ml-1">R$ {receitaSemana.toFixed(2)}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Slots Disponíveis:</span>
                                  <span className="font-bold text-orange-600 ml-1">{totalSlots - slotsOcupados}</span>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Legenda */}
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Legenda</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-100 border-l-4 border-green-500 rounded-sm"></div>
                    <span>Confirmada</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-100 border-l-4 border-yellow-500 rounded-sm"></div>
                    <span>Pendente</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-100 border-l-4 border-red-500 rounded-sm"></div>
                    <span>Cancelada</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded-sm"></div>
                    <span>Disponível</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm text-blue-700 mb-2">
                    <strong>💡 Dica:</strong> Clique em qualquer horário disponível para fazer uma reserva rápida. 
                    Os horários de hoje aparecem destacados em azul com um ponto pulsante.
                  </p>
                  <p className="text-sm text-blue-700">
                    <strong>📊 Exportação:</strong> Use os botões PDF e XLS para gerar relatórios mensais completos com:
                    calendário visual, estatísticas detalhadas, resumo por quadra e dados financeiros.
                  </p>
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
                                      <h4 className="text-base font-semibold text-gray-808 mb-3">
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
                  
                  {/* Tabela de Valores Diferenciados */}
                  <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                    <label className="flex items-center text-sm font-medium text-blue-800 mb-3">
                      <input
                        type="checkbox"
                        checked={formQuadra.usarTabelaDiferenciada}
                        onChange={(e) => setFormQuadra({...formQuadra, usarTabelaDiferenciada: e.target.checked})}
                        className="mr-2"
                      />
                      Usar valores diferenciados por período
                    </label>
                    
                    {formQuadra.usarTabelaDiferenciada ? (
                      <div className="space-y-3">
                        <div className="bg-orange-50 border border-orange-200 rounded p-3">
                          <label className="block text-sm font-medium text-orange-800 mb-1">
                            🌅 Manhã/Tarde (06:00 - 17:59)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            placeholder="Ex: 80.00"
                            value={formQuadra.valorManha}
                            onChange={(e) => setFormQuadra({...formQuadra, valorManha: e.target.value})}
                            className="w-full px-3 py-2 border border-orange-300 rounded-md text-sm"
                          />
                          <p className="text-xs text-orange-600 mt-1">Das 06:00 até 17:59</p>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded p-3">
                          <label className="block text-sm font-medium text-blue-800 mb-1">
                            🌙 Noite (18:00 - 22:59)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            placeholder="Ex: 100.00"
                            value={formQuadra.valorNoite}
                            onChange={(e) => setFormQuadra({...formQuadra, valorNoite: e.target.value})}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md text-sm"
                          />
                          <p className="text-xs text-blue-600 mt-1">Das 18:00 até 22:59</p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Valor único por hora
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Valor por hora"
                          value={formQuadra.valorHora}
                          onChange={(e) => setFormQuadra({...formQuadra, valorHora: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    )}
                  </div>
                  
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
                  {/* Tipo de Reserva */}
                  <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                    <label className="block text-sm font-medium text-blue-800 mb-2">Tipo de Reserva</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormReserva({...formReserva, tipoReserva: 'avulsa'})}
                        className={`p-3 rounded-lg border text-sm font-medium ${
                          formReserva.tipoReserva === 'avulsa' 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'bg-white text-blue-600 border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        🎯 Reserva Avulsa
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormReserva({...formReserva, tipoReserva: 'mensal'})}
                        className={`p-3 rounded-lg border text-sm font-medium ${
                          formReserva.tipoReserva === 'mensal' 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'bg-white text-blue-600 border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        📅 Reserva Mensal
                      </button>
                    </div>
                  </div>

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

                  {/* Data ou Mês de Referência */}
                  {formReserva.tipoReserva === 'avulsa' ? (
                    <input
                      type="date"
                      value={formReserva.data}
                      onChange={(e) => setFormReserva({...formReserva, data: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="Data da reserva"
                    />
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mês de Referência</label>
                      <input
                        type="month"
                        value={formReserva.mesReferencia}
                        onChange={(e) => setFormReserva({...formReserva, mesReferencia: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        placeholder="Selecione o mês"
                      />
                      <p className="text-xs text-blue-600 mt-1">
                        💡 O período real será calculado a partir da primeira data disponível (30 dias corridos)
                      </p>
                    </div>
                  )}
                  {/* Seleção de Dias da Semana - apenas para reserva mensal */}
                  {formReserva.tipoReserva === 'mensal' && (
                    <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                      <label className="block text-sm font-medium text-green-800 mb-3">Dias da Semana</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { key: 'segunda', label: 'Segunda-feira' },
                          { key: 'terca', label: 'Terça-feira' },
                          { key: 'quarta', label: 'Quarta-feira' },
                          { key: 'quinta', label: 'Quinta-feira' },
                          { key: 'sexta', label: 'Sexta-feira' },
                          { key: 'sabado', label: 'Sábado' },
                          { key: 'domingo', label: 'Domingo' }
                        ].map(dia => (
                          <label key={dia.key} className="flex items-center space-x-2 text-sm">
                            <input
                              type="checkbox"
                              checked={formReserva.diasSemana.includes(dia.key)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormReserva({
                                    ...formReserva, 
                                    diasSemana: [...formReserva.diasSemana, dia.key]
                                  });
                                } else {
                                  setFormReserva({
                                    ...formReserva, 
                                    diasSemana: formReserva.diasSemana.filter(d => d !== dia.key)
                                  });
                                }
                              }}
                              className="w-4 h-4 text-green-600"
                            />
                            <span className="text-green-700">{dia.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

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
                  
                  {/* Prévia do Período Real - Cálculo Inteligente */}
                  {formReserva.tipoReserva === 'mensal' && formReserva.mesReferencia && formReserva.quadraId && formReserva.diasSemana.length > 0 && (
                    <div className="border border-amber-200 rounded-lg p-4 bg-amber-50">
                      <h4 className="text-sm font-medium text-amber-800 mb-3">📅 Prévia do Período de Locação (Cálculo Inteligente)</h4>
                      {(() => {
                        const [ano, mes] = formReserva.mesReferencia.split('-');
                        const diasSemanaMap = {
                          'domingo': 0, 'segunda': 1, 'terca': 2, 'quarta': 3, 
                          'quinta': 4, 'sexta': 5, 'sabado': 6
                        };
                        
                        // Encontrar primeira data disponível no mês selecionado (a partir de hoje)
                        let primeiraDataDisponivel = null;
                        const diasDoMes = new Date(parseInt(ano), parseInt(mes), 0).getDate();
                        const mesNome = new Date(parseInt(ano), parseInt(mes) - 1, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
                        
                        // Data de hoje para não buscar datas passadas
                        const hoje = new Date();
                        hoje.setHours(0, 0, 0, 0);
                        
                        // Buscar do primeiro ao último dia do mês, mas só datas futuras ou de hoje
                        for (let dia = 1; dia <= diasDoMes; dia++) {
                          const dataAtual = new Date(parseInt(ano), parseInt(mes) - 1, dia);
                          const diaSemanaAtual = dataAtual.getDay();
                          
                          // Pular datas que já passaram
                          if (dataAtual < hoje) {
                            continue;
                          }
                          
                          // Verificar se este dia coincide com algum dos dias selecionados
                          const diaCoincide = formReserva.diasSemana.some(diaSelecionado => 
                            diasSemanaMap[diaSelecionado] === diaSemanaAtual
                          );
                          
                          if (diaCoincide) {
                            primeiraDataDisponivel = dataAtual;
                            break; // Encontrou a primeira data disponível, parar busca
                          }
                        }
                        
                        if (primeiraDataDisponivel) {
                          const dataFinal = new Date(primeiraDataDisponivel);
                          dataFinal.setDate(dataFinal.getDate() + 29); // +29 para completar 30 dias total
                          const periodoMensal = `${primeiraDataDisponivel.toLocaleDateString('pt-BR')} a ${dataFinal.toLocaleDateString('pt-BR')}`;
                          
                          return (
                            <div className="space-y-2 text-sm text-amber-700">
                              <div><strong>Mês selecionado:</strong> {mesNome.charAt(0).toUpperCase() + mesNome.slice(1)}</div>
                              <div><strong>Dias escolhidos:</strong> {formReserva.diasSemana.join(', ')}</div>
                              <div className="text-green-700 font-medium bg-green-100 p-2 rounded">
                                <strong>📅 Período real calculado:</strong> {periodoMensal}
                              </div>
                              <div className="text-xs text-amber-600">
                                ✅ Sistema encontrou a primeira data disponível automaticamente<br/>
                                ⏱️ Período de exatos 30 dias corridos a partir da primeira sessão<br/>
                                🔍 Verificação automática de conflitos de horário
                              </div>
                            </div>
                          );
                        } else {
                          return (
                            <div className="text-red-700 text-sm">
                              ❌ Não foi encontrada nenhuma data disponível no mês selecionado para os dias da semana escolhidos.
                            </div>
                          );
                        }
                      })()}
                    </div>
                  )}

                  {/* Cálculo de Valor Mensal */}
                  {formReserva.tipoReserva === 'mensal' && formReserva.valorMensal > 0 && (
                    <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                      <h4 className="text-sm font-medium text-purple-800 mb-3">💰 Valores Calculados (SEM DESCONTO)</h4>
                      <div className="space-y-2 text-sm text-purple-700">
                        <div><strong>Valor total mensal:</strong> R$ {formReserva.valorMensal.toFixed(2)}</div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs text-purple-600 mb-1">Número de Parcelas:</label>
                            <select
                              value={formReserva.numeroParcelas}
                              onChange={(e) => setFormReserva({...formReserva, numeroParcelas: parseInt(e.target.value)})}
                              className="w-full px-2 py-1 border border-purple-300 rounded text-sm"
                            >
                              <option value={1}>1x (à vista)</option>
                              <option value={2}>2x</option>
                              <option value={3}>3x</option>
                              <option value={4}>4x</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-purple-600 mb-1">Valor por Parcela:</label>
                            <div className="px-2 py-1 bg-purple-100 rounded text-sm font-medium">
                              R$ {formReserva.valorParcela?.toFixed(2) || '0.00'}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-purple-600 bg-purple-100 p-2 rounded">
                          📊 Cálculo: {formReserva.diasSemana.length} sessões/semana × 4.33 semanas/mês = aprox. {Math.round(formReserva.diasSemana.length * 4.33)} sessões<br/>
                          💡 Valores aplicados conforme tabela da quadra (manhã/tarde ou noite)
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Cálculo automático para reserva avulsa */}
                  {formReserva.tipoReserva === 'avulsa' && formReserva.quadraId && formReserva.horaInicio && formReserva.horaFim && (
                    <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                      <h4 className="text-sm font-medium text-green-800 mb-3">💰 Cálculo Automático do Valor</h4>
                      {(() => {
                        const quadra = quadras.find(q => q.id === parseInt(formReserva.quadraId));
                        if (!quadra || formReserva.horaInicio >= formReserva.horaFim) {
                          return <div className="text-red-700 text-sm">⚠️ Selecione uma quadra e horários válidos</div>;
                        }
                        
                        const horaInicio = new Date(`2000-01-01T${formReserva.horaInicio}`);
                        const horaFim = new Date(`2000-01-01T${formReserva.horaFim}`);
                        const minutos = (horaFim - horaInicio) / (1000 * 60);
                        const horas = minutos / 60;
                        
                        let valorPorHora, periodo;
                        if (quadra.usarTabelaDiferenciada) {
                          const hora = parseInt(formReserva.horaInicio.split(':')[0]);
                          if (hora >= 6 && hora < 18) {
                            valorPorHora = parseFloat(quadra.valorManha) || 0;
                            periodo = 'Manhã/Tarde (06:00-17:59)';
                          } else if (hora >= 18 && hora < 23) {
                            valorPorHora = parseFloat(quadra.valorNoite) || 0;
                            periodo = 'Noite (18:00-22:59)';
                          } else {
                            valorPorHora = parseFloat(quadra.valorHora) || 0;
                            periodo = 'Horário especial';
                          }
                        } else {
                          valorPorHora = parseFloat(quadra.valorHora) || 0;
                          periodo = 'Valor único';
                        }
                        
                        const valorTotal = horas * valorPorHora;
                        
                        return (
                          <div className="space-y-2 text-sm text-green-700">
                            <div><strong>Quadra:</strong> {quadra.nome}</div>
                            <div><strong>Período:</strong> {periodo}</div>
                            <div><strong>Duração:</strong> {horas} hora{horas !== 1 ? 's' : ''} ({minutos} minutos)</div>
                            <div><strong>Valor por hora:</strong> R$ {valorPorHora.toFixed(2)}</div>
                            <div className="text-green-800 font-bold bg-green-100 p-2 rounded">
                              <strong>💰 Valor Total: R$ {valorTotal.toFixed(2)}</strong>
                            </div>
                            <div className="text-xs text-green-600">
                              ✅ Valor calculado automaticamente conforme tabela da quadra
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Campos de valor - apenas para reserva avulsa ou edição */}
                  {(formReserva.tipoReserva === 'avulsa' || editingItem) && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Valor Total</label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Valor total"
                          value={formReserva.valor}
                          onChange={(e) => setFormReserva({...formReserva, valor: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Valor Pago</label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Valor pago"
                          value={formReserva.valorPago}
                          onChange={(e) => setFormReserva({...formReserva, valorPago: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {/* Valor pago na criação - para reserva mensal */}
                  {formReserva.tipoReserva === 'mensal' && !editingItem && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Valor Pago na Reserva</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formReserva.valorPago}
                        onChange={(e) => setFormReserva({...formReserva, valorPago: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                  )}

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
                      value={formReserva.formaPagamento}
                      onChange={(e) => setFormReserva({...formReserva, formaPagamento: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="">Forma de pagamento</option>
                      <option value="Dinheiro">Dinheiro</option>
                      <option value="PIX">PIX</option>
                      <option value="Cartão">Cartão</option>
                      <option value="Transferência">Transferência</option>
                    </select>
                  </div>
                  <textarea
                    placeholder="Observações"
                    value={formReserva.tipoReserva === 'mensal' ? formReserva.observacoesMensal : formReserva.observacoes}
                    onChange={(e) => {
                      if (formReserva.tipoReserva === 'mensal') {
                        setFormReserva({...formReserva, observacoesMensal: e.target.value});
                      } else {
                        setFormReserva({...formReserva, observacoes: e.target.value});
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-20"
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
                  <input
                    type="text"
                    placeholder="Nome completo"
                    value={formAdmin.nome}
                    onChange={(e) => setFormAdmin({...formAdmin, nome: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Nome de usuário"
                    value={formAdmin.usuario}
                    onChange={(e) => setFormAdmin({...formAdmin, usuario: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <div className="relative">
                    <input
                      type={showAdminPassword ? "text" : "password"}
                      placeholder="Senha"
                      value={formAdmin.senha}
                      onChange={(e) => setFormAdmin({...formAdmin, senha: e.target.value})}
                      className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-md text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700"
                    >
                      {showAdminPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
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
                  </select>
                  <button
                    onClick={adicionarAdmin}
                    className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 text-sm"
                  >
                    {editingItem ? 'Atualizar' : 'Adicionar'}
                  </button>
                </div>
              )}

              {modalType === 'faturamento' && (
                <div className="space-y-4">
                  <input
                    type="date"
                    value={formFaturamento.data}
                    onChange={(e) => setFormFaturamento({...formFaturamento, data: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Nome do cliente"
                    value={formFaturamento.cliente}
                    onChange={(e) => setFormFaturamento({...formFaturamento, cliente: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Mês da locação"
                    value={formFaturamento.mesLocacao}
                    onChange={(e) => setFormFaturamento({...formFaturamento, mesLocacao: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Horário (ex: 18:00-20:00)"
                      value={formFaturamento.hora}
                      onChange={(e) => setFormFaturamento({...formFaturamento, hora: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <select
                      value={formFaturamento.tipoQuadra}
                      onChange={(e) => setFormFaturamento({...formFaturamento, tipoQuadra: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="">Tipo de quadra</option>
                      {quadras.map(quadra => (
                        <option key={quadra.id} value={quadra.nome}>{quadra.nome}</option>
                      ))}
                    </select>
                  </div>
                  <select
                    value={formFaturamento.tipoLocacao}
                    onChange={(e) => setFormFaturamento({...formFaturamento, tipoLocacao: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Tipo de locação</option>
                    <option value="Avulsa">Avulsa</option>
                    <option value="Mensal">Mensal</option>
                    <option value="Trimestral">Trimestral</option>
                    <option value="Anual">Anual</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Recibo de pagamento"
                    value={formFaturamento.reciboPagamento}
                    onChange={(e) => setFormFaturamento({...formFaturamento, reciboPagamento: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <input
                    type="date"
                    placeholder="Data da locação"
                    value={formFaturamento.dataLocacao}
                    onChange={(e) => setFormFaturamento({...formFaturamento, dataLocacao: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Valor total"
                    value={formFaturamento.valor}
                    onChange={(e) => setFormFaturamento({...formFaturamento, valor: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <select
                    value={formFaturamento.formaPagamento}
                    onChange={(e) => setFormFaturamento({...formFaturamento, formaPagamento: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Forma de pagamento</option>
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="PIX">PIX</option>
                    <option value="Cartão">Cartão</option>
                    <option value="Transferência">Transferência</option>
                  </select>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Valor recebido"
                      value={formFaturamento.valorRecebido}
                      onChange={(e) => setFormFaturamento({...formFaturamento, valorRecebido: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Valor real recebido"
                      value={formFaturamento.valorRealRecebido}
                      onChange={(e) => setFormFaturamento({...formFaturamento, valorRealRecebido: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  <textarea
                    placeholder="Observações"
                    value={formFaturamento.observacoes}
                    onChange={(e) => setFormFaturamento({...formFaturamento, observacoes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-20"
                  />
                  <button
                    onClick={adicionarFaturamento}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 text-sm"
                  >
                    {editingItem ? 'Atualizar' : 'Adicionar'}
                  </button>
                </div>
              )}

              {modalType === 'recebimento' && (
                <div className="space-y-4">
                  <select
                    value={formRecebimento.faturamentoId}
                    onChange={(e) => setFormRecebimento({...formRecebimento, faturamentoId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Selecione o item</option>
                    <optgroup label="Faturamentos em Aberto">
                      {faturamentos.filter(f => (f.valorEmAberto || 0) > 0).map(faturamento => (
                        <option key={`fat_${faturamento.id}`} value={`fat_${faturamento.id}`}>
                          {faturamento.cliente} - R$ {(faturamento.valorEmAberto || 0).toFixed(2)} (Faturamento)
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Reservas Pendentes">
                      {reservas.filter(r => {
                        const valorTotal = r.valor || 0;
                        const valorPago = r.valorPago || 0;
                        return Math.max(0, valorTotal - valorPago) > 0;
                      }).map(reserva => {
                        const cliente = clientes.find(c => c.id === reserva.clienteId);
                        const quadra = quadras.find(q => q.id === reserva.quadraId);
                        const valorEmAberto = Math.max(0, (reserva.valor || 0) - (reserva.valorPago || 0));
                        return (
                          <option key={`res_${reserva.id}`} value={`res_${reserva.id}`}>
                            {cliente?.nome} - {quadra?.nome} - R$ {valorEmAberto.toFixed(2)} (Reserva)
                          </option>
                        );
                      })}
                    </optgroup>
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
                    placeholder="Valor recebido"
                    value={formRecebimento.valor}
                    onChange={(e) => setFormRecebimento({...formRecebimento, valor: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <select
                    value={formRecebimento.formaPagamento}
                    onChange={(e) => setFormRecebimento({...formRecebimento, formaPagamento: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Forma de pagamento</option>
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="PIX">PIX</option>
                    <option value="Cartão">Cartão</option>
                    <option value="Transferência">Transferência</option>
                  </select>
                  <textarea
                    placeholder="Observações"
                    value={formRecebimento.observacoes}
                    onChange={(e) => setFormRecebimento({...formRecebimento, observacoes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-20"
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