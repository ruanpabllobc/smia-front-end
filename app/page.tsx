// src/app/page.tsx
'use client';

import Input from "@/components/Input";
import { useEffect, useState } from 'react';
import { getTodosEspecialistas, criarEspecialista } from '@/services/especialistaService';
import { Especialista } from '@/types/Especialista';
import Image from "next/image";
import circlesSvg from "@/public/circles.svg";

export default function Home() {
  const [especialistas, setEspecialistas] = useState<Especialista[]>([]);
  const [nomeInput, setNomeInput] = useState('');
  const [crmInput, setCrmInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [senhaInput, setSenhaInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getTodosEspecialistas().then(setEspecialistas);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const novoEspecialista = {
        nome: nomeInput,
        crm: Number(crmInput),
        email: emailInput,
        senha: senhaInput
      };

      const especialistaCriado = await criarEspecialista(novoEspecialista);
      
      setEspecialistas([...especialistas, especialistaCriado]);
      
      setNomeInput('');
      setCrmInput('');
      setEmailInput('');
      setSenhaInput('');

    } catch (err) {
      setError('Erro ao criar especialista. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-green-50 min-h-screen w-full">
     <div className="fixed left-0 bottom-0 z-0">
        <Image 
          src={circlesSvg} 
          alt="Decoração de círculos"
          width={500}
          height={500}
        />
      </div>

      <div className="mr-[400px] p-8">
        <div className="w-[600px] mb-4">
        <h2 className="text-4xl text-green-900 font-bold mb-4">Sistema de Medicamentos Injetáveis/Aplicáveis</h2>
        <p className="text-lg text-gray-600">Organize sua saúde com facilidade: lembretes precisos para o horário certo de cada medicamento</p>
        </div>

        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {especialistas.map((esp) => (
            <li key={esp.id} className="p-4 bg-white rounded-lg shadow">
              <p><strong>Nome:</strong> {esp.nome}</p>
              <p><strong>CRM:</strong> {esp.crm}</p>
              <p><strong>Email:</strong> {esp.email}</p>
            </li>
          ))}
        </ul>
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
        onChange={(e) => setCrmInput(e.target.value.replace(/\D/g, ''))}
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
      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-green-700 hover:bg-green-800 text-white font-medium py-3 px-6 rounded-full transition-colors ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Registrando...' : 'Registrar-se'}
      </button>
      <p className="text-md text-gray-600 text-center">
        Já possui uma conta? <a href="#" className="text-green-700 hover:underline">Faça login</a>
      </p>
    </div>
  </form>
</div>
    </main>
  );
}