// <stdin>
import React, { useState, useEffect } from "https://esm.sh/react@18.2.0";
import { Calendar, Clock, Users, DollarSign, Plus, Edit, Trash2, Save, X, Search, Filter, Menu, Home, CalendarDays, Building, UserCheck, Printer, LogOut, Shield, Eye, EyeOff, Settings, CreditCard, TrendingUp, AlertCircle, CheckCircle, FileText, BarChart3, PieChart } from "https://esm.sh/lucide-react?deps=react@18.2.0,react-dom@18.2.0";
var QuadraManagementSystem = () => {
  const { useStoredState } = hatch;
  const [isAuthenticated, setIsAuthenticated] = useStoredState("isAuthenticated", false);
  const [usuarioLogado, setUsuarioLogado] = useStoredState("usuarioLogado", null);
  const [showLogin, setShowLogin] = useState(true);
  const [loginForm, setLoginForm] = useState({ usuario: "", senha: "" });
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [usuariosAdmin, setUsuariosAdmin] = useStoredState("usuariosAdmin", [
    { id: 1, usuario: "admin", senha: "jurema2025", nome: "Administrador", cargo: "Administrador Geral" },
    { id: 2, usuario: "gerente", senha: "gestao123", nome: "Gerente", cargo: "Gerente de Opera\xE7\xF5es" },
    { id: 3, usuario: "secretario", senha: "quadras456", nome: "Secret\xE1rio", cargo: "Secret\xE1rio do Clube" }
  ]);
  const [quadras, setQuadras] = useStoredState("quadras", [
    { id: 1, nome: "Campo de Futebol 1", modalidade: "Campo de Futebol", valorHora: 100, ativa: true },
    { id: 2, nome: "Quadra de Futsal 1", modalidade: "Quadra de Futsal", valorHora: 80, ativa: true }
  ]);
  const [clientes, setClientes] = useStoredState("clientes", [
    { id: 1, nome: "Jo\xE3o Silva", telefone: "(11) 99999-9999", email: "joao@email.com" },
    { id: 2, nome: "Maria Santos", telefone: "(11) 88888-8888", email: "maria@email.com" }
  ]);
  const [reservas, setReservas] = useStoredState("reservas", []);
  const [faturamentos, setFaturamentos] = useStoredState("faturamentos", []);
  const [recebimentos, setRecebimentos] = useStoredState("recebimentos", []);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroData, setFiltroData] = useState("");
  const [mesImpressao, setMesImpressao] = useState((/* @__PURE__ */ new Date()).toISOString().slice(0, 7));
  const [quadraImpressao, setQuadraImpressao] = useState("");
  const [semanaImpressao, setSemanaImpressao] = useState((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [tipoRelatorio, setTipoRelatorio] = useState("financeiro-mensal");
  const [dataRelatorio, setDataRelatorio] = useState((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
  const [periodoRelatorio, setPeriodoRelatorio] = useState("mensal");
  const [anoRelatorio, setAnoRelatorio] = useState((/* @__PURE__ */ new Date()).getFullYear().toString());
  const [formQuadra, setFormQuadra] = useState({ nome: "", modalidade: "", valorHora: "", ativa: true });
  const [formCliente, setFormCliente] = useState({ nome: "", telefone: "", email: "" });
  const [formReserva, setFormReserva] = useState({
    quadraId: "",
    clienteId: "",
    data: "",
    horaInicio: "",
    horaFim: "",
    valor: "",
    status: "Confirmada",
    statusPagamento: "Pendente",
    valorPago: "",
    formaPagamento: "",
    dataPagamento: "",
    observacoes: "",
    // Campos para reserva mensal
    tipoReserva: "avulsa",
    // 'avulsa' ou 'mensal'
    mesReferencia: "",
    diasSemana: [],
    // array com dias da semana selecionados
    valorMensal: 0,
    numeroParcelas: 1,
    valorParcela: 0,
    dataVencimentoPrimeiraParcela: "",
    observacoesMensal: ""
  });
  const [formAdmin, setFormAdmin] = useState({ nome: "", usuario: "", senha: "", cargo: "" });
  const [formFaturamento, setFormFaturamento] = useState({
    data: "",
    cliente: "",
    mesLocacao: "",
    hora: "",
    tipoQuadra: "",
    tipoLocacao: "",
    reciboPagamento: "",
    dataLocacao: "",
    valor: "",
    formaPagamento: "",
    valorRecebido: "",
    valorEmAberto: "",
    valorRealRecebido: "",
    observacoes: ""
  });
  const [formRecebimento, setFormRecebimento] = useState({
    faturamentoId: "",
    data: "",
    valor: "",
    formaPagamento: "",
    observacoes: ""
  });
  const adicionarQuadra = () => {
    if (editingItem) {
      setQuadras(quadras.map(
        (q) => q.id === editingItem.id ? { ...formQuadra, id: editingItem.id, valorHora: parseFloat(formQuadra.valorHora) } : q
      ));
      registrarAtividade("QUADRA_EDITADA", `Quadra "${formQuadra.nome}" editada`);
    } else {
      const novaQuadra = {
        id: Date.now(),
        ...formQuadra,
        valorHora: parseFloat(formQuadra.valorHora)
      };
      setQuadras([...quadras, novaQuadra]);
      registrarAtividade("QUADRA_CRIADA", `Nova quadra "${formQuadra.nome}" criada`);
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
    setModalType("quadra");
    setShowModal(true);
  };
  const excluirQuadra = (id) => {
    const quadra = quadras.find((q) => q.id === id);
    if (confirm("Tem certeza que deseja excluir esta quadra?")) {
      setQuadras(quadras.filter((q) => q.id !== id));
      registrarAtividade("QUADRA_EXCLUIDA", `Quadra "${quadra?.nome}" exclu\xEDda`);
    }
  };
  const adicionarFaturamento = () => {
    const valorTotal = parseFloat(formFaturamento.valor) || 0;
    const valorRecebido = parseFloat(formFaturamento.valorRecebido) || 0;
    const valorEmAberto = valorTotal - valorRecebido;
    if (editingItem) {
      setFaturamentos(faturamentos.map(
        (f) => f.id === editingItem.id ? {
          ...formFaturamento,
          id: editingItem.id,
          valor: valorTotal,
          valorRecebido,
          valorEmAberto,
          valorRealRecebido: parseFloat(formFaturamento.valorRealRecebido) || valorRecebido,
          usuarioEdicao: usuarioLogado?.nome || "Sistema",
          dataEdicao: (/* @__PURE__ */ new Date()).toISOString()
        } : f
      ));
    } else {
      const novoFaturamento = {
        id: Date.now(),
        ...formFaturamento,
        valor: valorTotal,
        valorRecebido,
        valorEmAberto,
        valorRealRecebido: parseFloat(formFaturamento.valorRealRecebido) || valorRecebido,
        status: valorEmAberto > 0 ? "Em Aberto" : "Pago",
        usuarioResponsavel: usuarioLogado?.nome || "Sistema",
        dataLancamento: (/* @__PURE__ */ new Date()).toISOString()
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
      observacoes: faturamento.observacoes || ""
    });
    setModalType("faturamento");
    setShowModal(true);
  };
  const excluirFaturamento = (id) => {
    if (confirm("Tem certeza que deseja excluir este faturamento?")) {
      setFaturamentos(faturamentos.filter((f) => f.id !== id));
      setRecebimentos(recebimentos.filter((r) => r.faturamentoId !== id));
    }
  };
  const adicionarRecebimento = () => {
    const tipoId = formRecebimento.faturamentoId;
    const [tipo, idStr] = tipoId.split("_");
    const id = parseInt(idStr);
    const valorRecebimento = parseFloat(formRecebimento.valor);
    const novoRecebimento = {
      id: Date.now(),
      ...formRecebimento,
      faturamentoId: tipo === "fat" ? id : null,
      reservaId: tipo === "res" ? id : null,
      tipoItem: tipo === "fat" ? "faturamento" : "reserva",
      valor: valorRecebimento,
      usuarioResponsavel: usuarioLogado?.nome || "Sistema",
      dataLancamento: (/* @__PURE__ */ new Date()).toISOString()
    };
    setRecebimentos([...recebimentos, novoRecebimento]);
    if (tipo === "fat") {
      setFaturamentos(faturamentos.map((f) => {
        if (f.id === id) {
          const novoValorRecebido = f.valorRealRecebido + valorRecebimento;
          const novoValorEmAberto = f.valor - novoValorRecebido;
          return {
            ...f,
            valorRealRecebido: novoValorRecebido,
            valorEmAberto: Math.max(0, novoValorEmAberto),
            status: novoValorEmAberto <= 0 ? "Pago" : "Em Aberto",
            ultimoRecebimento: {
              usuario: usuarioLogado?.nome || "Sistema",
              data: (/* @__PURE__ */ new Date()).toISOString()
            }
          };
        }
        return f;
      }));
    } else {
      setReservas(reservas.map((r) => {
        if (r.id === id) {
          const valorAtual = r.valorPago || 0;
          const novoValorPago = valorAtual + valorRecebimento;
          const valorTotal = r.valor || 0;
          let novoStatusPagamento = "Pendente";
          if (novoValorPago >= valorTotal) {
            novoStatusPagamento = "Pago";
          } else if (novoValorPago > 0) {
            novoStatusPagamento = "Parcial";
          }
          return {
            ...r,
            valorPago: novoValorPago,
            statusPagamento: novoStatusPagamento,
            formaPagamento: formRecebimento.formaPagamento,
            dataPagamento: formRecebimento.data,
            ultimoRecebimento: {
              usuario: usuarioLogado?.nome || "Sistema",
              data: (/* @__PURE__ */ new Date()).toISOString(),
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
    const recebimento = recebimentos.find((r) => r.id === id);
    if (recebimento && confirm("Tem certeza que deseja excluir este recebimento?")) {
      setRecebimentos(recebimentos.filter((r) => r.id !== id));
      if (recebimento.tipoItem === "faturamento" && recebimento.faturamentoId) {
        setFaturamentos(faturamentos.map((f) => {
          if (f.id === recebimento.faturamentoId) {
            const novoValorRecebido = f.valorRealRecebido - recebimento.valor;
            const novoValorEmAberto = f.valor - novoValorRecebido;
            return {
              ...f,
              valorRealRecebido: Math.max(0, novoValorRecebido),
              valorEmAberto: novoValorEmAberto,
              status: novoValorEmAberto > 0 ? "Em Aberto" : "Pago"
            };
          }
          return f;
        }));
      } else if (recebimento.tipoItem === "reserva" && recebimento.reservaId) {
        setReservas(reservas.map((r) => {
          if (r.id === recebimento.reservaId) {
            const valorAtual = r.valorPago || 0;
            const novoValorPago = Math.max(0, valorAtual - recebimento.valor);
            const valorTotal = r.valor || 0;
            let novoStatusPagamento = "Pendente";
            if (novoValorPago >= valorTotal) {
              novoStatusPagamento = "Pago";
            } else if (novoValorPago > 0) {
              novoStatusPagamento = "Parcial";
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
  const adicionarCliente = () => {
    if (editingItem) {
      setClientes(clientes.map(
        (c) => c.id === editingItem.id ? { ...formCliente, id: editingItem.id } : c
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
    setModalType("cliente");
    setShowModal(true);
  };
  const excluirCliente = (id) => {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      setClientes(clientes.filter((c) => c.id !== id));
    }
  };
  const calcularValorMensal = () => {
    if (!formReserva.quadraId || !formReserva.horaInicio || !formReserva.horaFim || formReserva.diasSemana.length === 0) {
      return 0;
    }
    const quadra = quadras.find((q) => q.id === parseInt(formReserva.quadraId));
    if (!quadra) return 0;
    const horaInicio = /* @__PURE__ */ new Date(`2000-01-01T${formReserva.horaInicio}`);
    const horaFim = /* @__PURE__ */ new Date(`2000-01-01T${formReserva.horaFim}`);
    const minutos = (horaFim - horaInicio) / (1e3 * 60);
    const horas = minutos / 60;
    const valorSessao = horas * quadra.valorHora;
    const sessoesPorSemana = formReserva.diasSemana.length;
    const sessoesPorMes = Math.round(sessoesPorSemana * 4.33);
    const valorMensal = valorSessao * sessoesPorMes;
    const valorComDesconto = valorMensal * 0.9;
    return valorComDesconto;
  };
  const calcularParcelas = (valorTotal, numeroParcelas) => {
    if (numeroParcelas <= 0) return 0;
    return valorTotal / numeroParcelas;
  };
  const gerarReservasMensais = (dadosReserva) => {
    const reservasGeradas = [];
    const [ano, mes] = dadosReserva.mesReferencia.split("-");
    const diasDoMes = new Date(parseInt(ano), parseInt(mes), 0).getDate();
    const diasSemanaMap = {
      "domingo": 0,
      "segunda": 1,
      "terca": 2,
      "quarta": 3,
      "quinta": 4,
      "sexta": 5,
      "sabado": 6
    };
    for (let dia = 1; dia <= diasDoMes; dia++) {
      const dataAtual = new Date(parseInt(ano), parseInt(mes) - 1, dia);
      const diaSemanaAtual = dataAtual.getDay();
      const diaCoincide = dadosReserva.diasSemana.some(
        (diaSelecionado) => diasSemanaMap[diaSelecionado] === diaSemanaAtual
      );
      if (diaCoincide) {
        const dataFormatada = dataAtual.toISOString().split("T")[0];
        const conflito = reservas.some(
          (r) => r.data === dataFormatada && r.quadraId === dadosReserva.quadraId && (r.horaInicio < dadosReserva.horaFim && r.horaFim > dadosReserva.horaInicio)
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
            status: dadosReserva.status,
            statusPagamento: "Pendente",
            valorPago: 0,
            tipoReserva: "mensal",
            mesReferencia: dadosReserva.mesReferencia,
            reservaMensalId: dadosReserva.reservaMensalId,
            observacoes: `Reserva mensal - ${dadosReserva.mesReferencia}. ${dadosReserva.observacoes || ""}`,
            usuarioResponsavel: usuarioLogado?.nome || "Sistema",
            dataLancamento: (/* @__PURE__ */ new Date()).toISOString()
          });
        }
      }
    }
    return reservasGeradas;
  };
  const adicionarReserva = () => {
    const quadra = quadras.find((q) => q.id === parseInt(formReserva.quadraId));
    if (!quadra) {
      alert("Selecione uma quadra v\xE1lida!");
      return;
    }
    if (formReserva.tipoReserva === "mensal") {
      if (!formReserva.mesReferencia || !formReserva.horaInicio || !formReserva.horaFim || !formReserva.clienteId || formReserva.diasSemana.length === 0) {
        alert("Para reserva mensal, preencha: m\xEAs de refer\xEAncia, hor\xE1rios, cliente e pelo menos um dia da semana!");
        return;
      }
    } else {
      if (!formReserva.data || !formReserva.horaInicio || !formReserva.horaFim || !formReserva.clienteId) {
        alert("Preencha todos os campos obrigat\xF3rios!");
        return;
      }
    }
    const reservasNoDia = reservas.filter(
      (r) => r.data === formReserva.data && r.quadraId === parseInt(formReserva.quadraId) && (!editingItem || r.id !== editingItem.id)
      // Excluir reserva atual se estiver editando
    );
    if (reservasNoDia.length >= 6) {
      alert(`Esta quadra j\xE1 possui o limite m\xE1ximo de 6 reservas para o dia ${formReserva.data}. Escolha outra data.`);
      return;
    }
    if (formReserva.horaInicio >= formReserva.horaFim) {
      alert("A hora de fim deve ser posterior \xE0 hora de in\xEDcio!");
      return;
    }
    const adicionarMinutos = (horario, minutos2) => {
      const [horas2, mins] = horario.split(":").map(Number);
      const totalMinutos = horas2 * 60 + mins + minutos2;
      const novasHoras = Math.floor(totalMinutos / 60);
      const novosMinutos = totalMinutos % 60;
      return `${novasHoras.toString().padStart(2, "0")}:${novosMinutos.toString().padStart(2, "0")}`;
    };
    const novaHoraInicio = formReserva.horaInicio;
    const novaHoraFim = formReserva.horaFim;
    const temConflito = reservasNoDia.some((reserva) => {
      const reservaInicio = reserva.horaInicio;
      const reservaFim = reserva.horaFim;
      const reservaFimMais5min = adicionarMinutos(reservaFim, 5);
      const novaFimMais5min = adicionarMinutos(novaHoraFim, 5);
      return novaHoraInicio < reservaFimMais5min && novaHoraFim > reservaInicio || reservaInicio < novaFimMais5min && reservaFim > novaHoraInicio;
    });
    if (temConflito) {
      alert(`Conflito de hor\xE1rio! Deve haver um intervalo m\xEDnimo de 5 minutos entre as reservas na quadra ${quadra.nome} no dia ${formReserva.data}.`);
      return;
    }
    const horaInicio = /* @__PURE__ */ new Date(`${formReserva.data}T${formReserva.horaInicio}`);
    const horaFim = /* @__PURE__ */ new Date(`${formReserva.data}T${formReserva.horaFim}`);
    const minutos = (horaFim - horaInicio) / (1e3 * 60);
    const horas = minutos / 60;
    const valorCalculado = horas * quadra.valorHora;
    if (editingItem) {
      setReservas(reservas.map(
        (r) => r.id === editingItem.id ? {
          ...formReserva,
          id: editingItem.id,
          quadraId: parseInt(formReserva.quadraId),
          clienteId: parseInt(formReserva.clienteId),
          valor: parseFloat(formReserva.valor) || valorCalculado,
          valorPago: parseFloat(formReserva.valorPago) || 0,
          usuarioEdicao: usuarioLogado?.nome || "Sistema",
          dataEdicao: (/* @__PURE__ */ new Date()).toISOString()
        } : r
      ));
      registrarAtividade("RESERVA_EDITADA", `Reserva editada - ${quadra.nome} em ${formReserva.data}`);
    } else {
      if (formReserva.tipoReserva === "mensal") {
        const valorMensal = calcularValorMensal();
        const valorParcela = calcularParcelas(valorMensal, formReserva.numeroParcelas);
        const valorPorSessao = valorMensal / (formReserva.diasSemana.length * 4.33);
        const reservaMensalId = `mensal_${Date.now()}`;
        const faturamentoMensal = {
          id: Date.now(),
          data: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          cliente: clientes.find((c) => c.id === parseInt(formReserva.clienteId))?.nome || "Cliente",
          mesLocacao: formReserva.mesReferencia,
          hora: `${formReserva.horaInicio}-${formReserva.horaFim}`,
          tipoQuadra: quadra.nome,
          tipoLocacao: "Mensal",
          reciboPagamento: `MENSAL-${reservaMensalId}`,
          dataLocacao: formReserva.mesReferencia,
          valor: valorMensal,
          formaPagamento: formReserva.formaPagamento || "",
          valorRecebido: parseFloat(formReserva.valorPago) || 0,
          valorEmAberto: valorMensal - (parseFloat(formReserva.valorPago) || 0),
          valorRealRecebido: parseFloat(formReserva.valorPago) || 0,
          status: (parseFloat(formReserva.valorPago) || 0) >= valorMensal ? "Pago" : "Em Aberto",
          usuarioResponsavel: usuarioLogado?.nome || "Sistema",
          dataLancamento: (/* @__PURE__ */ new Date()).toISOString(),
          reservaMensalId,
          numeroParcelas: formReserva.numeroParcelas,
          valorParcela,
          diasSemana: formReserva.diasSemana,
          observacoes: `Reserva mensal - ${formReserva.diasSemana.join(", ")}. Parcelas: ${formReserva.numeroParcelas}x R$ ${valorParcela.toFixed(2)}. ${formReserva.observacoesMensal || ""}`
        };
        const reservasIndividuais = gerarReservasMensais({
          ...formReserva,
          quadraId: parseInt(formReserva.quadraId),
          clienteId: parseInt(formReserva.clienteId),
          valorPorSessao,
          reservaMensalId
        });
        setFaturamentos([...faturamentos, faturamentoMensal]);
        setReservas([...reservas, ...reservasIndividuais]);
        registrarAtividade(
          "RESERVA_MENSAL_CRIADA",
          `Nova reserva mensal - ${quadra.nome} - ${formReserva.mesReferencia} - ${reservasIndividuais.length} sess\xF5es geradas`
        );
        alert(
          `\u2705 Reserva mensal criada com sucesso!

\u{1F4CA} Resumo:
\u2022 Quadra: ${quadra.nome}
\u2022 M\xEAs: ${formReserva.mesReferencia}
\u2022 Dias: ${formReserva.diasSemana.join(", ")}
\u2022 Hor\xE1rio: ${formReserva.horaInicio} - ${formReserva.horaFim}
\u2022 Valor total: R$ ${valorMensal.toFixed(2)}
\u2022 Parcelas: ${formReserva.numeroParcelas}x R$ ${valorParcela.toFixed(2)}
\u2022 Sess\xF5es geradas: ${reservasIndividuais.length}
\u2022 Desconto aplicado: 10%`
        );
      } else {
        const novaReserva = {
          id: Date.now(),
          ...formReserva,
          quadraId: parseInt(formReserva.quadraId),
          clienteId: parseInt(formReserva.clienteId),
          valor: parseFloat(formReserva.valor) || valorCalculado,
          valorPago: parseFloat(formReserva.valorPago) || 0,
          tipoReserva: "avulsa",
          usuarioResponsavel: usuarioLogado?.nome || "Sistema",
          dataLancamento: (/* @__PURE__ */ new Date()).toISOString()
        };
        setReservas([...reservas, novaReserva]);
        registrarAtividade("RESERVA_CRIADA", `Nova reserva - ${quadra.nome} em ${formReserva.data}`);
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
      statusPagamento: reserva.statusPagamento || "Pendente",
      valorPago: (reserva.valorPago || 0).toString(),
      formaPagamento: reserva.formaPagamento || "",
      dataPagamento: reserva.dataPagamento || "",
      observacoes: reserva.observacoes || ""
    });
    setModalType("reserva");
    setShowModal(true);
  };
  const excluirReserva = (id) => {
    if (confirm("Tem certeza que deseja excluir esta reserva?")) {
      setReservas(reservas.filter((r) => r.id !== id));
    }
  };
  const adicionarAdmin = () => {
    const usuarioExiste = usuariosAdmin.find((u) => u.usuario === formAdmin.usuario && (!editingItem || u.id !== editingItem.id));
    if (usuarioExiste) {
      alert("Este nome de usu\xE1rio j\xE1 existe!");
      return;
    }
    if (editingItem) {
      setUsuariosAdmin(usuariosAdmin.map(
        (u) => u.id === editingItem.id ? { ...formAdmin, id: editingItem.id } : u
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
    setModalType("admin");
    setShowModal(true);
  };
  const excluirAdmin = (id) => {
    if (usuariosAdmin.length <= 1) {
      alert("N\xE3o \xE9 poss\xEDvel excluir o \xFAltimo administrador!");
      return;
    }
    if (confirm("Tem certeza que deseja excluir este administrador?")) {
      setUsuariosAdmin(usuariosAdmin.filter((u) => u.id !== id));
    }
  };
  useEffect(() => {
    if (isAuthenticated && usuarioLogado && usuariosAdmin.find((u) => u.id === usuarioLogado.id)) {
      setShowLogin(false);
    } else {
      setIsAuthenticated(false);
      setUsuarioLogado(null);
      setShowLogin(true);
    }
  }, [isAuthenticated, usuarioLogado, usuariosAdmin]);
  const handleLogin = (e) => {
    e.preventDefault();
    const usuario = usuariosAdmin.find(
      (u) => u.usuario === loginForm.usuario && u.senha === loginForm.senha
    );
    if (usuario) {
      setIsAuthenticated(true);
      setUsuarioLogado(usuario);
      setShowLogin(false);
      setLoginError("");
      setLoginForm({ usuario: "", senha: "" });
    } else {
      setLoginError("Usu\xE1rio ou senha incorretos");
    }
  };
  const handleLogout = () => {
    registrarAtividade("LOGOUT", `Usu\xE1rio ${usuarioLogado?.nome} fez logout`);
    setIsAuthenticated(false);
    setUsuarioLogado(null);
    setShowLogin(true);
    setActiveTab("dashboard");
    setLoginForm({ usuario: "", senha: "" });
    setLoginError("");
  };
  const fecharModal = () => {
    setShowModal(false);
    setModalType("");
    setEditingItem(null);
    setFormQuadra({ nome: "", modalidade: "", valorHora: "", ativa: true });
    setFormCliente({ nome: "", telefone: "", email: "" });
    setFormReserva({
      quadraId: "",
      clienteId: "",
      data: "",
      horaInicio: "",
      horaFim: "",
      valor: "",
      status: "Confirmada",
      statusPagamento: "Pendente",
      valorPago: "",
      formaPagamento: "",
      dataPagamento: "",
      observacoes: "",
      // Campos para reserva mensal
      tipoReserva: "avulsa",
      mesReferencia: "",
      diasSemana: [],
      valorMensal: 0,
      numeroParcelas: 1,
      valorParcela: 0,
      dataVencimentoPrimeiraParcela: "",
      observacoesMensal: ""
    });
    setFormAdmin({ nome: "", usuario: "", senha: "", cargo: "" });
    setFormFaturamento({
      data: "",
      cliente: "",
      mesLocacao: "",
      hora: "",
      tipoQuadra: "",
      tipoLocacao: "",
      reciboPagamento: "",
      dataLocacao: "",
      valor: "",
      formaPagamento: "",
      valorRecebido: "",
      valorEmAberto: "",
      valorRealRecebido: "",
      observacoes: ""
    });
    setFormRecebimento({
      faturamentoId: "",
      data: "",
      valor: "",
      formaPagamento: "",
      observacoes: ""
    });
  };
  const [backupLogs, setBackupLogs] = useStoredState("backupLogs", []);
  const [ultimoBackup, setUltimoBackup] = useStoredState("ultimoBackup", null);
  const [configuracaoBackup, setConfiguracaoBackup] = useStoredState("configuracaoBackup", {
    autoBackup: true,
    intervaloDias: 1,
    manterHistorico: 30,
    // dias
    incluirLogs: true,
    compactarDados: true
  });
  const gerarBackup = (tipoBackup = "manual") => {
    try {
      const timestamp = (/* @__PURE__ */ new Date()).toISOString();
      const dataBackup = (/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR");
      const horaBackup = (/* @__PURE__ */ new Date()).toLocaleTimeString("pt-BR");
      const dadosBackup = {
        timestamp,
        versaoSistema: "2.1.0",
        tipoBackup,
        usuario: usuarioLogado?.nome || "Sistema",
        dados: {
          quadras,
          clientes,
          reservas,
          faturamentos,
          recebimentos,
          usuariosAdmin: usuariosAdmin.map((u) => ({ ...u, senha: "***PROTEGIDA***" })),
          // Senhas protegidas
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
          validacao: "OK"
        }
      };
      const logBackup = {
        id: Date.now(),
        data: dataBackup,
        hora: horaBackup,
        timestamp,
        tipo: tipoBackup,
        usuario: usuarioLogado?.nome || "Sistema",
        status: "Sucesso",
        tamanho: JSON.stringify(dadosBackup).length,
        registros: dadosBackup.estatisticas.totalQuadras + dadosBackup.estatisticas.totalClientes + dadosBackup.estatisticas.totalReservas + dadosBackup.estatisticas.totalFaturamentos,
        observacoes: `Backup ${tipoBackup} executado com sucesso`
      };
      const chaveBackup = `backup_${timestamp.replace(/[:.]/g, "_")}`;
      localStorage.setItem(chaveBackup, JSON.stringify(dadosBackup));
      const novosLogs = [...backupLogs, logBackup];
      setBackupLogs(novosLogs);
      setUltimoBackup(timestamp);
      limparBackupsAntigos();
      alert(`\u2705 Backup realizado com sucesso!
Data: ${dataBackup} \xE0s ${horaBackup}
Tipo: ${tipoBackup.toUpperCase()}
Registros: ${logBackup.registros}`);
      return { sucesso: true, backup: dadosBackup, log: logBackup };
    } catch (error) {
      console.error("Erro ao gerar backup:", error);
      const logErro = {
        id: Date.now(),
        data: (/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR"),
        hora: (/* @__PURE__ */ new Date()).toLocaleTimeString("pt-BR"),
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        tipo: tipoBackup,
        usuario: usuarioLogado?.nome || "Sistema",
        status: "Erro",
        tamanho: 0,
        registros: 0,
        observacoes: `Erro no backup: ${error.message}`
      };
      setBackupLogs([...backupLogs, logErro]);
      alert(`\u274C Erro ao realizar backup!
Detalhes: ${error.message}`);
      return { sucesso: false, erro: error.message };
    }
  };
  const restaurarBackup = (chaveBackup) => {
    try {
      const dadosBackup = localStorage.getItem(chaveBackup);
      if (!dadosBackup) {
        throw new Error("Backup n\xE3o encontrado");
      }
      const backup = JSON.parse(dadosBackup);
      const confirmacao = confirm(
        `\u26A0\uFE0F ATEN\xC7\xC3O: RESTAURA\xC7\xC3O DE BACKUP

Esta opera\xE7\xE3o ir\xE1 substituir TODOS os dados atuais!

Backup de: ${new Date(backup.timestamp).toLocaleString("pt-BR")}
Tipo: ${backup.tipoBackup.toUpperCase()}
Usu\xE1rio: ${backup.usuario}
Registros: ${Object.values(backup.estatisticas).reduce((a, b) => typeof b === "number" ? a + b : a, 0)}

Deseja prosseguir com a restaura\xE7\xE3o?`
      );
      if (!confirmacao) return;
      if (backup.dados.quadras) setQuadras(backup.dados.quadras);
      if (backup.dados.clientes) setClientes(backup.dados.clientes);
      if (backup.dados.reservas) setReservas(backup.dados.reservas);
      if (backup.dados.faturamentos) setFaturamentos(backup.dados.faturamentos);
      if (backup.dados.recebimentos) setRecebimentos(backup.dados.recebimentos);
      const logRestauracao = {
        id: Date.now(),
        data: (/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR"),
        hora: (/* @__PURE__ */ new Date()).toLocaleTimeString("pt-BR"),
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        tipo: "restauracao",
        usuario: usuarioLogado?.nome || "Sistema",
        status: "Sucesso",
        tamanho: backup.tamanho || 0,
        registros: Object.values(backup.estatisticas).reduce((a, b) => typeof b === "number" ? a + b : a, 0),
        observacoes: `Dados restaurados do backup de ${new Date(backup.timestamp).toLocaleString("pt-BR")}`
      };
      setBackupLogs([...backupLogs, logRestauracao]);
      alert(`\u2705 Restaura\xE7\xE3o conclu\xEDda com sucesso!
Dados restaurados do backup de ${new Date(backup.timestamp).toLocaleString("pt-BR")}`);
    } catch (error) {
      console.error("Erro na restaura\xE7\xE3o:", error);
      alert(`\u274C Erro na restaura\xE7\xE3o!
Detalhes: ${error.message}`);
    }
  };
  const limparBackupsAntigos = () => {
    try {
      const diasManter = configuracaoBackup.manterHistorico;
      const dataLimite = /* @__PURE__ */ new Date();
      dataLimite.setDate(dataLimite.getDate() - diasManter);
      const chaves = Object.keys(localStorage);
      const chavesBackup = chaves.filter((chave) => chave.startsWith("backup_"));
      let removidos = 0;
      chavesBackup.forEach((chave) => {
        try {
          const timestampStr = chave.replace("backup_", "").replace(/_/g, ":");
          const dataBackup = new Date(timestampStr);
          if (dataBackup < dataLimite) {
            localStorage.removeItem(chave);
            removidos++;
          }
        } catch (e) {
          localStorage.removeItem(chave);
          removidos++;
        }
      });
      console.log(`Backups antigos removidos: ${removidos}`);
    } catch (error) {
      console.error("Erro ao limpar backups antigos:", error);
    }
  };
  const listarBackups = () => {
    const chaves = Object.keys(localStorage);
    const chavesBackup = chaves.filter((chave) => chave.startsWith("backup_"));
    return chavesBackup.map((chave) => {
      try {
        const dados = JSON.parse(localStorage.getItem(chave));
        return {
          chave,
          timestamp: dados.timestamp,
          data: new Date(dados.timestamp).toLocaleDateString("pt-BR"),
          hora: new Date(dados.timestamp).toLocaleTimeString("pt-BR"),
          tipo: dados.tipoBackup,
          usuario: dados.usuario,
          registros: Object.values(dados.estatisticas).reduce((a, b) => typeof b === "number" ? a + b : a, 0),
          tamanho: (JSON.stringify(dados).length / 1024).toFixed(2) + " KB"
        };
      } catch (e) {
        return null;
      }
    }).filter((backup) => backup !== null).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };
  useEffect(() => {
    if (formReserva.tipoReserva === "mensal" && formReserva.quadraId && formReserva.horaInicio && formReserva.horaFim && formReserva.diasSemana.length > 0) {
      const valorMensal = calcularValorMensal();
      const valorParcela = calcularParcelas(valorMensal, formReserva.numeroParcelas);
      setFormReserva((prev) => ({
        ...prev,
        valorMensal,
        valorParcela
      }));
    }
  }, [formReserva.quadraId, formReserva.horaInicio, formReserva.horaFim, formReserva.diasSemana, formReserva.numeroParcelas, formReserva.tipoReserva]);
  useEffect(() => {
    if (!configuracaoBackup.autoBackup) return;
    const verificarBackupAutomatico = () => {
      const agora = /* @__PURE__ */ new Date();
      const hoje2 = agora.toDateString();
      const ultimoBackupData = ultimoBackup ? new Date(ultimoBackup).toDateString() : null;
      if (ultimoBackupData !== hoje2 && agora.getHours() >= 23) {
        gerarBackup("automatico");
      }
    };
    const interval = setInterval(verificarBackupAutomatico, 60 * 60 * 1e3);
    verificarBackupAutomatico();
    return () => clearInterval(interval);
  }, [ultimoBackup, configuracaoBackup.autoBackup]);
  const registrarAtividade = (acao, detalhes = "") => {
    const logAtividade = {
      id: Date.now(),
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      data: (/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR"),
      hora: (/* @__PURE__ */ new Date()).toLocaleTimeString("pt-BR"),
      usuario: usuarioLogado?.nome || "Sistema",
      acao,
      detalhes,
      ip: "Local",
      // Em produção, capturar IP real
      dispositivo: navigator.userAgent.substring(0, 50) + "..."
    };
    const logsAtividade = JSON.parse(localStorage.getItem("logs_atividade") || "[]");
    logsAtividade.push(logAtividade);
    if (logsAtividade.length > 1e3) {
      logsAtividade.splice(0, logsAtividade.length - 1e3);
    }
    localStorage.setItem("logs_atividade", JSON.stringify(logsAtividade));
  };
  useEffect(() => {
    if (isAuthenticated && usuarioLogado) {
      registrarAtividade("LOGIN", `Usu\xE1rio ${usuarioLogado.nome} fez login`);
    }
  }, [isAuthenticated, usuarioLogado]);
  const imprimirRelatorio = () => {
    const elementsToHide = document.querySelectorAll("nav, button, .fixed, .sticky, .md\\:hidden, .hover\\:bg-green-700");
    const originalDisplays = [];
    elementsToHide.forEach((el, index) => {
      originalDisplays[index] = el.style.display;
      el.style.display = "none";
    });
    document.body.classList.add("printing");
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        elementsToHide.forEach((el, index) => {
          el.style.display = originalDisplays[index];
        });
        document.body.classList.remove("printing");
      }, 1e3);
    }, 100);
  };
  const hoje = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const reservasHoje = reservas.filter((r) => r.data === hoje);
  const receitaMensal = reservas.filter((r) => r.data.startsWith((/* @__PURE__ */ new Date()).toISOString().slice(0, 7))).reduce((acc, r) => acc + r.valor, 0);
  const reservasFiltradas = reservas.filter((reserva) => {
    const quadra = quadras.find((q) => q.id === reserva.quadraId);
    const cliente = clientes.find((c) => c.id === reserva.clienteId);
    const matchSearch = !searchTerm || quadra?.nome.toLowerCase().includes(searchTerm.toLowerCase()) || cliente?.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchData = !filtroData || reserva.data === filtroData;
    return matchSearch && matchData;
  });
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
    dashboard: "Painel",
    reservas: "Reservas",
    quadras: "Quadras",
    clientes: "Clientes",
    financeiro: "Financeiro",
    relatorios: "Relat\xF3rios",
    admin: "ADM",
    sistema: "Sistema"
  };
  if (showLogin) {
    return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center p-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-xl shadow-2xl p-8 w-full max-w-md" }, /* @__PURE__ */ React.createElement("div", { className: "text-center mb-8" }, /* @__PURE__ */ React.createElement(
      "img",
      {
        src: "assets/QnQ2IRKmq0zfR25_j1Nkf.png",
        alt: "Esporte Clube Jurema",
        className: "h-20 w-20 mx-auto rounded-full bg-gray-100 p-2 mb-4"
      }
    ), /* @__PURE__ */ React.createElement("h1", { className: "text-2xl font-bold text-green-700 mb-2" }, "Esporte Clube Jurema"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600" }, "Sistema de Gest\xE3o de Quadras"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-500 mt-1" }, "Acesso Restrito - Administradores")), /* @__PURE__ */ React.createElement("form", { onSubmit: handleLogin, className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-2" }, "Usu\xE1rio"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        value: loginForm.usuario,
        onChange: (e) => setLoginForm({ ...loginForm, usuario: e.target.value }),
        className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent",
        placeholder: "Digite seu usu\xE1rio",
        required: true
      }
    )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-2" }, "Senha"), /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: showPassword ? "text" : "password",
        value: loginForm.senha,
        onChange: (e) => setLoginForm({ ...loginForm, senha: e.target.value }),
        className: "w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent",
        placeholder: "Digite sua senha",
        required: true
      }
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        onClick: () => setShowPassword(!showPassword),
        className: "absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700"
      },
      showPassword ? /* @__PURE__ */ React.createElement(EyeOff, { className: "h-5 w-5" }) : /* @__PURE__ */ React.createElement(Eye, { className: "h-5 w-5" })
    ))), loginError && /* @__PURE__ */ React.createElement("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm" }, loginError), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "submit",
        className: "w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition duration-200 font-medium"
      },
      "Entrar"
    )), /* @__PURE__ */ React.createElement("div", { className: "mt-8 p-4 bg-gray-50 rounded-lg" }, /* @__PURE__ */ React.createElement("h3", { className: "text-sm font-medium text-gray-700 mb-2" }, "Usu\xE1rios Autorizados:"), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-600 space-y-1" }, usuariosAdmin.map((user) => /* @__PURE__ */ React.createElement("div", { key: user.id }, "\u2022 ", /* @__PURE__ */ React.createElement("strong", null, user.usuario), " - ", user.cargo))), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-gray-500 mt-2" }, "Entre em contato com a administra\xE7\xE3o para obter as credenciais."), /* @__PURE__ */ React.createElement("div", { className: "mt-3 pt-3 border-t border-gray-200" }, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-gray-500" }, /* @__PURE__ */ React.createElement("strong", null, "Acesso Inicial:"), " A cada nova sess\xE3o, \xE9 necess\xE1rio fazer login novamente por seguran\xE7a.")))));
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("style", { jsx: true }, `
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
          
          /* Ocultar elementos desnecess\xE1rios na impress\xE3o */
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
          
          /* Conte\xFAdo do relat\xF3rio */
          .bg-white.rounded-lg.shadow {
            box-shadow: none !important;
            border-radius: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          /* Cabe\xE7alho */
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
          
          /* Se\xE7\xF5es */
          .border.rounded-lg {
            border: 1px solid #ccc !important;
            border-radius: 4px !important;
            margin: 10px 0 !important;
            padding: 10px !important;
            page-break-inside: avoid;
          }
          
          /* T\xEDtulos de se\xE7\xE3o */
          h3, h4 {
            font-size: 12px !important;
            font-weight: bold !important;
            margin: 8px 0 4px 0 !important;
            color: #1f2937 !important;
          }
          
          /* Quebras de p\xE1gina */
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
          
          /* Ajustes de espa\xE7amento */
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
          
          /* Responsividade para impress\xE3o */
          .hidden.md\\:block {
            display: block !important;
          }
          
          .md\\:hidden {
            display: none !important;
          }
        }
      `), /* @__PURE__ */ React.createElement("div", { className: "w-full h-full bg-gray-50 overflow-auto" }, /* @__PURE__ */ React.createElement("div", { className: "bg-gradient-to-r from-green-600 to-green-700 shadow-sm border-b px-4 py-3 md:px-6 md:py-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-3" }, /* @__PURE__ */ React.createElement(
    "img",
    {
      src: "assets/QnQ2IRKmq0zfR25_j1Nkf.png",
      alt: "Esporte Clube Jurema",
      className: "h-10 w-10 md:h-12 md:w-12 rounded-full bg-white p-1"
    }
  ), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", { className: "text-lg md:text-2xl font-bold text-white" }, "Esporte Clube Jurema"), /* @__PURE__ */ React.createElement("p", { className: "text-xs md:text-sm text-green-100 hidden sm:block" }, "Sistema de Gest\xE3o de Quadras - Valinhos"))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-3" }, /* @__PURE__ */ React.createElement("div", { className: "hidden sm:block text-right text-green-100" }, /* @__PURE__ */ React.createElement("p", { className: "text-sm font-medium" }, "Ol\xE1, ", usuarioLogado?.nome || "Usu\xE1rio", "!"), /* @__PURE__ */ React.createElement("p", { className: "text-xs opacity-90" }, usuarioLogado?.cargo || "Sistema Administrativo")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-2" }, /* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 bg-green-800 rounded-full flex items-center justify-center text-white text-sm font-medium" }, usuarioLogado?.nome ? usuarioLogado.nome.charAt(0).toUpperCase() : "U"), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: handleLogout,
      className: "bg-green-800 hover:bg-green-900 text-white px-3 py-2 rounded-lg text-sm transition duration-200 flex items-center space-x-1"
    },
    /* @__PURE__ */ React.createElement(LogOut, { className: "h-4 w-4" }),
    /* @__PURE__ */ React.createElement("span", { className: "hidden sm:inline" }, "Sair")
  ))), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setShowMobileMenu(!showMobileMenu),
      className: "md:hidden p-2 rounded-md text-green-100 hover:text-white hover:bg-green-800"
    },
    /* @__PURE__ */ React.createElement(Menu, { className: "h-6 w-6" })
  ))), /* @__PURE__ */ React.createElement("div", { className: "hidden md:block bg-white border-b" }, /* @__PURE__ */ React.createElement("nav", { className: "flex space-x-8 px-6" }, Object.entries(tabLabels).map(([tab, label]) => {
    const IconComponent = tabIcons[tab];
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: tab,
        onClick: () => setActiveTab(tab),
        className: `py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === tab ? "border-green-500 text-green-600" : "border-transparent text-gray-500 hover:text-gray-700"}`
      },
      /* @__PURE__ */ React.createElement(IconComponent, { className: "h-4 w-4" }),
      /* @__PURE__ */ React.createElement("span", null, label)
    );
  }))), showMobileMenu && /* @__PURE__ */ React.createElement("div", { className: "md:hidden fixed inset-0 z-50 bg-black bg-opacity-50", onClick: () => setShowMobileMenu(false) }, /* @__PURE__ */ React.createElement("div", { className: "bg-white w-64 h-full shadow-lg", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("div", { className: "p-4 border-b" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-3 mb-3" }, /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-medium" }, usuarioLogado?.nome ? usuarioLogado.nome.charAt(0).toUpperCase() : "U"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-medium text-gray-900" }, usuarioLogado?.nome || "Usu\xE1rio"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-gray-600" }, usuarioLogado?.cargo || "Administrador"))), /* @__PURE__ */ React.createElement("h2", { className: "text-lg font-semibold text-gray-800" }, "Menu")), /* @__PURE__ */ React.createElement("nav", { className: "p-2" }, Object.entries(tabLabels).map(([tab, label]) => {
    const IconComponent = tabIcons[tab];
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: tab,
        onClick: () => {
          setActiveTab(tab);
          setShowMobileMenu(false);
        },
        className: `w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${activeTab === tab ? "bg-green-100 text-green-600" : "text-gray-700 hover:bg-gray-100"}`
      },
      /* @__PURE__ */ React.createElement(IconComponent, { className: "h-5 w-5" }),
      /* @__PURE__ */ React.createElement("span", null, label)
    );
  })))), /* @__PURE__ */ React.createElement("div", { className: "md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40" }, /* @__PURE__ */ React.createElement("nav", { className: "flex" }, Object.entries(tabLabels).map(([tab, label]) => {
    const IconComponent = tabIcons[tab];
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: tab,
        onClick: () => setActiveTab(tab),
        className: `flex-1 py-2 px-1 text-xs flex flex-col items-center space-y-1 ${activeTab === tab ? "text-green-600" : "text-gray-500"}`
      },
      /* @__PURE__ */ React.createElement(IconComponent, { className: "h-5 w-5" }),
      /* @__PURE__ */ React.createElement("span", { className: "text-xs" }, label)
    );
  })), /* @__PURE__ */ React.createElement("div", { className: "bg-gray-800 text-center py-1" }, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-gray-300" }, "\xA9 2025 PauloCunhaMKT Solu\xE7\xF5es TI \u2022 v2.1.0"))), /* @__PURE__ */ React.createElement("div", { className: "p-3 md:p-6 pb-24 md:pb-16" }, activeTab === "dashboard" && /* @__PURE__ */ React.createElement("div", { className: "space-y-4 md:space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white p-3 md:p-6 rounded-lg shadow" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement(Calendar, { className: "h-6 w-6 md:h-8 md:w-8 text-blue-500" }), /* @__PURE__ */ React.createElement("div", { className: "ml-2 md:ml-4" }, /* @__PURE__ */ React.createElement("p", { className: "text-xs md:text-sm font-medium text-gray-600" }, "Hoje"), /* @__PURE__ */ React.createElement("p", { className: "text-lg md:text-2xl font-bold text-gray-900" }, reservasHoje.length), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-gray-500" }, "M\xE1x: ", quadras.filter((q) => q.ativa).length * 6)))), /* @__PURE__ */ React.createElement("div", { className: "bg-white p-3 md:p-6 rounded-lg shadow" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement(DollarSign, { className: "h-6 w-6 md:h-8 md:w-8 text-green-500" }), /* @__PURE__ */ React.createElement("div", { className: "ml-2 md:ml-4" }, /* @__PURE__ */ React.createElement("p", { className: "text-xs md:text-sm font-medium text-gray-600" }, "Receita"), /* @__PURE__ */ React.createElement("p", { className: "text-sm md:text-2xl font-bold text-gray-900" }, "R$ ", receitaMensal.toFixed(0))))), /* @__PURE__ */ React.createElement("div", { className: "bg-white p-3 md:p-6 rounded-lg shadow" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement(Users, { className: "h-6 w-6 md:h-8 md:w-8 text-purple-500" }), /* @__PURE__ */ React.createElement("div", { className: "ml-2 md:ml-4" }, /* @__PURE__ */ React.createElement("p", { className: "text-xs md:text-sm font-medium text-gray-600" }, "Clientes"), /* @__PURE__ */ React.createElement("p", { className: "text-lg md:text-2xl font-bold text-gray-900" }, clientes.length)))), /* @__PURE__ */ React.createElement("div", { className: "bg-white p-3 md:p-6 rounded-lg shadow" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement(Clock, { className: "h-6 w-6 md:h-8 md:w-8 text-orange-500" }), /* @__PURE__ */ React.createElement("div", { className: "ml-2 md:ml-4" }, /* @__PURE__ */ React.createElement("p", { className: "text-xs md:text-sm font-medium text-gray-600" }, "Quadras"), /* @__PURE__ */ React.createElement("p", { className: "text-lg md:text-2xl font-bold text-gray-900" }, quadras.filter((q) => q.ativa).length), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-gray-500" }, "6 slots/dia \u2022 5min intervalo")))), /* @__PURE__ */ React.createElement("div", { className: "bg-white p-3 md:p-6 rounded-lg shadow" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement(Calendar, { className: "h-6 w-6 md:h-8 md:w-8 text-purple-500" }), /* @__PURE__ */ React.createElement("div", { className: "ml-2 md:ml-4" }, /* @__PURE__ */ React.createElement("p", { className: "text-xs md:text-sm font-medium text-gray-600" }, "Mensais"), /* @__PURE__ */ React.createElement("p", { className: "text-lg md:text-2xl font-bold text-gray-900" }, faturamentos.filter(
    (f) => f.tipoLocacao === "Mensal" && f.mesLocacao >= (/* @__PURE__ */ new Date()).toISOString().slice(0, 7)
  ).length), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-gray-500" }, "Contratos mensais ativos"))))), (() => {
    const reservasMensaisAtivas = faturamentos.filter(
      (f) => f.tipoLocacao === "Mensal" && f.valorEmAberto > 0 && f.mesLocacao >= (/* @__PURE__ */ new Date()).toISOString().slice(0, 7)
    );
    return reservasMensaisAtivas.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow" }, /* @__PURE__ */ React.createElement("div", { className: "p-4 md:p-6 border-b" }, /* @__PURE__ */ React.createElement("h3", { className: "text-base md:text-lg font-medium text-gray-900" }, "\u{1F4C5} Reservas Mensais Ativas")), /* @__PURE__ */ React.createElement("div", { className: "p-4 md:p-6" }, reservasMensaisAtivas.slice(0, 3).map((faturamento) => /* @__PURE__ */ React.createElement("div", { key: faturamento.id, className: "flex items-center justify-between py-3 border-b last:border-b-0" }, /* @__PURE__ */ React.createElement("div", { className: "flex-1 min-w-0" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("p", { className: "font-medium truncate" }, faturamento.cliente), /* @__PURE__ */ React.createElement("span", { className: "px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800" }, "MENSAL")), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600 truncate" }, faturamento.tipoQuadra, " - ", faturamento.mesLocacao), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-gray-500" }, faturamento.hora), faturamento.diasSemana && /* @__PURE__ */ React.createElement("p", { className: "text-xs text-purple-600" }, "Dias: ", faturamento.diasSemana.join(", "))), /* @__PURE__ */ React.createElement("div", { className: "text-right ml-2" }, /* @__PURE__ */ React.createElement("p", { className: "font-medium text-purple-600" }, "R$ ", faturamento.valor?.toFixed(2)), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-red-600" }, "Em aberto: R$ ", faturamento.valorEmAberto?.toFixed(2)), faturamento.numeroParcelas > 1 && /* @__PURE__ */ React.createElement("p", { className: "text-xs text-gray-500" }, faturamento.numeroParcelas, "x R$ ", faturamento.valorParcela?.toFixed(2)))))));
  })(), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow" }, /* @__PURE__ */ React.createElement("div", { className: "p-4 md:p-6 border-b" }, /* @__PURE__ */ React.createElement("h3", { className: "text-base md:text-lg font-medium text-gray-900" }, "Pr\xF3ximas Reservas")), /* @__PURE__ */ React.createElement("div", { className: "p-4 md:p-6" }, reservas.slice(0, 5).map((reserva) => {
    const quadra = quadras.find((q) => q.id === reserva.quadraId);
    const cliente = clientes.find((c) => c.id === reserva.clienteId);
    return /* @__PURE__ */ React.createElement("div", { key: reserva.id, className: "flex items-center justify-between py-3 border-b last:border-b-0" }, /* @__PURE__ */ React.createElement("div", { className: "flex-1 min-w-0" }, /* @__PURE__ */ React.createElement("p", { className: "font-medium truncate" }, quadra?.nome), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600 truncate" }, cliente?.nome), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-gray-500" }, reserva.data, " \xE0s ", reserva.horaInicio)), /* @__PURE__ */ React.createElement("span", { className: `px-2 py-1 text-xs rounded-full whitespace-nowrap ml-2 ${reserva.status === "Confirmada" ? "bg-green-100 text-green-800" : reserva.status === "Pendente" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}` }, reserva.status));
  }), reservas.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "text-gray-500 text-center py-8" }, "Nenhuma reserva cadastrada")))), activeTab === "reservas" && /* @__PURE__ */ React.createElement("div", { className: "space-y-4 md:space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" }, /* @__PURE__ */ React.createElement("h2", { className: "text-lg md:text-xl font-semibold text-gray-900" }, "Reservas"), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        setModalType("reserva");
        setShowModal(true);
      },
      className: "w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-700"
    },
    /* @__PURE__ */ React.createElement(Plus, { className: "h-4 w-4" }),
    /* @__PURE__ */ React.createElement("span", null, "Nova Reserva")
  )), /* @__PURE__ */ React.createElement("div", { className: "bg-white p-4 rounded-lg shadow space-y-3 md:space-y-0 md:flex md:space-x-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex-1" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: "Buscar...",
      value: searchTerm,
      onChange: (e) => setSearchTerm(e.target.value),
      className: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "w-full md:w-auto" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "date",
      value: filtroData,
      onChange: (e) => setFiltroData(e.target.value),
      className: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
    }
  ))), /* @__PURE__ */ React.createElement("div", { className: "space-y-3 md:hidden" }, reservasFiltradas.map((reserva) => {
    const quadra = quadras.find((q) => q.id === reserva.quadraId);
    const cliente = clientes.find((c) => c.id === reserva.clienteId);
    return /* @__PURE__ */ React.createElement("div", { key: reserva.id, className: "bg-white rounded-lg shadow p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-start mb-2" }, /* @__PURE__ */ React.createElement("div", { className: "flex-1" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("h3", { className: "font-medium text-gray-900" }, quadra?.nome), reserva.tipoReserva === "mensal" && /* @__PURE__ */ React.createElement("span", { className: "px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 font-medium" }, "\u{1F4C5} MENSAL")), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600" }, cliente?.nome), reserva.tipoReserva === "mensal" && reserva.mesReferencia && /* @__PURE__ */ React.createElement("p", { className: "text-xs text-purple-600 font-medium" }, "M\xEAs: ", reserva.mesReferencia)), /* @__PURE__ */ React.createElement("span", { className: `px-2 py-1 text-xs rounded-full ${reserva.status === "Confirmada" ? "bg-green-100 text-green-800" : reserva.status === "Pendente" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}` }, reserva.status)), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3" }, /* @__PURE__ */ React.createElement("div", null, "Data: ", reserva.data), /* @__PURE__ */ React.createElement("div", null, "Valor: R$ ", reserva.valor?.toFixed(2)), /* @__PURE__ */ React.createElement("div", null, "In\xEDcio: ", reserva.horaInicio), /* @__PURE__ */ React.createElement("div", null, "Fim: ", reserva.horaFim)), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-2 text-sm mb-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement("span", { className: `px-2 py-1 text-xs rounded-full ${reserva.statusPagamento === "Pago" ? "bg-green-100 text-green-800" : reserva.statusPagamento === "Parcial" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}` }, reserva.statusPagamento || "Pendente")), /* @__PURE__ */ React.createElement("div", { className: "text-green-600 font-medium" }, "Pago: R$ ", (reserva.valorPago || 0).toFixed(2))), reserva.valorPago > 0 && /* @__PURE__ */ React.createElement("div", { className: "text-xs text-blue-600 mb-2" }, reserva.formaPagamento && `Forma: ${reserva.formaPagamento}`, reserva.dataPagamento && ` \u2022 Data: ${new Date(reserva.dataPagamento).toLocaleDateString("pt-BR")}`), /* @__PURE__ */ React.createElement("div", { className: "flex space-x-2" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => editarReserva(reserva),
        className: "flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700"
      },
      "Editar"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => excluirReserva(reserva.id),
        className: "bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
      },
      /* @__PURE__ */ React.createElement(Trash2, { className: "h-4 w-4" })
    )));
  }), reservasFiltradas.length === 0 && /* @__PURE__ */ React.createElement("div", { className: "text-center py-8 text-gray-500" }, "Nenhuma reserva encontrada")), /* @__PURE__ */ React.createElement("div", { className: "hidden md:block bg-white rounded-lg shadow overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ React.createElement("table", { className: "min-w-full divide-y divide-gray-200" }, /* @__PURE__ */ React.createElement("thead", { className: "bg-gray-50" }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Data/Hora"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Quadra"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Cliente"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Valor"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Status"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Pagamento"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "A\xE7\xF5es"))), /* @__PURE__ */ React.createElement("tbody", { className: "bg-white divide-y divide-gray-200" }, reservasFiltradas.map((reserva) => {
    const quadra = quadras.find((q) => q.id === reserva.quadraId);
    const cliente = clientes.find((c) => c.id === reserva.clienteId);
    return /* @__PURE__ */ React.createElement("tr", { key: reserva.id }, /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900" }, reserva.data, " ", reserva.horaInicio, "-", reserva.horaFim, reserva.tipoReserva === "mensal" && /* @__PURE__ */ React.createElement("div", { className: "text-xs text-purple-600 font-medium" }, "\u{1F4C5} Mensal: ", reserva.mesReferencia)), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, quadra?.nome, reserva.tipoReserva === "mensal" && /* @__PURE__ */ React.createElement("span", { className: "px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800" }, "MENSAL"))), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900" }, cliente?.nome), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900" }, "R$ ", reserva.valor?.toFixed(2)), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap" }, /* @__PURE__ */ React.createElement("span", { className: `px-2 py-1 text-xs rounded-full ${reserva.status === "Confirmada" ? "bg-green-100 text-green-800" : reserva.status === "Pendente" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}` }, reserva.status)), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm" }, /* @__PURE__ */ React.createElement("span", { className: `px-2 py-1 text-xs rounded-full ${reserva.statusPagamento === "Pago" ? "bg-green-100 text-green-800" : reserva.statusPagamento === "Parcial" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}` }, reserva.statusPagamento || "Pendente")), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-green-600 font-medium" }, "R$ ", (reserva.valorPago || 0).toFixed(2), reserva.valorPago > 0 && reserva.formaPagamento && /* @__PURE__ */ React.createElement("span", { className: "text-gray-500" }, " \u2022 ", reserva.formaPagamento))), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => editarReserva(reserva),
        className: "text-green-600 hover:text-green-900 mr-3"
      },
      /* @__PURE__ */ React.createElement(Edit, { className: "h-4 w-4" })
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => excluirReserva(reserva.id),
        className: "text-red-600 hover:text-red-900"
      },
      /* @__PURE__ */ React.createElement(Trash2, { className: "h-4 w-4" })
    )));
  })))))), activeTab === "quadras" && /* @__PURE__ */ React.createElement("div", { className: "space-y-4 md:space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" }, /* @__PURE__ */ React.createElement("h2", { className: "text-lg md:text-xl font-semibold text-gray-900" }, "Quadras"), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        setModalType("quadra");
        setShowModal(true);
      },
      className: "w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-700"
    },
    /* @__PURE__ */ React.createElement(Plus, { className: "h-4 w-4" }),
    /* @__PURE__ */ React.createElement("span", null, "Nova Quadra")
  )), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6" }, quadras.map((quadra) => /* @__PURE__ */ React.createElement("div", { key: quadra.id, className: "bg-white rounded-lg shadow p-4 md:p-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-start mb-4" }, /* @__PURE__ */ React.createElement("h3", { className: "text-base md:text-lg font-medium text-gray-900" }, quadra.nome), /* @__PURE__ */ React.createElement("span", { className: `px-2 py-1 text-xs rounded-full ${quadra.ativa ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}` }, quadra.ativa ? "Ativa" : "Inativa")), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600 mb-2 text-sm" }, quadra.modalidade), /* @__PURE__ */ React.createElement("p", { className: "text-gray-900 font-medium mb-4" }, "R$ ", quadra.valorHora, "/hora"), /* @__PURE__ */ React.createElement("div", { className: "flex space-x-2" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => editarQuadra(quadra),
      className: "flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700"
    },
    "Editar"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => excluirQuadra(quadra.id),
      className: "bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
    },
    /* @__PURE__ */ React.createElement(Trash2, { className: "h-4 w-4" })
  )))))), activeTab === "clientes" && /* @__PURE__ */ React.createElement("div", { className: "space-y-4 md:space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" }, /* @__PURE__ */ React.createElement("h2", { className: "text-lg md:text-xl font-semibold text-gray-900" }, "Clientes"), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        setModalType("cliente");
        setShowModal(true);
      },
      className: "w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700"
    },
    /* @__PURE__ */ React.createElement(Plus, { className: "h-4 w-4" }),
    /* @__PURE__ */ React.createElement("span", null, "Novo Cliente")
  )), /* @__PURE__ */ React.createElement("div", { className: "space-y-3 md:hidden" }, clientes.map((cliente) => /* @__PURE__ */ React.createElement("div", { key: cliente.id, className: "bg-white rounded-lg shadow p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-start mb-3" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-medium text-gray-900" }, cliente.nome), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600" }, cliente.telefone), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600" }, cliente.email))), /* @__PURE__ */ React.createElement("div", { className: "flex space-x-2" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => editarCliente(cliente),
      className: "flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
    },
    "Editar"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => excluirCliente(cliente.id),
      className: "bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
    },
    /* @__PURE__ */ React.createElement(Trash2, { className: "h-4 w-4" })
  ))))), /* @__PURE__ */ React.createElement("div", { className: "hidden md:block bg-white rounded-lg shadow overflow-hidden" }, /* @__PURE__ */ React.createElement("table", { className: "min-w-full divide-y divide-gray-200" }, /* @__PURE__ */ React.createElement("thead", { className: "bg-gray-50" }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Nome"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Telefone"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Email"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "A\xE7\xF5es"))), /* @__PURE__ */ React.createElement("tbody", { className: "bg-white divide-y divide-gray-200" }, clientes.map((cliente) => /* @__PURE__ */ React.createElement("tr", { key: cliente.id }, /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" }, cliente.nome), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900" }, cliente.telefone), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900" }, cliente.email), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => editarCliente(cliente),
      className: "text-green-600 hover:text-green-900 mr-3"
    },
    /* @__PURE__ */ React.createElement(Edit, { className: "h-4 w-4" })
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => excluirCliente(cliente.id),
      className: "text-red-600 hover:text-red-900"
    },
    /* @__PURE__ */ React.createElement(Trash2, { className: "h-4 w-4" })
  )))))))), activeTab === "financeiro" && /* @__PURE__ */ React.createElement("div", { className: "space-y-4 md:space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-lg md:text-xl font-semibold text-gray-900" }, "Controle Financeiro"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600" }, "Gest\xE3o de pend\xEAncias financeiras - Apenas lan\xE7amentos em aberto e parciais")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row gap-2 w-full sm:w-auto" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        setModalType("faturamento");
        setShowModal(true);
      },
      className: "w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700"
    },
    /* @__PURE__ */ React.createElement(Plus, { className: "h-4 w-4" }),
    /* @__PURE__ */ React.createElement("span", null, "Novo Faturamento")
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        setModalType("recebimento");
        setShowModal(true);
      },
      className: "w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-700"
    },
    /* @__PURE__ */ React.createElement(CreditCard, { className: "h-4 w-4" }),
    /* @__PURE__ */ React.createElement("span", null, "Registrar Recebimento")
  ))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-blue-50 p-3 md:p-4 rounded-lg" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement(FileText, { className: "h-6 w-6 md:h-8 md:w-8 text-blue-500 mr-2 md:mr-3" }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-xs md:text-sm font-medium text-blue-900" }, "Receita Total"), /* @__PURE__ */ React.createElement("p", { className: "text-sm md:text-xl font-bold text-blue-600" }, "R$ ", (() => {
    const receitaReservas = reservas.reduce((acc, r) => acc + (r.valor || 0), 0);
    const receitaFaturamentos = faturamentos.reduce((acc, f) => acc + (f.valor || 0), 0);
    return (receitaReservas + receitaFaturamentos).toFixed(2);
  })())))), /* @__PURE__ */ React.createElement("div", { className: "bg-green-50 p-3 md:p-4 rounded-lg" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement(CheckCircle, { className: "h-6 w-6 md:h-8 md:w-8 text-green-500 mr-2 md:mr-3" }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-xs md:text-sm font-medium text-green-900" }, "Valores Recebidos"), /* @__PURE__ */ React.createElement("p", { className: "text-sm md:text-xl font-bold text-green-600" }, "R$ ", (() => {
    const reservasPagas = reservas.reduce((acc, r) => acc + (r.valorPago || 0), 0);
    const faturamentosRecebidos = faturamentos.reduce((acc, f) => acc + (f.valorRealRecebido || 0), 0);
    return (reservasPagas + faturamentosRecebidos).toFixed(2);
  })())))), /* @__PURE__ */ React.createElement("div", { className: "bg-red-50 p-3 md:p-4 rounded-lg" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement(AlertCircle, { className: "h-6 w-6 md:h-8 md:w-8 text-red-500 mr-2 md:mr-3" }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-xs md:text-sm font-medium text-red-900" }, "Em Aberto"), /* @__PURE__ */ React.createElement("p", { className: "text-sm md:text-xl font-bold text-red-600" }, "R$ ", (() => {
    const reservasEmAberto = reservas.reduce((acc, r) => {
      const valorTotal = r.valor || 0;
      const valorPago = r.valorPago || 0;
      const valorPendente = Math.max(0, valorTotal - valorPago);
      return acc + valorPendente;
    }, 0);
    const faturamentosEmAberto = faturamentos.reduce((acc, f) => acc + (f.valorEmAberto || 0), 0);
    return (reservasEmAberto + faturamentosEmAberto).toFixed(2);
  })())))), /* @__PURE__ */ React.createElement("div", { className: "bg-purple-50 p-3 md:p-4 rounded-lg" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement(TrendingUp, { className: "h-6 w-6 md:h-8 md:w-8 text-purple-500 mr-2 md:mr-3" }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-xs md:text-sm font-medium text-purple-900" }, "Taxa Recebimento"), /* @__PURE__ */ React.createElement("p", { className: "text-sm md:text-xl font-bold text-purple-600" }, (() => {
    const receitaReservas = reservas.reduce((acc, r) => acc + (r.valor || 0), 0);
    const receitaFaturamentos = faturamentos.reduce((acc, f) => acc + (f.valor || 0), 0);
    const totalReceita = receitaReservas + receitaFaturamentos;
    const reservasRecebidas = reservas.reduce((acc, r) => acc + (r.valorPago || 0), 0);
    const faturamentosRecebidos = faturamentos.reduce((acc, f) => acc + (f.valorRealRecebido || 0), 0);
    const totalRecebido = reservasRecebidas + faturamentosRecebidos;
    return totalReceita > 0 ? Math.round(totalRecebido / totalReceita * 100) : 0;
  })(), "%"))))), /* @__PURE__ */ React.createElement("div", { className: "bg-white p-4 rounded-lg shadow space-y-3 md:space-y-0 md:flex md:space-x-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex-1" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: "Buscar cliente...",
      value: searchTerm,
      onChange: (e) => setSearchTerm(e.target.value),
      className: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "w-full md:w-auto" }, /* @__PURE__ */ React.createElement(
    "select",
    {
      value: filtroData,
      onChange: (e) => setFiltroData(e.target.value),
      className: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
    },
    /* @__PURE__ */ React.createElement("option", { value: "" }, "Todos os pendentes"),
    /* @__PURE__ */ React.createElement("option", { value: "Em Aberto" }, "Em Aberto"),
    /* @__PURE__ */ React.createElement("option", { value: "Parcial" }, "Parciais")
  ))), /* @__PURE__ */ React.createElement("div", { className: "space-y-3 md:hidden" }, (() => {
    const itensFinanceiros = [];
    faturamentos.forEach((faturamento) => {
      const valorEmAberto = faturamento.valorEmAberto || 0;
      if (valorEmAberto > 0) {
        itensFinanceiros.push({
          id: `fat_${faturamento.id}`,
          tipo: "faturamento",
          origem: "Faturamento Administrativo",
          cliente: faturamento.cliente,
          descricao: `${faturamento.tipoQuadra} - ${faturamento.mesLocacao}`,
          data: faturamento.data,
          valor: faturamento.valor,
          valorRecebido: faturamento.valorRealRecebido || 0,
          valorEmAberto,
          formaPagamento: faturamento.formaPagamento,
          status: "Em Aberto",
          item: faturamento
        });
      }
    });
    reservas.forEach((reserva) => {
      const valorTotal = reserva.valor || 0;
      const valorPago = reserva.valorPago || 0;
      const valorEmAberto = Math.max(0, valorTotal - valorPago);
      if (valorEmAberto > 0) {
        const cliente = clientes.find((c) => c.id === reserva.clienteId);
        const quadra = quadras.find((q) => q.id === reserva.quadraId);
        let status = "Em Aberto";
        if (valorPago > 0) {
          status = "Parcial";
        }
        itensFinanceiros.push({
          id: `res_${reserva.id}`,
          tipo: "reserva",
          origem: "Reserva de Quadra",
          cliente: cliente?.nome || "Cliente N/A",
          descricao: `${quadra?.nome} - ${reserva.data} (${reserva.horaInicio}-${reserva.horaFim})`,
          data: reserva.data,
          valor: valorTotal,
          valorRecebido: valorPago,
          valorEmAberto,
          formaPagamento: reserva.formaPagamento || "",
          status,
          item: reserva
        });
      }
    });
    const itensFiltrados = itensFinanceiros.filter((item) => {
      const matchSearch = !searchTerm || item.cliente?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = !filtroData || item.status === filtroData;
      return matchSearch && matchStatus;
    });
    return itensFiltrados.map((item) => /* @__PURE__ */ React.createElement("div", { key: item.id, className: `bg-white rounded-lg shadow p-4 border-l-4 ${item.tipo === "faturamento" ? "border-blue-500" : "border-green-500"}` }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-start mb-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex-1" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 mb-1" }, /* @__PURE__ */ React.createElement("h3", { className: "font-medium text-gray-900" }, item.cliente), /* @__PURE__ */ React.createElement("span", { className: `px-2 py-1 text-xs rounded-full font-medium ${item.tipo === "faturamento" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}` }, item.origem)), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600" }, item.descricao), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-blue-600 font-medium" }, "R$ ", item.valor?.toFixed(2))), /* @__PURE__ */ React.createElement("div", { className: "text-right" }, /* @__PURE__ */ React.createElement("span", { className: `px-2 py-1 text-xs rounded-full ${item.status === "Pago" ? "bg-green-100 text-green-800" : item.status === "Parcial" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}` }, item.status))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3" }, /* @__PURE__ */ React.createElement("div", null, "Recebido: R$ ", item.valorRecebido?.toFixed(2)), /* @__PURE__ */ React.createElement("div", null, "Em Aberto: R$ ", item.valorEmAberto?.toFixed(2)), /* @__PURE__ */ React.createElement("div", null, "Data: ", new Date(item.data).toLocaleDateString("pt-BR")), /* @__PURE__ */ React.createElement("div", null, "Forma: ", item.formaPagamento || "N/A")), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, item.valorEmAberto > 0 && /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => {
          setFormRecebimento({
            faturamentoId: item.id,
            data: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
            valor: item.valorEmAberto.toString(),
            formaPagamento: "",
            observacoes: ""
          });
          setModalType("recebimento");
          setShowModal(true);
        },
        className: "w-full bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 flex items-center justify-center space-x-2"
      },
      /* @__PURE__ */ React.createElement(CreditCard, { className: "h-4 w-4" }),
      /* @__PURE__ */ React.createElement("span", null, "Lan\xE7ar Recebimento")
    ), /* @__PURE__ */ React.createElement("div", { className: "flex space-x-2" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => {
          if (item.tipo === "faturamento") {
            editarFaturamento(item.item);
          } else {
            editarReserva(item.item);
          }
        },
        className: `flex-1 text-white px-3 py-2 rounded text-sm ${item.tipo === "faturamento" ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"}`
      },
      "Editar"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => {
          if (item.tipo === "faturamento") {
            excluirFaturamento(item.item.id);
          } else {
            excluirReserva(item.item.id);
          }
        },
        className: "bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
      },
      /* @__PURE__ */ React.createElement(Trash2, { className: "h-4 w-4" })
    )))));
  })(), (() => {
    const faturamentosEmAberto = faturamentos.filter((f) => (f.valorEmAberto || 0) > 0);
    const reservasEmAberto = reservas.filter((r) => {
      const valorTotal = r.valor || 0;
      const valorPago = r.valorPago || 0;
      return Math.max(0, valorTotal - valorPago) > 0;
    });
    const totalItensEmAberto = faturamentosEmAberto.length + reservasEmAberto.length;
    return totalItensEmAberto === 0 && /* @__PURE__ */ React.createElement("div", { className: "text-center py-8 text-gray-500 bg-white rounded-lg shadow" }, /* @__PURE__ */ React.createElement(CheckCircle, { className: "h-12 w-12 text-green-500 mx-auto mb-3" }), /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-medium text-gray-900 mb-2" }, "Nenhuma Pend\xEAncia Financeira!"), /* @__PURE__ */ React.createElement("p", { className: "text-sm" }, searchTerm ? "Nenhum resultado encontrado para sua busca." : "Todos os faturamentos e reservas est\xE3o com pagamentos em dia."));
  })()), /* @__PURE__ */ React.createElement("div", { className: "hidden md:block bg-white rounded-lg shadow overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ React.createElement("table", { className: "min-w-full divide-y divide-gray-200" }, /* @__PURE__ */ React.createElement("thead", { className: "bg-gray-50" }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Origem/Cliente"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Descri\xE7\xE3o"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Valor"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Recebido"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Em Aberto"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Status"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "A\xE7\xF5es"))), /* @__PURE__ */ React.createElement("tbody", { className: "bg-white divide-y divide-gray-200" }, (() => {
    const itensFinanceiros = [];
    faturamentos.forEach((faturamento) => {
      const valorEmAberto = faturamento.valorEmAberto || 0;
      if (valorEmAberto > 0) {
        itensFinanceiros.push({
          id: `fat_${faturamento.id}`,
          tipo: "faturamento",
          origem: "Faturamento Administrativo",
          cliente: faturamento.cliente,
          descricao: `${faturamento.tipoQuadra} - ${faturamento.mesLocacao}`,
          data: faturamento.data,
          valor: faturamento.valor,
          valorRecebido: faturamento.valorRealRecebido || 0,
          valorEmAberto,
          formaPagamento: faturamento.formaPagamento,
          status: "Em Aberto",
          item: faturamento
        });
      }
    });
    reservas.forEach((reserva) => {
      const valorTotal = reserva.valor || 0;
      const valorPago = reserva.valorPago || 0;
      const valorEmAberto = Math.max(0, valorTotal - valorPago);
      if (valorEmAberto > 0) {
        const cliente = clientes.find((c) => c.id === reserva.clienteId);
        const quadra = quadras.find((q) => q.id === reserva.quadraId);
        let status = "Em Aberto";
        if (valorPago > 0) {
          status = "Parcial";
        }
        itensFinanceiros.push({
          id: `res_${reserva.id}`,
          tipo: "reserva",
          origem: "Reserva de Quadra",
          cliente: cliente?.nome || "Cliente N/A",
          descricao: `${quadra?.nome} - ${reserva.data} (${reserva.horaInicio}-${reserva.horaFim})`,
          data: reserva.data,
          valor: valorTotal,
          valorRecebido: valorPago,
          valorEmAberto,
          formaPagamento: reserva.formaPagamento || "",
          status,
          item: reserva
        });
      }
    });
    const itensFiltrados = itensFinanceiros.filter((item) => {
      const matchSearch = !searchTerm || item.cliente?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = !filtroData || item.status === filtroData;
      return matchSearch && matchStatus;
    });
    itensFiltrados.sort((a, b) => new Date(b.data) - new Date(a.data));
    const resultados = itensFiltrados.map((item) => /* @__PURE__ */ React.createElement("tr", { key: item.id, className: "hover:bg-gray-50" }, /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement("div", { className: `w-3 h-3 rounded-full mr-3 ${item.tipo === "faturamento" ? "bg-blue-500" : "bg-green-500"}` }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "text-sm font-medium text-gray-900" }, item.cliente), /* @__PURE__ */ React.createElement("div", { className: `text-xs font-medium ${item.tipo === "faturamento" ? "text-blue-600" : "text-green-600"}` }, item.origem)))), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm text-gray-900" }, item.descricao), /* @__PURE__ */ React.createElement("div", { className: "text-sm text-gray-500" }, new Date(item.data).toLocaleDateString("pt-BR"))), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900" }, "R$ ", item.valor?.toFixed(2)), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium" }, "R$ ", item.valorRecebido?.toFixed(2)), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium" }, "R$ ", item.valorEmAberto?.toFixed(2)), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap" }, /* @__PURE__ */ React.createElement("span", { className: `px-2 py-1 text-xs rounded-full ${item.status === "Pago" ? "bg-green-100 text-green-800" : item.status === "Parcial" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}` }, item.status)), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-2" }, item.valorEmAberto > 0 && /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => {
          setFormRecebimento({
            faturamentoId: item.id,
            data: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
            valor: item.valorEmAberto.toString(),
            formaPagamento: "",
            observacoes: ""
          });
          setModalType("recebimento");
          setShowModal(true);
        },
        className: "bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 flex items-center space-x-1",
        title: "Lan\xE7ar Recebimento"
      },
      /* @__PURE__ */ React.createElement(CreditCard, { className: "h-3 w-3" }),
      /* @__PURE__ */ React.createElement("span", null, "Receber")
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => {
          if (item.tipo === "faturamento") {
            editarFaturamento(item.item);
          } else {
            editarReserva(item.item);
          }
        },
        className: `${item.tipo === "faturamento" ? "text-blue-600 hover:text-blue-900" : "text-green-600 hover:text-green-900"}`,
        title: "Editar"
      },
      /* @__PURE__ */ React.createElement(Edit, { className: "h-4 w-4" })
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => {
          if (item.tipo === "faturamento") {
            excluirFaturamento(item.item.id);
          } else {
            excluirReserva(item.item.id);
          }
        },
        className: "text-red-600 hover:text-red-900",
        title: "Excluir"
      },
      /* @__PURE__ */ React.createElement(Trash2, { className: "h-4 w-4" })
    )))));
    return resultados.length > 0 ? resultados : /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: "7", className: "px-6 py-12 text-center" }, /* @__PURE__ */ React.createElement(CheckCircle, { className: "h-12 w-12 text-green-500 mx-auto mb-3" }), /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-medium text-gray-900 mb-2" }, "Nenhuma Pend\xEAncia Financeira!"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-500" }, searchTerm ? "Nenhum resultado encontrado para sua busca." : "Todos os faturamentos e reservas est\xE3o com pagamentos em dia.")));
  })())))), recebimentos.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow" }, /* @__PURE__ */ React.createElement("div", { className: "p-4 md:p-6 border-b" }, /* @__PURE__ */ React.createElement("h3", { className: "text-base md:text-lg font-medium text-gray-900" }, "Hist\xF3rico de Recebimentos")), /* @__PURE__ */ React.createElement("div", { className: "p-4 md:p-6" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, recebimentos.slice(-10).reverse().map((recebimento) => {
    let nomeCliente, descricaoItem, tipoOrigem;
    if (recebimento.tipoItem === "faturamento" || recebimento.faturamentoId) {
      const faturamento = faturamentos.find((f) => f.id === (recebimento.faturamentoId || parseInt(recebimento.faturamentoId)));
      nomeCliente = faturamento?.cliente || "Cliente n\xE3o encontrado";
      descricaoItem = faturamento ? `${faturamento.tipoQuadra} - ${faturamento.mesLocacao}` : "Faturamento exclu\xEDdo";
      tipoOrigem = "Faturamento";
    } else if (recebimento.tipoItem === "reserva" || recebimento.reservaId) {
      const reserva = reservas.find((r) => r.id === recebimento.reservaId);
      if (reserva) {
        const cliente = clientes.find((c) => c.id === reserva.clienteId);
        const quadra = quadras.find((q) => q.id === reserva.quadraId);
        nomeCliente = cliente?.nome || "Cliente n\xE3o encontrado";
        descricaoItem = `${quadra?.nome} - ${reserva.data} (${reserva.horaInicio}-${reserva.horaFim})`;
        tipoOrigem = "Reserva";
      } else {
        nomeCliente = "Reserva n\xE3o encontrada";
        descricaoItem = "Reserva exclu\xEDda";
        tipoOrigem = "Reserva";
      }
    } else {
      const faturamento = faturamentos.find((f) => f.id === recebimento.faturamentoId);
      nomeCliente = faturamento?.cliente || "Cliente n\xE3o encontrado";
      descricaoItem = faturamento ? `${faturamento.tipoQuadra} - ${faturamento.mesLocacao}` : "Item exclu\xEDdo";
      tipoOrigem = "Faturamento";
    }
    return /* @__PURE__ */ React.createElement("div", { key: recebimento.id, className: "flex items-center justify-between py-3 border-b last:border-b-0" }, /* @__PURE__ */ React.createElement("div", { className: "flex-1 min-w-0" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("p", { className: "font-medium truncate" }, nomeCliente), /* @__PURE__ */ React.createElement("span", { className: `px-2 py-1 text-xs rounded-full font-medium ${tipoOrigem === "Faturamento" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}` }, tipoOrigem)), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600 truncate" }, descricaoItem), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600 truncate" }, recebimento.data, " - ", recebimento.formaPagamento), recebimento.usuarioResponsavel && /* @__PURE__ */ React.createElement("p", { className: "text-xs text-gray-500 flex items-center" }, /* @__PURE__ */ React.createElement(UserCheck, { className: "h-3 w-3 mr-1" }), "por: ", recebimento.usuarioResponsavel)), /* @__PURE__ */ React.createElement("div", { className: "text-right ml-2" }, /* @__PURE__ */ React.createElement("p", { className: "font-medium text-green-600" }, "R$ ", recebimento.valor?.toFixed(2)), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => excluirRecebimento(recebimento.id),
        className: "text-red-500 hover:text-red-700 text-xs"
      },
      /* @__PURE__ */ React.createElement(Trash2, { className: "h-3 w-3" })
    )));
  }))))), activeTab === "sistema" && /* @__PURE__ */ React.createElement("div", { className: "space-y-4 md:space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-lg md:text-xl font-semibold text-gray-900" }, "Sistema - Backup e Logs"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600" }, "Controle de seguran\xE7a, backup autom\xE1tico e logs de atividades")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row gap-2 w-full sm:w-auto" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => gerarBackup("manual"),
      className: "w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700"
    },
    /* @__PURE__ */ React.createElement(Shield, { className: "h-4 w-4" }),
    /* @__PURE__ */ React.createElement("span", null, "Backup Manual")
  ))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-green-50 p-4 rounded-lg border border-green-200" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement("div", { className: "w-3 h-3 bg-green-500 rounded-full animate-pulse mr-3" }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-sm font-medium text-green-900" }, "Status do Sistema"), /* @__PURE__ */ React.createElement("p", { className: "text-lg font-bold text-green-600" }, "Online")))), /* @__PURE__ */ React.createElement("div", { className: "bg-blue-50 p-4 rounded-lg border border-blue-200" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement(Shield, { className: "h-8 w-8 text-blue-500 mr-3" }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-sm font-medium text-blue-900" }, "\xDAltimo Backup"), /* @__PURE__ */ React.createElement("p", { className: "text-sm font-bold text-blue-600" }, ultimoBackup ? new Date(ultimoBackup).toLocaleDateString("pt-BR") : "Nunca")))), /* @__PURE__ */ React.createElement("div", { className: "bg-purple-50 p-4 rounded-lg border border-purple-200" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement(FileText, { className: "h-8 w-8 text-purple-500 mr-3" }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-sm font-medium text-purple-900" }, "Logs de Backup"), /* @__PURE__ */ React.createElement("p", { className: "text-lg font-bold text-purple-600" }, backupLogs.length)))), /* @__PURE__ */ React.createElement("div", { className: "bg-orange-50 p-4 rounded-lg border border-orange-200" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement(AlertCircle, { className: "h-8 w-8 text-orange-500 mr-3" }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-sm font-medium text-orange-900" }, "Backup Autom\xE1tico"), /* @__PURE__ */ React.createElement("p", { className: "text-sm font-bold text-orange-600" }, configuracaoBackup.autoBackup ? "Ativo" : "Inativo"))))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow p-4 md:p-6" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-medium text-gray-900 mb-4" }, "Configura\xE7\xF5es de Backup"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("label", { className: "flex items-center space-x-3" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "checkbox",
      checked: configuracaoBackup.autoBackup,
      onChange: (e) => setConfiguracaoBackup({
        ...configuracaoBackup,
        autoBackup: e.target.checked
      }),
      className: "w-4 h-4 text-blue-600"
    }
  ), /* @__PURE__ */ React.createElement("span", { className: "text-sm font-medium text-gray-900" }, "Backup Autom\xE1tico Di\xE1rio")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "Intervalo (dias)"), /* @__PURE__ */ React.createElement(
    "select",
    {
      value: configuracaoBackup.intervaloDias,
      onChange: (e) => setConfiguracaoBackup({
        ...configuracaoBackup,
        intervaloDias: parseInt(e.target.value)
      }),
      className: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
    },
    /* @__PURE__ */ React.createElement("option", { value: 1 }, "Di\xE1rio"),
    /* @__PURE__ */ React.createElement("option", { value: 2 }, "A cada 2 dias"),
    /* @__PURE__ */ React.createElement("option", { value: 7 }, "Semanal")
  ))), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "Manter hist\xF3rico (dias)"), /* @__PURE__ */ React.createElement(
    "select",
    {
      value: configuracaoBackup.manterHistorico,
      onChange: (e) => setConfiguracaoBackup({
        ...configuracaoBackup,
        manterHistorico: parseInt(e.target.value)
      }),
      className: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
    },
    /* @__PURE__ */ React.createElement("option", { value: 7 }, "7 dias"),
    /* @__PURE__ */ React.createElement("option", { value: 15 }, "15 dias"),
    /* @__PURE__ */ React.createElement("option", { value: 30 }, "30 dias"),
    /* @__PURE__ */ React.createElement("option", { value: 60 }, "60 dias")
  )), /* @__PURE__ */ React.createElement("label", { className: "flex items-center space-x-3" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "checkbox",
      checked: configuracaoBackup.incluirLogs,
      onChange: (e) => setConfiguracaoBackup({
        ...configuracaoBackup,
        incluirLogs: e.target.checked
      }),
      className: "w-4 h-4 text-blue-600"
    }
  ), /* @__PURE__ */ React.createElement("span", { className: "text-sm font-medium text-gray-900" }, "Incluir Logs nos Backups"))))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow p-4 md:p-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center mb-4" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-medium text-gray-900" }, "Backups Dispon\xEDveis"), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: limparBackupsAntigos,
      className: "text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
    },
    "Limpar Antigos"
  )), /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ React.createElement("table", { className: "min-w-full divide-y divide-gray-200" }, /* @__PURE__ */ React.createElement("thead", { className: "bg-gray-50" }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Data/Hora"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Tipo"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Usu\xE1rio"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Registros"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Tamanho"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "A\xE7\xF5es"))), /* @__PURE__ */ React.createElement("tbody", { className: "bg-white divide-y divide-gray-200" }, listarBackups().slice(0, 10).map((backup, index) => /* @__PURE__ */ React.createElement("tr", { key: backup.chave, className: "hover:bg-gray-50" }, /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900" }, backup.data, " ", backup.hora), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap" }, /* @__PURE__ */ React.createElement("span", { className: `px-2 py-1 text-xs rounded-full ${backup.tipo === "automatico" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}` }, backup.tipo.toUpperCase())), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900" }, backup.usuario), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900" }, backup.registros), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900" }, backup.tamanho), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => restaurarBackup(backup.chave),
      className: "text-green-600 hover:text-green-900 mr-3"
    },
    "Restaurar"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        if (confirm("Excluir este backup?")) {
          localStorage.removeItem(backup.chave);
          setActiveTab("sistema");
        }
      },
      className: "text-red-600 hover:text-red-900"
    },
    "Excluir"
  )))))), listarBackups().length === 0 && /* @__PURE__ */ React.createElement("div", { className: "text-center py-8 text-gray-500" }, "Nenhum backup encontrado"))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow p-4 md:p-6" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-medium text-gray-900 mb-4" }, "Hist\xF3rico de Backups"), /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, backupLogs.slice(-10).reverse().map((log) => /* @__PURE__ */ React.createElement("div", { key: log.id, className: `p-3 rounded border-l-4 ${log.status === "Sucesso" ? "bg-green-50 border-green-400" : "bg-red-50 border-red-400"}` }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-start" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "font-medium text-sm" }, log.tipo.toUpperCase(), " - ", log.status), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-gray-600" }, log.data, " \xE0s ", log.hora, " por ", log.usuario), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-gray-500 mt-1" }, log.observacoes)), /* @__PURE__ */ React.createElement("div", { className: "text-right text-xs text-gray-500" }, /* @__PURE__ */ React.createElement("p", null, log.registros, " registros"), /* @__PURE__ */ React.createElement("p", null, (log.tamanho / 1024).toFixed(2), " KB"))))), backupLogs.length === 0 && /* @__PURE__ */ React.createElement("div", { className: "text-center py-8 text-gray-500" }, "Nenhum log de backup encontrado"))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow p-4 md:p-6" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-medium text-gray-900 mb-4" }, "Logs de Atividade do Sistema"), /* @__PURE__ */ React.createElement("div", { className: "space-y-2 max-h-96 overflow-y-auto" }, (() => {
    const logsAtividade = JSON.parse(localStorage.getItem("logs_atividade") || "[]");
    return logsAtividade.slice(-20).reverse().map((log) => /* @__PURE__ */ React.createElement("div", { key: log.id, className: "p-2 border rounded text-xs" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center" }, /* @__PURE__ */ React.createElement("span", { className: "font-medium" }, log.acao), /* @__PURE__ */ React.createElement("span", { className: "text-gray-500" }, log.data, " ", log.hora)), /* @__PURE__ */ React.createElement("div", { className: "text-gray-600 mt-1" }, /* @__PURE__ */ React.createElement("p", null, "Usu\xE1rio: ", log.usuario), log.detalhes && /* @__PURE__ */ React.createElement("p", null, "Detalhes: ", log.detalhes))));
  })())), /* @__PURE__ */ React.createElement("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4" }, /* @__PURE__ */ React.createElement("h4", { className: "font-medium text-blue-900 mb-2" }, "Informa\xE7\xF5es do Sistema"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("strong", null, "Vers\xE3o:"), " v2.1.0"), /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("strong", null, "Build:"), " 2025.01")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("strong", null, "Navegador:"), " ", navigator.userAgent.substring(0, 30), "..."), /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("strong", null, "Armazenamento:"), " LocalStorage")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("strong", null, "Backup Autom\xE1tico:"), " ", configuracaoBackup.autoBackup ? "Ativo" : "Inativo"), /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("strong", null, "Pr\xF3ximo Backup:"), " ", ultimoBackup ? new Date(new Date(ultimoBackup).getTime() + configuracaoBackup.intervaloDias * 24 * 60 * 60 * 1e3).toLocaleDateString("pt-BR") : "Hoje"))))), activeTab === "admin" && /* @__PURE__ */ React.createElement("div", { className: "space-y-4 md:space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-lg md:text-xl font-semibold text-gray-900" }, "Administradores"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600" }, "Gerencie usu\xE1rios com acesso ao sistema")), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        setModalType("admin");
        setShowModal(true);
      },
      className: "w-full sm:w-auto bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-orange-700"
    },
    /* @__PURE__ */ React.createElement(Plus, { className: "h-4 w-4" }),
    /* @__PURE__ */ React.createElement("span", null, "Novo Administrador")
  )), /* @__PURE__ */ React.createElement("div", { className: "bg-amber-50 border border-amber-200 rounded-lg p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex" }, /* @__PURE__ */ React.createElement(Shield, { className: "h-5 w-5 text-amber-500 mr-3 mt-0.5" }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "text-sm font-medium text-amber-800" }, "\xC1rea Restrita"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-amber-700 mt-1" }, "Apenas usu\xE1rios com permiss\xF5es administrativas podem acessar esta se\xE7\xE3o. Mantenha as credenciais seguras e atualize as senhas regularmente.")))), /* @__PURE__ */ React.createElement("div", { className: "space-y-3 md:hidden" }, usuariosAdmin.map((admin) => /* @__PURE__ */ React.createElement("div", { key: admin.id, className: "bg-white rounded-lg shadow p-4 border-l-4 border-orange-500" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-start mb-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex-1" }, /* @__PURE__ */ React.createElement("h3", { className: "font-medium text-gray-900" }, admin.nome), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600" }, admin.cargo), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-orange-600 font-medium" }, "@", admin.usuario)), /* @__PURE__ */ React.createElement(Shield, { className: "h-5 w-5 text-orange-500" })), /* @__PURE__ */ React.createElement("div", { className: "flex space-x-2" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => editarAdmin(admin),
      className: "flex-1 bg-orange-600 text-white px-3 py-2 rounded text-sm hover:bg-orange-700"
    },
    "Editar"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => excluirAdmin(admin.id),
      className: "bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700",
      disabled: usuariosAdmin.length <= 1
    },
    /* @__PURE__ */ React.createElement(Trash2, { className: "h-4 w-4" })
  )), usuariosAdmin.length <= 1 && /* @__PURE__ */ React.createElement("p", { className: "text-xs text-red-500 mt-2" }, "\u26A0\uFE0F \xDAltimo administrador - n\xE3o pode ser exclu\xEDdo")))), /* @__PURE__ */ React.createElement("div", { className: "hidden md:block bg-white rounded-lg shadow overflow-hidden" }, /* @__PURE__ */ React.createElement("table", { className: "min-w-full divide-y divide-gray-200" }, /* @__PURE__ */ React.createElement("thead", { className: "bg-gray-50" }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Nome"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Usu\xE1rio"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Cargo"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Senha"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "A\xE7\xF5es"))), /* @__PURE__ */ React.createElement("tbody", { className: "bg-white divide-y divide-gray-200" }, usuariosAdmin.map((admin) => /* @__PURE__ */ React.createElement("tr", { key: admin.id, className: "hover:bg-gray-50" }, /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement(Shield, { className: "h-5 w-5 text-orange-500 mr-3" }), /* @__PURE__ */ React.createElement("div", { className: "text-sm font-medium text-gray-900" }, admin.nome))), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm text-orange-600 font-medium" }, "@", admin.usuario)), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900" }, admin.cargo), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap" }, /* @__PURE__ */ React.createElement("code", { className: "text-xs bg-gray-100 px-2 py-1 rounded" }, "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022")), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => editarAdmin(admin),
      className: "text-orange-600 hover:text-orange-900 mr-3"
    },
    /* @__PURE__ */ React.createElement(Edit, { className: "h-4 w-4" })
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => excluirAdmin(admin.id),
      className: `${usuariosAdmin.length <= 1 ? "text-gray-400 cursor-not-allowed" : "text-red-600 hover:text-red-900"}`,
      disabled: usuariosAdmin.length <= 1
    },
    /* @__PURE__ */ React.createElement(Trash2, { className: "h-4 w-4" })
  )))))), usuariosAdmin.length <= 1 && /* @__PURE__ */ React.createElement("div", { className: "px-6 py-3 bg-red-50 border-t border-red-200" }, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-red-700 flex items-center" }, /* @__PURE__ */ React.createElement(Shield, { className: "h-4 w-4 mr-2" }), "\xDAltimo administrador ativo - n\xE3o pode ser exclu\xEDdo por seguran\xE7a"))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-orange-50 p-4 rounded-lg" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement(Users, { className: "h-8 w-8 text-orange-500 mr-3" }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-sm font-medium text-orange-900" }, "Total de Administradores"), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold text-orange-600" }, usuariosAdmin.length)))), /* @__PURE__ */ React.createElement("div", { className: "bg-green-50 p-4 rounded-lg" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement(Shield, { className: "h-8 w-8 text-green-500 mr-3" }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-sm font-medium text-green-900" }, "Sistema Seguro"), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold text-green-600" }, "\u2713")))), /* @__PURE__ */ React.createElement("div", { className: "bg-blue-50 p-4 rounded-lg" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement(Calendar, { className: "h-8 w-8 text-blue-500 mr-3" }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-sm font-medium text-blue-900" }, "\xDAltimo Acesso"), /* @__PURE__ */ React.createElement("p", { className: "text-sm font-bold text-blue-600" }, "Hoje")))))), activeTab === "relatorios" && /* @__PURE__ */ React.createElement("div", { className: "space-y-4 md:space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-lg md:text-xl font-semibold text-gray-900" }, "Centro de Relat\xF3rios"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600" }, "Gere relat\xF3rios detalhados para impress\xE3o e an\xE1lise")), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: imprimirRelatorio,
      className: "bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-700 print:hidden"
    },
    /* @__PURE__ */ React.createElement(Printer, { className: "h-4 w-4" }),
    /* @__PURE__ */ React.createElement("span", null, "Imprimir Relat\xF3rio")
  )), /* @__PURE__ */ React.createElement("div", { className: "bg-white p-4 rounded-lg shadow print:hidden" }, /* @__PURE__ */ React.createElement("h3", { className: "text-sm font-medium text-gray-700 mb-3" }, "Tipo de Relat\xF3rio"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs text-gray-600 mb-1" }, "Categoria:"), /* @__PURE__ */ React.createElement(
    "select",
    {
      value: tipoRelatorio.split("-")[0],
      onChange: (e) => {
        const categoria = e.target.value;
        const periodo = tipoRelatorio.split("-")[1] || "diario";
        setTipoRelatorio(`${categoria}-${periodo}`);
      },
      className: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
    },
    /* @__PURE__ */ React.createElement("option", { value: "financeiro" }, "Financeiro"),
    /* @__PURE__ */ React.createElement("option", { value: "reservas" }, "Reservas"),
    /* @__PURE__ */ React.createElement("option", { value: "quadras" }, "Programa\xE7\xE3o de Quadras")
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs text-gray-600 mb-1" }, "Per\xEDodo:"), /* @__PURE__ */ React.createElement(
    "select",
    {
      value: tipoRelatorio.split("-")[1],
      onChange: (e) => {
        const categoria = tipoRelatorio.split("-")[0];
        const periodo = e.target.value;
        setTipoRelatorio(`${categoria}-${periodo}`);
      },
      className: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
    },
    /* @__PURE__ */ React.createElement("option", { value: "diario" }, "Di\xE1rio"),
    /* @__PURE__ */ React.createElement("option", { value: "semanal" }, "Semanal"),
    /* @__PURE__ */ React.createElement("option", { value: "mensal" }, "Mensal"),
    /* @__PURE__ */ React.createElement("option", { value: "anual" }, "Anual")
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs text-gray-600 mb-1" }, tipoRelatorio.includes("diario") ? "Data:" : tipoRelatorio.includes("semanal") ? "Semana de:" : tipoRelatorio.includes("anual") ? "Ano:" : "M\xEAs/Ano:"), tipoRelatorio.includes("anual") ? /* @__PURE__ */ React.createElement(
    "select",
    {
      value: anoRelatorio,
      onChange: (e) => setAnoRelatorio(e.target.value),
      className: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
    },
    Array.from({ length: 5 }, (_, i) => {
      const ano = (/* @__PURE__ */ new Date()).getFullYear() - 2 + i;
      return /* @__PURE__ */ React.createElement("option", { key: ano, value: ano }, ano);
    })
  ) : tipoRelatorio.includes("mensal") ? /* @__PURE__ */ React.createElement(
    "select",
    {
      value: mesImpressao,
      onChange: (e) => setMesImpressao(e.target.value),
      className: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
    },
    (() => {
      const options = [];
      const hoje2 = /* @__PURE__ */ new Date();
      for (let i = -6; i <= 6; i++) {
        const data = new Date(hoje2.getFullYear(), hoje2.getMonth() + i, 1);
        const valor = `${data.getFullYear()}-${(data.getMonth() + 1).toString().padStart(2, "0")}`;
        const texto = data.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
        options.push(
          /* @__PURE__ */ React.createElement("option", { key: valor, value: valor }, texto.charAt(0).toUpperCase() + texto.slice(1))
        );
      }
      return options;
    })()
  ) : /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "date",
      value: tipoRelatorio.includes("semanal") ? semanaImpressao : dataRelatorio,
      onChange: (e) => {
        if (tipoRelatorio.includes("semanal")) {
          setSemanaImpressao(e.target.value);
        } else {
          setDataRelatorio(e.target.value);
        }
      },
      className: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs text-gray-600 mb-1" }, "Quadra:"), /* @__PURE__ */ React.createElement(
    "select",
    {
      value: quadraImpressao,
      onChange: (e) => setQuadraImpressao(e.target.value),
      className: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
    },
    /* @__PURE__ */ React.createElement("option", { value: "" }, "Todas as Quadras"),
    quadras.filter((q) => q.ativa).map((quadra) => /* @__PURE__ */ React.createElement("option", { key: quadra.id, value: quadra.id }, quadra.nome))
  ))))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow overflow-hidden print:shadow-none print:border-0 print:rounded-none" }, /* @__PURE__ */ React.createElement("div", { className: "p-3 md:p-6 print:p-0 print:m-0" }, /* @__PURE__ */ React.createElement("div", { className: "text-center mb-4 md:mb-6 print:mb-3 print:break-inside-avoid" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center mb-2 print:mb-1" }, /* @__PURE__ */ React.createElement(
    "img",
    {
      src: "assets/QnQ2IRKmq0zfR25_j1Nkf.png",
      alt: "Esporte Clube Jurema",
      className: "h-12 w-12 md:h-16 md:w-16 rounded-full bg-white p-1 mr-3 print:h-10 print:w-10"
    }
  ), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", { className: "text-lg md:text-2xl font-bold text-green-700 print:text-lg" }, "ESPORTE CLUBE JUREMA"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-green-600 print:text-sm" }, "Valinhos - Fundado em 03/09/2006"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-gray-600 print:text-xs mt-1" }, "Sistema de Gest\xE3o com Controle de Usu\xE1rios - ", tipoRelatorio.includes("financeiro") ? "Relat\xF3rio Financeiro" : tipoRelatorio.includes("reservas") ? "Relat\xF3rio de Reservas" : "Programa\xE7\xE3o de Quadras"))), (() => {
    const getTituloRelatorio = () => {
      const categoria = tipoRelatorio.split("-")[0];
      const periodo = tipoRelatorio.split("-")[1];
      const quadraSelecionada = quadraImpressao ? quadras.find((q) => q.id == quadraImpressao) : null;
      let titulo = "";
      if (categoria === "financeiro") titulo = "Relat\xF3rio Financeiro";
      else if (categoria === "reservas") titulo = "Relat\xF3rio de Reservas";
      else titulo = "Programa\xE7\xE3o de Quadras";
      if (periodo === "diario") {
        return `${titulo} - ${new Date(dataRelatorio).toLocaleDateString("pt-BR")}`;
      } else if (periodo === "semanal") {
        const dataInicio = new Date(semanaImpressao);
        const dataFim = new Date(dataInicio);
        dataFim.setDate(dataInicio.getDate() + 6);
        return `${titulo} - Semana de ${dataInicio.toLocaleDateString("pt-BR")} a ${dataFim.toLocaleDateString("pt-BR")}`;
      } else if (periodo === "mensal") {
        const [ano, mes] = mesImpressao.split("-");
        const data = new Date(parseInt(ano), parseInt(mes) - 1, 1);
        return `${titulo} - ${data.toLocaleDateString("pt-BR", { month: "long", year: "numeric" }).toUpperCase()}`;
      } else if (periodo === "anual") {
        return `${titulo} - Ano ${anoRelatorio}`;
      }
      return titulo;
    };
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-base md:text-lg font-semibold text-gray-800 print:text-base" }, quadraImpressao ? `${quadras.find((q) => q.id == quadraImpressao)?.nome} - ` : "Todas as Quadras - ", getTituloRelatorio()), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600 print:text-sm mt-1" }, "Gerado em: ", (/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR"), " \xE0s ", (/* @__PURE__ */ new Date()).toLocaleTimeString("pt-BR")));
  })()), (() => {
    if (tipoRelatorio.includes("financeiro")) {
      return /* @__PURE__ */ React.createElement("div", null, (() => {
        let dataInicio, dataFim;
        if (tipoRelatorio.includes("diario")) {
          dataInicio = new Date(dataRelatorio);
          dataFim = new Date(dataInicio);
          dataFim.setDate(dataInicio.getDate() + 1);
        } else if (tipoRelatorio.includes("semanal")) {
          dataInicio = new Date(semanaImpressao);
          dataFim = new Date(dataInicio);
          dataFim.setDate(dataInicio.getDate() + 6);
        } else if (tipoRelatorio.includes("mensal")) {
          const [ano, mes] = mesImpressao.split("-");
          dataInicio = new Date(parseInt(ano), parseInt(mes) - 1, 1);
          dataFim = new Date(parseInt(ano), parseInt(mes), 0);
        } else if (tipoRelatorio.includes("anual")) {
          dataInicio = new Date(parseInt(anoRelatorio), 0, 1);
          dataFim = new Date(parseInt(anoRelatorio), 11, 31);
        }
        const reservasPeriodo = reservas.filter((r) => {
          const dataReserva = new Date(r.data);
          return dataReserva >= dataInicio && dataReserva <= dataFim && (!quadraImpressao || r.quadraId == quadraImpressao);
        });
        const faturamentosPeriodo = faturamentos.filter((f) => {
          const dataFaturamento = new Date(f.data);
          return dataFaturamento >= dataInicio && dataFaturamento <= dataFim;
        });
        return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "border rounded-lg p-4" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold text-blue-700 mb-4" }, "Resumo Financeiro"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-sm" }, /* @__PURE__ */ React.createElement("div", { className: "bg-blue-50 p-3 rounded" }, /* @__PURE__ */ React.createElement("p", { className: "text-blue-600 font-medium" }, "Faturamento Reservas"), /* @__PURE__ */ React.createElement("p", { className: "text-xl font-bold text-blue-700" }, "R$ ", reservasPeriodo.reduce((acc, r) => acc + (r.valor || 0), 0).toFixed(2))), /* @__PURE__ */ React.createElement("div", { className: "bg-green-50 p-3 rounded" }, /* @__PURE__ */ React.createElement("p", { className: "text-green-600 font-medium" }, "Recebido Reservas"), /* @__PURE__ */ React.createElement("p", { className: "text-xl font-bold text-green-700" }, "R$ ", reservasPeriodo.reduce((acc, r) => acc + (r.valorPago || 0), 0).toFixed(2))), /* @__PURE__ */ React.createElement("div", { className: "bg-purple-50 p-3 rounded" }, /* @__PURE__ */ React.createElement("p", { className: "text-purple-600 font-medium" }, "Faturamento Outros"), /* @__PURE__ */ React.createElement("p", { className: "text-xl font-bold text-purple-700" }, "R$ ", faturamentosPeriodo.reduce((acc, f) => acc + (f.valor || 0), 0).toFixed(2))), /* @__PURE__ */ React.createElement("div", { className: "bg-orange-50 p-3 rounded" }, /* @__PURE__ */ React.createElement("p", { className: "text-orange-600 font-medium" }, "Recebido Outros"), /* @__PURE__ */ React.createElement("p", { className: "text-xl font-bold text-orange-700" }, "R$ ", faturamentosPeriodo.reduce((acc, f) => acc + (f.valorRealRecebido || 0), 0).toFixed(2))))), (quadraImpressao ? quadras.filter((q) => q.id == quadraImpressao) : quadras.filter((q) => q.ativa)).map((quadra) => {
          const reservasQuadra = reservasPeriodo.filter((r) => r.quadraId === quadra.id);
          const receitaQuadra = reservasQuadra.reduce((acc, r) => acc + (r.valor || 0), 0);
          const recebidoQuadra = reservasQuadra.reduce((acc, r) => acc + (r.valorPago || 0), 0);
          return /* @__PURE__ */ React.createElement("div", { key: quadra.id, className: "border rounded-lg p-4" }, /* @__PURE__ */ React.createElement("h4", { className: "text-base font-semibold text-gray-808 mb-3" }, quadra.nome, " - ", quadra.modalidade), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-3 gap-4 mb-4 text-sm" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-gray-600" }, "Reservas:"), /* @__PURE__ */ React.createElement("p", { className: "font-bold text-lg" }, reservasQuadra.length)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-gray-600" }, "Faturado:"), /* @__PURE__ */ React.createElement("p", { className: "font-bold text-lg text-blue-600" }, "R$ ", receitaQuadra.toFixed(2))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-gray-600" }, "Recebido:"), /* @__PURE__ */ React.createElement("p", { className: "font-bold text-lg text-green-600" }, "R$ ", recebidoQuadra.toFixed(2)))), reservasQuadra.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto print:overflow-visible" }, /* @__PURE__ */ React.createElement("table", { className: "min-w-full border-collapse border border-gray-300 text-xs print:text-xs print:w-full" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { className: "bg-gray-50" }, /* @__PURE__ */ React.createElement("th", { className: "border border-gray-300 px-2 py-1 text-left" }, "Data"), /* @__PURE__ */ React.createElement("th", { className: "border border-gray-300 px-2 py-1 text-left" }, "Hor\xE1rio"), /* @__PURE__ */ React.createElement("th", { className: "border border-gray-300 px-2 py-1 text-left" }, "Cliente"), /* @__PURE__ */ React.createElement("th", { className: "border border-gray-300 px-2 py-1 text-left" }, "Valor"), /* @__PURE__ */ React.createElement("th", { className: "border border-gray-300 px-2 py-1 text-left" }, "Pago"), /* @__PURE__ */ React.createElement("th", { className: "border border-gray-300 px-2 py-1 text-left" }, "Status"))), /* @__PURE__ */ React.createElement("tbody", null, reservasQuadra.sort((a, b) => a.data.localeCompare(b.data)).map((reserva, idx) => {
            const cliente = clientes.find((c) => c.id === reserva.clienteId);
            return /* @__PURE__ */ React.createElement("tr", { key: idx, className: idx % 2 === 0 ? "bg-white" : "bg-gray-50" }, /* @__PURE__ */ React.createElement("td", { className: "border border-gray-300 px-2 py-1" }, new Date(reserva.data).toLocaleDateString("pt-BR")), /* @__PURE__ */ React.createElement("td", { className: "border border-gray-300 px-2 py-1" }, reserva.horaInicio, " - ", reserva.horaFim), /* @__PURE__ */ React.createElement("td", { className: "border border-gray-300 px-2 py-1" }, cliente?.nome || "N/A"), /* @__PURE__ */ React.createElement("td", { className: "border border-gray-300 px-2 py-1 text-blue-600 font-medium" }, "R$ ", reserva.valor?.toFixed(2)), /* @__PURE__ */ React.createElement("td", { className: "border border-gray-300 px-2 py-1 text-green-600 font-medium" }, "R$ ", (reserva.valorPago || 0).toFixed(2)), /* @__PURE__ */ React.createElement("td", { className: "border border-gray-300 px-2 py-1" }, /* @__PURE__ */ React.createElement("span", { className: `px-1 py-0.5 text-xs rounded ${reserva.statusPagamento === "Pago" ? "bg-green-100 text-green-800" : reserva.statusPagamento === "Parcial" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}` }, reserva.statusPagamento || "Pendente")));
          })))));
        }), faturamentosPeriodo.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "border rounded-lg p-4 print:break-inside-avoid print:page-break-before-auto" }, /* @__PURE__ */ React.createElement("h4", { className: "text-base font-semibold text-gray-800 mb-3" }, "Faturamentos Administrativos"), /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto print:overflow-visible" }, /* @__PURE__ */ React.createElement("table", { className: "min-w-full border-collapse border border-gray-300 text-xs print:text-xs print:w-full" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { className: "bg-gray-50" }, /* @__PURE__ */ React.createElement("th", { className: "border border-gray-300 px-2 py-1 text-left" }, "Data"), /* @__PURE__ */ React.createElement("th", { className: "border border-gray-300 px-2 py-1 text-left" }, "Cliente"), /* @__PURE__ */ React.createElement("th", { className: "border border-gray-300 px-2 py-1 text-left" }, "Tipo"), /* @__PURE__ */ React.createElement("th", { className: "border border-gray-300 px-2 py-1 text-left" }, "Valor"), /* @__PURE__ */ React.createElement("th", { className: "border border-gray-300 px-2 py-1 text-left" }, "Recebido"), /* @__PURE__ */ React.createElement("th", { className: "border border-gray-300 px-2 py-1 text-left" }, "Em Aberto"))), /* @__PURE__ */ React.createElement("tbody", null, faturamentosPeriodo.sort((a, b) => a.data.localeCompare(b.data)).map((faturamento, idx) => /* @__PURE__ */ React.createElement("tr", { key: idx, className: idx % 2 === 0 ? "bg-white" : "bg-gray-50" }, /* @__PURE__ */ React.createElement("td", { className: "border border-gray-300 px-2 py-1" }, new Date(faturamento.data).toLocaleDateString("pt-BR")), /* @__PURE__ */ React.createElement("td", { className: "border border-gray-300 px-2 py-1" }, faturamento.cliente), /* @__PURE__ */ React.createElement("td", { className: "border border-gray-300 px-2 py-1" }, faturamento.tipoLocacao), /* @__PURE__ */ React.createElement("td", { className: "border border-gray-300 px-2 py-1 text-blue-600 font-medium" }, "R$ ", faturamento.valor?.toFixed(2)), /* @__PURE__ */ React.createElement("td", { className: "border border-gray-300 px-2 py-1 text-green-600 font-medium" }, "R$ ", (faturamento.valorRealRecebido || 0).toFixed(2)), /* @__PURE__ */ React.createElement("td", { className: "border border-gray-300 px-2 py-1 text-red-600 font-medium" }, "R$ ", (faturamento.valorEmAberto || 0).toFixed(2)))))))));
      })());
    } else if (tipoRelatorio.includes("reservas")) {
      return /* @__PURE__ */ React.createElement("div", null, (() => {
        let dataInicio, dataFim;
        if (tipoRelatorio.includes("diario")) {
          dataInicio = new Date(dataRelatorio);
          dataFim = new Date(dataInicio);
          dataFim.setDate(dataInicio.getDate() + 1);
        } else if (tipoRelatorio.includes("semanal")) {
          dataInicio = new Date(semanaImpressao);
          dataFim = new Date(dataInicio);
          dataFim.setDate(dataInicio.getDate() + 6);
        } else if (tipoRelatorio.includes("mensal")) {
          const [ano, mes] = mesImpressao.split("-");
          dataInicio = new Date(parseInt(ano), parseInt(mes) - 1, 1);
          dataFim = new Date(parseInt(ano), parseInt(mes), 0);
        } else if (tipoRelatorio.includes("anual")) {
          dataInicio = new Date(parseInt(anoRelatorio), 0, 1);
          dataFim = new Date(parseInt(anoRelatorio), 11, 31);
        }
        const reservasPeriodo = reservas.filter((r) => {
          const dataReserva = new Date(r.data);
          return dataReserva >= dataInicio && dataReserva <= dataFim && (!quadraImpressao || r.quadraId == quadraImpressao);
        });
        const confirmadasCount = reservasPeriodo.filter((r) => r.status === "Confirmada").length;
        const pendentesCount = reservasPeriodo.filter((r) => r.status === "Pendente").length;
        const canceladasCount = reservasPeriodo.filter((r) => r.status === "Cancelada").length;
        return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "border rounded-lg p-4" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold text-blue-700 mb-4" }, "Resumo de Reservas"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-sm" }, /* @__PURE__ */ React.createElement("div", { className: "bg-blue-50 p-3 rounded" }, /* @__PURE__ */ React.createElement("p", { className: "text-blue-600 font-medium" }, "Total"), /* @__PURE__ */ React.createElement("p", { className: "text-xl font-bold text-blue-700" }, reservasPeriodo.length)), /* @__PURE__ */ React.createElement("div", { className: "bg-green-50 p-3 rounded" }, /* @__PURE__ */ React.createElement("p", { className: "text-green-600 font-medium" }, "Confirmadas"), /* @__PURE__ */ React.createElement("p", { className: "text-xl font-bold text-green-700" }, confirmadasCount)), /* @__PURE__ */ React.createElement("div", { className: "bg-yellow-50 p-3 rounded" }, /* @__PURE__ */ React.createElement("p", { className: "text-yellow-600 font-medium" }, "Pendentes"), /* @__PURE__ */ React.createElement("p", { className: "text-xl font-bold text-yellow-700" }, pendentesCount)), /* @__PURE__ */ React.createElement("div", { className: "bg-red-50 p-3 rounded" }, /* @__PURE__ */ React.createElement("p", { className: "text-red-600 font-medium" }, "Canceladas"), /* @__PURE__ */ React.createElement("p", { className: "text-xl font-bold text-red-700" }, canceladasCount)))), tipoRelatorio.includes("diario") ? (
          // Para relatório diário, mostrar por horário
          /* @__PURE__ */ React.createElement("div", { className: "border rounded-lg p-4" }, /* @__PURE__ */ React.createElement("h4", { className: "text-base font-semibold text-gray-800 mb-3" }, "Reservas do Dia - ", new Date(dataRelatorio).toLocaleDateString("pt-BR")), /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ React.createElement("table", { className: "min-w-full border-collapse border border-gray-300 text-xs" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { className: "bg-gray-50" }, /* @__PURE__ */ React.createElement("th", { className: "border border-gray-300 px-2 py-1 text-left" }, "Hor\xE1rio"), /* @__PURE__ */ React.createElement("th", { className: "border border-gray-300 px-2 py-1 text-left" }, "Quadra"), /* @__PURE__ */ React.createElement("th", { className: "border border-gray-300 px-2 py-1 text-left" }, "Cliente"), /* @__PURE__ */ React.createElement("th", { className: "border border-gray-300 px-2 py-1 text-left" }, "Valor"), /* @__PURE__ */ React.createElement("th", { className: "border border-gray-300 px-2 py-1 text-left" }, "Status"), /* @__PURE__ */ React.createElement("th", { className: "border border-gray-300 px-2 py-1 text-left" }, "Respons\xE1vel"))), /* @__PURE__ */ React.createElement("tbody", null, reservasPeriodo.sort((a, b) => a.horaInicio.localeCompare(b.horaInicio)).map((reserva, idx) => {
            const quadra = quadras.find((q) => q.id === reserva.quadraId);
            const cliente = clientes.find((c) => c.id === reserva.clienteId);
            return /* @__PURE__ */ React.createElement("tr", { key: idx, className: idx % 2 === 0 ? "bg-white" : "bg-gray-50" }, /* @__PURE__ */ React.createElement("td", { className: "border border-gray-300 px-2 py-1 font-medium" }, reserva.horaInicio, " - ", reserva.horaFim), /* @__PURE__ */ React.createElement("td", { className: "border border-gray-300 px-2 py-1" }, quadra?.nome), /* @__PURE__ */ React.createElement("td", { className: "border border-gray-300 px-2 py-1" }, cliente?.nome), /* @__PURE__ */ React.createElement("td", { className: "border border-gray-300 px-2 py-1 text-blue-600 font-medium" }, "R$ ", reserva.valor?.toFixed(2)), /* @__PURE__ */ React.createElement("td", { className: "border border-gray-300 px-2 py-1" }, /* @__PURE__ */ React.createElement("span", { className: `px-1 py-0.5 text-xs rounded ${reserva.status === "Confirmada" ? "bg-green-100 text-green-800" : reserva.status === "Pendente" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}` }, reserva.status)), /* @__PURE__ */ React.createElement("td", { className: "border border-gray-300 px-2 py-1 text-xs" }, reserva.usuarioResponsavel || "N/A"));
          })))))
        ) : (
          // Para outros períodos, agrupar por quadra
          (quadraImpressao ? quadras.filter((q) => q.id == quadraImpressao) : quadras.filter((q) => q.ativa)).map((quadra) => {
            const reservasQuadra = reservasPeriodo.filter((r) => r.quadraId === quadra.id);
            return reservasQuadra.length > 0 && /* @__PURE__ */ React.createElement("div", { key: quadra.id, className: "border rounded-lg p-4" }, /* @__PURE__ */ React.createElement("h4", { className: "text-base font-semibold text-gray-800 mb-3" }, quadra.nome, " - ", quadra.modalidade), /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ React.createElement("table", { className: "min-w-full border-collapse border border-gray-300 text-xs" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { className: "bg-gray-50" }, /* @__PURE__ */ React.createElement("th", { className: "border border-gray-300 px-2 py-1 text-left" }, "Data"), /* @__PURE__ */ React.createElement("th", { className: "border border-gray-300 px-2 py-1 text-left" }, "Hor\xE1rio"), /* @__PURE__ */ React.createElement("th", { className: "border border-gray-300 px-2 py-1 text-left" }, "Cliente"), /* @__PURE__ */ React.createElement("th", { className: "border border-gray-300 px-2 py-1 text-left" }, "Valor"), /* @__PURE__ */ React.createElement("th", { className: "border border-gray-300 px-2 py-1 text-left" }, "Status"))), /* @__PURE__ */ React.createElement("tbody", null, reservasQuadra.sort((a, b) => a.data.localeCompare(b.data) || a.horaInicio.localeCompare(b.horaInicio)).map((reserva, idx) => {
              const cliente = clientes.find((c) => c.id === reserva.clienteId);
              return /* @__PURE__ */ React.createElement("tr", { key: idx, className: idx % 2 === 0 ? "bg-white" : "bg-gray-50" }, /* @__PURE__ */ React.createElement("td", { className: "border border-gray-300 px-2 py-1" }, new Date(reserva.data).toLocaleDateString("pt-BR")), /* @__PURE__ */ React.createElement("td", { className: "border border-gray-300 px-2 py-1 font-medium" }, reserva.horaInicio, " - ", reserva.horaFim), /* @__PURE__ */ React.createElement("td", { className: "border border-gray-300 px-2 py-1" }, cliente?.nome), /* @__PURE__ */ React.createElement("td", { className: "border border-gray-300 px-2 py-1 text-blue-600 font-medium" }, "R$ ", reserva.valor?.toFixed(2)), /* @__PURE__ */ React.createElement("td", { className: "border border-gray-300 px-2 py-1" }, /* @__PURE__ */ React.createElement("span", { className: `px-1 py-0.5 text-xs rounded ${reserva.status === "Confirmada" ? "bg-green-100 text-green-800" : reserva.status === "Pendente" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}` }, reserva.status)));
            })))));
          })
        ));
      })());
    } else {
      return /* @__PURE__ */ React.createElement("div", null, (() => {
        const dataInicio = new Date(semanaImpressao);
        const quadrasParaExibir = quadraImpressao ? quadras.filter((q) => q.id == quadraImpressao) : quadras.filter((q) => q.ativa);
        const diasSemana = [];
        for (let i = 0; i < 7; i++) {
          const data = new Date(dataInicio);
          data.setDate(dataInicio.getDate() + i);
          diasSemana.push(data);
        }
        return quadrasParaExibir.map((quadra) => /* @__PURE__ */ React.createElement("div", { key: quadra.id, className: "mb-6 print:mb-4 print:break-inside-avoid" }, /* @__PURE__ */ React.createElement("h3", { className: "text-base md:text-lg font-semibold text-blue-700 mb-3 print:text-base border-b border-blue-200 pb-2" }, quadra.nome, " - ", quadra.modalidade), /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ React.createElement("table", { className: "min-w-full border-collapse border border-gray-300 text-xs md:text-sm print:text-xs" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { className: "bg-blue-50 print:bg-gray-100" }, /* @__PURE__ */ React.createElement("th", { className: "border border-gray-300 px-2 md:px-3 py-2 text-left font-medium w-20" }, "Data"), /* @__PURE__ */ React.createElement("th", { className: "border border-gray-300 px-2 md:px-3 py-2 text-left font-medium w-16" }, "Dia"), /* @__PURE__ */ React.createElement("th", { className: "border border-gray-300 px-2 md:px-3 py-2 text-left font-medium" }, "Hor\xE1rios e Reservas"))), /* @__PURE__ */ React.createElement("tbody", null, diasSemana.map((data, index) => {
          const dataStr = data.toISOString().split("T")[0];
          const diaSemana = data.toLocaleDateString("pt-BR", { weekday: "long" });
          const reservasDoDia = reservas.filter(
            (r) => r.data === dataStr && r.quadraId === quadra.id
          ).sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
          return /* @__PURE__ */ React.createElement("tr", { key: index, className: `${index % 2 === 0 ? "bg-white" : "bg-gray-50"} print:break-inside-avoid` }, /* @__PURE__ */ React.createElement("td", { className: "border border-gray-300 px-2 md:px-3 py-2 font-medium text-blue-600" }, data.getDate().toString().padStart(2, "0"), "/", (data.getMonth() + 1).toString().padStart(2, "0")), /* @__PURE__ */ React.createElement("td", { className: "border border-gray-300 px-2 md:px-3 py-2 text-gray-700 capitalize" }, diaSemana), /* @__PURE__ */ React.createElement("td", { className: "border border-gray-300 px-2 md:px-3 py-2" }, reservasDoDia.length > 0 ? /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, reservasDoDia.map((reserva, idx) => {
            const cliente = clientes.find((c) => c.id === reserva.clienteId);
            return /* @__PURE__ */ React.createElement(
              "div",
              {
                key: idx,
                className: `p-2 rounded border-l-4 ${reserva.status === "Confirmada" ? "bg-green-50 border-green-400" : reserva.status === "Pendente" ? "bg-yellow-50 border-yellow-400" : "bg-red-50 border-red-400"}`
              },
              /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-2 text-xs" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold text-blue-700" }, reserva.horaInicio, " - ", reserva.horaFim), /* @__PURE__ */ React.createElement("span", { className: "font-medium text-gray-800" }, cliente?.nome || "Cliente N/A"), /* @__PURE__ */ React.createElement("span", { className: "text-green-600 font-medium" }, "R$ ", reserva.valor?.toFixed(2)), /* @__PURE__ */ React.createElement("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${reserva.status === "Confirmada" ? "bg-green-100 text-green-800" : reserva.status === "Pendente" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}` }, reserva.status)),
              reserva.usuarioResponsavel && /* @__PURE__ */ React.createElement("div", { className: "mt-1 text-xs text-gray-500 flex items-center" }, /* @__PURE__ */ React.createElement(UserCheck, { className: "h-3 w-3 mr-1" }), "Agendado por: ", /* @__PURE__ */ React.createElement("strong", { className: "ml-1" }, reserva.usuarioResponsavel), reserva.dataLancamento && /* @__PURE__ */ React.createElement("span", { className: "ml-2 text-gray-400" }, "\u2022 ", new Date(reserva.dataLancamento).toLocaleDateString("pt-BR"))),
              reserva.observacoes && /* @__PURE__ */ React.createElement("div", { className: "mt-1 text-xs text-gray-600 italic" }, "Obs: ", reserva.observacoes)
            );
          })) : /* @__PURE__ */ React.createElement("div", { className: "text-center text-gray-400 py-4 italic" }, "Nenhuma reserva para este dia")));
        })))), /* @__PURE__ */ React.createElement("div", { className: "mt-3 p-3 bg-blue-50 rounded border print:bg-gray-100" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 text-xs" }, (() => {
          const reservasQuadra = reservas.filter((r) => {
            const dataReserva = new Date(r.data);
            const dataInicio2 = new Date(semanaImpressao);
            const dataFim = new Date(dataInicio2);
            dataFim.setDate(dataInicio2.getDate() + 6);
            return r.quadraId === quadra.id && dataReserva >= dataInicio2 && dataReserva <= dataFim;
          });
          const totalReservas = reservasQuadra.length;
          const reservasConfirmadas = reservasQuadra.filter((r) => r.status === "Confirmada").length;
          const receitaTotal = reservasQuadra.reduce((acc, r) => acc + (r.valor || 0), 0);
          const receitaPaga = reservasQuadra.reduce((acc, r) => acc + (r.valorPago || 0), 0);
          return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-gray-600" }, "Total de Reservas:"), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-blue-600 ml-1" }, totalReservas)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-gray-600" }, "Confirmadas:"), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-green-600 ml-1" }, reservasConfirmadas)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-gray-600" }, "Receita Total:"), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-blue-600 ml-1" }, "R$ ", receitaTotal.toFixed(2))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-gray-600" }, "Valor Recebido:"), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-green-600 ml-1" }, "R$ ", receitaPaga.toFixed(2))));
        })()))));
      })());
    }
  })(), /* @__PURE__ */ React.createElement("div", { className: "mt-4 md:mt-6 print:mt-4" }, /* @__PURE__ */ React.createElement("h3", { className: "text-sm md:text-lg font-medium text-gray-900 mb-2 md:mb-3 print:text-sm" }, "Legenda e Informa\xE7\xF5es"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 print:gap-4 text-xs md:text-sm print:text-xs" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement("h4", { className: "font-medium text-gray-800" }, "Status das Reservas:"), /* @__PURE__ */ React.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement("div", { className: "w-3 h-3 bg-green-100 border-l-4 border-green-400 rounded-sm mr-2" }), /* @__PURE__ */ React.createElement("span", null, "Confirmada")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement("div", { className: "w-3 h-3 bg-yellow-100 border-l-4 border-yellow-400 rounded-sm mr-2" }), /* @__PURE__ */ React.createElement("span", null, "Pendente")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement("div", { className: "w-3 h-3 bg-red-100 border-l-4 border-red-400 rounded-sm mr-2" }), /* @__PURE__ */ React.createElement("span", null, "Cancelada")))), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement("h4", { className: "font-medium text-gray-800" }, tipoRelatorio.includes("financeiro") ? "Informa\xE7\xF5es Financeiras:" : tipoRelatorio.includes("reservas") ? "Dados das Reservas:" : "Programa\xE7\xE3o de Quadras:"), /* @__PURE__ */ React.createElement("div", { className: "text-xs space-y-1" }, tipoRelatorio.includes("financeiro") ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", null, "\u2022 Valores faturados e recebidos"), /* @__PURE__ */ React.createElement("div", null, "\u2022 Separa\xE7\xE3o por reservas e outros"), /* @__PURE__ */ React.createElement("div", null, "\u2022 Status de pagamento detalhado"), /* @__PURE__ */ React.createElement("div", null, "\u2022 An\xE1lise por quadra e per\xEDodo"), /* @__PURE__ */ React.createElement("div", null, "\u2022 Controle de inadimpl\xEAncia")) : tipoRelatorio.includes("reservas") ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", null, "\u2022 Hor\xE1rios e dura\xE7\xF5es das reservas"), /* @__PURE__ */ React.createElement("div", null, "\u2022 Dados completos dos clientes"), /* @__PURE__ */ React.createElement("div", null, "\u2022 Status e valores das reservas"), /* @__PURE__ */ React.createElement("div", null, "\u2022 Usu\xE1rio respons\xE1vel pelo agendamento"), /* @__PURE__ */ React.createElement("div", null, "\u2022 Controle de ocupa\xE7\xE3o por per\xEDodo")) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", null, "\u2022 Hor\xE1rio de in\xEDcio e fim (intervalos de 5 minutos)"), /* @__PURE__ */ React.createElement("div", null, "\u2022 Nome completo do cliente"), /* @__PURE__ */ React.createElement("div", null, "\u2022 Valor da loca\xE7\xE3o proporcional ao tempo"), /* @__PURE__ */ React.createElement("div", null, "\u2022 Status da reserva (cores visuais)"), /* @__PURE__ */ React.createElement("div", null, "\u2022 Usu\xE1rio respons\xE1vel pelo agendamento"), /* @__PURE__ */ React.createElement("div", null, "\u2022 Data do lan\xE7amento da reserva"), /* @__PURE__ */ React.createElement("div", null, "\u2022 Observa\xE7\xF5es (quando houver)"), /* @__PURE__ */ React.createElement("div", null, "\u2022 M\xE1ximo 6 reservas por quadra/dia")))), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement("h4", { className: "font-medium text-gray-800" }, "Caracter\xEDsticas do Relat\xF3rio:"), /* @__PURE__ */ React.createElement("div", { className: "text-xs space-y-1" }, /* @__PURE__ */ React.createElement("div", null, "\u2022 Per\xEDodo: ", tipoRelatorio.includes("diario") ? "Di\xE1rio" : tipoRelatorio.includes("semanal") ? "Semanal" : tipoRelatorio.includes("mensal") ? "Mensal" : "Anual"), /* @__PURE__ */ React.createElement("div", null, "\u2022 Categoria: ", tipoRelatorio.includes("financeiro") ? "Financeiro" : tipoRelatorio.includes("reservas") ? "Reservas" : "Programa\xE7\xE3o"), /* @__PURE__ */ React.createElement("div", null, "\u2022 Quadra(s): ", quadraImpressao ? quadras.find((q) => q.id == quadraImpressao)?.nome : "Todas as ativas"), /* @__PURE__ */ React.createElement("div", null, "\u2022 Gerado em: ", (/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR")), /* @__PURE__ */ React.createElement("div", null, "\u2022 Usu\xE1rio: ", usuarioLogado?.nome)))), /* @__PURE__ */ React.createElement("div", { className: "mt-4 p-3 bg-blue-50 border border-blue-200 rounded print:bg-gray-100" }, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-blue-700 print:text-gray-700" }, /* @__PURE__ */ React.createElement("strong", null, "Centro de Relat\xF3rios:"), " ", tipoRelatorio.includes("financeiro") ? "Relat\xF3rio financeiro detalhado com controle de faturamento, recebimentos e inadimpl\xEAncia. Ideal para an\xE1lise de desempenho financeiro e tomada de decis\xF5es." : tipoRelatorio.includes("reservas") ? "Relat\xF3rio completo de reservas com dados operacionais e de ocupa\xE7\xE3o. Perfeito para controle administrativo e an\xE1lise de demanda." : "Programa\xE7\xE3o detalhada por quadra incluindo informa\xE7\xF5es completas de cada reserva e controle de responsabilidade por agendamento. Ideal para controle operacional e acompanhamento de ocupa\xE7\xE3o."))))))), /* @__PURE__ */ React.createElement("div", { className: "hidden md:block bg-gray-800 text-center py-3 mt-8 border-t border-gray-700" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto px-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center space-x-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-2" }, /* @__PURE__ */ React.createElement("div", { className: "w-2 h-2 bg-green-500 rounded-full animate-pulse" }), /* @__PURE__ */ React.createElement("span", { className: "text-sm text-gray-300" }, "Sistema Online")), /* @__PURE__ */ React.createElement("div", { className: "text-gray-500" }, "\u2022"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-300" }, "\xA9 2025 ", /* @__PURE__ */ React.createElement("span", { className: "font-medium text-green-400" }, "PauloCunhaMKT"), " Solu\xE7\xF5es TI"), /* @__PURE__ */ React.createElement("div", { className: "text-gray-500" }, "\u2022"), /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-1" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs bg-gray-700 px-2 py-1 rounded text-gray-400" }, "v2.1.0"), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-gray-500" }, "Build 2025.01"))), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-gray-500 mt-1" }, "Sistema de Gest\xE3o Esportiva \u2022 Desenvolvido especialmente para o Esporte Clube Jurema"))), showModal && /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg p-4 md:p-6 w-full max-w-md mx-4 max-h-screen overflow-y-auto" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center mb-4" }, /* @__PURE__ */ React.createElement("h3", { className: "text-base md:text-lg font-medium" }, editingItem ? "Editar" : "Novo", " ", modalType === "quadra" ? "Quadra" : modalType === "cliente" ? "Cliente" : modalType === "admin" ? "Administrador" : modalType === "faturamento" ? "Faturamento" : modalType === "recebimento" ? "Recebimento" : "Reserva"), /* @__PURE__ */ React.createElement("button", { onClick: fecharModal }, /* @__PURE__ */ React.createElement(X, { className: "h-5 w-5" }))), modalType === "quadra" && /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: "Nome da quadra",
      value: formQuadra.nome,
      onChange: (e) => setFormQuadra({ ...formQuadra, nome: e.target.value }),
      className: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
    }
  ), /* @__PURE__ */ React.createElement(
    "select",
    {
      value: formQuadra.modalidade,
      onChange: (e) => setFormQuadra({ ...formQuadra, modalidade: e.target.value }),
      className: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
    },
    /* @__PURE__ */ React.createElement("option", { value: "" }, "Selecione a modalidade"),
    /* @__PURE__ */ React.createElement("option", { value: "Campo de Futebol" }, "Campo de Futebol"),
    /* @__PURE__ */ React.createElement("option", { value: "Quadra de Futsal" }, "Quadra de Futsal")
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      placeholder: "Valor por hora",
      value: formQuadra.valorHora,
      onChange: (e) => setFormQuadra({ ...formQuadra, valorHora: e.target.value }),
      className: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
    }
  ), /* @__PURE__ */ React.createElement("label", { className: "flex items-center text-sm" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "checkbox",
      checked: formQuadra.ativa,
      onChange: (e) => setFormQuadra({ ...formQuadra, ativa: e.target.checked }),
      className: "mr-2"
    }
  ), "Quadra ativa"), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: adicionarQuadra,
      className: "w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 text-sm"
    },
    editingItem ? "Atualizar" : "Adicionar"
  )), modalType === "cliente" && /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: "Nome do cliente",
      value: formCliente.nome,
      onChange: (e) => setFormCliente({ ...formCliente, nome: e.target.value }),
      className: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
    }
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: "Telefone",
      value: formCliente.telefone,
      onChange: (e) => setFormCliente({ ...formCliente, telefone: e.target.value }),
      className: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
    }
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "email",
      placeholder: "Email",
      value: formCliente.email,
      onChange: (e) => setFormCliente({ ...formCliente, email: e.target.value }),
      className: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
    }
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: adicionarCliente,
      className: "w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 text-sm"
    },
    editingItem ? "Atualizar" : "Adicionar"
  )), modalType === "reserva" && /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "border border-blue-200 rounded-lg p-3 bg-blue-50" }, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-blue-800 mb-2" }, "Tipo de Reserva"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-3" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => setFormReserva({ ...formReserva, tipoReserva: "avulsa" }),
      className: `p-3 rounded-lg border text-sm font-medium ${formReserva.tipoReserva === "avulsa" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-blue-600 border-blue-300 hover:bg-blue-50"}`
    },
    "\u{1F3AF} Reserva Avulsa"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => setFormReserva({ ...formReserva, tipoReserva: "mensal" }),
      className: `p-3 rounded-lg border text-sm font-medium ${formReserva.tipoReserva === "mensal" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-blue-600 border-blue-300 hover:bg-blue-50"}`
    },
    "\u{1F4C5} Reserva Mensal"
  ))), /* @__PURE__ */ React.createElement(
    "select",
    {
      value: formReserva.quadraId,
      onChange: (e) => setFormReserva({ ...formReserva, quadraId: e.target.value }),
      className: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
    },
    /* @__PURE__ */ React.createElement("option", { value: "" }, "Selecione a quadra"),
    quadras.filter((q) => q.ativa).map((quadra) => /* @__PURE__ */ React.createElement("option", { key: quadra.id, value: quadra.id }, quadra.nome))
  ), /* @__PURE__ */ React.createElement(
    "select",
    {
      value: formReserva.clienteId,
      onChange: (e) => setFormReserva({ ...formReserva, clienteId: e.target.value }),
      className: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
    },
    /* @__PURE__ */ React.createElement("option", { value: "" }, "Selecione o cliente"),
    clientes.map((cliente) => /* @__PURE__ */ React.createElement("option", { key: cliente.id, value: cliente.id }, cliente.nome))
  ), formReserva.tipoReserva === "avulsa" ? /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "date",
      value: formReserva.data,
      onChange: (e) => setFormReserva({ ...formReserva, data: e.target.value }),
      className: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm",
      placeholder: "Data da reserva"
    }
  ) : /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "M\xEAs de Refer\xEAncia"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "month",
      value: formReserva.mesReferencia,
      onChange: (e) => setFormReserva({ ...formReserva, mesReferencia: e.target.value }),
      className: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm",
      placeholder: "Selecione o m\xEAs"
    }
  )), formReserva.tipoReserva === "mensal" && /* @__PURE__ */ React.createElement("div", { className: "border border-green-200 rounded-lg p-4 bg-green-50" }, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-green-800 mb-3" }, "Dias da Semana"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-2" }, [
    { key: "segunda", label: "Segunda-feira" },
    { key: "terca", label: "Ter\xE7a-feira" },
    { key: "quarta", label: "Quarta-feira" },
    { key: "quinta", label: "Quinta-feira" },
    { key: "sexta", label: "Sexta-feira" },
    { key: "sabado", label: "S\xE1bado" },
    { key: "domingo", label: "Domingo" }
  ].map((dia) => /* @__PURE__ */ React.createElement("label", { key: dia.key, className: "flex items-center space-x-2 text-sm" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "checkbox",
      checked: formReserva.diasSemana.includes(dia.key),
      onChange: (e) => {
        if (e.target.checked) {
          setFormReserva({
            ...formReserva,
            diasSemana: [...formReserva.diasSemana, dia.key]
          });
        } else {
          setFormReserva({
            ...formReserva,
            diasSemana: formReserva.diasSemana.filter((d) => d !== dia.key)
          });
        }
      },
      className: "w-4 h-4 text-green-600"
    }
  ), /* @__PURE__ */ React.createElement("span", { className: "text-green-700" }, dia.label))))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-2" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "time",
      placeholder: "Hora in\xEDcio",
      value: formReserva.horaInicio,
      onChange: (e) => setFormReserva({ ...formReserva, horaInicio: e.target.value }),
      className: "px-3 py-2 border border-gray-300 rounded-md text-sm",
      min: "06:00",
      max: "22:00"
    }
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "time",
      placeholder: "Hora fim",
      value: formReserva.horaFim,
      onChange: (e) => setFormReserva({ ...formReserva, horaFim: e.target.value }),
      className: "px-3 py-2 border border-gray-300 rounded-md text-sm",
      min: "07:00",
      max: "23:00"
    }
  )), formReserva.tipoReserva === "mensal" && formReserva.quadraId && formReserva.horaInicio && formReserva.horaFim && formReserva.diasSemana.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "border border-purple-200 rounded-lg p-4 bg-purple-50" }, /* @__PURE__ */ React.createElement("h4", { className: "text-sm font-medium text-purple-800 mb-3" }, "\u{1F4B0} C\xE1lculo da Reserva Mensal"), (() => {
    const valorMensal = calcularValorMensal();
    const quadraSelecionada = quadras.find((q) => q.id === parseInt(formReserva.quadraId));
    const horaInicio = /* @__PURE__ */ new Date(`2000-01-01T${formReserva.horaInicio}`);
    const horaFim = /* @__PURE__ */ new Date(`2000-01-01T${formReserva.horaFim}`);
    const minutos = (horaFim - horaInicio) / (1e3 * 60);
    const horas = minutos / 60;
    const valorSessao = horas * (quadraSelecionada?.valorHora || 0);
    const sessoesPorMes = Math.round(formReserva.diasSemana.length * 4.33);
    const valorSemDesconto = valorSessao * sessoesPorMes;
    const desconto = valorSemDesconto * 0.1;
    return /* @__PURE__ */ React.createElement("div", { className: "text-sm text-purple-700 space-y-2" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("strong", null, "Valor por sess\xE3o:"), /* @__PURE__ */ React.createElement("br", null), "R$ ", valorSessao.toFixed(2), " (", horas.toFixed(1), "h \xD7 R$ ", quadraSelecionada?.valorHora, ")"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("strong", null, "Sess\xF5es/m\xEAs:"), /* @__PURE__ */ React.createElement("br", null), sessoesPorMes, " (", formReserva.diasSemana.length, " dias \xD7 4.33 semanas)")), /* @__PURE__ */ React.createElement("div", { className: "border-t border-purple-300 pt-2" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between" }, /* @__PURE__ */ React.createElement("span", null, "Valor sem desconto:"), /* @__PURE__ */ React.createElement("span", null, "R$ ", valorSemDesconto.toFixed(2))), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between text-green-600" }, /* @__PURE__ */ React.createElement("span", null, "Desconto mensal (10%):"), /* @__PURE__ */ React.createElement("span", null, "- R$ ", desconto.toFixed(2))), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between font-bold text-lg border-t border-purple-300 pt-1" }, /* @__PURE__ */ React.createElement("span", null, "Valor total mensal:"), /* @__PURE__ */ React.createElement("span", null, "R$ ", valorMensal.toFixed(2)))));
  })()), formReserva.tipoReserva === "mensal" && /* @__PURE__ */ React.createElement("div", { className: "border border-orange-200 rounded-lg p-4 bg-orange-50" }, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-orange-800 mb-3" }, "\u{1F4B3} Op\xE7\xF5es de Pagamento"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-3" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs text-orange-700 mb-1" }, "N\xFAmero de Parcelas"), /* @__PURE__ */ React.createElement(
    "select",
    {
      value: formReserva.numeroParcelas,
      onChange: (e) => setFormReserva({ ...formReserva, numeroParcelas: parseInt(e.target.value) }),
      className: "w-full px-3 py-2 border border-orange-300 rounded-md text-sm"
    },
    /* @__PURE__ */ React.createElement("option", { value: 1 }, "\xC0 vista (1x)"),
    /* @__PURE__ */ React.createElement("option", { value: 2 }, "2x sem juros"),
    /* @__PURE__ */ React.createElement("option", { value: 3 }, "3x sem juros"),
    /* @__PURE__ */ React.createElement("option", { value: 4 }, "4x sem juros")
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs text-orange-700 mb-1" }, "Valor da Parcela"), /* @__PURE__ */ React.createElement("div", { className: "px-3 py-2 bg-orange-100 border border-orange-300 rounded-md text-sm font-medium text-orange-800" }, formReserva.quadraId && formReserva.horaInicio && formReserva.horaFim && formReserva.diasSemana.length > 0 ? `R$ ${calcularParcelas(calcularValorMensal(), formReserva.numeroParcelas).toFixed(2)}` : "R$ 0,00"))), formReserva.numeroParcelas > 1 && /* @__PURE__ */ React.createElement("div", { className: "mt-3" }, /* @__PURE__ */ React.createElement("label", { className: "block text-xs text-orange-700 mb-1" }, "Vencimento da 1\xAA Parcela"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "date",
      value: formReserva.dataVencimentoPrimeiraParcela,
      onChange: (e) => setFormReserva({ ...formReserva, dataVencimentoPrimeiraParcela: e.target.value }),
      className: "w-full px-3 py-2 border border-orange-300 rounded-md text-sm"
    }
  ))), formReserva.tipoReserva === "avulsa" && /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      placeholder: "Valor (opcional)",
      value: formReserva.valor,
      onChange: (e) => setFormReserva({ ...formReserva, valor: e.target.value }),
      className: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
    }
  ), formReserva.tipoReserva === "avulsa" && formReserva.data && formReserva.quadraId && /* @__PURE__ */ React.createElement("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-3" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm text-blue-700" }, /* @__PURE__ */ React.createElement("strong", null, "Disponibilidade:"), (() => {
    const reservasNoDia = reservas.filter(
      (r) => r.data === formReserva.data && r.quadraId === parseInt(formReserva.quadraId) && (!editingItem || r.id !== editingItem.id)
    );
    const quadraSelecionada = quadras.find((q) => q.id === parseInt(formReserva.quadraId));
    return /* @__PURE__ */ React.createElement("div", { className: "mt-2" }, /* @__PURE__ */ React.createElement("p", null, "\u2022 Quadra: ", /* @__PURE__ */ React.createElement("strong", null, quadraSelecionada?.nome)), /* @__PURE__ */ React.createElement("p", null, "\u2022 Data: ", /* @__PURE__ */ React.createElement("strong", null, (/* @__PURE__ */ new Date(formReserva.data + "T00:00:00")).toLocaleDateString("pt-BR"))), /* @__PURE__ */ React.createElement("p", null, "\u2022 Reservas no dia: ", /* @__PURE__ */ React.createElement("strong", null, reservasNoDia.length, "/6")), /* @__PURE__ */ React.createElement("p", null, "\u2022 Hor\xE1rio de funcionamento: ", /* @__PURE__ */ React.createElement("strong", null, "06:00 \xE0s 23:00")), /* @__PURE__ */ React.createElement("p", null, "\u2022 Intervalo entre reservas: ", /* @__PURE__ */ React.createElement("strong", null, "m\xEDnimo 5 minutos")), reservasNoDia.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "mt-2" }, /* @__PURE__ */ React.createElement("p", { className: "font-medium" }, "Hor\xE1rios ocupados:"), /* @__PURE__ */ React.createElement("div", { className: "space-y-1" }, reservasNoDia.sort((a, b) => a.horaInicio.localeCompare(b.horaInicio)).map((r, idx) => {
      const cliente = clientes.find((c) => c.id === r.clienteId);
      return /* @__PURE__ */ React.createElement("div", { key: idx, className: "text-xs bg-white p-2 rounded border" }, /* @__PURE__ */ React.createElement("strong", null, r.horaInicio, " - ", r.horaFim), " \u2022 ", cliente?.nome);
    }))), reservasNoDia.length >= 6 && /* @__PURE__ */ React.createElement("div", { className: "mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-700" }, /* @__PURE__ */ React.createElement("strong", null, "\u26A0\uFE0F Limite atingido!"), " Esta quadra j\xE1 possui 6 reservas neste dia."));
  })())), formReserva.tipoReserva === "avulsa" && /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-2" }, /* @__PURE__ */ React.createElement(
    "select",
    {
      value: formReserva.status,
      onChange: (e) => setFormReserva({ ...formReserva, status: e.target.value }),
      className: "px-3 py-2 border border-gray-300 rounded-md text-sm"
    },
    /* @__PURE__ */ React.createElement("option", { value: "Confirmada" }, "Confirmada"),
    /* @__PURE__ */ React.createElement("option", { value: "Pendente" }, "Pendente"),
    /* @__PURE__ */ React.createElement("option", { value: "Cancelada" }, "Cancelada")
  ), /* @__PURE__ */ React.createElement(
    "select",
    {
      value: formReserva.statusPagamento,
      onChange: (e) => {
        const novoStatus = e.target.value;
        setFormReserva({
          ...formReserva,
          statusPagamento: novoStatus,
          // Auto-ajustar valorPago baseado no status
          valorPago: novoStatus === "Pago" && !formReserva.valorPago ? formReserva.valor : formReserva.valorPago,
          dataPagamento: novoStatus !== "Pendente" && !formReserva.dataPagamento ? (/* @__PURE__ */ new Date()).toISOString().split("T")[0] : formReserva.dataPagamento
        });
      },
      className: "px-3 py-2 border border-gray-300 rounded-md text-sm"
    },
    /* @__PURE__ */ React.createElement("option", { value: "Pendente" }, "Pendente"),
    /* @__PURE__ */ React.createElement("option", { value: "Parcial" }, "Parcial"),
    /* @__PURE__ */ React.createElement("option", { value: "Pago" }, "Pago")
  )), formReserva.tipoReserva === "avulsa" && formReserva.statusPagamento !== "Pendente" && /* @__PURE__ */ React.createElement("div", { className: "bg-green-50 border border-green-200 rounded-lg p-3 space-y-3" }, /* @__PURE__ */ React.createElement("h4", { className: "text-sm font-medium text-green-800" }, "Informa\xE7\xF5es de Pagamento"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-2" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      step: "0.01",
      placeholder: "Valor pago",
      value: formReserva.valorPago,
      onChange: (e) => {
        const valorPago = parseFloat(e.target.value) || 0;
        const valorTotal = parseFloat(formReserva.valor) || 0;
        let novoStatus = "Pendente";
        if (valorPago === 0) {
          novoStatus = "Pendente";
        } else if (valorPago >= valorTotal) {
          novoStatus = "Pago";
        } else {
          novoStatus = "Parcial";
        }
        setFormReserva({
          ...formReserva,
          valorPago: e.target.value,
          statusPagamento: novoStatus
        });
      },
      className: "px-3 py-2 border border-gray-300 rounded-md text-sm"
    }
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "date",
      value: formReserva.dataPagamento,
      onChange: (e) => setFormReserva({ ...formReserva, dataPagamento: e.target.value }),
      className: "px-3 py-2 border border-gray-300 rounded-md text-sm"
    }
  )), /* @__PURE__ */ React.createElement(
    "select",
    {
      value: formReserva.formaPagamento,
      onChange: (e) => setFormReserva({ ...formReserva, formaPagamento: e.target.value }),
      className: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
    },
    /* @__PURE__ */ React.createElement("option", { value: "" }, "Forma de pagamento"),
    /* @__PURE__ */ React.createElement("option", { value: "Pix" }, "Pix"),
    /* @__PURE__ */ React.createElement("option", { value: "Dinheiro" }, "Dinheiro"),
    /* @__PURE__ */ React.createElement("option", { value: "Transfer\xEAncia" }, "Transfer\xEAncia"),
    /* @__PURE__ */ React.createElement("option", { value: "Cart\xE3o" }, "Cart\xE3o"),
    /* @__PURE__ */ React.createElement("option", { value: "Cheque" }, "Cheque")
  ), formReserva.valorPago && formReserva.valor && /* @__PURE__ */ React.createElement("div", { className: "text-xs text-green-700" }, /* @__PURE__ */ React.createElement("strong", null, "Saldo:"), " R$ ", ((parseFloat(formReserva.valor) || 0) - (parseFloat(formReserva.valorPago) || 0)).toFixed(2), parseFloat(formReserva.valorPago) >= parseFloat(formReserva.valor) && " \u2713 Pago")), formReserva.tipoReserva === "mensal" && /* @__PURE__ */ React.createElement("div", { className: "border border-green-200 rounded-lg p-4 bg-green-50" }, /* @__PURE__ */ React.createElement("h4", { className: "text-sm font-medium text-green-800 mb-3" }, "\u{1F4B0} Pagamento Inicial (Opcional)"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-3" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      step: "0.01",
      placeholder: "Valor pago na reserva",
      value: formReserva.valorPago,
      onChange: (e) => setFormReserva({ ...formReserva, valorPago: e.target.value }),
      className: "w-full px-3 py-2 border border-green-300 rounded-md text-sm"
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
    "select",
    {
      value: formReserva.formaPagamento,
      onChange: (e) => setFormReserva({ ...formReserva, formaPagamento: e.target.value }),
      className: "w-full px-3 py-2 border border-green-300 rounded-md text-sm"
    },
    /* @__PURE__ */ React.createElement("option", { value: "" }, "Forma de pagamento"),
    /* @__PURE__ */ React.createElement("option", { value: "Pix" }, "Pix"),
    /* @__PURE__ */ React.createElement("option", { value: "Dinheiro" }, "Dinheiro"),
    /* @__PURE__ */ React.createElement("option", { value: "Transfer\xEAncia" }, "Transfer\xEAncia"),
    /* @__PURE__ */ React.createElement("option", { value: "Cart\xE3o" }, "Cart\xE3o")
  ))), formReserva.valorPago && formReserva.quadraId && formReserva.horaInicio && formReserva.horaFim && formReserva.diasSemana.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "mt-2 text-xs text-green-700" }, /* @__PURE__ */ React.createElement("strong", null, "Saldo restante:"), " R$ ", (calcularValorMensal() - parseFloat(formReserva.valorPago || 0)).toFixed(2))), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      placeholder: formReserva.tipoReserva === "mensal" ? "Observa\xE7\xF5es sobre a reserva mensal (opcional)" : "Observa\xE7\xF5es (opcional)",
      value: formReserva.tipoReserva === "mensal" ? formReserva.observacoesMensal : formReserva.observacoes,
      onChange: (e) => {
        if (formReserva.tipoReserva === "mensal") {
          setFormReserva({ ...formReserva, observacoesMensal: e.target.value });
        } else {
          setFormReserva({ ...formReserva, observacoes: e.target.value });
        }
      },
      className: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm",
      rows: "3"
    }
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: adicionarReserva,
      className: "w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 text-sm"
    },
    editingItem ? "Atualizar" : "Adicionar"
  )), modalType === "admin" && /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex" }, /* @__PURE__ */ React.createElement(Shield, { className: "h-4 w-4 text-orange-500 mr-2 mt-0.5" }), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-orange-700" }, /* @__PURE__ */ React.createElement("strong", null, "Importante:"), " Mantenha as credenciais seguras. Evite senhas simples."))), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: "Nome completo",
      value: formAdmin.nome,
      onChange: (e) => setFormAdmin({ ...formAdmin, nome: e.target.value }),
      className: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
    }
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: "Nome de usu\xE1rio (login)",
      value: formAdmin.usuario,
      onChange: (e) => setFormAdmin({ ...formAdmin, usuario: e.target.value.toLowerCase().replace(/\s+/g, "") }),
      className: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: showPassword ? "text" : "password",
      placeholder: "Senha de acesso",
      value: formAdmin.senha,
      onChange: (e) => setFormAdmin({ ...formAdmin, senha: e.target.value }),
      className: "w-full px-3 py-2 pr-10 border border-gray-300 rounded-md text-sm"
    }
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => setShowPassword(!showPassword),
      className: "absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
    },
    showPassword ? /* @__PURE__ */ React.createElement(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ React.createElement(Eye, { className: "h-4 w-4" })
  )), /* @__PURE__ */ React.createElement(
    "select",
    {
      value: formAdmin.cargo,
      onChange: (e) => setFormAdmin({ ...formAdmin, cargo: e.target.value }),
      className: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
    },
    /* @__PURE__ */ React.createElement("option", { value: "" }, "Selecione o cargo"),
    /* @__PURE__ */ React.createElement("option", { value: "Administrador Geral" }, "Administrador Geral"),
    /* @__PURE__ */ React.createElement("option", { value: "Gerente de Opera\xE7\xF5es" }, "Gerente de Opera\xE7\xF5es"),
    /* @__PURE__ */ React.createElement("option", { value: "Secret\xE1rio do Clube" }, "Secret\xE1rio do Clube"),
    /* @__PURE__ */ React.createElement("option", { value: "Assistente Administrativo" }, "Assistente Administrativo"),
    /* @__PURE__ */ React.createElement("option", { value: "Coordenador de Quadras" }, "Coordenador de Quadras")
  ), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-600 bg-gray-50 p-3 rounded" }, /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("strong", null, "Dicas de Seguran\xE7a:")), /* @__PURE__ */ React.createElement("ul", { className: "mt-1 space-y-1" }, /* @__PURE__ */ React.createElement("li", null, "\u2022 Use senhas com pelo menos 8 caracteres"), /* @__PURE__ */ React.createElement("li", null, "\u2022 Combine letras, n\xFAmeros e s\xEDmbolos"), /* @__PURE__ */ React.createElement("li", null, "\u2022 Evite informa\xE7\xF5es pessoais \xF3bvias"), /* @__PURE__ */ React.createElement("li", null, "\u2022 Altere a senha regularmente"))), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: adicionarAdmin,
      className: "w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 text-sm"
    },
    editingItem ? "Atualizar Administrador" : "Adicionar Administrador"
  )), modalType === "faturamento" && /* @__PURE__ */ React.createElement("div", { className: "space-y-4 max-h-96 overflow-y-auto" }, /* @__PURE__ */ React.createElement("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-3" }, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-blue-700" }, /* @__PURE__ */ React.createElement("strong", null, "Faturamento:"), " Registre todas as informa\xE7\xF5es da loca\xE7\xE3o conforme orienta\xE7\xF5es.")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-3" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "date",
      placeholder: "Data",
      value: formFaturamento.data,
      onChange: (e) => setFormFaturamento({ ...formFaturamento, data: e.target.value }),
      className: "px-3 py-2 border border-gray-300 rounded-md text-sm"
    }
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: "Cliente",
      value: formFaturamento.cliente,
      onChange: (e) => setFormFaturamento({ ...formFaturamento, cliente: e.target.value }),
      className: "px-3 py-2 border border-gray-300 rounded-md text-sm"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-3" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: "M\xEAs Loca\xE7\xE3o (ex: JAN/2025)",
      value: formFaturamento.mesLocacao,
      onChange: (e) => setFormFaturamento({ ...formFaturamento, mesLocacao: e.target.value }),
      className: "px-3 py-2 border border-gray-300 rounded-md text-sm"
    }
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: "Hora",
      value: formFaturamento.hora,
      onChange: (e) => setFormFaturamento({ ...formFaturamento, hora: e.target.value }),
      className: "px-3 py-2 border border-gray-300 rounded-md text-sm"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-3" }, /* @__PURE__ */ React.createElement(
    "select",
    {
      value: formFaturamento.tipoQuadra,
      onChange: (e) => setFormFaturamento({ ...formFaturamento, tipoQuadra: e.target.value }),
      className: "px-3 py-2 border border-gray-300 rounded-md text-sm"
    },
    /* @__PURE__ */ React.createElement("option", { value: "" }, "Tipo de Quadra"),
    /* @__PURE__ */ React.createElement("option", { value: "Campo de Futebol" }, "Campo de Futebol"),
    /* @__PURE__ */ React.createElement("option", { value: "Quadra de Futsal" }, "Quadra de Futsal")
  ), /* @__PURE__ */ React.createElement(
    "select",
    {
      value: formFaturamento.tipoLocacao,
      onChange: (e) => setFormFaturamento({ ...formFaturamento, tipoLocacao: e.target.value }),
      className: "px-3 py-2 border border-gray-300 rounded-md text-sm"
    },
    /* @__PURE__ */ React.createElement("option", { value: "" }, "Tipo de Loca\xE7\xE3o"),
    /* @__PURE__ */ React.createElement("option", { value: "Mensal" }, "Mensal"),
    /* @__PURE__ */ React.createElement("option", { value: "Avulso" }, "Avulso")
  )), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-3" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: "Recibo de Pagamento N\xBA",
      value: formFaturamento.reciboPagamento,
      onChange: (e) => setFormFaturamento({ ...formFaturamento, reciboPagamento: e.target.value }),
      className: "px-3 py-2 border border-gray-300 rounded-md text-sm"
    }
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "date",
      placeholder: "Data da Loca\xE7\xE3o",
      value: formFaturamento.dataLocacao,
      onChange: (e) => setFormFaturamento({ ...formFaturamento, dataLocacao: e.target.value }),
      className: "px-3 py-2 border border-gray-300 rounded-md text-sm"
    }
  )), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      step: "0.01",
      placeholder: "Valor da Loca\xE7\xE3o",
      value: formFaturamento.valor,
      onChange: (e) => setFormFaturamento({ ...formFaturamento, valor: e.target.value }),
      className: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
    }
  ), /* @__PURE__ */ React.createElement(
    "select",
    {
      value: formFaturamento.formaPagamento,
      onChange: (e) => setFormFaturamento({ ...formFaturamento, formaPagamento: e.target.value }),
      className: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
    },
    /* @__PURE__ */ React.createElement("option", { value: "" }, "Forma de Pagamento"),
    /* @__PURE__ */ React.createElement("option", { value: "Pix" }, "Pix"),
    /* @__PURE__ */ React.createElement("option", { value: "Dinheiro" }, "Dinheiro"),
    /* @__PURE__ */ React.createElement("option", { value: "Transfer\xEAncia" }, "Transfer\xEAncia"),
    /* @__PURE__ */ React.createElement("option", { value: "Cart\xE3o" }, "Cart\xE3o")
  ), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-3" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      step: "0.01",
      placeholder: "Valor Recebido (inicial)",
      value: formFaturamento.valorRecebido,
      onChange: (e) => setFormFaturamento({ ...formFaturamento, valorRecebido: e.target.value }),
      className: "px-3 py-2 border border-gray-300 rounded-md text-sm"
    }
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      step: "0.01",
      placeholder: "Valor Real Recebido",
      value: formFaturamento.valorRealRecebido,
      onChange: (e) => setFormFaturamento({ ...formFaturamento, valorRealRecebido: e.target.value }),
      className: "px-3 py-2 border border-gray-300 rounded-md text-sm"
    }
  )), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      placeholder: "Observa\xE7\xF5es",
      value: formFaturamento.observacoes,
      onChange: (e) => setFormFaturamento({ ...formFaturamento, observacoes: e.target.value }),
      className: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm",
      rows: "3"
    }
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: adicionarFaturamento,
      className: "w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 text-sm"
    },
    editingItem ? "Atualizar Faturamento" : "Registrar Faturamento"
  )), modalType === "recebimento" && /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-green-50 border border-green-200 rounded-lg p-3" }, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-green-700" }, /* @__PURE__ */ React.createElement("strong", null, "Recebimento:"), " Registre valores recebidos posteriormente ao faturamento.")), /* @__PURE__ */ React.createElement(
    "select",
    {
      value: formRecebimento.faturamentoId,
      onChange: (e) => setFormRecebimento({ ...formRecebimento, faturamentoId: e.target.value }),
      className: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
    },
    /* @__PURE__ */ React.createElement("option", { value: "" }, "Selecione o Item Financeiro"),
    faturamentos.filter((f) => f.valorEmAberto > 0).map((faturamento) => /* @__PURE__ */ React.createElement("option", { key: `fat_${faturamento.id}`, value: `fat_${faturamento.id}` }, "[FATURAMENTO] ", faturamento.cliente, " - ", faturamento.mesLocacao, " (R$ ", faturamento.valorEmAberto?.toFixed(2), " em aberto)")),
    reservas.filter((r) => {
      const valorTotal = r.valor || 0;
      const valorPago = r.valorPago || 0;
      const valorEmAberto = Math.max(0, valorTotal - valorPago);
      return valorEmAberto > 0;
    }).map((reserva) => {
      const cliente = clientes.find((c) => c.id === reserva.clienteId);
      const quadra = quadras.find((q) => q.id === reserva.quadraId);
      const valorTotal = reserva.valor || 0;
      const valorPago = reserva.valorPago || 0;
      const valorEmAberto = Math.max(0, valorTotal - valorPago);
      const statusStr = valorPago === 0 ? "EM ABERTO" : "PARCIAL";
      return /* @__PURE__ */ React.createElement("option", { key: `res_${reserva.id}`, value: `res_${reserva.id}` }, "[RESERVA-", statusStr, "] ", cliente?.nome, " - ", quadra?.nome, " ", new Date(reserva.data).toLocaleDateString("pt-BR"), " (R$ ", valorEmAberto.toFixed(2), " em aberto)");
    })
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "date",
      value: formRecebimento.data,
      onChange: (e) => setFormRecebimento({ ...formRecebimento, data: e.target.value }),
      className: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
    }
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      step: "0.01",
      placeholder: "Valor Recebido",
      value: formRecebimento.valor,
      onChange: (e) => setFormRecebimento({ ...formRecebimento, valor: e.target.value }),
      className: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
    }
  ), /* @__PURE__ */ React.createElement(
    "select",
    {
      value: formRecebimento.formaPagamento,
      onChange: (e) => setFormRecebimento({ ...formRecebimento, formaPagamento: e.target.value }),
      className: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
    },
    /* @__PURE__ */ React.createElement("option", { value: "" }, "Forma de Pagamento"),
    /* @__PURE__ */ React.createElement("option", { value: "Pix" }, "Pix"),
    /* @__PURE__ */ React.createElement("option", { value: "Dinheiro" }, "Dinheiro"),
    /* @__PURE__ */ React.createElement("option", { value: "Transfer\xEAncia" }, "Transfer\xEAncia"),
    /* @__PURE__ */ React.createElement("option", { value: "Cart\xE3o" }, "Cart\xE3o")
  ), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      placeholder: "Observa\xE7\xF5es",
      value: formRecebimento.observacoes,
      onChange: (e) => setFormRecebimento({ ...formRecebimento, observacoes: e.target.value }),
      className: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm",
      rows: "3"
    }
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: adicionarRecebimento,
      className: "w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 text-sm"
    },
    "Registrar Recebimento"
  ))))));
};
var stdin_default = QuadraManagementSystem;
export {
  stdin_default as default
};
