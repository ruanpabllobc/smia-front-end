"use client";

import Input from "@/components/Input";
import { useEffect, useState } from "react";
import {
  getTodosEspecialistas,
  criarEspecialista,
} from "@/services/especialistaService";
import { Especialista } from "@/types/Especialista";
import Image from "next/image";
import circlesSvg from "@/public/circles.svg";
import isometric from "@/public/isometric.svg";
import Button from "@/components/Button";

export default function Home() {
  const [especialistas, setEspecialistas] = useState<Especialista[]>([]);
  const [nomeInput, setNomeInput] = useState("");
  const [crmInput, setCrmInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [senhaInput, setSenhaInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getTodosEspecialistas().then(setEspecialistas);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const novoEspecialista = {
        nome: nomeInput,
        crm: Number(crmInput),
        email: emailInput,
        senha: senhaInput,
      };

      const especialistaCriado = await criarEspecialista(novoEspecialista);

      setEspecialistas([...especialistas, especialistaCriado]);

      setNomeInput("");
      setCrmInput("");
      setEmailInput("");
      setSenhaInput("");
    } catch (err) {
      setError("Erro ao criar especialista. Por favor, tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-green-50 min-h-screen w-full relative">
      <div className="flex min-h-screen">
        <div className="flex-1 flex items-center justify-center pr-[400px]">
          {" "}
          <div className="max-w-4xl mx-auto flex items-center gap-10 px-8">
            <div className="max-w-[600px]">
              <h2 className="text-4xl text-green-900 font-bold mb-4">
                Sistema de Medicamentos Injetáveis/Aplicáveis
              </h2>
              <p className="text-lg text-gray-600">
                Organize sua saúde com facilidade: lembretes precisos para o
                horário certo de cada medicamento
              </p>
            </div>
            <Image
              src={isometric}
              alt="Idosos e aplicativo móvel para ilustração"
              width={400}
              height={400}
              className="flex-shrink-0"
            />
          </div>
        </div>
        <div className="bg-white h-screen w-[400px] fixed right-0 top-0 p-8 overflow-y-auto border-l border-gray-200 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Olá!</h1>
            <p className="text-lg text-gray-600">Cadastre-se e comece a usar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <Input
                label="Nome"
                type="text"
                value={nomeInput}
                onChange={(e) => setNomeInput(e.target.value)}
                placeholder="Seu nome completo"
                required
              />
              <Input
                label="CRM"
                type="text"
                value={crmInput}
                onChange={(e) => setCrmInput(e.target.value.replace(/\D/g, ""))}
                placeholder="Apenas números"
                required
              />
              <Input
                label="Email"
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="exemplo@clinica.com"
                required
              />
              <Input
                label="Senha"
                type="password"
                value={senhaInput}
                onChange={(e) => setSenhaInput(e.target.value)}
                placeholder="Sua senha"
                required
              />

              {error && <p className="text-red-500">{error}</p>}
            </div>

            <div className="space-y-4">
              <Button type="submit" variant="default" loading={loading}>
                Registrar-se
              </Button>
              <p className="text-md text-gray-600 text-center">
                Já possui uma conta?{" "}
                <a href="#" className="text-green-700 hover:underline">
                  Faça login
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>

      <div className="fixed left-0 bottom-0 z-0">
        <Image
          src={circlesSvg}
          alt="Decoração de círculos"
          width={500}
          height={500}
        />
      </div>
    </main>
  );
}
