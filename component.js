// <stdin>
import React, { useState, useEffect } from "https://esm.sh/react@18.2.0";
import { Calendar, Clock, Users, DollarSign, Plus, Edit, Trash2, Save, X, Search, Filter } from "https://esm.sh/lucide-react?deps=react@18.2.0,react-dom@18.2.0";
var QuadraManagementSystem = () => {
  const { useStoredState } = hatch;
  const [quadras, setQuadras] = useStoredState("quadras", [
    { id: 1, nome: "Campo de Futebol 1", modalidade: "Campo de Futebol", valorHora: 100, ativa: true },
    { id: 2, nome: "Quadra de Futsal 1", modalidade: "Quadra de Futsal", valorHora: 80, ativa: true }
  ]);
  const [clientes, setClientes] = useStoredState("clientes", [
    { id: 1, nome: "Jo\xE3o Silva", telefone: "(11) 99999-9999", email: "joao@email.com" },
    { id: 2, nome: "Maria Santos", telefone: "(11) 88888-8888", email: "maria@email.com" }
  ]);
  const [reservas, setReservas] = useStoredState("reservas", []);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroData, setFiltroData] = useState("");
  const [mesImpressao, setMesImpressao] = useState((/* @__PURE__ */ new Date()).toISOString().slice(0, 7));
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
    observacoes: ""
  });
  const adicionarQuadra = () => {
    if (editingItem) {
      setQuadras(quadras.map(
        (q) => q.id === editingItem.id ? { ...formQuadra, id: editingItem.id, valorHora: parseFloat(formQuadra.valorHora) } : q
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
    setModalType("quadra");
    setShowModal(true);
  };
  const excluirQuadra = (id) => {
    if (confirm("Tem certeza que deseja excluir esta quadra?")) {
      setQuadras(quadras.filter((q) => q.id !== id));
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
  const adicionarReserva = () => {
    const quadra = quadras.find((q) => q.id === parseInt(formReserva.quadraId));
    const horaInicio = /* @__PURE__ */ new Date(`${formReserva.data}T${formReserva.horaInicio}`);
    const horaFim = /* @__PURE__ */ new Date(`${formReserva.data}T${formReserva.horaFim}`);
    const horas = (horaFim - horaInicio) / (1e3 * 60 * 60);
    const valorCalculado = horas * quadra.valorHora;
    if (editingItem) {
      setReservas(reservas.map(
        (r) => r.id === editingItem.id ? {
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
      observacoes: ""
    });
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
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("style", { jsx: true }, `
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
      `), /* @__PURE__ */ React.createElement("div", { className: "w-full h-full bg-gray-50 overflow-auto" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white shadow-sm border-b px-6 py-4" }, /* @__PURE__ */ React.createElement("h1", { className: "text-2xl font-bold text-gray-800" }, "Gest\xE3o de Quadras Esportivas"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600" }, "Sistema completo para controle de aluguel")), /* @__PURE__ */ React.createElement("div", { className: "bg-white border-b" }, /* @__PURE__ */ React.createElement("nav", { className: "flex space-x-8 px-6" }, ["dashboard", "reservas", "quadras", "clientes", "impressao"].map((tab) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: tab,
      onClick: () => setActiveTab(tab),
      className: `py-4 px-2 border-b-2 font-medium text-sm capitalize ${activeTab === tab ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`
    },
    tab === "dashboard" ? "Painel" : tab === "impressao" ? "Impress\xE3o" : tab
  )))), /* @__PURE__ */ React.createElement("div", { className: "p-6" }, activeTab === "dashboard" && /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white p-6 rounded-lg shadow" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement(Calendar, { className: "h-8 w-8 text-blue-500" }), /* @__PURE__ */ React.createElement("div", { className: "ml-4" }, /* @__PURE__ */ React.createElement("p", { className: "text-sm font-medium text-gray-600" }, "Reservas Hoje"), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold text-gray-900" }, reservasHoje.length)))), /* @__PURE__ */ React.createElement("div", { className: "bg-white p-6 rounded-lg shadow" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement(DollarSign, { className: "h-8 w-8 text-green-500" }), /* @__PURE__ */ React.createElement("div", { className: "ml-4" }, /* @__PURE__ */ React.createElement("p", { className: "text-sm font-medium text-gray-600" }, "Receita Mensal"), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold text-gray-900" }, "R$ ", receitaMensal.toFixed(2))))), /* @__PURE__ */ React.createElement("div", { className: "bg-white p-6 rounded-lg shadow" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement(Users, { className: "h-8 w-8 text-purple-500" }), /* @__PURE__ */ React.createElement("div", { className: "ml-4" }, /* @__PURE__ */ React.createElement("p", { className: "text-sm font-medium text-gray-600" }, "Clientes"), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold text-gray-900" }, clientes.length)))), /* @__PURE__ */ React.createElement("div", { className: "bg-white p-6 rounded-lg shadow" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement(Clock, { className: "h-8 w-8 text-orange-500" }), /* @__PURE__ */ React.createElement("div", { className: "ml-4" }, /* @__PURE__ */ React.createElement("p", { className: "text-sm font-medium text-gray-600" }, "Quadras Ativas"), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold text-gray-900" }, quadras.filter((q) => q.ativa).length))))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow" }, /* @__PURE__ */ React.createElement("div", { className: "p-6 border-b" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-medium text-gray-900" }, "Pr\xF3ximas Reservas")), /* @__PURE__ */ React.createElement("div", { className: "p-6" }, reservas.slice(0, 5).map((reserva) => {
    const quadra = quadras.find((q) => q.id === reserva.quadraId);
    const cliente = clientes.find((c) => c.id === reserva.clienteId);
    return /* @__PURE__ */ React.createElement("div", { key: reserva.id, className: "flex items-center justify-between py-3 border-b last:border-b-0" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "font-medium" }, quadra?.nome), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600" }, cliente?.nome, " - ", reserva.data, " \xE0s ", reserva.horaInicio)), /* @__PURE__ */ React.createElement("span", { className: `px-2 py-1 text-xs rounded-full ${reserva.status === "Confirmada" ? "bg-green-100 text-green-800" : reserva.status === "Pendente" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}` }, reserva.status));
  })))), activeTab === "reservas" && /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center" }, /* @__PURE__ */ React.createElement("h2", { className: "text-xl font-semibold text-gray-900" }, "Reservas"), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        setModalType("reserva");
        setShowModal(true);
      },
      className: "bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
    },
    /* @__PURE__ */ React.createElement(Plus, { className: "h-4 w-4" }),
    /* @__PURE__ */ React.createElement("span", null, "Nova Reserva")
  )), /* @__PURE__ */ React.createElement("div", { className: "bg-white p-4 rounded-lg shadow flex space-x-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex-1" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: "Buscar por quadra ou cliente...",
      value: searchTerm,
      onChange: (e) => setSearchTerm(e.target.value),
      className: "w-full px-3 py-2 border border-gray-300 rounded-md"
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "date",
      value: filtroData,
      onChange: (e) => setFiltroData(e.target.value),
      className: "px-3 py-2 border border-gray-300 rounded-md"
    }
  ))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow overflow-hidden" }, /* @__PURE__ */ React.createElement("table", { className: "min-w-full divide-y divide-gray-200" }, /* @__PURE__ */ React.createElement("thead", { className: "bg-gray-50" }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Data/Hora"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Quadra"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Cliente"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Valor"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Status"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "A\xE7\xF5es"))), /* @__PURE__ */ React.createElement("tbody", { className: "bg-white divide-y divide-gray-200" }, reservasFiltradas.map((reserva) => {
    const quadra = quadras.find((q) => q.id === reserva.quadraId);
    const cliente = clientes.find((c) => c.id === reserva.clienteId);
    return /* @__PURE__ */ React.createElement("tr", { key: reserva.id }, /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900" }, reserva.data, " ", reserva.horaInicio, "-", reserva.horaFim), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900" }, quadra?.nome), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900" }, cliente?.nome), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900" }, "R$ ", reserva.valor?.toFixed(2)), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap" }, /* @__PURE__ */ React.createElement("span", { className: `px-2 py-1 text-xs rounded-full ${reserva.status === "Confirmada" ? "bg-green-100 text-green-800" : reserva.status === "Pendente" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}` }, reserva.status)), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => editarReserva(reserva),
        className: "text-blue-600 hover:text-blue-900 mr-3"
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
  }))))), activeTab === "quadras" && /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center" }, /* @__PURE__ */ React.createElement("h2", { className: "text-xl font-semibold text-gray-900" }, "Quadras"), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        setModalType("quadra");
        setShowModal(true);
      },
      className: "bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
    },
    /* @__PURE__ */ React.createElement(Plus, { className: "h-4 w-4" }),
    /* @__PURE__ */ React.createElement("span", null, "Nova Quadra")
  )), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" }, quadras.map((quadra) => /* @__PURE__ */ React.createElement("div", { key: quadra.id, className: "bg-white rounded-lg shadow p-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-start mb-4" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-medium text-gray-900" }, quadra.nome), /* @__PURE__ */ React.createElement("span", { className: `px-2 py-1 text-xs rounded-full ${quadra.ativa ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}` }, quadra.ativa ? "Ativa" : "Inativa")), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600 mb-2" }, "Modalidade: ", quadra.modalidade), /* @__PURE__ */ React.createElement("p", { className: "text-gray-900 font-medium mb-4" }, "R$ ", quadra.valorHora, "/hora"), /* @__PURE__ */ React.createElement("div", { className: "flex space-x-2" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => editarQuadra(quadra),
      className: "flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
    },
    "Editar"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => excluirQuadra(quadra.id),
      className: "bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
    },
    /* @__PURE__ */ React.createElement(Trash2, { className: "h-4 w-4" })
  )))))), activeTab === "clientes" && /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center" }, /* @__PURE__ */ React.createElement("h2", { className: "text-xl font-semibold text-gray-900" }, "Clientes"), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        setModalType("cliente");
        setShowModal(true);
      },
      className: "bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
    },
    /* @__PURE__ */ React.createElement(Plus, { className: "h-4 w-4" }),
    /* @__PURE__ */ React.createElement("span", null, "Novo Cliente")
  )), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow overflow-hidden" }, /* @__PURE__ */ React.createElement("table", { className: "min-w-full divide-y divide-gray-200" }, /* @__PURE__ */ React.createElement("thead", { className: "bg-gray-50" }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Nome"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Telefone"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Email"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "A\xE7\xF5es"))), /* @__PURE__ */ React.createElement("tbody", { className: "bg-white divide-y divide-gray-200" }, clientes.map((cliente) => /* @__PURE__ */ React.createElement("tr", { key: cliente.id }, /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" }, cliente.nome), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900" }, cliente.telefone), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900" }, cliente.email), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => editarCliente(cliente),
      className: "text-blue-600 hover:text-blue-900 mr-3"
    },
    /* @__PURE__ */ React.createElement(Edit, { className: "h-4 w-4" })
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => excluirCliente(cliente.id),
      className: "text-red-600 hover:text-red-900"
    },
    /* @__PURE__ */ React.createElement(Trash2, { className: "h-4 w-4" })
  )))))))), activeTab === "impressao" && /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center" }, /* @__PURE__ */ React.createElement("h2", { className: "text-xl font-semibold text-gray-900" }, "Impress\xE3o de Hor\xE1rio Mensal"), /* @__PURE__ */ React.createElement("div", { className: "flex space-x-3" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "month",
      value: mesImpressao,
      onChange: (e) => setMesImpressao(e.target.value),
      className: "px-3 py-2 border border-gray-300 rounded-md"
    }
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => window.print(),
      className: "bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700"
    },
    /* @__PURE__ */ React.createElement("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" })),
    /* @__PURE__ */ React.createElement("span", null, "Imprimir")
  ))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg shadow overflow-hidden print:shadow-none" }, /* @__PURE__ */ React.createElement("div", { className: "p-6 print:p-2" }, /* @__PURE__ */ React.createElement("div", { className: "text-center mb-6 print:mb-4" }, /* @__PURE__ */ React.createElement("h1", { className: "text-2xl font-bold text-gray-900 print:text-lg" }, "Hor\xE1rios de Reservas - ", (/* @__PURE__ */ new Date(mesImpressao + "-01")).toLocaleDateString("pt-BR", { month: "long", year: "numeric" }).toUpperCase()), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600 print:text-sm" }, "Gest\xE3o de Quadras Esportivas")), /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ React.createElement("table", { className: "min-w-full border-collapse border border-gray-300 print:text-xs" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { className: "bg-gray-50 print:bg-gray-100" }, /* @__PURE__ */ React.createElement("th", { className: "border border-gray-300 px-2 py-1 text-left font-medium" }, "Data"), /* @__PURE__ */ React.createElement("th", { className: "border border-gray-300 px-2 py-1 text-left font-medium" }, "Dia"), quadras.filter((q) => q.ativa).map((quadra) => /* @__PURE__ */ React.createElement("th", { key: quadra.id, className: "border border-gray-300 px-2 py-1 text-left font-medium min-w-32" }, quadra.nome)))), /* @__PURE__ */ React.createElement("tbody", null, (() => {
    const [ano, mes] = mesImpressao.split("-");
    const diasNoMes = new Date(parseInt(ano), parseInt(mes), 0).getDate();
    const dias = [];
    for (let dia = 1; dia <= diasNoMes; dia++) {
      const dataCompleta = `${mesImpressao}-${dia.toString().padStart(2, "0")}`;
      const dataObj = new Date(dataCompleta);
      const diaSemana = dataObj.toLocaleDateString("pt-BR", { weekday: "short" });
      const reservasDoDia = reservas.filter((r) => r.data === dataCompleta);
      dias.push(
        /* @__PURE__ */ React.createElement("tr", { key: dia, className: `${dia % 2 === 0 ? "bg-gray-50" : "bg-white"} print:break-inside-avoid` }, /* @__PURE__ */ React.createElement("td", { className: "border border-gray-300 px-2 py-1 font-medium" }, dia.toString().padStart(2, "0")), /* @__PURE__ */ React.createElement("td", { className: "border border-gray-300 px-2 py-1" }, diaSemana), quadras.filter((q) => q.ativa).map((quadra) => {
          const reservasQuadra = reservasDoDia.filter((r) => r.quadraId === quadra.id);
          return /* @__PURE__ */ React.createElement("td", { key: quadra.id, className: "border border-gray-300 px-1 py-1 text-xs" }, reservasQuadra.map((reserva, index) => {
            const cliente = clientes.find((c) => c.id === reserva.clienteId);
            return /* @__PURE__ */ React.createElement(
              "div",
              {
                key: index,
                className: `mb-1 p-1 rounded text-xs ${reserva.status === "Confirmada" ? "bg-green-100" : reserva.status === "Pendente" ? "bg-yellow-100" : "bg-red-100"}`
              },
              /* @__PURE__ */ React.createElement("div", { className: "font-medium" }, reserva.horaInicio, "-", reserva.horaFim),
              /* @__PURE__ */ React.createElement("div", { className: "truncate" }, cliente?.nome || "Cliente n\xE3o encontrado"),
              /* @__PURE__ */ React.createElement("div", { className: "text-gray-600" }, "R$ ", reserva.valor?.toFixed(2))
            );
          }), reservasQuadra.length === 0 && /* @__PURE__ */ React.createElement("div", { className: "text-gray-400 text-center" }, "-"));
        }))
      );
    }
    return dias;
  })()))), /* @__PURE__ */ React.createElement("div", { className: "mt-6 print:mt-4" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-medium text-gray-900 mb-3 print:text-sm" }, "Legenda de Status"), /* @__PURE__ */ React.createElement("div", { className: "flex space-x-6 print:space-x-4 print:text-xs" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement("div", { className: "w-4 h-4 bg-green-100 rounded mr-2" }), /* @__PURE__ */ React.createElement("span", null, "Confirmada")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement("div", { className: "w-4 h-4 bg-yellow-100 rounded mr-2" }), /* @__PURE__ */ React.createElement("span", null, "Pendente")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement("div", { className: "w-4 h-4 bg-red-100 rounded mr-2" }), /* @__PURE__ */ React.createElement("span", null, "Cancelada")))), /* @__PURE__ */ React.createElement("div", { className: "mt-6 print:mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 print:gap-2" }, /* @__PURE__ */ React.createElement("div", { className: "bg-blue-50 p-4 rounded-lg print:p-2" }, /* @__PURE__ */ React.createElement("h4", { className: "font-medium text-blue-900 print:text-sm" }, "Total de Reservas"), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold text-blue-600 print:text-lg" }, reservas.filter((r) => r.data.startsWith(mesImpressao)).length)), /* @__PURE__ */ React.createElement("div", { className: "bg-green-50 p-4 rounded-lg print:p-2" }, /* @__PURE__ */ React.createElement("h4", { className: "font-medium text-green-900 print:text-sm" }, "Receita Total"), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold text-green-600 print:text-lg" }, "R$ ", reservas.filter((r) => r.data.startsWith(mesImpressao)).reduce((acc, r) => acc + (r.valor || 0), 0).toFixed(2))), /* @__PURE__ */ React.createElement("div", { className: "bg-purple-50 p-4 rounded-lg print:p-2" }, /* @__PURE__ */ React.createElement("h4", { className: "font-medium text-purple-900 print:text-sm" }, "Taxa de Ocupa\xE7\xE3o"), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold text-purple-600 print:text-lg" }, (() => {
    const diasNoMes = new Date(mesImpressao.split("-")[0], mesImpressao.split("-")[1], 0).getDate();
    const totalSlotsPossiveis = diasNoMes * quadras.filter((q) => q.ativa).length;
    const slotsOcupados = reservas.filter((r) => r.data.startsWith(mesImpressao) && r.status === "Confirmada").length;
    return totalSlotsPossiveis > 0 ? Math.round(slotsOcupados / totalSlotsPossiveis * 100) : 0;
  })(), "%"))))))), showModal && /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-lg p-6 w-full max-w-md mx-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center mb-4" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-medium" }, editingItem ? "Editar" : "Nova", " ", modalType === "quadra" ? "Quadra" : modalType === "cliente" ? "Cliente" : "Reserva"), /* @__PURE__ */ React.createElement("button", { onClick: fecharModal }, /* @__PURE__ */ React.createElement(X, { className: "h-5 w-5" }))), modalType === "quadra" && /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: "Nome da quadra",
      value: formQuadra.nome,
      onChange: (e) => setFormQuadra({ ...formQuadra, nome: e.target.value }),
      className: "w-full px-3 py-2 border border-gray-300 rounded-md"
    }
  ), /* @__PURE__ */ React.createElement(
    "select",
    {
      value: formQuadra.modalidade,
      onChange: (e) => setFormQuadra({ ...formQuadra, modalidade: e.target.value }),
      className: "w-full px-3 py-2 border border-gray-300 rounded-md"
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
      className: "w-full px-3 py-2 border border-gray-300 rounded-md"
    }
  ), /* @__PURE__ */ React.createElement("label", { className: "flex items-center" }, /* @__PURE__ */ React.createElement(
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
      className: "w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
    },
    editingItem ? "Atualizar" : "Adicionar"
  )), modalType === "cliente" && /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: "Nome do cliente",
      value: formCliente.nome,
      onChange: (e) => setFormCliente({ ...formCliente, nome: e.target.value }),
      className: "w-full px-3 py-2 border border-gray-300 rounded-md"
    }
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: "Telefone",
      value: formCliente.telefone,
      onChange: (e) => setFormCliente({ ...formCliente, telefone: e.target.value }),
      className: "w-full px-3 py-2 border border-gray-300 rounded-md"
    }
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "email",
      placeholder: "Email",
      value: formCliente.email,
      onChange: (e) => setFormCliente({ ...formCliente, email: e.target.value }),
      className: "w-full px-3 py-2 border border-gray-300 rounded-md"
    }
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: adicionarCliente,
      className: "w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
    },
    editingItem ? "Atualizar" : "Adicionar"
  )), modalType === "reserva" && /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement(
    "select",
    {
      value: formReserva.quadraId,
      onChange: (e) => setFormReserva({ ...formReserva, quadraId: e.target.value }),
      className: "w-full px-3 py-2 border border-gray-300 rounded-md"
    },
    /* @__PURE__ */ React.createElement("option", { value: "" }, "Selecione a quadra"),
    quadras.filter((q) => q.ativa).map((quadra) => /* @__PURE__ */ React.createElement("option", { key: quadra.id, value: quadra.id }, quadra.nome))
  ), /* @__PURE__ */ React.createElement(
    "select",
    {
      value: formReserva.clienteId,
      onChange: (e) => setFormReserva({ ...formReserva, clienteId: e.target.value }),
      className: "w-full px-3 py-2 border border-gray-300 rounded-md"
    },
    /* @__PURE__ */ React.createElement("option", { value: "" }, "Selecione o cliente"),
    clientes.map((cliente) => /* @__PURE__ */ React.createElement("option", { key: cliente.id, value: cliente.id }, cliente.nome))
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "date",
      value: formReserva.data,
      onChange: (e) => setFormReserva({ ...formReserva, data: e.target.value }),
      className: "w-full px-3 py-2 border border-gray-300 rounded-md"
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-2" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "time",
      placeholder: "Hora in\xEDcio",
      value: formReserva.horaInicio,
      onChange: (e) => setFormReserva({ ...formReserva, horaInicio: e.target.value }),
      className: "px-3 py-2 border border-gray-300 rounded-md"
    }
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "time",
      placeholder: "Hora fim",
      value: formReserva.horaFim,
      onChange: (e) => setFormReserva({ ...formReserva, horaFim: e.target.value }),
      className: "px-3 py-2 border border-gray-300 rounded-md"
    }
  )), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      placeholder: "Valor (opcional - ser\xE1 calculado automaticamente)",
      value: formReserva.valor,
      onChange: (e) => setFormReserva({ ...formReserva, valor: e.target.value }),
      className: "w-full px-3 py-2 border border-gray-300 rounded-md"
    }
  ), /* @__PURE__ */ React.createElement(
    "select",
    {
      value: formReserva.status,
      onChange: (e) => setFormReserva({ ...formReserva, status: e.target.value }),
      className: "w-full px-3 py-2 border border-gray-300 rounded-md"
    },
    /* @__PURE__ */ React.createElement("option", { value: "Confirmada" }, "Confirmada"),
    /* @__PURE__ */ React.createElement("option", { value: "Pendente" }, "Pendente"),
    /* @__PURE__ */ React.createElement("option", { value: "Cancelada" }, "Cancelada")
  ), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      placeholder: "Observa\xE7\xF5es (opcional)",
      value: formReserva.observacoes,
      onChange: (e) => setFormReserva({ ...formReserva, observacoes: e.target.value }),
      className: "w-full px-3 py-2 border border-gray-300 rounded-md",
      rows: "3"
    }
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: adicionarReserva,
      className: "w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
    },
    editingItem ? "Atualizar" : "Adicionar"
  ))))));
};
var stdin_default = QuadraManagementSystem;
export {
  stdin_default as default
};
