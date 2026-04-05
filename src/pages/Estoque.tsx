import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

interface Produto {
  id: string;
  nome: string;
  categoria: string;
  quantidade: number;
  preco: number;
  status: string;
}

const Estoque = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [quantidade, setQuantidade] = useState(0);
  const [preco, setPreco] = useState(0);

  const carregarProdutos = async () => {
    const { data } = await supabase.from("produtos").select("*");
    if (data) setProdutos(data);
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const adicionarProduto = async () => {
    if (!nome) return;
    await supabase.from("produtos").insert([{ nome, categoria, quantidade, preco }]);
    setNome("");
    setCategoria("");
    setQuantidade(0);
    setPreco(0);
    carregarProdutos();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <h2 className="text-2xl font-bold">Estoque</h2>

        <div className="bg-white p-4 rounded-lg shadow space-y-3">
          <h3 className="font-bold">Adicionar Peça</h3>
          <input
            className="border p-2 rounded w-full"
            placeholder="Nome da peça"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <input
            className="border p-2 rounded w-full"
            placeholder="Categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          />
          <input
            className="border p-2 rounded w-full"
            type="number"
            placeholder="Quantidade"
            value={quantidade}
            onChange={(e) => setQuantidade(Number(e.target.value))}
          />
          <input
            className="border p-2 rounded w-full"
            type="number"
            placeholder="Preço"
            value={preco}
            onChange={(e) => setPreco(Number(e.target.value))}
          />
          <Button onClick={adicionarProduto}>Adicionar</Button>
        </div>

        <table className="w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left">Nome</th>
              <th className="p-3 text-left">Categoria</th>
              <th className="p-3 text-left">Quantidade</th>
              <th className="p-3 text-left">Preço</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="p-3">{p.nome}</td>
                <td className="p-3">{p.categoria}</td>
                <td className="p-3">{p.quantidade}</td>
                <td className="p-3">R$ {p.preco}</td>
                <td className="p-3">{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default Estoque;
