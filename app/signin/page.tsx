"use client";

import Input from "@/components/Input";
import { useState } from "react";
import Image from "next/image";
import circlesSvg from "@/public/circles.svg";
import isometric from "@/public/isometric.svg";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export default function Home() {
  const router = useRouter();
  const [emailInput, setEmailInput] = useState("");
  const [senhaInput, setSenhaInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (emailInput.trim() === "" && senhaInput.trim() === "") {
      setError("Por favor, insira seus dados de acesso");
      return;
    }

    setLoading(true);
    setError("");

    // Redireciona para a dashboard
    router.push("/dashboard/especialista");
    setLoading(false);
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
            <h1 className="text-2xl font-bold text-gray-800">Olá de novo!</h1>
            <p className="text-lg text-gray-600">Insira seus dados de acesso</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
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
                Entrar
              </Button>
              <p className="text-md text-gray-600 text-center">
                Não possui uma conta?{" "}
                <a href="#" className="text-green-700 hover:underline">
                  Cadastre-se
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/*
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {especialistas.map((esp) => (
          <li key={esp.id} className="p-4 bg-white rounded-lg shadow">
          <p>
          <strong>Nome:</strong> {esp.nome}
          </p>
          <p>
          <strong>CRM:</strong> {esp.crm}
          </p>
          <p>
          <strong>Email:</strong> {esp.email}
          </p>
          </li>
          ))}
          </ul>*/}

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
