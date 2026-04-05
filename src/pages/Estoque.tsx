import { useState, useEffect, useCallback } from "react";
import { AlertTriangle } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const TAMANHOS = ["P", "M", "G", "GG"] as const;

interface Produto {
  id: string;
  nome: string;
  categoria: string;
  quantidade: number;
  preco: number;
  status: string;
  tamanho: string;
  estoque_minimo: number;
  user_id?: string;
}

const Estoque = () => {
  const { user } = useAuth();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [quantidade, setQuantidade] = useState(0);
  const [preco, setPreco] = useState(0);
  const [tamanho, setTamanho] = useState<string>("M");
  const [estoqueMinimo, setEstoqueMinimo] = useState(0);

  const carregarProdutos = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from("produtos").select("*").eq("user_id", user.id);
    if (data) setProdutos(data as Produto[]);
  }, [user]);

  useEffect(() => {
    carregarProdutos();
  }, [carregarProdutos]);

  const adicionarProduto = async () => {
    if (!user || !nome) return;
    await supabase.from("produtos").insert([
      {
        nome,
        categoria,
        quantidade,
        preco,
        tamanho,
        estoque_minimo: estoqueMinimo,
        user_id: user.id,
      },
    ]);
    setNome("");
    setCategoria("");
    setQuantidade(0);
    setPreco(0);
    setTamanho("M");
    setEstoqueMinimo(0);
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
          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">Tamanho</label>
            <Select value={tamanho} onValueChange={setTamanho}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Tamanho" />
              </SelectTrigger>
              <SelectContent>
                {TAMANHOS.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <input
            className="border p-2 rounded w-full"
            type="number"
            min={0}
            placeholder="Estoque mínimo (alerta quando atingir)"
            value={estoqueMinimo}
            onChange={(e) => setEstoqueMinimo(Number(e.target.value))}
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
              <th className="p-3 text-left">Tamanho</th>
              <th className="p-3 text-left">Quantidade</th>
              <th className="p-3 text-left">Mín.</th>
              <th className="p-3 text-left">Preço</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((p) => {
              const q = Number(p.quantidade);
              const min = Number(p.estoque_minimo ?? 0);
              const baixo = q <= min;
              return (
                <tr
                  key={p.id}
                  className={cn(
                    "border-b transition-colors",
                    baixo && "bg-amber-50 border-amber-200 ring-1 ring-inset ring-amber-200/80",
                  )}
                >
                  <td className="p-3 font-medium">{p.nome}</td>
                  <td className="p-3">{p.categoria}</td>
                  <td className="p-3">{p.tamanho ?? "—"}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-2">
                      {q}
                      {baixo && (
                        <span
                          className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900"
                          title="Quantidade no ou abaixo do mínimo"
                        >
                          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                          Baixo
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="p-3">{min}</td>
                  <td className="p-3">R$ {Number(p.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                  <td className="p-3">{p.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default Estoque;
