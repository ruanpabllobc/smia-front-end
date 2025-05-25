"use client";

import { useState, useEffect } from "react";
import {
  criarPaciente,
  getPacientePorId,
  atualizarPaciente,
} from "@/services/pacienteService";
import Input from "@/components/Input";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getMedicamentosPorPaciente,
  criarMedicamento,
  atualizarMedicamento,
  deletarMedicamento,
} from "@/services/medicamentoService";
import type { Medicamento } from "@/types/Medicamento";
import Button from "@/components/Button";
import HoverableCard from "@/components/HoverableCard";
import {
  getLembretesPorPaciente,
  deletarLembrete,
} from "@/services/lembreteService";
import type { Lembrete } from "@/types/Lembrete";

export default function PacientesPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
    data_nascimento: "",
    peso: "",
    altura: "",
    especialista: 1,
  });
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [medicamentoEditando, setMedicamentoEditando] =
    useState<Medicamento | null>(null);
  const [excluindoId, setExcluindoId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lembretes, setLembretes] = useState<Lembrete[]>([]);
  const [excluindoLembreteId, setExcluindoLembreteId] = useState<number | null>(
    null
  );

  useEffect(() => {
    console.log("ID recebido:", id);
    if (id) {
      console.log("Iniciando carregamento do paciente...");
      carregarDadosPaciente(id);
    } else {
      console.log("Nenhum ID fornecido - modo de criação");
    }
  }, [id]);

  const carregarDadosPaciente = async (pacienteId: string) => {
    try {
      setLoading(true);
      setError("");

      const paciente = await getPacientePorId(Number(pacienteId));
      console.log("Dados do paciente:", paciente);

      setFormData({
        nome: paciente.nome || "",
        email: paciente.email || "",
        cpf: paciente.cpf?.toString() || "",
        data_nascimento: paciente.data_nascimento?.split("T")[0] || "",
        peso: paciente.peso?.toString() || "",
        altura: paciente.altura?.toString() || "",
        especialista: paciente.especialista || 1,
      });

      try {
        const lembretesData = await getLembretesPorPaciente(Number(pacienteId));
        setLembretes(lembretesData);
      } catch (lembreteError) {
        console.error("Erro ao carregar lembretes:", lembreteError);
        setLembretes([]);
      }

      try {
        const medicamentos = await getMedicamentosPorPaciente(
          Number(pacienteId)
        );
        console.log("Medicamentos:", medicamentos);
        setMedicamentos(medicamentos);
      } catch (medError) {
        console.error("Erro específico nos medicamentos:", medError);
        setMedicamentos([]);
        setError(
          "Medicamentos não puderam ser carregados, mas o paciente está disponível"
        );
      }
    } catch (pacienteError) {
      console.error("Erro ao carregar paciente:", pacienteError);
      setError("Erro ao carregar dados do paciente");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedicamento = async (
    medicamentoData: Omit<Medicamento, "id" | "paciente" | "especialista">
  ) => {
    if (!id) return;

    try {
      await criarMedicamento({
        ...medicamentoData,
        paciente: Number(id),
        especialista: Number(formData.especialista),
      });
      carregarDadosPaciente(id.toString());
    } catch (error) {
      setError("Erro ao adicionar medicamento");
      console.error(error);
    }
  };

  const handleUpdateMedicamento = async (
    medicamentoData: Omit<Medicamento, "id" | "paciente" | "especialista">
  ) => {
    if (!id || !medicamentoEditando) return;

    try {
      await atualizarMedicamento(medicamentoEditando.id, {
        ...medicamentoData,
        paciente: Number(id),
        especialista: Number(formData.especialista),
      });
      setMedicamentoEditando(null);
      carregarDadosPaciente(id.toString());
    } catch (error) {
      setError("Erro ao atualizar medicamento");
      console.error(error);
    }
  };

  const handleCancelarEdicao = () => {
    setMedicamentoEditando(null);
  };

  const handleDeletarMedicamento = async (medicamentoId: number) => {
    if (!id) return;

    try {
      if (confirm("Tem certeza que deseja deletar este medicamento?")) {
        setExcluindoId(medicamentoId);
        await deletarMedicamento(medicamentoId);
        await carregarDadosPaciente(id.toString());
      }
    } catch (error) {
      setError("Erro ao excluir medicamento");
      console.error("Erro na exclusão:", error);
    } finally {
      setExcluindoId(null);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.email || !formData.cpf) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);

    try {
      const pacienteData = {
        nome: formData.nome,
        email: formData.email,
        cpf: Number(formData.cpf),
        data_nascimento: formData.data_nascimento,
        peso: Number(formData.peso),
        altura: Number(formData.altura),
        especialista: Number(formData.especialista),
      };

      if (id) {
        console.log("Dados sendo enviados:", pacienteData);
        await atualizarPaciente(Number(id), pacienteData);
      } else {
        await criarPaciente(pacienteData);
      }
      router.push("/dashboard/especialista");
    } catch (error) {
      setError(id ? "Erro ao atualizar paciente" : "Erro ao criar paciente");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletarLembrete = async (lembreteId: number) => {
    if (!id) return;

    try {
      if (confirm("Tem certeza que deseja deletar este lembrete?")) {
        setExcluindoLembreteId(lembreteId);
        await deletarLembrete(lembreteId);
        await carregarDadosPaciente(id.toString());
      }
    } catch (error) {
      setError("Erro ao excluir lembrete");
      console.error("Erro na exclusão:", error);
    } finally {
      setExcluindoLembreteId(null);
    }
  };

  return (
    <div className="bg-green-50 min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          {id ? `Editar Paciente (ID: ${id})` : "Cadastrar Paciente"}{" "}
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mb-8 space-y-4 bg-white p-6 rounded-lg border border-gray-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              label="CPF"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              required
            />
            <Input
              label="Data de Nascimento"
              type="date"
              name="data_nascimento"
              value={formData.data_nascimento}
              onChange={handleChange}
              required
            />
            <Input
              label="Peso (kg)"
              type="number"
              name="peso"
              value={formData.peso}
              onChange={handleChange}
              step="0.1"
              required
            />
            <Input
              label="Altura (m)"
              type="number"
              name="altura"
              value={formData.altura}
              onChange={handleChange}
              step="0.01"
              required
            />
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <Button type="submit" width="fit" disabled={loading}>
            {id ? "Atualizar Paciente" : "Cadastrar Paciente"}
          </Button>
        </form>

        {loading && (
          <div className="p-4 bg-blue-50 text-blue-700 rounded mb-4">
            {!medicamentos.length
              ? "Carregando dados do paciente..."
              : "Carregando medicamentos..."}
          </div>
        )}

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mt-6 p-6 border rounded bg-white border-gray-100">
          <h3 className="font-medium mb-3">Adicionar Medicamento</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const medicamentoData = {
                nome: form.nome.value,
                intervalo: form.intervalo.value,
                quantidade: Number(form.quantidade.value),
                data_inicio: form.data_inicio.value,
                data_fim: form.data_fim.value,
              };

              if (medicamentoEditando) {
                handleUpdateMedicamento(medicamentoData);
              } else {
                handleAddMedicamento(medicamentoData);
              }
              form.reset();
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="nome"
                label="Nome"
                required
                defaultValue={medicamentoEditando?.nome || ""}
              />
              <Input
                name="intervalo"
                label="Intervalo (HH:MM)"
                required
                defaultValue={medicamentoEditando?.intervalo || ""}
              />
              <Input
                name="quantidade"
                label="Quantidade"
                type="number"
                step="0.1"
                required
                defaultValue={medicamentoEditando?.quantidade || ""}
              />
              <Input
                name="data_inicio"
                label="Data Início"
                type="datetime-local"
                required
                defaultValue={
                  medicamentoEditando?.data_inicio?.slice(0, 16) || ""
                }
              />
              <Input
                name="data_fim"
                label="Data Fim"
                type="datetime-local"
                required
                defaultValue={medicamentoEditando?.data_fim?.slice(0, 16) || ""}
              />
            </div>
            <div className="flex gap-2 mt-4">
              <Button type="submit" width="fit">
                {medicamentoEditando
                  ? "Atualizar Medicamento"
                  : "Adicionar Medicamento"}
              </Button>
              {medicamentoEditando && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelarEdicao}
                  width="fit"
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </div>

        {id && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4">Medicamentos</h2>

            {medicamentos.length > 0 ? (
              <div className="space-y-2">
                {medicamentos.map((med) => (
                  <HoverableCard key={med.id}>
                    <div>
                      <h3 className="font-bold">{med.nome}</h3>
                      <p>Intervalo: {med.intervalo}</p>
                      <p>Quantidade: {med.quantidade}</p>
                      <p>
                        Data Início:{" "}
                        {new Date(med.data_inicio).toLocaleString()}
                      </p>
                      <p>
                        Data Fim:{" "}
                        {med.data_fim
                          ? new Date(med.data_fim).toLocaleString()
                          : "Não definido"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setMedicamentoEditando(med)}
                        size="small"
                        width="fit"
                      >
                        Editar
                      </Button>
                      <Button
                        onClick={() => handleDeletarMedicamento(med.id)}
                        variant="danger"
                        size="small"
                        width="fit"
                        loading={excluindoId === med.id}
                      >
                        Excluir
                      </Button>
                    </div>
                  </HoverableCard>
                ))}
              </div>
            ) : (
              <p>Nenhum medicamento cadastrado.</p>
            )}
          </div>
        )}

        {id && (
          <div className="mt-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Lembretes</h2>
              <Button
                onClick={() =>
                  router.push(
                    `/dashboard/especialista/create-lembrete?pacienteId=${id}`
                  )
                }
                width="fit"
                size="small"
              >
                Adicionar Lembrete
              </Button>
            </div>

            {lembretes.length > 0 ? (
              <div className="space-y-2">
                {lembretes.map((lembrete) => (
                  <HoverableCard key={lembrete.id}>
                    <div>
                      <h3 className="font-bold">{lembrete.medicamento.nome}</h3>
                      <p>
                        Data/Hora:{" "}
                        {new Date(lembrete.data_hora).toLocaleString()}
                      </p>
                      <p>
                        Status: {lembrete.status ? "Realizado" : "Pendente"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() =>
                          router.push(
                            `/dashboard/especialista/create-lembrete?id=${lembrete.id}&pacienteId=${id}`
                          )
                        }
                        size="small"
                        width="fit"
                      >
                        Editar
                      </Button>
                      <Button
                        onClick={() => handleDeletarLembrete(lembrete.id)}
                        variant="danger"
                        size="small"
                        width="fit"
                        loading={excluindoLembreteId === lembrete.id}
                      >
                        Excluir
                      </Button>
                    </div>
                  </HoverableCard>
                ))}
              </div>
            ) : (
              <p>Nenhum lembrete cadastrado.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
