"use client";

import { useState } from "react";
import { criarPaciente } from "@/services/pacienteService";
import Input from "@/components/Input";
import { useRouter } from "next/navigation";

export default function PacientesPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
    data_nascimento: "",
    peso: "",
    altura: "",
    especialista: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

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
    setError("");

    try {
      await criarPaciente({
        nome: formData.nome,
        email: formData.email,
        cpf: Number(formData.cpf),
        data_nascimento: formData.data_nascimento,
        peso: Number(formData.peso),
        altura: Number(formData.altura),
        especialista: Number(formData.especialista),
      });

      router.push("/dashboard/especialista");
    } catch (error) {
      setError("Erro ao criar paciente");
      console.error("Erro detalhado:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Cadastro de Pacientes</h1>

      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
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

        <button
          type="submit"
          disabled={loading}
          className={`bg-green-700 text-white py-2 px-4 rounded ${
            loading ? "opacity-50" : ""
          }`}
        >
          {loading ? "Salvando..." : "Cadastrar Paciente"}
        </button>
      </form>
    </div>
  );
}
