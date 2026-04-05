import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

interface Cliente {
  id: string;
  nome: string;
  valor: number;
  data: string;
  status: string;
}

const Fiado = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState(0);

  const carregarClientes = async () => {
    const { data } = await supabase.from("clientes_fiado").select("*");
    if (data) setClientes(data);
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  const adicionarCliente = async () => {
    if (!nome) return;
    await supabase.from("clientes_fiado").insert([{ nome, valor }]);
    setNome("");
    setValor(0);
    carregarClientes();
  };

  const marcarPago = async (id: string) => {
    await supabase.from("clientes_fiado").update({ status: "pago" }).eq("id", id);
    carregarClientes();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <h2 className="text-2xl font-bold">Fiado</h2>

        <div className="bg-white p-4 rounded-lg shadow space-y-3">
          <h3 className="font-bold">Adicionar Cliente Fiado</h3>
          <input
            className="border p-2 rounded w-full"
            placeholder="Nome do cliente"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <input
            className="border p-2 rounded w-full"
            type="number"
            placeholder="Valor"
            value={valor}
            onChange={(e) => setValor(Number(e.target.value))}
          />
          <Button onClick={adicionarCliente}>Adicionar</Button>
        </div>

        <table className="w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left">Nome</th>
              <th className="p-3 text-left">Valor</th>
              <th className="p-3 text-left">Data</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Ação</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr key={c.id} className="border-b">
                <td className="p-3">{c.nome}</td>
                <td className="p-3">R$ {c.valor}</td>
                <td className="p-3">{c.data}</td>
                <td className="p-3">{c.status}</td>
                <td className="p-3">
                  {c.status === "pendente" && (
                    <Button onClick={() => marcarPago(c.id)} className="text-xs px-2 py-1">
                      Marcar Pago
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default Fiado;
