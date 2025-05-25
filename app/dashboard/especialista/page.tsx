// src/app/dashboard-especialista/page.tsx
"use client";

import { useState, useEffect } from "react";
import { getTodosPacientes, deletarPaciente } from "@/services/pacienteService";
import type { Paciente } from "@/types/Paciente";
import Link from "next/link";
import Button from "@/components/Button";
import AppLink from "@/components/AppLink";

export default function DashboardEspecialistaPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    carregarPacientes();
  }, []);

  const carregarPacientes = async () => {
    try {
      setLoading(true);
      const data = await getTodosPacientes();
      setPacientes(data);
    } catch (error) {
      setError("Erro ao carregar pacientes");
      console.error("Erro detalhado:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletarPaciente = async (id: number) => {
    // Confirmação antes de deletar
    const confirmacao = window.confirm(
      "Tem certeza que deseja deletar este paciente? Esta ação não pode ser desfeita."
    );

    if (!confirmacao) return;

    try {
      setLoading(true);
      await deletarPaciente(id);
      // Atualiza a lista após deletar
      await carregarPacientes();
    } catch (error) {
      setError("Erro ao deletar paciente");
      console.error("Erro detalhado:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard do Especialista</h1>
        <Link
          href="/dashboard/especialista/create-paciente"
          className="bg-green-700 text-white py-2 px-4 rounded hover:bg-green-800"
        >
          Cadastrar Novo Paciente
        </Link>
      </div>

      {loading && <p>Carregando pacientes...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div>
        <h2 className="text-xl font-semibold mb-4">Pacientes Cadastrados</h2>
        {pacientes.length === 0 ? (
          <p>Nenhum paciente cadastrado</p>
        ) : (
          <ul className="space-y-2">
            {pacientes.map((paciente) => (
              <li
                key={paciente.id}
                className="p-4 bg-gray-100 rounded-xl flex justify-between items-center"
              >
                <div>
                  <p>
                    <strong>Nome:</strong> {paciente.nome}
                  </p>
                  <p>
                    <strong>Email:</strong> {paciente.email}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <AppLink
                    href={{
                      pathname: "/dashboard/especialista/create-paciente",
                      query: { id: paciente.id },
                    }}
                    size="small"
                    width="fit"
                  >
                    Editar
                  </AppLink>
                  <Button
                    type="button"
                    variant="danger"
                    size="small"
                    width="fit"
                    onClick={() => handleDeletarPaciente(Number(paciente.id))}
                  >
                    Deletar
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
