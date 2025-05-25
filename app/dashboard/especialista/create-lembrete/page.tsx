"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  criarLembrete,
  getLembretePorId,
  atualizarLembrete,
} from "@/services/lembreteService";
import { getPacientePorId } from "@/services/pacienteService";
import { getMedicamentosPorPaciente } from "@/services/medicamentoService";
import Input from "@/components/Input";
import Button from "@/components/Button";
import type { CreateLembreteDto, UpdateLembreteDto } from "@/types/Lembrete";
import type { Medicamento } from "@/types/Medicamento";
import type { Paciente } from "@/types/Paciente";

export default function CreateLembretePage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const pacienteId = searchParams.get("pacienteId");
  const router = useRouter();

  const [formData, setFormData] = useState<CreateLembreteDto>({
    data_hora: "",
    medicamento_id: 0,
    paciente_id: pacienteId ? Number(pacienteId) : 0,
  });

  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const carregarDadosPaciente = useCallback(async (pacienteId: string) => {
    try {
      setLoading(true);
      const pacienteData = await getPacientePorId(Number(pacienteId));
      setPaciente(pacienteData);

      const medicamentosData = await getMedicamentosPorPaciente(
        Number(pacienteId)
      );
      setMedicamentos(medicamentosData);

      setFormData((prev) => ({
        ...prev,
        paciente_id: Number(pacienteId),
      }));
    } catch (error) {
      setError("Erro ao carregar dados do paciente");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const carregarLembrete = useCallback(
    async (lembreteId: string) => {
      try {
        setLoading(true);
        const lembrete = await getLembretePorId(Number(lembreteId));

        setFormData({
          data_hora: lembrete.data_hora,
          medicamento_id: lembrete.medicamento.id,
          paciente_id: lembrete.paciente.id,
        });

        if (!paciente) {
          await carregarDadosPaciente(lembrete.paciente.id.toString());
        }
      } catch (error) {
        setError("Erro ao carregar lembrete");
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [paciente, carregarDadosPaciente]
  );

  useEffect(() => {
    if (pacienteId) {
      carregarDadosPaciente(pacienteId);
    }

    if (id) {
      carregarLembrete(id);
    }
  }, [id, pacienteId, carregarDadosPaciente, carregarLembrete]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.data_hora ||
      !formData.medicamento_id ||
      !formData.paciente_id
    ) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (id) {
        await atualizarLembrete(Number(id), formData as UpdateLembreteDto);
      } else {
        await criarLembrete(formData);
      }
      router.push(
        `/dashboard/especialista/paciente?id=${formData.paciente_id}`
      );
    } catch (error) {
      setError(id ? "Erro ao atualizar lembrete" : "Erro ao criar lembrete");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-green-50 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg border border-gray-100">
        <h1 className="text-2xl font-bold mb-6">
          {id ? "Editar Lembrete" : "Criar Novo Lembrete"}
        </h1>

        {paciente && (
          <div className="mb-6 p-4 bg-gray-50 rounded">
            <h2 className="font-semibold mb-2">Paciente</h2>
            <p>
              {paciente.nome} - {paciente.email}
            </p>
          </div>
        )}

        {loading && !paciente && <p>Carregando dados...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Input
              label="Data e Hora"
              type="datetime-local"
              name="data_hora"
              value={formData.data_hora}
              onChange={handleChange}
              required
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Medicamento *
              </label>
              <select
                name="medicamento_id"
                value={formData.medicamento_id}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
                disabled={medicamentos.length === 0}
              >
                <option value="">Selecione um medicamento</option>
                {medicamentos.map((med) => (
                  <option key={med.id} value={med.id}>
                    {med.nome} - {med.intervalo} (Quantidade: {med.quantidade})
                  </option>
                ))}
              </select>
              {medicamentos.length === 0 && (
                <p className="text-sm text-yellow-600">
                  Nenhum medicamento cadastrado para este paciente. Cadastre um
                  medicamento primeiro.
                </p>
              )}
            </div>
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={loading || medicamentos.length === 0}
            >
              {id ? "Atualizar Lembrete" : "Criar Lembrete"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                router.push(
                  `/dashboard/especialista/paciente?id=${formData.paciente_id}`
                )
              }
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
